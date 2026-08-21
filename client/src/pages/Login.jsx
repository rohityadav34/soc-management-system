import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slice/authslice";
import { toast } from "react-hot-toast";
import { ShieldCheck, Home, UserCheck } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  // Demo accounts for showcasing the project — replace with your real demo credentials
  const demoAccounts = [
    {
      role: "Admin",
      icon: ShieldCheck,
      email: "admin123@yopmail.com",
      password: "admin@123",
      color: "bg-indigo-500",
    },
    {
      role: "Resident",
      icon: Home,
      email: "regident123@yopmail.com",
      password: "resident@123",
      color: "bg-emerald-500",
    },
    {
      role: "Guard",
      icon: UserCheck,
      email: "guard123@yopmail.com",
      password: "guard@123",
      color: "bg-orange-500",
    },
  ];

  const fillDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    toast.success("Demo credentials filled! Click Login.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      const resultAction = await dispatch(login({ formData: { email, password } }));
      if (login.fulfilled.match(resultAction)) {
        toast.success("Logged in successfully!");
        navigate("/dashboard");
      } else {
        toast.error(resultAction.payload?.message || "Login failed. Please check credentials.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Welcome Back</h2>
        <p className="text-slate-500 text-center text-sm mb-6">Society Management Portal</p>

        {/* Demo Accounts Section */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
            Try Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((demo) => {
              const Icon = demo.icon;
              return (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => fillDemoCredentials(demo.email, demo.password)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all group"
                >
                  <div className={`w-8 h-8 ${demo.color} rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">{demo.role}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400">or login manually</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/15 flex items-center justify-center ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>

        <p className="text-sm text-center text-slate-500 mt-6">
          Don't have an account? Ask your Society Admin to register you.
        </p>
      </div>
    </div>
  );
};

export default Login;