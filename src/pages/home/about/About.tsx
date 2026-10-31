import React from "react";
import { Shield, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-slate-950/40 border-t border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <Badge variant="purple" size="md">
              ✦ WHO WE ARE
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Empowering Careers Through Intelligent Technology
            </h2>

            <p className="text-base text-slate-300 leading-relaxed font-normal">
              Our mission is to bridge the gap between talented professionals and their dream
              roles. We combine ATS optimization models with industry skill mapping to give you
              a decisive edge over keyword filtering systems.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              Whether you are a university graduate stepping into tech or an experienced
              engineer targeting senior architecture roles, RBSGA delivers actionable feedback,
              structural clarity, and real-time guidance.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-indigo-400 font-semibold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Driven Insights</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We analyze job descriptions and detect the exact technical keywords recruiters
                  require.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold text-sm">
                  <Shield className="w-4 h-4" />
                  <span>ATS-Compliant Structure</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Clean hierarchy and typography engineered to pass machine screening with top scores.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Engine Visualizer Card */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400">Match-Engine v2.4</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                  <span>Keyword Relevance</span>
                  <span className="text-indigo-400 font-mono text-sm">94%</span>
                </h4>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-[94%]" />
                </div>

                <h4 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                  <span>ATS Readability Score</span>
                  <span className="text-emerald-400 font-mono text-sm">98%</span>
                </h4>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[98%]" />
                </div>

                <h4 className="text-base font-bold text-white mb-4 flex items-center justify-between">
                  <span>Skill Deficiencies</span>
                  <span className="text-amber-400 font-mono text-sm">Resolved</span>
                </h4>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[100%]" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> All checks passing
                </span>
                <span>Real-time verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
