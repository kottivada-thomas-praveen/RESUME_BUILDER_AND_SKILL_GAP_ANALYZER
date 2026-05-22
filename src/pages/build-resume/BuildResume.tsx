import React, { useState, useEffect } from "react";
import "./BuildResume.css";
import {
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Wrench,
  Sparkles,
  Download,
  RefreshCw,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileCheck
} from "lucide-react";

interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  field: string;
  gradDate: string;
  location: string;
}

interface Project {
  name: string;
  technologies: string;
  link: string;
  description: string;
}

interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  skills: string; // comma-separated
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
}

const SAMPLE_DATA: ResumeData = {
  fullName: "Alex Mercer",
  title: "Full Stack Engineer",
  email: "alex.mercer@email.com",
  phone: "+1 (555) 019-2834",
  location: "San Francisco, CA",
  website: "github.com/alexmercer",
  summary: "Innovative Full Stack Engineer with 4+ years of experience designing, building, and deploying robust web applications. Passionate about AI integrations, developer experience, and creating clean, scalable code architectures.",
  skills: "React, TypeScript, Node.js, Express, PostgreSQL, Next.js, Docker, REST APIs, Git, Tailwind CSS",
  experiences: [
    {
      company: "ByteCraft Solutions",
      role: "Senior Software Developer",
      startDate: "2024-03",
      endDate: "Present",
      location: "San Francisco, CA",
      description: "Led development of a cloud-based SaaS dashboard, improving response times by 40%. Directed a team of 4 frontend engineers and introduced TypeScript, reducing runtime crashes by 25%."
    },
    {
      company: "AppSphere Inc.",
      role: "Full Stack Developer",
      startDate: "2022-06",
      endDate: "2024-02",
      location: "Remote",
      description: "Developed and maintained high-traffic customer portals. Integrated secure Stripe payments and designed scalable PostgreSQL database schemas, supporting 50k+ active daily users."
    }
  ],
  educations: [
    {
      school: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      gradDate: "2022-05",
      location: "Berkeley, CA"
    }
  ],
  projects: [
    {
      name: "AI Portfolio Planner",
      technologies: "React, OpenAI API, Node.js",
      link: "github.com/alexmercer/ai-planner",
      description: "A web application that generates personalized career roadmaps and matches users with online course suggestions based on skill gaps."
    },
    {
      name: "SwiftStore E-Commerce API",
      technologies: "Express, PostgreSQL, Redis",
      link: "github.com/alexmercer/swiftstore",
      description: "A high-performance backend API featuring JSON Web Token auth, caching, and payment processing with less than 80ms average response times."
    }
  ]
};

const INITIAL_DATA: ResumeData = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  summary: "",
  skills: "",
  experiences: [],
  educations: [],
  projects: []
};

const BuildResume: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("modern");
  const [selectedColor, setSelectedColor] = useState<string>("purple");
  const [atsScore, setAtsScore] = useState<number>(0);
  const [scoreTips, setScoreTips] = useState<string[]>([]);

  // Accordion toggle states
  const [openSections, setOpenSections] = useState({
    personal: true,
    experience: true,
    education: true,
    projects: true,
    skills: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // State calculations for AI Resume Score
  useEffect(() => {
    let score = 0;
    const tips: string[] = [];

    if (resumeData.fullName.trim()) score += 10;
    else tips.push("Provide your full name in Personal Info.");

    if (resumeData.title.trim()) score += 10;
    else tips.push("Add a professional title/headline.");

    if (resumeData.email.trim() && resumeData.phone.trim()) score += 15;
    else tips.push("Ensure contact details (email and phone) are complete.");

    if (resumeData.website.trim()) score += 10;
    else tips.push("Add a link to your LinkedIn or GitHub portfolio.");

    if (resumeData.summary.trim()) {
      if (resumeData.summary.length > 50) score += 15;
      else {
        score += 10;
        tips.push("Make your summary longer and more descriptive (min 50 chars).");
      }
    } else {
      tips.push("Write a professional summary explaining your key qualifications.");
    }

    const skillList = resumeData.skills.split(",").map(s => s.trim()).filter(Boolean);
    if (skillList.length >= 5) score += 15;
    else if (skillList.length > 0) {
      score += 8;
      tips.push("Add at least 5 key skills for better keyword search matching.");
    } else {
      tips.push("List your technical or soft skills.");
    }

    if (resumeData.experiences.length > 0) {
      score += 15;
      const descLen = resumeData.experiences.some(exp => exp.description.length > 30);
      if (!descLen) tips.push("Elaborate on your job descriptions (include achievements).");
    } else {
      tips.push("Add at least one work experience or internship.");
    }

    if (resumeData.projects.length > 0) score += 10;
    else tips.push("Include a project to show hands-on experience.");

    setAtsScore(score);
    setScoreTips(tips);
  }, [resumeData]);

  // Fill sample data
  const handleFillSample = () => {
    setResumeData(SAMPLE_DATA);
  };

  // Reset form
  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear your resume inputs?")) {
      setResumeData(INITIAL_DATA);
    }
  };

  // Handle simple fields
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Experiences
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { company: "", role: "", startDate: "", endDate: "", location: "", description: "" }
      ]
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    setResumeData(prev => {
      const list = [...prev.experiences];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, experiences: list };
    });
  };

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  // Handle Education
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      educations: [
        ...prev.educations,
        { school: "", degree: "", field: "", gradDate: "", location: "" }
      ]
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setResumeData(prev => {
      const list = [...prev.educations];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, educations: list };
    });
  };

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index)
    }));
  };

  // Handle Projects
  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: "", technologies: "", link: "", description: "" }
      ]
    }));
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    setResumeData(prev => {
      const list = [...prev.projects];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, projects: list };
    });
  };

  const removeProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Trigger Print dialog
  const handlePrint = () => {
    window.print();
  };

  // Get color hex codes for templates
  const getColorHex = () => {
    switch (selectedColor) {
      case "blue": return "#2563eb";
      case "emerald": return "#10b981";
      case "coral": return "#f97316";
      case "purple":
      default:
        return "#7c3aed";
    }
  };

  const activeColor = getColorHex();

  return (
    <div className="resume-builder-page">
      {/* Top Controls Toolbar */}
      <div className="builder-toolbar">
        <div className="toolbar-left">
          <h1>Resume Builder</h1>
          <p>Design a high-quality, professional ATS-friendly resume</p>
        </div>

        <div className="toolbar-actions">
          <button className="tool-btn sample-btn" onClick={handleFillSample}>
            <RefreshCw size={16} /> Fill Sample Data
          </button>
          <button className="tool-btn reset-btn" onClick={handleReset}>
            <Trash2 size={16} /> Reset Form
          </button>
          <button className="tool-btn download-btn" onClick={handlePrint}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      <div className="builder-content">
        {/* Left column: Editor */}
        <div className="editor-pane">
          {/* Customization Options Bar */}
          <div className="customization-card">
            <h3>Style Customize</h3>
            <div className="custom-options">
              <div className="option-group">
                <label>Template</label>
                <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
                  <option value="modern">Modern Minimalist (Sidebar)</option>
                  <option value="classic">Elegant Classic (Centered)</option>
                  <option value="ats">Tech ATS-Optimized (Clean)</option>
                </select>
              </div>

              <div className="option-group">
                <label>Accent Color</label>
                <div className="color-selectors">
                  {["purple", "blue", "emerald", "coral"].map(c => (
                    <button
                      key={c}
                      className={`color-dot ${c} ${selectedColor === c ? "active" : ""}`}
                      onClick={() => setSelectedColor(c)}
                      title={c.toUpperCase()}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Score Analyzer Card */}
          <div className="ai-feedback-section">
            <div className="score-header">
              <div className="score-badge-container">
                <FileCheck size={20} className="score-icon" style={{ color: activeColor }} />
                <span>Resume Strength:</span>
              </div>
              <span className="score-value" style={{ color: activeColor }}>{atsScore}%</span>
            </div>
            <div className="score-bar-wrapper">
              <div className="score-bar" style={{ width: `${atsScore}%`, backgroundColor: activeColor }} />
            </div>

            {scoreTips.length > 0 ? (
              <div className="tips-list">
                <p className="tips-title">💡 Actionable suggestions to improve:</p>
                <ul>
                  {scoreTips.slice(0, 3).map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                  {scoreTips.length > 3 && (
                    <li className="more-tips">and {scoreTips.length - 3} more suggestions...</li>
                  )}
                </ul>
              </div>
            ) : (
              <div className="score-perfect">
                <Sparkles size={16} /> Perfect! Your resume draft is strong and complete.
              </div>
            )}
          </div>

          {/* Collapsible Form Sections */}
          <div className="accordion-wrapper">
            
            {/* 1. PERSONAL INFO */}
            <div className={`accordion-item ${openSections.personal ? "open" : ""}`}>
              <div className="accordion-header" onClick={() => toggleSection("personal")}>
                <span className="title"><User size={18} /> Personal Information</span>
                {openSections.personal ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              
              {openSections.personal && (
                <div className="accordion-body">
                  <div className="input-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={resumeData.fullName}
                        onChange={handleFieldChange}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="form-group">
                      <label>Professional Title</label>
                      <input
                        type="text"
                        name="title"
                        value={resumeData.title}
                        onChange={handleFieldChange}
                        placeholder="Software Engineer"
                      />
                    </div>
                  </div>

                  <div className="input-row">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={resumeData.email}
                        onChange={handleFieldChange}
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={resumeData.phone}
                        onChange={handleFieldChange}
                        placeholder="+1 (123) 456-7890"
                      />
                    </div>
                  </div>

                  <div className="input-row">
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={resumeData.location}
                        onChange={handleFieldChange}
                        placeholder="New York, NY"
                      />
                    </div>
                    <div className="form-group">
                      <label>Portfolio / Website</label>
                      <input
                        type="text"
                        name="website"
                        value={resumeData.website}
                        onChange={handleFieldChange}
                        placeholder="github.com/johndoe"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Professional Summary</label>
                    <textarea
                      name="summary"
                      value={resumeData.summary}
                      onChange={handleFieldChange}
                      placeholder="Brief overview of your career background, expertise, and goals..."
                      rows={4}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. EXPERIENCE */}
            <div className={`accordion-item ${openSections.experience ? "open" : ""}`}>
              <div className="accordion-header" onClick={() => toggleSection("experience")}>
                <span className="title"><Briefcase size={18} /> Work Experience</span>
                {openSections.experience ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {openSections.experience && (
                <div className="accordion-body">
                  {resumeData.experiences.map((exp, index) => (
                    <div key={index} className="array-item-card">
                      <div className="item-header">
                        <h4>Job #{index + 1}</h4>
                        <button className="delete-btn" onClick={() => removeExperience(index)} title="Remove Experience">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="input-row">
                        <div className="form-group">
                          <label>Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(index, "company", e.target.value)}
                            placeholder="Tech Solutions Ltd"
                          />
                        </div>
                        <div className="form-group">
                          <label>Job Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => updateExperience(index, "role", e.target.value)}
                            placeholder="Frontend Developer"
                          />
                        </div>
                      </div>

                      <div className="input-row">
                        <div className="form-group">
                          <label>Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                            placeholder="e.g. 2021-06"
                          />
                        </div>
                        <div className="form-group">
                          <label>End Date</label>
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                            placeholder="e.g. Present or 2023-08"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(index, "location", e.target.value)}
                          placeholder="San Francisco, CA or Remote"
                        />
                      </div>

                      <div className="form-group">
                        <label>Description / Core Achievements</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(index, "description", e.target.value)}
                          placeholder="Describe responsibilities and accomplishments. E.g. Improved database speed by 30%..."
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button className="add-btn" onClick={addExperience}>
                    <Plus size={16} /> Add Experience
                  </button>
                </div>
              )}
            </div>

            {/* 3. EDUCATION */}
            <div className={`accordion-item ${openSections.education ? "open" : ""}`}>
              <div className="accordion-header" onClick={() => toggleSection("education")}>
                <span className="title"><GraduationCap size={18} /> Education</span>
                {openSections.education ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {openSections.education && (
                <div className="accordion-body">
                  {resumeData.educations.map((edu, index) => (
                    <div key={index} className="array-item-card">
                      <div className="item-header">
                        <h4>Education #{index + 1}</h4>
                        <button className="delete-btn" onClick={() => removeEducation(index)} title="Remove Education">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="input-row">
                        <div className="form-group">
                          <label>School / University</label>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateEducation(index, "school", e.target.value)}
                            placeholder="Harvard University"
                          />
                        </div>
                        <div className="form-group">
                          <label>Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, "degree", e.target.value)}
                            placeholder="Bachelor of Science"
                          />
                        </div>
                      </div>

                      <div className="input-row">
                        <div className="form-group">
                          <label>Field of Study</label>
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => updateEducation(index, "field", e.target.value)}
                            placeholder="Computer Engineering"
                          />
                        </div>
                        <div className="form-group">
                          <label>Graduation Date</label>
                          <input
                            type="text"
                            value={edu.gradDate}
                            onChange={(e) => updateEducation(index, "gradDate", e.target.value)}
                            placeholder="e.g. 2022-05"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => updateEducation(index, "location", e.target.value)}
                          placeholder="Boston, MA"
                        />
                      </div>
                    </div>
                  ))}

                  <button className="add-btn" onClick={addEducation}>
                    <Plus size={16} /> Add Education
                  </button>
                </div>
              )}
            </div>

            {/* 4. PROJECTS */}
            <div className={`accordion-item ${openSections.projects ? "open" : ""}`}>
              <div className="accordion-header" onClick={() => toggleSection("projects")}>
                <span className="title"><FolderGit2 size={18} /> Projects</span>
                {openSections.projects ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {openSections.projects && (
                <div className="accordion-body">
                  {resumeData.projects.map((proj, index) => (
                    <div key={index} className="array-item-card">
                      <div className="item-header">
                        <h4>Project #{index + 1}</h4>
                        <button className="delete-btn" onClick={() => removeProject(index)} title="Remove Project">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="input-row">
                        <div className="form-group">
                          <label>Project Name</label>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => updateProject(index, "name", e.target.value)}
                            placeholder="E-commerce Engine"
                          />
                        </div>
                        <div className="form-group">
                          <label>Technologies Used</label>
                          <input
                            type="text"
                            value={proj.technologies}
                            onChange={(e) => updateProject(index, "technologies", e.target.value)}
                            placeholder="React, Redux, Node.js"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Project Link / URL</label>
                        <input
                          type="text"
                          value={proj.link}
                          onChange={(e) => updateProject(index, "link", e.target.value)}
                          placeholder="github.com/myusername/project"
                        />
                      </div>

                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={proj.description}
                          onChange={(e) => updateProject(index, "description", e.target.value)}
                          placeholder="Outline project goal and your achievements..."
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}

                  <button className="add-btn" onClick={addProject}>
                    <Plus size={16} /> Add Project
                  </button>
                </div>
              )}
            </div>

            {/* 5. SKILLS */}
            <div className={`accordion-item ${openSections.skills ? "open" : ""}`}>
              <div className="accordion-header" onClick={() => toggleSection("skills")}>
                <span className="title"><Wrench size={18} /> Skills</span>
                {openSections.skills ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {openSections.skills && (
                <div className="accordion-body">
                  <div className="form-group">
                    <label>Skills (Separate with commas)</label>
                    <textarea
                      name="skills"
                      value={resumeData.skills}
                      onChange={handleFieldChange}
                      placeholder="React, TypeScript, Java, SQL, Git, Problem Solving..."
                      rows={3}
                    />
                    <small className="help-text">Entering skills separated by commas allows templates to display them as beautiful individual tags.</small>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right column: Live Paper Preview */}
        <div className="preview-pane">
          <div className="preview-header">
            <h3>Live Preview</h3>
            <span>Auto-synced</span>
          </div>

          <div className="paper-container">
            {/* The Resume Sheet Mockup */}
            <div className={`resume-paper template-${selectedTemplate}`} id="resume-print-area">
              
              {/* RENDER TEMPLATE 1: MODERN MINIMALIST (Sidebar Layout) */}
              {selectedTemplate === "modern" && (
                <div className="modern-layout">
                  {/* Left Sidebar */}
                  <div className="modern-sidebar" style={{ borderRightColor: activeColor }}>
                    <div className="sidebar-header-box" style={{ backgroundColor: activeColor }}>
                      <h1 className="name">{resumeData.fullName || "Your Full Name"}</h1>
                      <div className="job-title">{resumeData.title || "Job Title / Specialization"}</div>
                    </div>
                    
                    <div className="sidebar-section">
                      <h4 className="sidebar-title" style={{ color: activeColor }}>CONTACT</h4>
                      <div className="sidebar-item"><Mail size={12} /> <span>{resumeData.email || "email@address.com"}</span></div>
                      <div className="sidebar-item"><Phone size={12} /> <span>{resumeData.phone || "+1 (000) 000-0000"}</span></div>
                      <div className="sidebar-item"><MapPin size={12} /> <span>{resumeData.location || "City, State"}</span></div>
                      {resumeData.website && (
                        <div className="sidebar-item"><Globe size={12} /> <span>{resumeData.website}</span></div>
                      )}
                    </div>

                    <div className="sidebar-section">
                      <h4 className="sidebar-title" style={{ color: activeColor }}>SKILLS</h4>
                      <div className="skills-vertical">
                        {resumeData.skills.split(",").map(s => s.trim()).filter(Boolean).map((s, idx) => (
                          <span key={idx} className="skill-tag" style={{ borderLeftColor: activeColor }}>{s}</span>
                        ))}
                      </div>
                    </div>

                    {resumeData.educations.length > 0 && (
                      <div className="sidebar-section">
                        <h4 className="sidebar-title" style={{ color: activeColor }}>EDUCATION</h4>
                        {resumeData.educations.map((edu, idx) => (
                          <div key={idx} className="edu-sidebar-item">
                            <strong className="edu-deg">{edu.degree} {edu.field ? `in ${edu.field}` : ""}</strong>
                            <div className="edu-sch">{edu.school}</div>
                            <div className="edu-date">{edu.gradDate} | {edu.location}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Main Body */}
                  <div className="modern-main">
                    {resumeData.summary && (
                      <div className="main-section">
                        <h3 className="section-title" style={{ color: activeColor }}>PROFILE</h3>
                        <p className="profile-text">{resumeData.summary}</p>
                      </div>
                    )}

                    {resumeData.experiences.length > 0 && (
                      <div className="main-section">
                        <h3 className="section-title" style={{ color: activeColor }}>WORK EXPERIENCE</h3>
                        {resumeData.experiences.map((exp, idx) => (
                          <div key={idx} className="exp-preview-item">
                            <div className="exp-meta">
                              <strong>{exp.role}</strong>
                              <span className="exp-date">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="exp-sub">
                              <span className="comp">{exp.company}</span>
                              <span className="loc">{exp.location}</span>
                            </div>
                            <p className="exp-desc">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.projects.length > 0 && (
                      <div className="main-section">
                        <h3 className="section-title" style={{ color: activeColor }}>PROJECTS</h3>
                        {resumeData.projects.map((proj, idx) => (
                          <div key={idx} className="project-preview-item">
                            <div className="proj-meta">
                              <strong>{proj.name}</strong>
                              <span className="proj-tech" style={{ color: activeColor }}>{proj.technologies}</span>
                            </div>
                            {proj.link && <div className="proj-link">{proj.link}</div>}
                            <p className="proj-desc">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* RENDER TEMPLATE 2: ELEGANT CLASSIC (Centered Layout) */}
              {selectedTemplate === "classic" && (
                <div className="classic-layout">
                  <header className="classic-header" style={{ borderBottomColor: activeColor }}>
                    <h1 className="name" style={{ color: activeColor }}>{resumeData.fullName || "Your Full Name"}</h1>
                    <div className="job-title">{resumeData.title || "Job Title / Specialization"}</div>
                    
                    <div className="contact-row">
                      {resumeData.email && <span>{resumeData.email}</span>}
                      {resumeData.phone && <span> • {resumeData.phone}</span>}
                      {resumeData.location && <span> • {resumeData.location}</span>}
                      {resumeData.website && <span> • {resumeData.website}</span>}
                    </div>
                  </header>

                  {resumeData.summary && (
                    <div className="classic-section">
                      <h3 className="classic-section-title" style={{ borderBottomColor: activeColor }}>PROFESSIONAL SUMMARY</h3>
                      <p className="summary-body">{resumeData.summary}</p>
                    </div>
                  )}

                  {resumeData.experiences.length > 0 && (
                    <div className="classic-section">
                      <h3 className="classic-section-title" style={{ borderBottomColor: activeColor }}>PROFESSIONAL EXPERIENCE</h3>
                      {resumeData.experiences.map((exp, idx) => (
                        <div key={idx} className="classic-exp-item">
                          <div className="classic-item-row">
                            <strong>{exp.company}</strong>
                            <span>{exp.location}</span>
                          </div>
                          <div className="classic-item-row sub">
                            <i>{exp.role}</i>
                            <span>{exp.startDate} – {exp.endDate}</span>
                          </div>
                          <p className="classic-desc">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.projects.length > 0 && (
                    <div className="classic-section">
                      <h3 className="classic-section-title" style={{ borderBottomColor: activeColor }}>PROJECTS</h3>
                      {resumeData.projects.map((proj, idx) => (
                        <div key={idx} className="classic-proj-item">
                          <div className="classic-item-row">
                            <strong>{proj.name}</strong>
                            <span>{proj.link}</span>
                          </div>
                          <div className="classic-techs">Technologies: <i>{proj.technologies}</i></div>
                          <p className="classic-desc">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.educations.length > 0 && (
                    <div className="classic-section">
                      <h3 className="classic-section-title" style={{ borderBottomColor: activeColor }}>EDUCATION</h3>
                      {resumeData.educations.map((edu, idx) => (
                        <div key={idx} className="classic-edu-item">
                          <div className="classic-item-row">
                            <strong>{edu.school}</strong>
                            <span>{edu.location}</span>
                          </div>
                          <div className="classic-item-row sub">
                            <span>{edu.degree} in {edu.field}</span>
                            <span>Graduation: {edu.gradDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.skills && (
                    <div className="classic-section">
                      <h3 className="classic-section-title" style={{ borderBottomColor: activeColor }}>CORE SKILLS</h3>
                      <div className="classic-skills-tags">
                        {resumeData.skills.split(",").map(s => s.trim()).filter(Boolean).map((s, idx) => (
                          <span key={idx} className="classic-skill-tag">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RENDER TEMPLATE 3: TECH ATS-OPTIMIZED (Minimal layout) */}
              {selectedTemplate === "ats" && (
                <div className="ats-layout">
                  <header className="ats-header">
                    <h1 className="name">{resumeData.fullName || "Your Full Name"}</h1>
                    <div className="job-title" style={{ color: activeColor }}>{resumeData.title || "Job Title / Specialization"}</div>
                    <div className="contact-details">
                      {resumeData.email && <span>{resumeData.email} | </span>}
                      {resumeData.phone && <span>{resumeData.phone} | </span>}
                      {resumeData.location && <span>{resumeData.location} | </span>}
                      {resumeData.website && <span>{resumeData.website}</span>}
                    </div>
                  </header>

                  {resumeData.summary && (
                    <div className="ats-section">
                      <h3 className="ats-section-title" style={{ color: activeColor }}>SUMMARY</h3>
                      <p className="ats-body">{resumeData.summary}</p>
                    </div>
                  )}

                  {resumeData.skills && (
                    <div className="ats-section">
                      <h3 className="ats-section-title" style={{ color: activeColor }}>TECHNICAL SKILLS</h3>
                      <p className="ats-skills-line">
                        <strong>Skills: </strong>
                        {resumeData.skills.split(",").map(s => s.trim()).filter(Boolean).join(", ")}
                      </p>
                    </div>
                  )}

                  {resumeData.experiences.length > 0 && (
                    <div className="ats-section">
                      <h3 className="ats-section-title" style={{ color: activeColor }}>EXPERIENCE</h3>
                      {resumeData.experiences.map((exp, idx) => (
                        <div key={idx} className="ats-exp-item">
                          <div className="ats-row">
                            <strong>{exp.company}</strong>
                            <span>{exp.location}</span>
                          </div>
                          <div className="ats-row sub">
                            <span>{exp.role}</span>
                            <span>{exp.startDate} - {exp.endDate}</span>
                          </div>
                          <p className="ats-bullet-desc">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.projects.length > 0 && (
                    <div className="ats-section">
                      <h3 className="ats-section-title" style={{ color: activeColor }}>PROJECTS</h3>
                      {resumeData.projects.map((proj, idx) => (
                        <div key={idx} className="ats-proj-item">
                          <div className="ats-row">
                            <strong>{proj.name} ({proj.technologies})</strong>
                            <span>{proj.link}</span>
                          </div>
                          <p className="ats-bullet-desc">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.educations.length > 0 && (
                    <div className="ats-section">
                      <h3 className="ats-section-title" style={{ color: activeColor }}>EDUCATION</h3>
                      {resumeData.educations.map((edu, idx) => (
                        <div key={idx} className="ats-edu-item">
                          <div className="ats-row">
                            <strong>{edu.school}</strong>
                            <span>{edu.location}</span>
                          </div>
                          <div className="ats-row sub">
                            <span>{edu.degree} in {edu.field}</span>
                            <span>Graduated: {edu.gradDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BuildResume;
