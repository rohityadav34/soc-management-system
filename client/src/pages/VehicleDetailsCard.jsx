import React, { useState } from "react";
import { Plus, Trash2, Car } from "lucide-react";
import { Button, Dialog, Input, Table, Thead, Tbody, Tr, Th, Td } from "../components/ui";

function VehicleDetailsCard({ vehicles = [], onAddVehicle, onDeleteVehicle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: "Car",
    vehicleNumber: "",
    parkingSlot: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = () => {
    setFormData({ vehicleType: "Car", vehicleNumber: "", parkingSlot: "" });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vehicleType || !formData.vehicleNumber || !formData.parkingSlot) return;
    try {
      setSubmitting(true);
      await onAddVehicle(formData);
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-slate-800 font-black text-lg flex items-center gap-2">
            <Car size={20} className="text-indigo-600" />
            Vehicle Details
          </h3>
          <Button
            onClick={handleOpen}
            size="sm"
            variant="ghost"
            className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold rounded-lg text-xs px-3 py-1.5 flex items-center gap-1 transition-colors"
          >
            <Plus size={14} />
            Add Vehicle
          </Button>
        </div>

        <div className="overflow-x-auto">
          {vehicles.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No vehicles registered yet.
            </div>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th className="text-slate-400 text-xs font-semibold uppercase text-left py-3">Vehicle Type</Th>
                  <Th className="text-slate-400 text-xs font-semibold uppercase text-left py-3">Vehicle Number</Th>
                  <Th className="text-slate-400 text-xs font-semibold uppercase text-left py-3">Parking Slot</Th>
                  <Th className="text-slate-400 text-xs font-semibold uppercase text-right py-3 pr-2">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {vehicles.map((vehicle) => (
                  <Tr key={vehicle._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <Td className="py-4 text-slate-800 font-semibold text-sm">{vehicle.vehicleType}</Td>
                    <Td className="py-4 text-slate-500 text-sm">{vehicle.vehicleNumber}</Td>
                    <Td className="py-4 text-slate-500 text-sm">{vehicle.parkingSlot}</Td>
                    <Td className="py-4 text-right pr-2">
                      <button
                        onClick={() => onDeleteVehicle(vehicle._id)}
                        className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Vehicle"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </div>
      </div>

      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        title="Register Vehicle"
        size="md"
        footer={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Registering..." : "Register Vehicle"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-slate-700 text-xs font-bold block mb-1.5 uppercase">Vehicle Type</label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm text-slate-800 bg-white"
            >
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <Input
            label="Vehicle Number"
            name="vehicleNumber"
            placeholder="e.g. RJ14AB1234"
            value={formData.vehicleNumber}
            onChange={handleChange}
            required
          />
          <Input
            label="Parking Slot"
            name="parkingSlot"
            placeholder="e.g. P-12"
            value={formData.parkingSlot}
            onChange={handleChange}
            required
          />
        </form>
      </Dialog>
    </div>
  );
}

export default VehicleDetailsCard;
