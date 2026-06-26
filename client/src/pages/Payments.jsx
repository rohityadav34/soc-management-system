import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBills, createBill, payBill, deleteBill } from '../redux/slice/billSlice';
import { fetchFlats } from '../redux/slice/flatSlice';
import { Button, Dialog, Input, Badge, Table, Thead, Tbody, Tr, Th, Td } from '../components/ui';
import { CreditCard, Search, Trash2, Calendar, Landmark, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

function Payments() {
  const dispatch = useDispatch();
  const { bills, loading } = useSelector((state) => state.bill);
  const { flats } = useSelector((state) => state.flat);
  const { role } = useSelector((state) => state.auth);

  const isAdmin = role?.toLowerCase() === 'admin';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    dueDate: '',
    flatId: '',
  });

  useEffect(() => {
    dispatch(fetchBills());
    if (isAdmin) {
      dispatch(fetchFlats());
    }
  }, [dispatch, isAdmin]);

  const handleOpenDialog = () => {
    setFormData({ title: '', amount: '', dueDate: '', flatId: '' });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.amount || !formData.dueDate || !formData.flatId) {
      toast.error('All fields are required.');
      return;
    }
    dispatch(createBill(formData)).then((action) => {
      if (createBill.fulfilled.match(action)) {
        toast.success('Bill generated successfully!');
        setIsDialogOpen(false);
        dispatch(fetchBills());
      } else {
        toast.error('Failed to generate bill.');
      }
    });
  };

  const handlePayBill = (id) => {
    dispatch(payBill(id)).then((action) => {
      if (payBill.fulfilled.match(action)) {
        toast.success('Bill paid successfully!');
        dispatch(fetchBills());
      } else {
        toast.error('Failed to process payment.');
      }
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      dispatch(deleteBill(id)).then((action) => {
        if (deleteBill.fulfilled.match(action)) {
          toast.success('Bill deleted successfully.');
          dispatch(fetchBills());
        }
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return <Badge variant="success">Paid</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="danger">Unpaid</Badge>;
    }
  };

  const filteredBills = bills.filter((b) => {
    const matchesSearch = b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.flat?.flatNumber?.toString().includes(searchTerm);
    const matchesStatus = !selectedStatus || b.status?.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="text-emerald-600" size={24} />
            Maintenance Bills & Payments
          </h1>
          <p className="text-slate-500 text-sm">
            {isAdmin 
              ? 'Generate maintenance charges and track payments across all flats.' 
              : 'View and clear your outstanding maintenance bills.'}
          </p>
        </div>
        {isAdmin && (
          <Button 
            leftIcon={<Plus size={18} />} 
            onClick={handleOpenDialog}
          >
            Generate Bill
          </Button>
        )}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search bills..."
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
            <option value="">All Invoices</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Bills Table */}
      {loading ? (
        <div className="p-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <Table>
            <Thead>
              <Tr>
                <Th>Bill Details</Th>
                <Th>Flat / Resident</Th>
                <Th>Amount</Th>
                <Th>Due Date</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredBills.length > 0 ? (
                filteredBills.map((b) => (
                  <Tr key={b._id} className="hover:bg-slate-50 transition-colors">
                    <Td>
                      <div className="space-y-1">
                        <strong className="text-slate-800 font-semibold block">{b.title}</strong>
                        {b.paymentDate && (
                          <span className="text-slate-400 text-xs flex items-center gap-1">
                            Paid on: {new Date(b.paymentDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <div className="space-y-0.5">
                        <span className="text-slate-700 font-medium block">
                          Flat {b.flat?.flatNumber} (Block {b.flat?.block})
                        </span>
                        {b.resident && (
                          <span className="text-slate-400 text-xs">{b.resident.name}</span>
                        )}
                      </div>
                    </Td>
                    <Td className="font-bold text-slate-800">
                      ₹{b.amount}
                    </Td>
                    <Td className="text-slate-500 text-xs">
                      {new Date(b.dueDate).toLocaleDateString()}
                    </Td>
                    <Td>{getStatusBadge(b.status)}</Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-2">
                        {!isAdmin && b.status !== 'paid' && (
                          <button
                            onClick={() => handlePayBill(b._id)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                            title="Pay Now"
                          >
                            <CreditCard size={14} /> Pay Now
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(b._id)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                            title="Delete Bill"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={6} className="text-center text-slate-400 py-12">
                    No bills generated.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </div>
      )}

      {/* Generate Bill Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Generate New Bill"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Generate Bill</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <Input
            label="Bill Title (e.g. Maintenance Charges)"
            placeholder="Electricity / Maintenance Fee"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <Input
            label="Amount (INR)"
            type="number"
            placeholder="E.g. 2500"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
          <Input
            label="Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 ml-0.5">Select Target Flat</label>
            <select
              name="flatId"
              value={formData.flatId}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
            >
              <option value="">-- Choose Flat --</option>
              {flats.map((f) => (
                <option key={f._id} value={f._id}>
                  Flat {f.flatNumber} - Block {f.block} (Floor {f.floor})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Payments;
