import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import ResetSetupPassword from '../pages/ResetSetupPassword';
import Dashboard from '../components/Deshboard';
import ProtectedRoutes from '../components/ProtectedRoutes';
import OpenRoutes from '../components/opernRouter';
import ManageUsers from '../components/ManageUsers';
import Stats from '../components/Stats';

import { useSelector } from 'react-redux';
import ManageFlat from '../pages/ManageFlat';
import ManageComplaints from '../pages/ManageComplaints';
import ManageNotices from '../pages/ManageNotices';
import MyFlat from '../pages/MyFlat';
import Visitors from '../pages/Visitors';
import Home from '../pages/Home';
import Payments from '../pages/Payments';
import Deliveries from '../pages/Deliveries';
import Parking from '../pages/Parking';
import Emergency from '../pages/Emergency';
import ResidentDashboard from '../components/ResidentDashboard';
import GuardDashboard from '../components/GuardDashboard';
import Profile from '../pages/Profile';

const RoleBasedIndex = () => {
  const { role } = useSelector((state) => state.auth);
  const roleLower = role?.toLowerCase();
  if (roleLower === 'admin') return <Stats />;
  if (roleLower === 'resident') return <ResidentDashboard />;
  if (roleLower === 'security-guard' || roleLower === 'security_guard' || roleLower === 'staff') return <GuardDashboard />;
  return <ManageUsers />;
};

function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<OpenRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/reset-setup-password" element={<ResetSetupPassword />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />}>
         
            <Route index element={<RoleBasedIndex />} />
            
           
            <Route path="stats" element={<Stats />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="flats" element={<ManageFlat/>} />
            <Route path="staff" element={<ManageUsers />} />
            <Route path="complaints" element={<ManageComplaints />} />
            <Route path="notices" element={<ManageNotices />} />

          
            <Route path="my-flat" element={<MyFlat/>} />
            <Route path="payments" element={<Payments />} />
            <Route path="my-complaints" element={<ManageComplaints />} />
          
            <Route path="visitors" element={<Visitors />} />
            <Route path="deliveries" element={<Deliveries />} />
            <Route path="parking" element={<Parking />} />
            <Route path="emergency" element={<Emergency />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default AppRoutes;