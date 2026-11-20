import React, { useState } from "react";
import { Send, ShieldCheck, Clock, MessageSquareCheck } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useToast } from "../../../components/ui/ToastContext";
import Api from "../../../api/Api";

export const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      toast.error("Missing Information", "Please fill out all required fields before submitting.");
      return;
    }

    setLoading(true);

    try {
      const response = await Api.post("/api/contact", {
        name: formState.name.trim(),
        email: formState.email.trim(),
        message: formState.message.trim(),
      });

      if (response.data?.success) {
        toast.success(
          "Inquiry Dispatched Successfully!",
          "Your query has been sent directly to executive management. We will reply to your email promptly."
        );
        setFormState({ name: "", email: "", message: "" });
      } else {
        toast.error("Submission Issue", response.data?.message || "Failed to submit query. Please try again.");
      }
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || err.message || "Failed to send query. Please try again.";
      toast.error("Dispatch Error", serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Inquiries & Privacy Information */}
          <div className="lg:col-span-5 space-y-6">
            <Badge variant="primary" size="md">
              ✦ DIRECT INQUIRY
            </Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              We're Here to Help You Succeed
            </h2>

            <p className="text-base text-slate-400 leading-relaxed">
              Have questions regarding our resume templates, ATS compliance, or career intelligence tools? Submit your inquiry below and our engineering and support leads will review your message immediately.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Direct & Private Dispatch</h4>
                  <p className="text-sm font-medium text-white">Queries route privately to administrator email</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rapid Response Time</h4>
                  <p className="text-sm font-medium text-white">Direct replies delivered within 24 business hours</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageSquareCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dedicated Support</h4>
                  <p className="text-sm font-medium text-white">Individual technical & career assistance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form Card */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-white mb-2">Send Us an Inquiry</h3>
              <p className="text-sm text-slate-400 mb-6">
                Fill out the form below. Your message will be sent straight to our management inbox.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Tell us what you're looking for or any questions you have..."
                    required
                    className="w-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 shadow-inner transition-all duration-200 focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={loading}
                  rightIcon={<Send className="w-4 h-4" />}
                  className="w-full justify-center"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
