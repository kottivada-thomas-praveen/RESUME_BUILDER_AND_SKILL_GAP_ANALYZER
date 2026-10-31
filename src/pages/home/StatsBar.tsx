import React from "react";
import { Users, FileCheck2, Target, Award } from "lucide-react";

export const StatsBar: React.FC = () => {
  const stats = [
    {
      icon: FileCheck2,
      value: "50,000+",
      label: "Resumes Built",
      subtext: "Across 45+ countries",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      icon: Award,
      value: "98.4%",
      label: "ATS Pass Rate",
      subtext: "Bypasses automated filters",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: Target,
      value: "1,200+",
      label: "Skills Indexed",
      subtext: "Real-time industry roles",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      icon: Users,
      value: "3.4x",
      label: "More Interviews",
      subtext: "Reported by job seekers",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <section className="py-12 border-y border-slate-800/80 bg-slate-950/60 backdrop-blur-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-slate-700/80 transition-all hover:-translate-y-0.5"
              >
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-slate-200">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {stat.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
