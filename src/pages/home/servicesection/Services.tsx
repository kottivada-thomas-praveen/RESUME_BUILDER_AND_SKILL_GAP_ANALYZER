import React from "react";
import "./Services.css";
import {
  FileText,
  BarChart3,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    id: 1,
    icon: <FileText size={22} />,
    title: "Resume Builder",
    description:
      "Create ATS-friendly, professional resumes in minutes with smart suggestions, modern templates, and real-time feedback.",
    points: [
      "ATS optimization",
      "Smart content suggestions",
      "Multiple professional templates",
    ],
    link: "#",
    variant: "resume",
  },
  {
    id: 2,
    icon: <BarChart3 size={22} />,
    title: "Skill Gap Analyzer",
    description:
      "Analyze your skills against job requirements and identify gaps to prioritize what to learn next.",
    points: [
      "Job matching & skill comparison",
      "Gap identification & prioritization",
      "Personalized learning recommendations",
    ],
    link: "#",
    variant: "analyzer",
  },
  {
    id: 3,
    icon: <Sparkles size={22} />,
    title: "Career Recommendations",
    description:
      "Get personalized career paths, role matches, and learning suggestions to reach your goals faster.",
    points: [
      "Personalized career roadmap",
      "Role match & opportunity insights",
      "Curated learning paths",
    ],
    link: "#",
    variant: "career",
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section className="services-section" id="services">
      <div className="services-container">
        <div className="services-header">
          <span className="services-badge">✦ WHAT WE DO</span>
          <h2>Our Services</h2>
          <p>
            Build smarter resumes and close skill gaps with confidence.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.id}>
              <div className={`service-illustration ${service.variant}`}>
                {service.variant === "resume" && (
                  <div className="mockup mockup-resume">
                    <div className="resume-window">
                      <div className="resume-sidebar" />
                      <div className="resume-content">
                        <div className="resume-top">
                          <div className="avatar-circle" />
                          <div className="resume-lines">
                            <span />
                            <span />
                            <span className="short" />
                          </div>
                        </div>
                        <div className="resume-block" />
                        <div className="resume-block small" />
                        <div className="resume-block small" />
                      </div>
                    </div>
                    <div className="floating-tag tag-left">Aa</div>
                    <div className="floating-tag tag-right">✓</div>
                  </div>
                )}

                {service.variant === "analyzer" && (
                  <div className="mockup mockup-analyzer">
                    <div className="analytics-window">
                      <div className="analytics-sidebar">
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="analytics-content">
                        <div className="donut-score">
                          <div className="score-ring">
                            <strong>72%</strong>
                            <small>Good Match</small>
                          </div>
                        </div>
                        <div className="bars-group">
                          <div className="bar-item">
                            <span />
                            <div><i style={{ width: "78%" }} /></div>
                          </div>
                          <div className="bar-item">
                            <span />
                            <div><i style={{ width: "65%" }} /></div>
                          </div>
                          <div className="bar-item">
                            <span />
                            <div><i style={{ width: "52%" }} /></div>
                          </div>
                          <div className="bar-item">
                            <span />
                            <div><i style={{ width: "70%" }} /></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {service.variant === "career" && (
                  <div className="mockup mockup-career">
                    <div className="roadmap-window">
                      <div className="road-path">
                        <span className="dot one" />
                        <span className="dot two" />
                        <span className="dot three" />
                        <div className="path-line" />
                      </div>
                      <div className="career-panels">
                        <div className="career-pill active">Target Role</div>
                        <div className="career-pill">Next Milestone</div>
                        <div className="career-pill">Learning Path</div>
                      </div>
                    </div>
                    <div className="target-badge">◎</div>
                  </div>
                )}
              </div>

              <div className="service-content">
                <div className="service-title-row">
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                </div>

                <p className="service-description">{service.description}</p>

                <ul className="service-points">
                  {service.points.map((point, index) => (
                    <li key={index}>
                      <CheckCircle2 size={16} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <a href={service.link} className="service-link">
                  Learn more <ArrowRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;