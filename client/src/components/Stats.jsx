import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../redux/slice/userSlice';
import { fetchFlats } from '../redux/slice/flatSlice';
import { fetchComplaints } from '../redux/slice/complaintSlice';
import { fetchNotices } from '../redux/slice/noticeSlice';
import { 
    LayoutDashboard, Users, Home, 
    ShieldAlert, Megaphone, CreditCard, 
    ClipboardList, UserCheck, ShieldCheck,
    Activity, TrendingUp, Package, Car,
    Outdent
  } from 'lucide-react';

  
function Stats() {
  const dispatch = useDispatch();
  
  const { users = [], loading: loadingUsers } = useSelector((state) => state.user);
  const { flats = [], loading: loadingFlats } = useSelector((state) => state.flat);
  const { complaints = [], loading: loadingComplaints } = useSelector((state) => state.complaint);
  const { notices = [], loading: loadingNotices } = useSelector((state) => state.notice);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchFlats());
    dispatch(fetchComplaints());
    dispatch(fetchNotices());
  }, [dispatch]);

  // Dynamic calculations for stats cards
 // Safely extract role name whether `role` is a string, an object
// like { role: "resident" }, or an object like { name: "resident" }.
const getRoleName = (u) => {
  const r = u?.role;
  if (!r) return '';
  if (typeof r === 'string') return r.toLowerCase();
  if (typeof r === 'object') return String(r.role ?? r.name ?? '').toLowerCase();
  return '';
};

// Dynamic calculations for stats cards
const totalResidents = users.filter(u => getRoleName(u) === 'resident').length;

const totalFlats = flats.length;
const occupiedFlats = flats.filter(f => f.status?.toLowerCase() === 'occupied').length;
const occupancyRate = totalFlats > 0 ? Math.round((occupiedFlats / totalFlats) * 100) : 0;

const activeGuards = users.filter(u => {
  const roleName = getRoleName(u);
  return roleName === 'security-guard' || roleName === 'security_guard' || roleName === 'staff';
}).length;

  const pendingIssues = complaints.filter(c => c.status?.toLowerCase() === 'pending').length;

  // Combine complaints and notices for Recent Alerts
  const alertsList = [];
  
  complaints.forEach((c) => {
    alertsList.push({
      id: `complaint-${c._id}`,
      title: `New complaint: "${c.title}"`,
      desc: `Filed by ${c.resident?.name || 'Resident'}`,
      time: c.createdAt,
      color: 'bg-amber-500'
    });
  });

  notices.forEach((n) => {
    alertsList.push({
      id: `notice-${n._id}`,
      title: `Announcement: "${n.title}"`,
      desc: n.description || 'Public society notice',
      time: n.createdAt,
      color: 'bg-indigo-500'
    });
  });

  // Sort newest first and limit to 4
  const recentAlerts = alertsList
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 4);

  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };
 
  return (
     <div>
        <div className="space-y-8 animate-in fade-in duration-700">
          <header>
            <h1 className="text-2xl font-bold text-slate-900">Administrator Console</h1>
            <p className="text-slate-500 text-sm mt-1">Manage society operations and user access control.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Residents" 
              value={loadingUsers ? '...' : totalResidents} 
              icon={Users} 
              color="bg-blue-500" 
              trend={`${totalResidents} active profiles`} 
            />
            <StatsCard 
              title="Occupancy Rate" 
              value={loadingFlats ? '...' : `${occupancyRate}%`} 
              icon={Home} 
              color="bg-emerald-500" 
              trend={`${occupiedFlats} of ${totalFlats} flats occupied`} 
            />
            <StatsCard 
              title="Active Guards" 
              value={loadingUsers ? '...' : activeGuards} 
              icon={ShieldCheck} 
              color="bg-indigo-500" 
              trend={`${activeGuards} guards deployed`} 
            />
            <StatsCard 
              title="Pending Issues" 
              value={loadingComplaints ? '...' : pendingIssues} 
              icon={ShieldAlert} 
              color="bg-orange-500" 
              trend={`${pendingIssues} unresolved complaints`} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 ds-panel p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Society Overview</h3>
                  <Activity className="text-slate-400" size={20} />
                </div>
                <div className="h-64 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center">
                   <p className="text-slate-400 text-sm">Society Activity Graph Placeholder</p>
                </div>
             </div>
             <div className="ds-panel p-6">
                <h3 className="text-lg font-bold mb-6">Recent Alerts</h3>
                <div className="space-y-4">
                  {loadingComplaints || loadingNotices ? (
                    <div className="py-8 flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                    </div>
                  ) : recentAlerts.length === 0 ? (
                    <p className="text-slate-400 text-sm py-4 text-center">No recent alerts or complaints.</p>
                  ) : (
                    recentAlerts.map((alert) => (
                      <div key={alert.id} className="flex gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${alert.color}`}></div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 leading-snug">{alert.title}</p>
                          {alert.desc && <p className="text-xs text-slate-400 mt-0.5">{alert.desc}</p>}
                          <p className="text-[10px] text-slate-400 mt-1 font-medium">{getRelativeTime(alert.time)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
             </div>
          </div>
        </div>  
     </div>
  )
}


// Helper Component for Stats Cards
const StatsCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="ds-panel p-6 flex flex-col justify-between group hover:border-primary-500/30 transition-all cursor-pointer">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} text-white shadow-lg shadow-inherit/20`}>
        <Icon size={22} />
      </div>
      <div className="text-right">
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
    </div>
    <div className="pt-4 border-t border-slate-50">
      <div className="flex items-center gap-1.5">
        <TrendingUp size={14} className="text-emerald-500" />
        <span className="text-[11px] font-medium text-slate-600">{trend}</span>
      </div>
    </div>
  </div>
);


export default Stats