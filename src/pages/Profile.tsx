import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";
import Api from "../api/Api";

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await authService.updateProfile({ fullName, email });
      if (response.success && response.data) {
        updateUser(response.data);
        setMessage("Profile updated successfully!");
      } else {
        setError(response.message || "Failed to update profile.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">User Account Profile</h2>

          {message && (
            <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300">Account ID</label>
              <input
                type="text"
                disabled
                value={user?.id || ""}
                className="mt-1 block w-full px-4 py-2.5 bg-slate-800/50 border border-slate-800 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Role</label>
              <input
                type="text"
                disabled
                value={user?.role || "USER"}
                className="mt-1 block w-full px-4 py-2.5 bg-slate-800/50 border border-slate-800 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? "Saving Changes..." : "Update Profile"}
            </button>
          </form>

          {/* GDPR Privacy & Data Deletion (SRS #22) */}
          <div className="mt-12 pt-8 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Data Privacy & GDPR
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Permanent Account & Data Wipe</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In accordance with GDPR compliance standards, you have the right to be forgotten. 
              Clicking below will permanently and irreversibly erase your user profile, all associated resumes, 
              skills, ATS analyses, and cached server PDFs from our system.
            </p>
            <button
              type="button"
              onClick={async () => {
                const confirmed = window.confirm(
                  "ARE YOU ABSOLUTELY SURE?\n\nThis will permanently delete your account, all your resumes, and all your skill analyses from the database. This action cannot be reversed."
                );
                if (!confirmed) return;
                try {
                  const res = await Api.delete("/api/privacy/delete-my-data");
                  alert(res.data?.message || "All your data has been successfully deleted under GDPR guidelines.");
                  localStorage.clear();
                  window.location.href = "/login";
                } catch (e: any) {
                  alert(e.response?.data?.message || "Failed to wipe data. Please contact support.");
                }
              }}
              className="px-5 py-2.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 font-semibold text-xs rounded-xl transition-all"
            >
              Permanently Erase All My Data (GDPR Wipe)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
