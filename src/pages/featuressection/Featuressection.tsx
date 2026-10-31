import React from "react";
import {
  FileText,
  Compass,
  BadgeCheck,
  BrainCircuit,
  Eye,
  FileDown,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";

export const Featuressection: React.FC = () => {
  const features = [
    {
      icon: FileText,
      badge: "AI Powered",
      title: "AI Resume Builder",
      description:
        "Draft tailored, modern resumes with auto-formatting, AI-suggested bullet points, and live WYSIWYG editing.",
      link: "/build-resume",
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10",
      glow: "indigo" as const,
    },
    {
      icon: Compass,
      badge: "Intelligent",
      title: "Skill Gap Analysis",
      description:
        "Compare your qualifications directly against real job descriptions to reveal missing technical and soft skills.",
      link: "/analyze-resume",
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10",
      glow: "purple" as const,
    },
    {
      icon: BadgeCheck,
      badge: "Compliance",
      title: "ATS Score Checker",
      description:
        "Ensure your resume passes Applicant Tracking Systems with comprehensive keyword match and structural grading.",
      link: "/analyze-resume",
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      glow: "emerald" as const,
    },
    {
      icon: BrainCircuit,
      badge: "Career Growth",
      title: "Smart Course Recommendations",
      description:
        "Receive curated learning resources and project ideas designed specifically to bridge your identified skill gaps.",
      link: "/analyze-resume",
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10",
      glow: "indigo" as const,
    },
    {
      icon: Eye,
      badge: "Instant",
      title: "Real-Time Live Preview",
      description:
        "Witness changes immediately as you type. Switch between professional templates with a single click.",
      link: "/build-resume",
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10",
      glow: "none" as const,
    },
    {
      icon: FileDown,
      badge: "Print Ready",
      title: "Pixel-Perfect PDF Export",
      description:
        "Download print-ready, clean PDF documents that render consistently across all recruiter platforms.",
      link: "/build-resume",
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10",
      glow: "none" as const,
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background accents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="primary" size="md">
            ✦ POWERFUL CAPABILITIES
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Everything You Need to Get Hired
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Eliminate guesswork from your job applications. Combine automated resume
            creation with deep skill analytics.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={idx}
                hoverable
                glow={feature.glow}
                className="group relative flex flex-col justify-between border-slate-800/80 bg-slate-900/60"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl ${feature.iconBg} ${feature.iconColor} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="default" size="sm">
                      {feature.badge}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                <Link
                  to={feature.link}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 hover:underline pt-4 border-t border-slate-800/60"
                >
                  <span>Explore feature</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Featuressection;