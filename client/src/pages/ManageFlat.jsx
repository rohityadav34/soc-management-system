import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlats, createFlat, updateFlat, deleteFlat } from '../redux/slice/flatSlice';
import { fetchUsers } from '../redux/slice/userSlice';
import { Table, Thead, Tbody, Tr, Th, Td, Button, Badge, Dialog, Input } from '../components/ui';
import { Home, Search, Edit2, Trash2, Building2, Users, CheckCircle, HelpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

function ManageFlat() {
  const dispatch = useDispatch();
  const { flats, loading } = useSelector((state) => state.flat);
  const { users } = useSelector((state) => state.user);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [editFlatId, setEditFlatId] = useState(null);
  
  const [formData, setFormData] = useState({
    flatNumber: '',
    block: '',
    floor: '',
  });

  useEffect(() => {
    dispatch(fetchFlats());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Compute Stats
  const totalFlats = flats.length;
  const occupiedFlats = flats.filter(f => f.isaccopied).length;
  const vacantFlats = flats.filter(f => !f.isaccopied).length;

  const filteredFlats = flats.filter((flat) => {
    const blockTextMatch = flat.block?.toLowerCase().includes(searchTerm.toLowerCase());
    const numberMatch = flat.flatNumber?.toString().includes(searchTerm);
    const residentMatch = flat.residentName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = blockTextMatch || numberMatch || residentMatch;

    const matchesBlock = !selectedBlock || flat.block?.toLowerCase() === selectedBlock.toLowerCase();
    const matchesStatus = !selectedStatus || 
      (selectedStatus === 'occupied' ? flat.isaccopied : !flat.isaccopied);

    return matchesSearch && matchesBlock && matchesStatus;
  });

  const handleOpenDialog = (flat = null) => {
    if (flat) {
      setEditFlatId(flat._id);
      setFormData({
        flatNumber: flat.flatNumber || '',
        block: flat.block || '',
        floor: flat.floor || '',
      });
    } else {
      setEditFlatId(null);
      setFormData({ flatNumber: '', block: '', floor: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.flatNumber || !formData.block || !formData.floor) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const flatData = {
      flatNumber: Number(formData.flatNumber),
      block: formData.block.trim(),
      floor: Number(formData.floor),
    };

    if (editFlatId) {
      dispatch(updateFlat({ id: editFlatId, flatData }))
        .unwrap()
        .then(() => {
          toast.success("Flat updated successfully!");
          dispatch(fetchFlats());
          dispatch(fetchUsers());
          setIsDialogOpen(false);
        })
        .catch((err) => {
          toast.error(err.message || "Failed to update flat.");
        });
    } else {
      dispatch(createFlat(flatData))
        .unwrap()
        .then(() => {
          toast.success("Flat created successfully!");
          dispatch(fetchFlats());
          dispatch(fetchUsers());
          setIsDialogOpen(false);
        })
        .catch((err) => {
          toast.error(err.message || "Failed to create flat.");
        });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this flat? This will also unassign any resident.')) {
      dispatch(deleteFlat(id))
        .unwrap()
        .then(() => {
          toast.success("Flat deleted successfully!");
          dispatch(fetchFlats());
          dispatch(fetchUsers());
        })
        .catch((err) => {
          toast.error(err.message || "Failed to delete flat.");
        });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Flat Management</h1>
          <p className="text-slate-500 text-sm">View, create, and assign residents to society flats.</p>
        </div>
        <Button 
          leftIcon={<Home size={18} />} 
          onClick={() => handleOpenDialog()}
        >
          Add New Flat
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Flats</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalFlats}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Occupied Flats</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{occupiedFlats}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <HelpCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Vacant Flats</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{vacantFlats}</h3>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search flat number, block, or resident..."
            className="w-full pr-4 py-2 pl-10 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Block Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Block:</label>
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">All Blocks</option>
            <option value="A">Block A</option>
            <option value="B">Block B</option>
            <option value="C">Block C</option>
            <option value="D">Block D</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">All Status</option>
            <option value="occupied">Occupied</option>
            <option value="vacant">Vacant</option>
          </select>
        </div>
      </div>

      {/* Flats Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <Table>
            <Thead>
              <Tr hover={false}>
                <Th>Resident Name</Th>
                <Th>Flat Number</Th>
                <Th>Block</Th>
                <Th>Floor</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredFlats.length > 0 ? (
                filteredFlats.map((flat) => (
                  <Tr key={flat._id}>
                    <Td className="font-semibold text-slate-800">
                      {flat.residentName && flat.residentName !== 'N/A' ? (
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                            {flat.residentName.charAt(0).toUpperCase()}
                          </div>
                          <span>{flat.residentName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-normal italic">Unassigned</span>
                      )}
                    </Td>
                    <Td className="font-medium text-slate-900">{flat.flatNumber}</Td>
                    <Td className="uppercase font-semibold text-slate-600">{flat.block}</Td>
                    <Td className="text-slate-600">{flat.floor}</Td>
                    <Td>
                      <Badge variant={flat.isaccopied ? 'success' : 'slate'}>
                        {flat.isaccopied ? 'Occupied' : 'Vacant'}
                      </Badge>
                    </Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenDialog(flat)}
                          className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors"
                          title="Edit Flat"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(flat._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Flat"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr hover={false}>
                  <Td colSpan={6} className="text-center py-12 text-slate-500">
                    No flats found matching your search.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        )}
      </div>

      {/* Add/Edit Flat Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editFlatId ? "Edit Flat Details" : "Add New Flat"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editFlatId ? "Update Flat" : "Create Flat"}</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Flat Number" 
              type="number"
              placeholder="101" 
              name="flatNumber"
              value={formData.flatNumber}
              onChange={handleChange}
              required
            />
            <Input 
              label="Block" 
              placeholder="A" 
              name="block"
              value={formData.block}
              onChange={handleChange}
              required
            />
          </div>
          <Input 
            label="Floor" 
            type="number"
            placeholder="1" 
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            required
          />
        </div>
      </Dialog>
    </div>
  );
}

export default ManageFlat;