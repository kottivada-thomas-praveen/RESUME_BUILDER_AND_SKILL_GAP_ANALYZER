import React, { useState } from "react";
import "./Contact.css";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      setLoading(false);
      alert("Thank you for contacting us! We will get back to you shortly.");
      setFormState({ name: "", email: "", message: "" });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-grid">
          {/* Left: Contact Info */}
          <div className="contact-info-panel">
            <span className="contact-badge">✦ CONNECT</span>
            <h2>Get In Touch</h2>
            <p className="contact-desc">
              Have questions about our AI resume builder, skill gap analyzer, or business packages? Drop us a line and our support team will respond within 24 hours.
            </p>

            <div className="contact-methods">
              <div className="contact-method-card">
                <div className="contact-icon"><Mail size={20} /></div>
                <div>
                  <h4>Email Us</h4>
                  <p>support@rbsga.com</p>
                </div>
              </div>

              <div className="contact-method-card">
                <div className="contact-icon"><Phone size={20} /></div>
                <div>
                  <h4>Call Us</h4>
                  <p>+1 (800) 555-0199</p>
                </div>
              </div>

              <div className="contact-method-card">
                <div className="contact-icon"><MapPin size={20} /></div>
                <div>
                  <h4>Our Office</h4>
                  <p>100 Innovation Way, San Francisco, CA</p>
                </div>
              </div>
            </div>

            <div className="contact-visual">
              <div className="speech-box">
                <MessageSquare size={16} />
                <span>"Prompt customer support is our priority."</span>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="contact-form-panel">
            <form onSubmit={handleSubmit} className="contact-form">
              <h3>Send Message</h3>
              
              <div className="form-group">
                <label htmlFor="contact-name">Full Name</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Your Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows={5}
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>Sending...</>
                ) : (
                  <>
                    Send Message <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
