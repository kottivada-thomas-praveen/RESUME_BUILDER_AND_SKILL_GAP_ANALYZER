import React, { type JSX } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ShieldAlert, ArrowLeft } from "lucide-react";

interface ProtectedRouteProps {
  children: JSX.Element;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium text-sm">Verifying Session Security...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-Based Authorization Gate: Restrict admin-only routes to ROLE_ADMIN
  if (adminOnly && user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400 px-3 py-1 bg-rose-500/10 rounded-full border border-rose-500/20">
              403 - Forbidden Access
            </span>
            <h2 className="text-2xl font-black text-white mt-3">Administrator Privileges Required</h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Your account (<span className="text-slate-200 font-mono font-medium">{user?.email}</span>) does not possess the <span className="font-bold text-rose-300">ADMIN</span> clearance required to view this monitoring panel.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to User Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
