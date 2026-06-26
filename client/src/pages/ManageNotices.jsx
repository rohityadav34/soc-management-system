import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotices, createNotice, deleteNotice } from '../redux/slice/noticeSlice';
import { Button, Dialog, Input, Card } from '../components/ui';
import { Megaphone, Search, Trash2, Calendar, User, Clock, Bell } from 'lucide-react';
import { toast } from 'react-hot-toast';

function ManageNotices() {
  const dispatch = useDispatch();
  const { notices, loading } = useSelector((state) => state.notice);
  const { role } = useSelector((state) => state.auth);
  
  const isAdmin = role?.toLowerCase() === 'admin';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    expiryDate: '',
  });

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  const handleOpenDialog = () => {
    setFormData({ title: '', description: '', expiryDate: '' });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required.');
      return;
    }
    dispatch(createNotice(formData)).then((action) => {
      if (createNotice.fulfilled.match(action)) {
        toast.success('Announcement broadcasted successfully!');
        setIsDialogOpen(false);
        dispatch(fetchNotices());
      } else {
        toast.error('Failed to broadcast notice.');
      }
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      dispatch(deleteNotice(id)).then((action) => {
        if (deleteNotice.fulfilled.match(action)) {
          toast.success('Notice deleted successfully.');
          dispatch(fetchNotices());
        }
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredNotices = notices.filter((notice) =>
    notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="text-emerald-600" size={24} />
            Society Announcements
          </h1>
          <p className="text-slate-500 text-sm">Notice board for important updates and broadcasting announcements.</p>
        </div>
        {isAdmin && (
          <Button 
            leftIcon={<Bell size={18} />} 
            onClick={handleOpenDialog}
          >
            Post Announcement
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search announcements..."
            className="w-full pr-4 py-2 pl-10 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="p-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <div 
                key={notice._id} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-emerald-500/30 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-slate-800 text-lg leading-snug">{notice.title}</h3>
                    {isAdmin && (
                      <button 
                        onClick={() => handleDelete(notice._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Announcement"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{notice.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-slate-400" />
                    <span>Posted by: <strong className="text-slate-700 font-medium">{notice.postedBy?.name || 'Admin'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    <span>Date: {new Date(notice.createdAt).toLocaleDateString()}</span>
                  </div>
                  {notice.expiryDate && (
                    <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Clock size={12} />
                      <span>Expires: {new Date(notice.expiryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
              No announcements posted yet.
            </div>
          )}
        </div>
      )}

      {/* Add Notice Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Broadcast Announcement"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Broadcast</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <Input 
            label="Announcement Title" 
            placeholder="E.g., Power Outage Notice" 
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 ml-0.5">Description</label>
            <textarea
              name="description"
              placeholder="Enter details of the announcement here..."
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none"
            />
          </div>
          <Input 
            label="Expiry Date (Optional)" 
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default ManageNotices;