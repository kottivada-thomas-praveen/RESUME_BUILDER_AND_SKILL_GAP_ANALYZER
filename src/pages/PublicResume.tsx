import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Api from "../api/Api";
import {
  Download,
  Eye,
  MapPin,
  Mail,
  Phone,
  Globe,
  Sparkles,
  ExternalLink,
  AlertCircle
} from "lucide-react";

interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  field: string;
  gradDate: string;
  location: string;
}

interface Project {
  name: string;
  technologies: string;
  link: string;
  description: string;
}

interface ResumeData {
  id: number;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  skills: string;
  templateName: string;
  accentColor: string;
  photoUrl?: string;
  atsScore: number;
  version: number;
  viewsCount: number;
  downloadCount: number;
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
}

export const PublicResume: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchPublicResume = async () => {
      try {
        setLoading(true);
        const res = await Api.get(`/api/public/resumes/${shareToken}`);
        if (res.data && res.data.data) {
          setResume(res.data.data);
        } else {
          setError("Resume not found or sharing has been disabled by owner.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Resume not found or sharing link is inactive.");
      } finally {
        setLoading(false);
      }
    };

    if (shareToken) {
      fetchPublicResume();
    }
  }, [shareToken]);

  const handleDownloadPdf = async () => {
    if (!shareToken) return;
    try {
      setDownloading(true);
      const response = await Api.get(`/api/public/resumes/${shareToken}/export`, {
        responseType: "blob"
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${resume?.fullName || "resume"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      if (resume) {
        setResume({ ...resume, downloadCount: (resume.downloadCount || 0) + 1 });
      }
    } catch (err) {
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-base font-medium">Loading verified resume profile...</p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Resume Unavailable</h2>
        <p className="text-slate-400 max-w-md mb-6">{error || "This resume link may have expired or been deactivated."}</p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          Return to CareerCraft
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Public Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-semibold text-emerald-400 tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Verified Public Profile
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {resume.viewsCount} views
                </span>
              </div>
              <h1 className="text-lg font-bold text-white">{resume.fullName}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloading ? "Compiling PDF..." : "Download Official PDF"}
            </button>
          </div>
        </div>

        {/* Resume Preview Document Card */}
        <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 border border-slate-200">
          {/* Header */}
          <div className="border-b border-slate-200 pb-6 mb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
              {resume.fullName}
            </h1>
            <p className="text-lg font-semibold text-indigo-700 mt-1">{resume.title}</p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 mt-3">
              {resume.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {resume.email}
                </span>
              )}
              {resume.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {resume.phone}
                </span>
              )}
              {resume.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {resume.location}
                </span>
              )}
              {resume.website && (
                <span className="flex items-center gap-1 text-indigo-600">
                  <Globe className="w-3.5 h-3.5" /> {resume.website}
                </span>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {resume.summary && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2">
                Professional Summary
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">{resume.summary}</p>
            </div>
          )}

          {/* Technical Skills */}
          {resume.skills && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-2">
                Core Competencies & Skills
              </h2>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {resume.skills.split(",").map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium rounded-md"
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {resume.experiences && resume.experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-3">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {resume.experiences.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm">
                      <span className="font-bold text-slate-900">{exp.role}</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {exp.startDate} — {exp.endDate || "Present"}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-indigo-700 flex items-center justify-between">
                      <span>{exp.company}</span>
                      {exp.location && <span className="text-slate-500 font-normal">{exp.location}</span>}
                    </div>
                    {exp.description && (
                      <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed pt-1">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.educations && resume.educations.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-3">
                Education
              </h2>
              <div className="space-y-3">
                {resume.educations.map((edu, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm">
                    <div>
                      <span className="font-bold text-slate-900">{edu.degree}</span>
                      {edu.field && <span> in {edu.field}</span>}
                      <div className="text-xs text-indigo-700 font-medium">{edu.school}</div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {edu.gradDate} {edu.location && `| ${edu.location}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1 mb-3">
                Key Projects
              </h2>
              <div className="space-y-3">
                {resume.projects.map((proj, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-900">{proj.name}</span>
                      {proj.link && (
                        <a
                          href={proj.link.startsWith("http") ? proj.link : `https://${proj.link}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    {proj.technologies && (
                      <p className="text-xs text-indigo-700 font-mono">{proj.technologies}</p>
                    )}
                    {proj.description && (
                      <p className="text-xs text-slate-700 leading-relaxed">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicResume;
