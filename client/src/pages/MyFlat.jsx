import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import FlatDetailsCard from "./FlatDetailsCard";
import FamilyMembersCard from "./FamilyMembersCard";
import VehicleDetailsCard from "./VehicleDetailsCard";
import ParkingInformationCard from "./ParkingInformationCard";

function MyFlat() {
  const userId = Cookies.get("id");
  const [userProfile, setUserProfile] = useState(null);
  const [parkingInfo, setParkingInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFlatAndProfileDetails = async () => {
    try {
      setLoading(true);
      // Fetch user profile (includes populated flat details, members, and vehicles)
      const profileRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        { withCredentials: true }
      );
      if (profileRes.data && profileRes.data.data) {
        setUserProfile(profileRes.data.data);
      }

      // Fetch parking info
      const parkingRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/parking/my-parking`,
        { withCredentials: true }
      );
      if (parkingRes.data && parkingRes.data.data) {
        setParkingInfo(parkingRes.data.data);
      }
    } catch (error) {
      console.error("Error loading flat details:", error);
      toast.error("Failed to load flat details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFlatAndProfileDetails();
    }
  }, [userId]);

  // Family Members operations
  const handleAddMember = async (memberData) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/${userId}/members`,
        memberData,
        { withCredentials: true }
      );
      if (res.data) {
        setUserProfile((prev) => ({ ...prev, members: res.data.data }));
        toast.success("Family member added successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add family member.");
      throw error;
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/${userId}/members/${memberId}`,
        { withCredentials: true }
      );
      if (res.data) {
        setUserProfile((prev) => ({ ...prev, members: res.data.data }));
        toast.success("Family member deleted successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete family member.");
    }
  };

  // Vehicles operations
  const handleAddVehicle = async (vehicleData) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/${userId}/vehicles`,
        vehicleData,
        { withCredentials: true }
      );
      if (res.data) {
        setUserProfile((prev) => ({ ...prev, vehicles: res.data.data }));
        toast.success("Vehicle registered successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to register vehicle.");
      throw error;
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/${userId}/vehicles/${vehicleId}`,
        { withCredentials: true }
      );
      if (res.data) {
        setUserProfile((prev) => ({ ...prev, vehicles: res.data.data }));
        toast.success("Vehicle deleted successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete vehicle.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          My Flat
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage flat details, family members, and registered vehicles.
        </p>
      </div>

      {/* Grid Layout matching the mockup structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Row 1, Left: Flat Details (5 cols) */}
        <div className="lg:col-span-5 h-full">
          <FlatDetailsCard flat={userProfile?.flat} user={userProfile} />
        </div>

        {/* Row 1, Right: Family Members (7 cols) */}
        <div className="lg:col-span-7 h-full">
          <FamilyMembersCard
            members={userProfile?.members}
            onAddMember={handleAddMember}
            onDeleteMember={handleDeleteMember}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Row 2, Left: Vehicle Details (7 cols) */}
        <div className="lg:col-span-7 h-full">
          <VehicleDetailsCard
            vehicles={userProfile?.vehicles}
            onAddVehicle={handleAddVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />
        </div>

        {/* Row 2, Right: Parking Information (5 cols) */}
        <div className="lg:col-span-5 h-full">
          <ParkingInformationCard parking={parkingInfo} />
        </div>
      </div>
    </div>
  );
}

export default MyFlat;