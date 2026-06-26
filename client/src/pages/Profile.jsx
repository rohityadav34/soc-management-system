import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, Lock, Shield, Building, Edit, Save, ArrowLeft } from "lucide-react";
import { Button, Input, Card } from "../components/ui";

function Profile() {
  const userId = Cookies.get("id");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        { withCredentials: true }
      );
      if (res.data && res.data.data) {
        const user = res.data.data;
        setProfile(user);
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          password: "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfileDetails();
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and Email are required.");
      return;
    }

    try {
      setUpdating(true);
      // Clean up body
      const updatePayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone ? Number(formData.phone) : undefined,
      };
      if (formData.password) {
        updatePayload.password = formData.password;
      }

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        updatePayload,
        { withCredentials: true }
      );

      if (res.data) {
        toast.success("Profile updated successfully!");
        setFormData((prev) => ({ ...prev, password: "" }));
        fetchProfileDetails();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <User className="text-indigo-600" />
          My Profile
        </h1>
        <p className="text-slate-500 text-sm">View and manage your account details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Account Overview */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center space-y-4">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-3xl border-2 border-indigo-100 shadow-sm mx-auto">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{profile?.name}</h2>
              <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider mt-1">
                {profile?.role?.role?.replace("_", " ")}
              </span>
            </div>
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-left text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{profile?.email}</span>
              </div>
              {profile?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-slate-400" />
                  <span>{profile?.phone}</span>
                </div>
              )}
            </div>
          </div>

          {profile?.flat && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 uppercase tracking-wider">
                <Building size={16} className="text-indigo-600" />
                Flat Assignment
              </h3>
              <div className="space-y-3 pt-2 text-sm text-slate-600">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span>Flat Number</span>
                  <strong className="text-slate-800">{profile.flat.flatNumber}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span>Block</span>
                  <strong className="text-slate-800">Block {profile.flat.block}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Floor</span>
                  <strong className="text-slate-800">{profile.flat.floor}th Floor</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Card: Edit Details */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
              <Edit size={18} className="text-indigo-600" />
              Update Account Details
            </h3>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  leftIcon={<User size={16} />}
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  leftIcon={<Mail size={16} />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  name="phone"
                  type="number"
                  placeholder="10 digit phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  leftIcon={<Phone size={16} />}
                />
                <Input
                  label="New Password (Optional)"
                  name="password"
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={formData.password}
                  onChange={handleChange}
                  leftIcon={<Lock size={16} />}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  disabled={updating}
                  leftIcon={<Save size={18} />}
                >
                  {updating ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
