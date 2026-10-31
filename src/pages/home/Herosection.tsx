import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CheckCircle,
  Zap,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import resumeIllustration from "../../assets/Resume-amico.svg";

export const Herosection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute -top-10 left-10 w-72 h-72 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Generation Career Intelligence</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="text-slate-400">RBSGA 2.0</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Build Smarter Resumes.{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Discover Missing Skills.
              </span>{" "}
              Get Hired Faster.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Create ATS-optimized, modern resumes in minutes and analyze skill gaps
              against your target roles with intelligent algorithmic insights.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/build-resume")}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-indigo-600/30 font-semibold"
              >
                Build My Resume
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/analyze-resume")}
                leftIcon={<Sparkles className="w-4 h-4 text-purple-400" />}
                className="w-full sm:w-auto hover:bg-slate-800/80"
              >
                Analyze ATS & Skills
              </Button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>100% ATS Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Instant AI Analysis</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Illustration & Floating Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Visual Container Card */}
            <div className="relative w-full max-w-md p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
              {/* Window Controls */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/50">
                  rbsga-preview.pdf
                </div>
              </div>

              {/* Main SVG Illustration */}
              <div className="relative overflow-hidden rounded-2xl bg-slate-950/60 p-4 border border-slate-800/60 flex items-center justify-center">
                <img
                  src={resumeIllustration}
                  alt="RBSGA Resume Builder & Skill Gap Analyzer"
                  className="w-full max-h-[340px] object-contain drop-shadow-md hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating Badge 1: ATS Compatibility */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center gap-3 animate-bounce-slow">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>98.4% ATS Score</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">Screening passed</span>
                </div>
              </div>

              {/* Floating Badge 2: Skill Gaps */}
              <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-slate-900/95 border border-indigo-500/40 rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">4 Skill Gaps Solved</div>
                  <span className="text-[10px] text-indigo-300 font-medium">+38% Interview Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Herosection;
