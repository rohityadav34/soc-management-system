import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Home as HomeIcon,
  CreditCard,
  ShieldAlert,
  Users2,
  Car,
  Megaphone,
  ChevronRight,
  PlusCircle,
  FileText,
  User,
  Settings,
  Bell,
} from "lucide-react";
import { fetchNotices } from "../redux/slice/noticeSlice";
import { fetchComplaints } from "../redux/slice/complaintSlice";
import { fetchBills } from "../redux/slice/billSlice";
import { fetchVisitors } from "../redux/slice/visitorSlice";
import { Badge } from "../components/ui";

function ResidentDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get name from Redux or Cookies
  const authName = useSelector((state) => state.auth.name) || Cookies.get("name") || "Resident";
  
  // States from Redux
  const { notices = [], loading: loadingNotices } = useSelector((state) => state.notice);
  const { complaints = [], loading: loadingComplaints } = useSelector((state) => state.complaint);
  const { bills = [], loading: loadingBills } = useSelector((state) => state.bill);
  const { visitors = [], loading: loadingVisitors } = useSelector((state) => state.visitor);

  // Local states
  const [flatInfo, setFlatInfo] = useState(null);
  const [parkingInfo, setParkingInfo] = useState(null);
  const [loadingLocal, setLoadingLocal] = useState(true);

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    // Dispatch Redux requests
    dispatch(fetchNotices());
    dispatch(fetchComplaints());
    dispatch(fetchBills());
    dispatch(fetchVisitors());

    // Fetch user profile flat details & parking slot
    const fetchLocalDetails = async () => {
      try {
        setLoadingLocal(true);
        const userId = Cookies.get("id");
        if (userId) {
          // Fetch profile for flat info
          const userRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/${userId}`,
            { withCredentials: true }
          );
          if (userRes.data && userRes.data.data) {
            setFlatInfo(userRes.data.data.flat);
          }

          // Fetch parking info
          const parkingRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/parking/my-parking`,
            { withCredentials: true }
          );
          if (parkingRes.data && parkingRes.data.data) {
            setParkingInfo(parkingRes.data.data);
          }
        }
      } catch (err) {
        console.error("Error fetching local dashboard details:", err);
      } finally {
        setLoadingLocal(false);
      }
    };

    fetchLocalDetails();
  }, [dispatch]);

  // Calculations
  const unpaidBills = bills.filter((b) => b.status === "unpaid" || b.status === "pending");
  const totalPendingAmount = unpaidBills.reduce((sum, b) => sum + b.amount, 0);
  
  // Find oldest unpaid bill due date
  let oldestDueDate = null;
  if (unpaidBills.length > 0) {
    const sortedUnpaid = [...unpaidBills].sort(
      (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    );
    oldestDueDate = new Date(sortedUnpaid[0].dueDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const activeComplaintsCount = complaints.filter(
    (c) => c.status === "pending" || c.status === "in_progress" || c.status === "in-progress"
  ).length;

  // Filter visitors for today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const visitorsTodayCount = visitors.filter((v) => {
    const checkInDate = v.checkIn || v.createdAt;
    return checkInDate && new Date(checkInDate) >= todayStart;
  }).length;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return <Badge variant="success">Resolved</Badge>;
      case "in_progress":
      case "in-progress":
        return <Badge variant="warning">In Progress</Badge>;
      default:
        return <Badge variant="danger">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Dynamic Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {getGreeting()}, {authName.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back to your dashboard</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Card 1: My Flat */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                My Flat
              </p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                {flatInfo ? `${flatInfo.block}-${flatInfo.flatNumber}` : "N/A"}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <HomeIcon size={20} />
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-3 border-t border-slate-100 pt-3">
            {flatInfo ? `Floor ${flatInfo.floor}, Block ${flatInfo.block}` : "Not Assigned"}
          </p>
        </div>

        {/* Card 2: Pending Payment */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Pending Payment
              </p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                ₹{totalPendingAmount.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <CreditCard size={20} />
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-3 border-t border-slate-100 pt-3">
            {oldestDueDate ? `Due on ${oldestDueDate}` : "No outstanding bills"}
          </p>
        </div>

        {/* Card 3: Active Complaints */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Active Complaints
              </p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                {activeComplaintsCount}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
              <ShieldAlert size={20} />
            </div>
          </div>
          <Link
            to="/dashboard/my-complaints"
            className="text-indigo-600 hover:text-indigo-700 text-xs font-medium mt-3 border-t border-slate-100 pt-3 inline-flex items-center gap-0.5"
          >
            View your complaints
          </Link>
        </div>

        {/* Card 4: Visitors Today */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Visitors Today
              </p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                {visitorsTodayCount}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <Users2 size={20} />
            </div>
          </div>
          <Link
            to="/dashboard/visitors"
            className="text-indigo-600 hover:text-indigo-700 text-xs font-medium mt-3 border-t border-slate-100 pt-3 inline-flex items-center gap-0.5"
          >
            View entries
          </Link>
        </div>

        {/* Card 5: Parking Slot */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Parking Slot
              </p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                {parkingInfo ? parkingInfo.slotNumber : "None"}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Car size={20} />
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-3 border-t border-slate-100 pt-3">
            {parkingInfo ? `${parkingInfo.vehicleNumber || "No vehicle bound"}` : "Unallocated"}
          </p>
        </div>
      </div>

      {/* Announcements & Complaints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Announcements */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Megaphone size={18} className="text-indigo-600" />
                Recent Announcements
              </h3>
              <Link
                to="/dashboard/notices"
                className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold"
              >
                View All
              </Link>
            </div>

            {loadingNotices ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              </div>
            ) : notices.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No recent announcements.
              </div>
            ) : (
              <div className="space-y-5">
                {notices.slice(0, 2).map((notice) => (
                  <div key={notice._id} className="flex gap-4 items-start">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                      <Megaphone size={18} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-bold text-slate-800 text-sm leading-snug">
                          {notice.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0 whitespace-nowrap">
                          {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                        {notice.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ShieldAlert size={18} className="text-rose-600" />
                Recent Complaints
              </h3>
              <Link
                to="/dashboard/my-complaints"
                className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold"
              >
                View All
              </Link>
            </div>

            {loadingComplaints ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600"></div>
              </div>
            ) : complaints.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No complaints submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.slice(0, 2).map((complaint) => (
                  <div
                    key={complaint._id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg font-semibold text-xs font-mono shrink-0">
                        #{complaint._id.slice(-4).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">
                          {complaint.title}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          Filed on: {new Date(complaint.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">{getStatusBadge(complaint.status)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Action 1 */}
          <Link
            to="/dashboard/my-complaints"
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <ShieldAlert size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-none">Raise Complaint</h4>
                <p className="text-slate-400 text-[11px] mt-1.5 leading-none">Report an issue</p>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-slate-400 group-hover:translate-x-1 transition-transform"
            />
          </Link>

          {/* Action 2 */}
          <Link
            to="/dashboard/payments"
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CreditCard size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-none">Pay Maintenance</h4>
                <p className="text-slate-400 text-[11px] mt-1.5 leading-none">Make a payment</p>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-slate-400 group-hover:translate-x-1 transition-transform"
            />
          </Link>

          {/* Action 3 */}
          <Link
            to="/dashboard/notices"
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Megaphone size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-none">View Announcements</h4>
                <p className="text-slate-400 text-[11px] mt-1.5 leading-none">See all updates</p>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-slate-400 group-hover:translate-x-1 transition-transform"
            />
          </Link>

          {/* Action 4 */}
          <Link
            to="/dashboard/profile"
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <User size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-none">Update Profile</h4>
                <p className="text-slate-400 text-[11px] mt-1.5 leading-none">Edit your details</p>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-slate-400 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResidentDashboard;
