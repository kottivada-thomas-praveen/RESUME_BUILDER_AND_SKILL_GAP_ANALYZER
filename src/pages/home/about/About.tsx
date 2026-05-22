import React from "react";
import "./About.css";
import { Award, Shield, Target, Users } from "lucide-react";

const stats = [
  { id: 1, value: "10,000+", label: "Resumes Created", icon: <Award size={24} /> },
  { id: 2, value: "98%", label: "ATS Pass Rate", icon: <Shield size={24} /> },
  { id: 3, value: "15,000+", label: "Skills Analyzed", icon: <Target size={24} /> },
  { id: 4, value: "5,000+", label: "Happy Users", icon: <Users size={24} /> }
];

const AboutSection: React.FC = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-grid">
          {/* Left: Content */}
          <div className="about-content">
            <span className="about-badge">✦ WHO WE ARE</span>
            <h2>Empowering Careers through Intelligent Technology</h2>
            <p className="about-lead">
              Our mission is to bridge the gap between talented professionals and their dream careers. We utilize intelligent keyword scoring and resume formatting to put you ahead of the competition.
            </p>
            <p className="about-body">
              Whether you are an entry-level graduate looking to break into the tech industry or a seasoned engineer aiming for senior roles, our automated systems check for missing skills, grade your resume's readability, and help you customize templates that get noticed.
            </p>

            <div className="about-values">
              <div className="value-card">
                <h4>AI-Driven Insights</h4>
                <p>We analyze job descriptions and detect the precise keywords recruiters are searching for.</p>
              </div>
              <div className="value-card">
                <h4>ATS-Friendly Design</h4>
                <p>Templates engineered specifically to bypass screening filters and read clearly on screens.</p>
              </div>
            </div>
          </div>

          {/* Right: Stats and Visuals */}
          <div className="about-stats-container">
            <div className="stats-grid">
              {stats.map((stat) => (
                <div className="stat-card" key={stat.id}>
                  <div className="stat-icon-wrapper">
                    {stat.icon}
                  </div>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="about-visual-card">
              <div className="visual-top">
                <span className="visual-dot red"></span>
                <span className="visual-dot yellow"></span>
                <span className="visual-dot green"></span>
              </div>
              <div className="visual-body">
                <h4>AI Match Engine</h4>
                <div className="visual-bar-item">
                  <div className="bar-labels">
                    <span>Keyword Relevance</span>
                    <span>94%</span>
                  </div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: "94%" }}></div></div>
                </div>
                <div className="visual-bar-item">
                  <div className="bar-labels">
                    <span>Missing Skills Gap</span>
                    <span>6% (Resolved)</span>
                  </div>
                  <div className="bar-track"><div className="bar-fill resolve" style={{ width: "6%" }}></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
