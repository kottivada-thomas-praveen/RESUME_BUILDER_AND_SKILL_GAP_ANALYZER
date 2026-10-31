import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import Api from "../api/Api";
import {
  FileText,
  Copy,
  Share2,
  Download,
  Eye,
  Plus,
  Shield,
  Trash2,
  Check
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleDeleteResume = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await Api.delete(`/api/resumes/${id}`);
      fetchResumes();
    } catch (e) {
      alert("Failed to delete resume.");
    }
  };

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      const res = await Api.get("/api/resumes");
      if (res.data?.data) {
        setResumes(res.data.data);
      }
    } catch (e) {
      console.error("Failed to load user resumes", e);
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleClone = async (id: number) => {
    try {
      const res = await Api.post(`/api/resumes/${id}/clone`);
      if (res.data?.data) {
        alert("Resume successfully cloned! You can now customize this new version.");
        fetchResumes();
      }
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to clone resume.");
    }
  };

  const handleShare = async (id: number) => {
    try {
      const res = await Api.post(`/api/resumes/${id}/share`);
      if (res.data?.data?.shareToken) {
        const token = res.data.data.shareToken;
        const publicUrl = `${window.location.origin}/public/resume/${token}`;
        await navigator.clipboard.writeText(publicUrl);
        setCopiedToken(token);
        setTimeout(() => setCopiedToken(null), 3000);
        fetchResumes();
      }
    } catch (e: any) {
      alert("Failed to generate share link.");
    }
  };

  const handleDownloadPdf = async (id: number, name: string) => {
    try {
      const res = await Api.get(`/api/resumes/${id}/export`, { responseType: "blob" });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${name || "resume"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      fetchResumes();
    } catch (e) {
      alert("Could not export PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                  ROLE: {user?.role || "USER"}
                </span>
                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="text-xs font-semibold px-3 py-1 bg-purple-500/20 text-purple-300 hover:text-white rounded-full border border-purple-500/30 transition-colors flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3" /> Admin Center &rarr;
                  </Link>
                )}
              </div>
              <h1 className="text-3xl font-extrabold mt-2 text-white">
                Welcome back, {user?.fullName || "Developer"}! 👋
              </h1>
              <p className="text-slate-400 mt-1">
                Build ATS-friendly resumes and analyze skill gaps in real-time.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/build-resume"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200"
              >
                <Plus className="w-4 h-4" /> Create Resume
              </Link>
              <Link
                to="/profile"
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300 shadow-lg">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 text-2xl mb-4">
              📄
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Resume Builder</h3>
            <p className="text-slate-400 text-sm mb-4">
              Create industry-standard resumes with live previews, MaterialUI Stepper, and AI bullet optimization.
            </p>
            <Link to="/build-resume" className="text-indigo-400 font-semibold text-sm hover:text-indigo-300">
              Launch Builder &rarr;
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 shadow-lg">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 text-2xl mb-4">
              📊
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Skill Gap Dashboard</h3>
            <p className="text-slate-400 text-sm mb-4">
              Visual radar charts & missing skill recommendations compared against live job descriptions.
            </p>
            <Link to="/analyze-resume" className="text-purple-400 font-semibold text-sm hover:text-purple-300">
              Analyze Skills &rarr;
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 shadow-lg">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 text-2xl mb-4">
              🛡️
            </div>
            <h3 className="text-xl font-bold text-white mb-2">GDPR & Security Status</h3>
            <p className="text-slate-400 text-sm mb-4">
              Strict GDPR deletion endpoints • Encrypted JWT session • Role-based access control.
            </p>
            <Link to="/profile" className="text-emerald-400 font-semibold text-sm hover:text-emerald-300">
              Privacy Settings &rarr;
            </Link>
          </div>
        </div>

        {/* User's Resumes Management List (SRS #9, #10, #18, #20, #21) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                My Saved Resumes ({resumes.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage, clone versions, share public links, and track recruiter views.
              </p>
            </div>
            <Link
              to="/build-resume"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
            >
              + New Resume
            </Link>
          </div>

          {loadingResumes ? (
            <div className="py-12 text-center text-slate-400">Loading your resumes...</div>
          ) : resumes.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <div className="text-4xl">📝</div>
              <p className="text-sm">You haven't saved any resumes yet.</p>
              <Link
                to="/build-resume"
                className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
              >
                Create Your First Resume
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumes.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">{r.fullName}</h4>
                      <p className="text-xs font-semibold text-indigo-400">{r.title || "Software Engineer"}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      v{r.version || 1} • {r.templateName || "modern"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-500" /> {r.viewsCount || 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5 text-slate-500" /> {r.downloadCount || 0} downloads
                    </span>
                    <span className="text-slate-500">
                      Updated {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : "Recently"}
                    </span>
                  </div>

                  {/* Actions: Edit, Clone, Share, Download */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <Link
                      to={`/build-resume?id=${r.id}`}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleClone(r.id)}
                      title="Duplicate this resume version"
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Copy className="w-3 h-3 text-indigo-400" /> Clone
                    </button>

                    <button
                      onClick={() => handleShare(r.id)}
                      title="Generate public shareable link"
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                    >
                      {copiedToken === r.shareToken ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3 text-purple-400" /> Share Link
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDownloadPdf(r.id, r.fullName)}
                      title="Download formatted PDF"
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Download className="w-3 h-3" /> PDF
                    </button>

                    <button
                      onClick={() => handleDeleteResume(r.id)}
                      title="Delete resume"
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
