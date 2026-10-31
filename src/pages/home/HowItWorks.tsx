import React from "react";
import { FileUp, Cpu, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      icon: FileUp,
      title: "Input Details or Upload Resume",
      description:
        "Select a template or start from scratch with our intuitive form builder. Add your education, experience, and projects.",
      badge: "Quick Start",
    },
    {
      step: "02",
      icon: Cpu,
      title: "Run Instant Skill Gap & ATS Scan",
      description:
        "Paste your target job description. Our AI analyzes compatibility, flags missing keywords, and calculates your ATS readiness score.",
      badge: "AI Analysis",
    },
    {
      step: "03",
      icon: CheckCircle2,
      title: "Optimize, Export & Land Interviews",
      description:
        "Implement tailored suggestions, polish bullet points with high-impact phrasing, and export a clean ATS-friendly PDF.",
      badge: "Get Hired",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-950/40 border-t border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="purple" size="md">
            ✦ SIMPLE 3-STEP PROCESS
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            How RBSGA Supercharges Your Job Hunt
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            From zero to interview-ready in three straightforward steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 hover:border-slate-700 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
              >
                {/* Step Number */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl font-black text-slate-700 font-mono group-hover:text-indigo-500/60 transition-colors">
                    {item.step}
                  </span>
                  <Badge variant="default" size="sm">
                    {item.badge}
                  </Badge>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Banner */}
        <div className="mt-16 text-center">
          <Link to="/build-resume">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Optimizing Your Resume Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
