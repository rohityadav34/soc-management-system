import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVisitors, registerVisitor } from '../redux/slice/visitorSlice';
import { fetchFlats } from '../redux/slice/flatSlice';
import { Button, Dialog, Input, Badge, Table, Thead, Tbody, Tr, Th, Td } from '../components/ui';
import { ShieldCheck, Search, Users, UserPlus, Phone, Calendar, ClipboardList } from 'lucide-react';
import { toast } from 'react-hot-toast';

function Visitors() {
  const dispatch = useDispatch();
  const { visitors, loading } = useSelector((state) => state.visitor);
  const { flats } = useSelector((state) => state.flat);
  const { role, id: currentUserId } = useSelector((state) => state.auth);

  const isGuard = role?.toLowerCase() === 'security-guard' || role?.toLowerCase() === 'security_guard';
  const isAdmin = role?.toLowerCase() === 'admin';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    purpose: '',
    type: 'guest', // default
    flatId: '',
  });

  useEffect(() => {
    dispatch(fetchVisitors());
    if (isGuard || isAdmin) {
      dispatch(fetchFlats());
    }
  }, [dispatch, isGuard, isAdmin]);

  const handleOpenDialog = () => {
    setFormData({ name: '', phone: '', purpose: '', type: 'guest', flatId: '' });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.flatId) {
      toast.error('Name, Phone, and target flat are required.');
      return;
    }
    
    const payload = {
      ...formData,
      userId: currentUserId,
    };

    dispatch(registerVisitor(payload)).then((action) => {
      if (registerVisitor.fulfilled.match(action)) {
        toast.success('Visitor registered, resident notification sent!');
        setIsDialogOpen(false);
        dispatch(fetchVisitors());
      } else {
        toast.error('Failed to register visitor.');
      }
    });
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="warning">Pending Approval</Badge>;
    }
  };

  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch = v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.flat?.flatNumber?.toString().includes(searchTerm);
    const matchesStatus = !selectedStatus || v.status?.toLowerCase() === selectedStatus.toLowerCase();
    const matchesType = !selectedType || v.type?.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-emerald-600" size={24} />
            Visitor Log Book
          </h1>
          <p className="text-slate-500 text-sm">
            {isGuard 
              ? 'Check-in visitors, assign target flats, and get residents approvals.' 
              : 'Track past and active visitor entry logs for your apartment.'}
          </p>
        </div>
        {isGuard && (
          <Button 
            leftIcon={<UserPlus size={18} />} 
            onClick={handleOpenDialog}
          >
            Register Visitor
          </Button>
        )}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search visitors..."
            className="w-full pr-4 py-2 pl-10 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">All Types</option>
            <option value="guest">Guest</option>
            <option value="delivery">Delivery</option>
            <option value="electrician">Electrician</option>
            <option value="plumber">Plumber</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Visitors List Table */}
      {loading ? (
        <div className="p-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <Table>
            <Thead>
              <Tr>
                <Th>Visitor Details</Th>
                <Th>Contact & Type</Th>
                <Th>Purpose</Th>
                <Th>Flat Number</Th>
                <Th>Date & Time</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredVisitors.length > 0 ? (
                filteredVisitors.map((v) => (
                  <Tr key={v._id} className="hover:bg-slate-50 transition-colors">
                    <Td>
                      <strong className="text-slate-800 font-semibold block">{v.name}</strong>
                    </Td>
                    <Td>
                      <div className="space-y-0.5">
                        <span className="text-slate-600 text-sm flex items-center gap-1">
                          <Phone size={12} className="text-slate-400" /> {v.phone}
                        </span>
                        <span className="text-xs uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium tracking-wide">
                          {v.type}
                        </span>
                      </div>
                    </Td>
                    <Td className="text-slate-600 text-sm">{v.purpose || 'N/A'}</Td>
                    <Td className="font-semibold text-slate-700">
                      Flat {v.flat?.flatNumber} (Block {v.flat?.block})
                    </Td>
                    <Td className="text-slate-500 text-xs">
                      <div className="flex flex-col">
                        <span>{new Date(v.createdAt).toLocaleDateString()}</span>
                        <span className="text-slate-400">
                          {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </Td>
                    <Td>{getStatusBadge(v.status)}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={6} className="text-center text-slate-400 py-12">
                    No visitor logs found.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </div>
      )}

      {/* Register Visitor Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Check-In New Visitor"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Request Entry</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <Input
            label="Visitor Name"
            placeholder="E.g. John Doe"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            label="Phone Number"
            placeholder="E.g. 9876543210"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 ml-0.5">Visitor Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
            >
              <option value="guest">Guest</option>
              <option value="delivery">Delivery Person</option>
              <option value="electrician">Electrician</option>
              <option value="plumber">Plumber</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Input
            label="Purpose of Visit"
            placeholder="E.g. Delivery / Electric repair"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
          />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 ml-0.5">Target Flat</label>
            <select
              name="flatId"
              value={formData.flatId}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
            >
              <option value="">-- Choose Flat --</option>
              {flats.map((f) => (
                <option key={f._id} value={f._id}>
                  Flat {f.flatNumber} - Block {f.block}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Visitors;