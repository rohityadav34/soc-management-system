import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setupInitialPassword, Signout } from "../redux/slice/authslice";
import { toast } from "react-hot-toast";
import { KeyRound, Mail, Lock, ShieldCheck } from "lucide-react";

const ResetSetupPassword = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const emailParam = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailParam);
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Log out any currently logged in user (like an Admin) to ensure a clean session for the resident
    dispatch(Signout());
  }, [dispatch]);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !tempPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    try {
      const resultAction = await dispatch(
        setupInitialPassword({ email, tempPassword, newPassword })
      );

      if (setupInitialPassword.fulfilled.match(resultAction)) {
        toast.success("Password configured successfully! Welcome aboard.");
        navigate("/dashboard");
      } else {
        toast.error(
          resultAction.payload?.message || "Failed to set password. Please check temporary credentials."
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600"></div>

        <div className="flex justify-center mb-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <KeyRound size={28} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-800 mb-1">Set Your Password</h2>
        <p className="text-slate-500 text-center text-sm mb-6">
          Configure a permanent password to activate your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input (Read-only if provided in url) */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!emailParam}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-600 outline-none cursor-not-allowed text-sm"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          {/* Temporary Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Temporary Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="Enter temporary password from email"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/15 flex items-center justify-center ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Set Password & Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetSetupPassword;
