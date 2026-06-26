import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { 
  Search, 
  Car, 
  Plus, 
  Trash2, 
  Edit2, 
  User, 
  Unlock, 
  Lock,
  AlertTriangle
} from "lucide-react";
import { Button, Badge, Dialog, Input, Card } from "../components/ui";
import {
  fetchParkings,
  createParking,
  updateParking,
  deleteParking,
} from "../redux/slice/parkingslice";

function Parking() {
  const dispatch = useDispatch();
  const { parkings = [], loading, error, message } = useSelector(
    (state) => state.parking
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [blockFilter, setBlockFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  
  // Form states
  const [block, setBlock] = useState("A");
  const [parkingNumber, setParkingNumber] = useState("");
  
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [residentName, setResidentName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchParkings());
  }, [dispatch]);

  // Handle toast notifications
  useEffect(() => {
    if (error) {
      toast.error(error.message || error || "Something went wrong");
    }
    if (message) {
      toast.success(message);
    }
  }, [error, message]);

  // Filter logic
  const filteredSpots = parkings.filter((spot) => {
    const matchesSearch = 
      !searchTerm ||
      spot.slotNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.residentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBlock = blockFilter === "all" || spot.block === blockFilter;
    const matchesStatus = statusFilter === "all" || spot.status === statusFilter;

    return matchesSearch && matchesBlock && matchesStatus;
  });

  // Stats calculation
  const totalSpots = parkings.length;
  const occupiedSpots = parkings.filter(s => s.status === "occupied").length;
  const vacantSpots = parkings.filter(s => s.status === "vacant").length;

  // Add new parking slot
  const handleAddParking = (e) => {
    e.preventDefault();
    if (!parkingNumber) {
      toast.error("Please enter a slot number.");
      return;
    }
    const slotNumber = `${block}-${parkingNumber}`;
    // Check if slot already exists
    if (parkings.some(spot => spot.slotNumber === slotNumber)) {
      toast.error(`Slot ${slotNumber} already exists.`);
      return;
    }
    dispatch(createParking({
      block,
      slotNumber,
      status: "vacant"
    })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Parking slot created successfully!");
        setParkingNumber("");
        setShowAddModal(false);
      }
    });
  };

  // Open booking modal
  const handleOpenBookModal = (spot) => {
    setSelectedSpot(spot);
    setIsEditing(false);
    setResidentName("");
    setVehicleNumber("");
    setShowBookModal(true);
  };

  // Open edit modal for occupied slot
  const handleOpenEditModal = (spot) => {
    setSelectedSpot(spot);
    setIsEditing(true);
    setResidentName(spot.residentName || "");
    setVehicleNumber(spot.vehicleNumber || "");
    setShowBookModal(true);
  };

  // Handle booking or updating parking spot
  const handleBookOrUpdate = (e) => {
    e.preventDefault();
    if (!residentName || !vehicleNumber) {
      toast.error("Please fill in all fields.");
      return;
    }

    dispatch(updateParking({
      id: selectedSpot._id,
      parkingData: {
        residentName,
        vehicleNumber,
        status: "occupied"
      }
    })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success(isEditing ? "Booking updated successfully!" : "Slot booked successfully!");
        setShowBookModal(false);
        setResidentName("");
        setVehicleNumber("");
      }
    });
  };

  // Release/Vacate occupied spot
  const handleReleaseSpot = (spot) => {
    if (window.confirm(`Are you sure you want to release slot ${spot.slotNumber}?`)) {
      dispatch(updateParking({
        id: spot._id,
        parkingData: {
          residentName: "",
          vehicleNumber: "",
          status: "vacant"
        }
      })).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast.success(`Slot ${spot.slotNumber} has been released.`);
        }
      });
    }
  };

  // Delete parking slot completely
  const handleDeleteSpot = (id, slotNumber) => {
    if (window.confirm(`Are you sure you want to delete parking slot ${slotNumber} permanently?`)) {
      dispatch(deleteParking(id)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast.success(`Slot ${slotNumber} deleted.`);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex gap-2 items-center">
            <Car className="text-primary-600" />
            Parking Management
          </h1>
          <p className="text-slate-500 text-sm">Monitor, assign, and manage society parking slots.</p>
        </div>
        <Button 
          leftIcon={<Plus size={18} />} 
          onClick={() => setShowAddModal(true)}
        >
          Add Parking Slot
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Spots" subtitle="All registered parking slots">
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-bold text-slate-800">{totalSpots}</span>
            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
              <Car className="text-slate-600" size={20} />
            </div>
          </div>
        </Card>

        <Card title="Occupied Spots" subtitle="Currently in-use slots">
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-bold text-rose-600">{occupiedSpots}</span>
            <div className="h-10 w-10 bg-rose-50 rounded-full flex items-center justify-center">
              <Lock className="text-rose-600" size={20} />
            </div>
          </div>
        </Card>

        <Card title="Vacant Spots" subtitle="Available to book">
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-bold text-emerald-600">{vacantSpots}</span>
            <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center">
              <Unlock className="text-emerald-600" size={20} />
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search slot, resident, or vehicle..."
            className="w-full pr-4 py-2 pl-10 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Block Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Block:</label>
          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="all">All Blocks</option>
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="all">All Status</option>
            <option value="occupied">Occupied</option>
            <option value="vacant">Vacant</option>
          </select>
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="p-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredSpots.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <AlertTriangle className="mx-auto text-slate-400" size={40} />
          <h3 className="text-lg font-medium text-slate-700">No Parking Spots Found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Try adjusting your filters or search query, or add a new slot to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSpots.map((spot) => (
            <div
              key={spot._id}
              className={`group relative rounded-xl border p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md ${
                spot.status === "occupied"
                  ? "bg-rose-50/40 border-rose-100 hover:border-rose-200"
                  : "bg-emerald-50/40 border-emerald-100 hover:border-emerald-200"
              }`}
            >
              {/* Delete Button (Hover Triggered / Subtle) */}
              <button
                onClick={() => handleDeleteSpot(spot._id, spot.slotNumber)}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white/80 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Delete Parking Spot"
              >
                <Trash2 size={16} />
              </button>

              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                      Block {spot.block}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 mt-0.5">
                      {spot.slotNumber}
                    </h3>
                  </div>
                  <Badge variant={spot.status === "occupied" ? "danger" : "success"}>
                    {spot.status === "occupied" ? "Occupied" : "Vacant"}
                  </Badge>
                </div>

                {/* Booking details */}
                {spot.status === "occupied" ? (
                  <div className="space-y-2 bg-white/70 p-3 rounded-lg border border-slate-100 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <User size={14} className="text-slate-400 shrink-0" />
                      <span className="font-medium truncate">{spot.residentName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Car size={14} className="text-slate-400 shrink-0" />
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                        {spot.vehicleNumber}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center text-center text-emerald-600/70">
                    <Unlock size={24} className="mb-1" />
                    <span className="text-xs font-medium">Available</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-2">
                {spot.status === "occupied" ? (
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 text-xs"
                      leftIcon={<Edit2 size={12} />}
                      onClick={() => handleOpenEditModal(spot)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-xs text-rose-600 hover:bg-rose-50"
                      onClick={() => handleReleaseSpot(spot)}
                    >
                      Release
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => handleOpenBookModal(spot)}
                  >
                    Book Slot
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Slot Dialog */}
      <Dialog
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Parking Slot"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddParking}>
              Create Slot
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddParking} className="space-y-4 py-2">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Select Block
            </label>
            <select
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="A">Block A</option>
              <option value="B">Block B</option>
              <option value="C">Block C</option>
              <option value="D">Block D</option>
            </select>
          </div>
          <Input
            label="Slot Number"
            type="text"
            placeholder="e.g. 101, 102"
            value={parkingNumber}
            onChange={(e) => setParkingNumber(e.target.value)}
            required
            helperText="The slot ID will be generated as {Block}-{Number}"
          />
        </form>
      </Dialog>

      {/* Book/Edit Slot Dialog */}
      <Dialog
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        title={isEditing ? `Edit Booking: ${selectedSpot?.slotNumber}` : `Book Parking Spot: ${selectedSpot?.slotNumber}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowBookModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookOrUpdate}>
              {isEditing ? "Save Changes" : "Confirm Booking"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleBookOrUpdate} className="space-y-4 py-2">
          <Input
            label="Resident Name"
            placeholder="John Doe"
            value={residentName}
            onChange={(e) => setResidentName(e.target.value)}
            required
            leftIcon={<User size={16} />}
          />
          <Input
            label="Vehicle Number"
            placeholder="MH 12 AB 1234"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            required
            leftIcon={<Car size={16} />}
          />
        </form>
      </Dialog>
    </div>
  );
}

export default Parking;