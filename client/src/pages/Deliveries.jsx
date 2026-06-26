import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlats } from '../redux/slice/flatSlice';
import { Button, Dialog, Input, Badge, Table, Thead, Tbody, Tr, Th, Td } from '../components/ui';
import { Package, Search, Plus, Calendar, Clock, MapPin, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function Deliveries() {
  const dispatch = useDispatch();
  const { flats } = useSelector((state) => state.flat);
  const { role } = useSelector((state) => state.auth);
  
  const isGuard = role?.toLowerCase() === 'security-guard' || role?.toLowerCase() === 'security_guard';
  const isAdmin = role?.toLowerCase() === 'admin';
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    company: 'Amazon',
    trackingNumber: '',
    flatId: '',
    recipient: '',
  });

  // Mock list of deliveries for display
  const loadDeliveries = () => {
    setLoading(true);
    // Standard mock deliveries
    setTimeout(() => {
      setDeliveries([
        {
          _id: 'd1',
          company: 'Blue Dart',
          trackingNumber: 'BD8273618',
          flat: { flatNumber: 101, block: 'A' },
          recipient: 'Rohan Sharma',
          status: 'delivered',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: 'd2',
          company: 'Amazon Logistics',
          trackingNumber: 'AMZ-89317-X',
          flat: { flatNumber: 302, block: 'B' },
          recipient: 'Priya Verma',
          status: 'pending',
          createdAt: new Date().toISOString(),
        }
      ]);
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    loadDeliveries();
    if (isGuard || isAdmin) {
      dispatch(fetchFlats());
    }
  }, [dispatch, isGuard, isAdmin]);

  const handleOpenDialog = () => {
    setFormData({ company: 'Amazon', trackingNumber: '', flatId: '', recipient: '' });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.trackingNumber || !formData.flatId || !formData.recipient) {
      toast.error('All fields are required.');
      return;
    }

    const selectedFlat = flats.find(f => f._id === formData.flatId);

    const newDelivery = {
      _id: 'd' + (deliveries.length + 1),
      company: formData.company,
      trackingNumber: formData.trackingNumber,
      flat: selectedFlat ? { flatNumber: selectedFlat.flatNumber, block: selectedFlat.block } : { flatNumber: 100, block: 'A' },
      recipient: formData.recipient,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setDeliveries([newDelivery, ...deliveries]);
    toast.success('Delivery logged and notification dispatched!');
    setIsDialogOpen(false);
  };

  const handleUpdateStatus = (id, status) => {
    setDeliveries(deliveries.map(d => d._id === id ? { ...d, status } : d));
    toast.success(`Delivery status updated to ${status}!`);
  };

  const filteredDeliveries = deliveries.filter((d) =>
    d.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.flat?.flatNumber?.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="text-emerald-600" size={24} />
            Parcel & Delivery Tracking
          </h1>
          <p className="text-slate-500 text-sm">
            {isGuard 
              ? 'Log incoming courier parcels and notify target residents.' 
              : 'View and track incoming parcels at the security gate.'}
          </p>
        </div>
        {isGuard && (
          <Button 
            leftIcon={<Plus size={18} />} 
            onClick={handleOpenDialog}
          >
            Log Delivery
          </Button>
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search deliveries..."
            className="w-full pr-4 py-2 pl-10 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Deliveries Table */}
      {loading ? (
        <div className="p-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <Table>
            <Thead>
              <Tr>
                <Th>Courier Company</Th>
                <Th>Tracking Number</Th>
                <Th>Target Flat / Recipient</Th>
                <Th>Logged Date</Th>
                <Th>Status</Th>
                {isGuard && <Th className="text-right">Actions</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((d) => (
                  <Tr key={d._id} className="hover:bg-slate-50 transition-colors">
                    <Td className="font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <Truck size={16} className="text-slate-400" />
                        {d.company}
                      </div>
                    </Td>
                    <Td className="text-slate-600 text-sm font-mono">{d.trackingNumber}</Td>
                    <Td>
                      <div className="space-y-0.5">
                        <span className="text-slate-700 font-medium block">
                          Flat {d.flat?.flatNumber} (Block {d.flat?.block})
                        </span>
                        <span className="text-slate-400 text-xs">{d.recipient}</span>
                      </div>
                    </Td>
                    <Td className="text-slate-500 text-xs">
                      {new Date(d.createdAt).toLocaleString()}
                    </Td>
                    <Td>
                      {d.status === 'delivered' ? (
                        <Badge variant="success">Delivered</Badge>
                      ) : (
                        <Badge variant="warning">At Gate</Badge>
                      )}
                    </Td>
                    {isGuard && (
                      <Td className="text-right">
                        {d.status !== 'delivered' && (
                          <button
                            onClick={() => handleUpdateStatus(d._id, 'delivered')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition-all"
                          >
                            Mark Handed Over
                          </button>
                        )}
                      </Td>
                    )}
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={isGuard ? 6 : 5} className="text-center text-slate-400 py-12">
                    No parcels currently logged at the gate.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </div>
      )}

      {/* Log Delivery Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Log Incoming Courier Parcel"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Log & Notify</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 ml-0.5">Courier/Delivery Partner</label>
            <select
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
            >
              <option value="Amazon">Amazon</option>
              <option value="Flipkart">Flipkart</option>
              <option value="Zomato">Zomato</option>
              <option value="Swiggy">Swiggy</option>
              <option value="Blue Dart">Blue Dart</option>
              <option value="Delhivery">Delhivery</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <Input
            label="Tracking/Reference Number"
            placeholder="E.g. AMZ-98213"
            name="trackingNumber"
            value={formData.trackingNumber}
            onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
          />
          <Input
            label="Recipient Name"
            placeholder="Resident Name"
            name="recipient"
            value={formData.recipient}
            onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
          />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 ml-0.5">Target Flat</label>
            <select
              name="flatId"
              value={formData.flatId}
              onChange={(e) => setFormData({ ...formData, flatId: e.target.value })}
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

export default Deliveries;
