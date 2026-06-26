import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComplaints, createComplaint, updateComplaint, deleteComplaint } from '../redux/slice/complaintSlice';
import { Button, Dialog, Input, Badge, Table, Thead, Tbody, Tr, Th, Td } from '../components/ui';
import { MessageSquarePlus, Search, Trash2, Edit2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

function ManageComplaints() {
  const dispatch = useDispatch();
  const { complaints, loading } = useSelector((state) => state.complaint);
  const { role } = useSelector((state) => state.auth);

  const isAdmin = role?.toLowerCase() === 'admin';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  const handleOpenDialog = () => {
    setFormData({ title: '', description: '' });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required.');
      return;
    }
    dispatch(createComplaint(formData)).then((action) => {
      if (createComplaint.fulfilled.match(action)) {
        toast.success('Complaint submitted successfully!');
        setIsDialogOpen(false);
        dispatch(fetchComplaints());
      } else {
        toast.error('Failed to submit complaint.');
      }
    });
  };

  const handleUpdateStatus = (id, status) => {
    dispatch(updateComplaint({ id, status })).then((action) => {
      if (updateComplaint.fulfilled.match(action)) {
        toast.success('Complaint status updated!');
        dispatch(fetchComplaints());
      }
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      dispatch(deleteComplaint(id)).then((action) => {
        if (deleteComplaint.fulfilled.match(action)) {
          toast.success('Complaint deleted successfully.');
          dispatch(fetchComplaints());
        }
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      case 'in_progress':
      case 'in-progress':
        return <Badge variant="warning">In Progress</Badge>;
      default:
        return <Badge variant="danger">Pending</Badge>;
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || c.status?.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="text-rose-600" size={24} />
            Complaints & Feedback
          </h1>
          <p className="text-slate-500 text-sm">
            {isAdmin 
              ? 'View and manage resident-raised complaints and their resolution states.' 
              : 'Submit and track your complaints with real-time status updates.'}
          </p>
        </div>
        {!isAdmin && (
          <Button 
            leftIcon={<MessageSquarePlus size={18} />} 
            onClick={handleOpenDialog}
          >
            File a Complaint
          </Button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search complaints..."
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
            <option value="">All Complaints</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Complaints List Table */}
      {loading ? (
        <div className="p-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <Table>
            <Thead>
              <Tr>
                <Th>Title & Description</Th>
                {isAdmin && <Th>Filed By</Th>}
                <Th>Date Filed</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((c) => (
                  <Tr key={c._id} className="hover:bg-slate-50 transition-colors">
                    <Td className="max-w-md">
                      <div className="space-y-1">
                        <strong className="text-slate-800 font-semibold block">{c.title}</strong>
                        <p className="text-slate-500 text-xs line-clamp-2">{c.description}</p>
                      </div>
                    </Td>
                    {isAdmin && (
                      <Td className="text-slate-600 text-sm">
                        {c.resident?.name || 'Resident'}
                      </Td>
                    )}
                    <Td className="text-slate-500 text-xs">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </Td>
                    <Td>{getStatusBadge(c.status)}</Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-2">
                        {isAdmin && c.status !== 'resolved' && (
                          <>
                            {c.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateStatus(c._id, 'in_progress')}
                                className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                                title="In Progress"
                              >
                                <Clock size={14} /> Start Resolve
                              </button>
                            )}
                            <button
                              onClick={() => handleUpdateStatus(c._id, 'resolved')}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                              title="Resolve Complaint"
                            >
                              <CheckCircle2 size={14} /> Resolve
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                          title="Delete Complaint"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={5} className="text-center text-slate-400 py-12">
                    No complaints registered.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </div>
      )}

      {/* File Complaint Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="File a Complaint"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit Complaint</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <Input
            label="Complaint Title"
            placeholder="E.g., Water leakage in block B"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 ml-0.5">Details & Description</label>
            <textarea
              name="description"
              placeholder="Describe the complaint in detail..."
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default ManageComplaints;