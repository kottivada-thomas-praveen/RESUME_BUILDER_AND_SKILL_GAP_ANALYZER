import React from "react";
import {
  FileText,
  BarChart3,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { Link } from "react-router-dom";

export const ServicesSection: React.FC = () => {
  const services = [
    {
      id: 1,
      icon: FileText,
      title: "AI Resume Builder",
      description:
        "Create ATS-friendly, professional resumes in minutes with smart suggestions, modern formatting, and instant PDF download.",
      points: [
        "ATS optimization algorithms",
        "Smart bullet point suggestions",
        "Modern professional layouts",
      ],
      link: "/build-resume",
      actionText: "Create Resume",
      color: "from-indigo-500/20 to-indigo-600/5",
      border: "hover:border-indigo-500/40",
      accent: "text-indigo-400",
    },
    {
      id: 2,
      icon: BarChart3,
      title: "Skill Gap Analyzer",
      description:
        "Evaluate your skillset against target role requirements to highlight key missing competencies and increase interview callbacks.",
      points: [
        "Job description matching",
        "Technical & soft skill breakdown",
        "Actionable prioritization",
      ],
      link: "/analyze-resume",
      actionText: "Analyze Gaps",
      color: "from-purple-500/20 to-purple-600/5",
      border: "hover:border-purple-500/40",
      accent: "text-purple-400",
    },
    {
      id: 3,
      icon: Sparkles,
      title: "Intelligent Recommendations",
      description:
        "Receive tailored learning paths, course recommendations, and strategic project additions to bridge detected skill voids.",
      points: [
        "Personalized career roadmaps",
        "Role readiness scoring",
        "Targeted skill acquisition",
      ],
      link: "/analyze-resume",
      actionText: "Get Recommendations",
      color: "from-emerald-500/20 to-emerald-600/5",
      border: "hover:border-emerald-500/40",
      accent: "text-emerald-400",
    },
  ];

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="primary" size="md">
            ✦ WHAT WE DO
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Our Core Career Services
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Engineered to give job seekers an undeniable competitive advantage.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`flex flex-col justify-between p-8 rounded-3xl bg-gradient-to-b ${service.color} bg-slate-900/60 border border-slate-800 ${service.border} transition-all duration-300 shadow-xl group hover:-translate-y-1`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-6 shadow-inner group-hover:scale-105 transition-transform">
                    <Icon className={`w-6 h-6 ${service.accent}`} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {service.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className={`w-4 h-4 ${service.accent} shrink-0 mt-0.5`} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={service.link}
                  className="inline-flex items-center justify-between px-5 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-sm font-semibold text-white transition-all group-hover:border-slate-600"
                >
                  <span>{service.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;