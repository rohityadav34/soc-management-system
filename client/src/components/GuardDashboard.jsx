import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  Car,
  UserPlus,
  Truck,
  ChevronRight,
  Clock,
  ArrowRightLeft
} from "lucide-react";
import { fetchVisitors } from "../redux/slice/visitorSlice";
import { fetchFlats } from "../redux/slice/flatSlice";
import { Badge } from "./ui";
import Cookies from "js-cookie";

function GuardDashboard() {
  const dispatch = useDispatch();
  const authName = useSelector((state) => state.auth.name) || Cookies.get("name") || "Security Officer";

  const { visitors = [], loading: loadingVisitors } = useSelector((state) => state.visitor);
  const { flats = [], loading: loadingFlats } = useSelector((state) => state.flat);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    dispatch(fetchVisitors());
    dispatch(fetchFlats());
  }, [dispatch]);

  // Calculations for Today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayVisitors = visitors.filter((v) => {
    const visitorDate = v.createdAt || v.checkIn;
    return visitorDate && new Date(visitorDate) >= todayStart;
  });

  const totalVisitorsCount = todayVisitors.length;
  const pendingApprovalsCount = todayVisitors.filter((v) => v.status?.toLowerCase() === "pending").length;
  const approvedEntriesCount = todayVisitors.filter((v) => v.status?.toLowerCase() === "accepted").length;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return <Badge variant="success">Approved</Badge>;
      case "rejected":
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="warning">Pending Approval</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="text-emerald-600" size={32} />
            {getGreeting()}, {authName.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Guard Station & Gatekeeper Dashboard</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-full border border-emerald-100 font-semibold text-xs uppercase tracking-wider animate-pulse">
          <span className="h-2 w-2 rounded-full bg-emerald-600 block"></span>
          Active Shift
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Today's Visitors */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Today's Visitors
              </p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                {totalVisitorsCount}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <Users size={20} />
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-3 border-t border-slate-100 pt-3">
            Total logs registered today
          </p>
        </div>

        {/* Card 2: Pending Approvals */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Pending Approvals
              </p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">
                {pendingApprovalsCount}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-3 border-t border-slate-100 pt-3">
            Awaiting resident response
          </p>
        </div>

        {/* Card 3: Approved Entries */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Approved Entries
              </p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">
                {approvedEntriesCount}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={20} />
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-3 border-t border-slate-100 pt-3">
            Allowed inside premises
          </p>
        </div>
      </div>

      {/* Recent Visitors Table/List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ArrowRightLeft size={18} className="text-indigo-600" />
            Recent Today's Visitors
          </h3>
          <Link to="/dashboard/visitors" className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold">
            View Log Book
          </Link>
        </div>

        {loadingVisitors ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : todayVisitors.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No visitors registered yet today.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {todayVisitors.slice(0, 3).map((v) => (
              <div key={v._id} className="py-4 flex justify-between items-center gap-4 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{v.name}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span>Phone: {v.phone}</span>
                    <span>•</span>
                    <span className="font-medium text-slate-600">Flat {v.flat?.flatNumber} (Block {v.flat?.block})</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {getStatusBadge(v.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Action 1 */}
          <Link
            to="/dashboard/visitors"
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <UserPlus size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-none">Register Visitor</h4>
                <p className="text-slate-400 text-[11px] mt-1.5 leading-none">Check-in at gate</p>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-slate-400 group-hover:translate-x-1 transition-transform"
            />
          </Link>

          {/* Action 2 */}
          <Link
            to="/dashboard/deliveries"
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Truck size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-none">Log Delivery</h4>
                <p className="text-slate-400 text-[11px] mt-1.5 leading-none">Courier or parcel</p>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-slate-400 group-hover:translate-x-1 transition-transform"
            />
          </Link>

          {/* Action 3 */}
          <Link
            to="/dashboard/parking"
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-500/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Car size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-none">Parking Layout</h4>
                <p className="text-slate-400 text-[11px] mt-1.5 leading-none">Check slot allocation</p>
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

export default GuardDashboard;
