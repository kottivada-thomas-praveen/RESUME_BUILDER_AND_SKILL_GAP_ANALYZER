import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "../../components/ui/Badge";

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is an ATS and why do I need an ATS-optimized resume?",
      a: "An Applicant Tracking System (ATS) is software utilized by over 95% of Fortune 500 companies to automatically filter and rank candidates before a human recruiter ever sees their resume. If your resume lacks targeted keywords or uses non-standard formatting, it can be automatically rejected. RBSGA formats your resume cleanly and aligns keyword density so you pass automated screens.",
    },
    {
      q: "How does the Skill Gap Analyzer work?",
      a: "Our system evaluates your skills and experience against the requirements of your target job description. It detects missing technical proficiencies, soft skills, tools, and certifications, providing an actionable gap report and personalized recommendations to close those deficiencies.",
    },
    {
      q: "Can I download my resume as a PDF?",
      a: "Yes! Once you have personalized and previewed your resume, you can export it instantly as a high-resolution, print-ready PDF that maintains immaculate typography, layout margins, and ATS machine-readability.",
    },
    {
      q: "Is my personal data and resume information private?",
      a: "Absolutely. We treat your personal credentials, contact information, and career history with strict enterprise security. Your resumes and profile data belong exclusively to you and are never shared or sold to third parties.",
    },
    {
      q: "Is RBSGA free to use?",
      a: "Yes! You can register an account, build resumes, run ATS analyses, and inspect skill gaps completely free of charge. We believe career empowerment should be accessible to all professionals and graduates.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge variant="info" size="md">
            ✦ COMMON QUESTIONS
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Got questions about RBSGA? We have answers.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                >
                  <span className="font-semibold text-base sm:text-lg text-slate-100">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-indigo-400" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
