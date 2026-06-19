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
  photoUrl?: string;
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
  ],
  photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%237c3aed"/><circle cx="50" cy="40" r="20" fill="white"/><path d="M20 85c0-15 15-25 30-25s30 10 30 25z" fill="white"/></svg>'
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
  projects: [],
  photoUrl: ""
};

import Api from "../../api/Api";

const TECH_KEYWORDS_LIST = [
  "react", "typescript", "javascript", "node.js", "node", "express", "postgresql", "postgres", "mysql", "mongodb", "nosql", "sql", "next.js", "nextjs", "vue", "angular", "python", "django", "flask", "fastapi", "java", "spring", "springboot", "c#", "dotnet", "asp.net", "php", "laravel", "ruby", "rails", "go", "golang", "rust", "aws", "azure", "gcp", "docker", "kubernetes", "git", "github", "ci/cd", "jenkins", "graphql", "rest", "api", "tailwind", "css", "html", "sass", "bootstrap", "redux", "redis", "elasticsearch", "firebase", "linux", "jest", "cypress", "mocha", "agile", "scrum", "microservices", "serverless", "security", "ai"
];

const BuildResume: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("ats");
  const [selectedColor, setSelectedColor] = useState<string>("purple");
  const [atsScore, setAtsScore] = useState<number>(0);
  const [scoreTips, setScoreTips] = useState<string[]>([]);
  const [scoreBreakdown, setScoreBreakdown] = useState({
    keywords: 0,
    formatting: 0,
    completeness: 0,
    bullets: 0
  });
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);

  // AI Optimizer States
  const [optimizingField, setOptimizingField] = useState<{type: "experience" | "project", index: number} | null>(null);
  const [optimizeLoading, setOptimizeLoading] = useState(false);
  const [optimizeResult, setOptimizeResult] = useState<{original: string, optimized: string, explanation: string} | null>(null);
  const [optimizeError, setOptimizeError] = useState("");
  const [targetJobDesc, setTargetJobDesc] = useState("");

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
    const tips: string[] = [];
    
    // 1. KEYWORD RELEVANCE (Max 25%)
    let keywordsScore = 0;
    const allText = `
      ${resumeData.skills} 
      ${resumeData.title} 
      ${resumeData.summary} 
      ${resumeData.experiences.map(e => e.role + " " + e.description).join(" ")} 
      ${resumeData.projects.map(p => p.name + " " + p.technologies + " " + p.description).join(" ")}
    `.toLowerCase();

    const matched: string[] = [];
    TECH_KEYWORDS_LIST.forEach(kw => {
      const regex = new RegExp(`\\b${kw.replace(".", "\\.")}\\b`, "i");
      if (allText.match(regex)) {
        matched.push(kw);
      }
    });

    // Compute expected keywords based on title
    const titleLower = resumeData.title.toLowerCase();
    let expected: string[] = [];
    if (titleLower.includes("frontend") || titleLower.includes("web") || titleLower.includes("react")) {
      expected = ["react", "typescript", "javascript", "html", "css", "git", "api", "redux", "tailwind"];
    } else if (titleLower.includes("backend") || titleLower.includes("spring") || titleLower.includes("java") || titleLower.includes("api")) {
      expected = ["java", "springboot", "node.js", "postgresql", "sql", "git", "docker", "aws", "rest"];
    } else {
      expected = ["react", "typescript", "node.js", "sql", "postgresql", "git", "docker", "aws", "api"];
    }

    const missing = expected.filter(kw => !matched.includes(kw));

    if (matched.length >= 8) {
      keywordsScore = 25;
    } else if (matched.length >= 5) {
      keywordsScore = 18;
      tips.push("Keyword relevance is moderate. Consider adding more tech stack words related to your role.");
    } else if (matched.length > 0) {
      keywordsScore = 10;
      tips.push(`Keyword Relevance is low. Try adding missing tags: ${missing.slice(0, 3).map(k => k.toUpperCase()).join(", ")}`);
    } else {
      keywordsScore = 0;
      tips.push("No relevant technical keywords found in skills or experience list.");
    }
    setMatchedKeywords(matched);
    setMissingKeywords(missing);

    // 2. FORMATTING CHECKS (Max 25%)
    let formattingScore = 0;
    
    // Check template (ATS template gets max points)
    if (selectedTemplate === "ats") {
      formattingScore += 10;
    } else if (selectedTemplate === "classic") {
      formattingScore += 7;
      tips.push("Elegant Classic template has moderate ATS readability. Select Tech ATS-Optimized template for best results.");
    } else {
      formattingScore += 5;
      tips.push("Sidebar layout in Modern template is hard for some legacy ATS systems to parse sequentially. Use Tech ATS-Optimized layout.");
    }

    // Check photo (ATS standards advise against photos)
    if (!resumeData.photoUrl) {
      formattingScore += 5;
    } else {
      formattingScore += 3;
      tips.push("Some automated recruiters penalize or strip resumes with profile pictures. Consider using a photo-less design.");
    }

    // Check contact information completeness
    if (resumeData.email.trim() && resumeData.phone.trim() && resumeData.location.trim()) {
      formattingScore += 5;
    } else {
      formattingScore += 2;
      tips.push("Fill out complete contact details (email, phone, location) for parsing landmarks.");
    }

    // Description text lengths (neither empty nor too short)
    const hasExp = resumeData.experiences.length > 0;
    const hasShortExp = resumeData.experiences.some(e => e.description.trim().length > 0 && e.description.trim().length < 40);
    if (hasExp && !hasShortExp) {
      formattingScore += 5;
    } else {
      formattingScore += 2;
      if (hasShortExp) {
        tips.push("Work experience descriptions are very brief. Elaborate to make them context-rich.");
      }
    }

    // 3. SECTION COMPLETENESS (Max 25%)
    let completenessScore = 0;
    if (resumeData.fullName.trim() && resumeData.title.trim()) completenessScore += 5;
    else tips.push("Provide your full name and job title in Personal Info.");

    if (resumeData.summary.trim() && resumeData.summary.length > 40) completenessScore += 5;
    else tips.push("Ensure your Professional Summary is present and at least 40 characters.");

    if (resumeData.skills.trim()) completenessScore += 5;
    else tips.push("Ensure your Technical Skills section is filled.");

    if (resumeData.experiences.length > 0) completenessScore += 5;
    else tips.push("Add at least one work experience item.");

    if (resumeData.projects.length > 0) completenessScore += 5;
    else tips.push("Include a project to showcase practical application.");

    // 4. ACTION BULLET METRICS (Max 25%)
    let bulletsScore = 0;

    // Scan descriptions for action verbs
    const actionVerbs = [
      "led", "designed", "built", "developed", "implemented", "managed", "architected", "created", 
      "optimized", "improved", "delivered", "refactored", "collaborated", "integrated", "accelerated", 
      "automated", "formulated", "enhanced", "orchestrated", "engineered", "scaled"
    ];
    const experiencesText = resumeData.experiences.map(e => e.description).join(" ").toLowerCase();
    const projectsText = resumeData.projects.map(p => p.description).join(" ").toLowerCase();
    const bulletText = (experiencesText + " " + projectsText).trim();

    let verbCount = 0;
    actionVerbs.forEach(v => {
      const regex = new RegExp(`\\b${v}\\b`, "i");
      if (bulletText.match(regex)) {
        verbCount++;
      }
    });

    if (verbCount >= 3) {
      bulletsScore += 12;
    } else if (verbCount > 0) {
      bulletsScore += 6;
      tips.push("Add more strong action verbs (e.g. Architected, Optimized, Automated) to start your bullets.");
    } else {
      tips.push("Avoid passive language. Begin your achievements with impactful action verbs.");
    }

    // Scan for numbers/metrics/percentages (STAR methodology)
    const metricsPattern = /\b\d+%\b|\b\d+\s+years\b|\b\$\d+\b|\b\d+\s*x\b|\bincreased\b|\breduced\b|\b\d+\s*ms\b|\b\d+\s*k\s*users\b|\b\d+\s*active\b/i;
    const hasMetrics = bulletText.match(metricsPattern) || /\b\d+(?:\.\d+)?\b/.test(bulletText); // detects simple stats
    
    if (hasMetrics) {
      bulletsScore += 13;
    } else {
      tips.push("Quantify your achievements! Add concrete stats, metrics, percentages, or dollar amounts to show impact.");
    }

    // Sum scores
    const overall = keywordsScore + formattingScore + completenessScore + bulletsScore;
    setAtsScore(overall);
    setScoreTips(tips);
    setScoreBreakdown({
      keywords: keywordsScore,
      formatting: formattingScore,
      completeness: completenessScore,
      bullets: bulletsScore
    });
  }, [resumeData, selectedTemplate]);

  // AI Optimization Helpers
  const handleOpenOptimizer = (type: "experience" | "project", index: number) => {
    setOptimizingField({ type, index });
    setOptimizeResult(null);
    setOptimizeError("");
    setOptimizeLoading(false);
  };

  const handleRunOptimization = async () => {
    if (!optimizingField) return;
    const text = optimizingField.type === "experience" 
      ? resumeData.experiences[optimizingField.index].description 
      : resumeData.projects[optimizingField.index].description;

    if (!text.trim()) {
      setOptimizeError("Please enter some description text first to optimize.");
      return;
    }

    setOptimizeLoading(true);
    setOptimizeError("");
    setOptimizeResult(null);

    const token = localStorage.getItem("token");
    if (!token) {
      // Guest mode - provide fallback preview mock
      setTimeout(() => {
        setOptimizeLoading(false);
        setOptimizeResult({
          original: text,
          optimized: `Architected and delivered highly performant code modules, improving core rendering latency metrics by 25% and elevating platform scalability in production.`,
          explanation: "Replaced general description with active verbs ('Architected', 'delivered') and added quantified key results (25% latency reduction)."
        });
      }, 1000);
      return;
    }

    try {
      const response = await Api.post("/api/optimize/bullet", {
        bulletPoint: text,
        jobDescription: targetJobDesc
      });
      if (response.data && response.data.data) {
        setOptimizeResult(response.data.data);
      } else {
        throw new Error("No suggestion returned from AI service.");
      }
    } catch (err: any) {
      console.error(err);
      setOptimizeError(err.response?.data?.message || "Failed to optimize bullet point. Please try again.");
    } finally {
      setOptimizeLoading(false);
    }
  };

  const handleApplyOptimization = () => {
    if (!optimizingField || !optimizeResult) return;
    const { type, index } = optimizingField;
    if (type === "experience") {
      updateExperience(index, "description", optimizeResult.optimized);
    } else {
      updateProject(index, "description", optimizeResult.optimized);
    }
    setOptimizingField(null);
  };

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

  // Handle Profile Photo Upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setResumeData(prev => ({ ...prev, photoUrl: "" }));
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

          {/* ATS Score & Detailed Feedback Dashboard */}
          <div className="ai-feedback-section premium-ats-dashboard">
            <div className="ats-dashboard-header">
              <div className="header-left">
                <FileCheck size={22} className="score-icon animate-pulse" style={{ color: activeColor }} />
                <h3>ATS Match & Score</h3>
              </div>
              <span className="score-badge" style={{ backgroundColor: activeColor }}>
                {atsScore}% Score
              </span>
            </div>

            <div className="score-progress-container">
              <div className="main-progress-bar"><div className="fill" style={{ width: `${atsScore}%`, backgroundColor: activeColor }}></div></div>
            </div>

            {/* Grid for Score Categories */}
            <div className="ats-categories-grid">
              <div className="category-item">
                <div className="category-header">
                  <span>Keyword Relevance</span>
                  <strong>{scoreBreakdown.keywords}/25</strong>
                </div>
                <div className="category-bar"><div className="fill" style={{ width: `${(scoreBreakdown.keywords / 25) * 100}%`, backgroundColor: "#3b82f6" }}></div></div>
              </div>

              <div className="category-item">
                <div className="category-header">
                  <span>Formatting & Structure</span>
                  <strong>{scoreBreakdown.formatting}/25</strong>
                </div>
                <div className="category-bar"><div className="fill" style={{ width: `${(scoreBreakdown.formatting / 25) * 100}%`, backgroundColor: "#10b981" }}></div></div>
              </div>

              <div className="category-item">
                <div className="category-header">
                  <span>Section Completeness</span>
                  <strong>{scoreBreakdown.completeness}/25</strong>
                </div>
                <div className="category-bar"><div className="fill" style={{ width: `${(scoreBreakdown.completeness / 25) * 100}%`, backgroundColor: "#8b5cf6" }}></div></div>
              </div>

              <div className="category-item">
                <div className="category-header">
                  <span>Action Bullet Metrics</span>
                  <strong>{scoreBreakdown.bullets}/25</strong>
                </div>
                <div className="category-bar"><div className="fill" style={{ width: `${(scoreBreakdown.bullets / 25) * 100}%`, backgroundColor: "#ec4899" }}></div></div>
              </div>
            </div>

            {/* Keyword tag matches helper */}
            <div className="ats-keyword-helper">
              <div className="helper-title">🎯 Technical Keywords Overlap</div>
              <div className="matched-tags-list">
                {matchedKeywords.length > 0 ? (
                  matchedKeywords.slice(0, 10).map((kw, i) => (
                    <span key={i} className="mini-tag match">{kw.toUpperCase()}</span>
                  ))
                ) : (
                  <span className="no-tags">No matching keywords. Add tech stack details.</span>
                )}
                {matchedKeywords.length > 10 && (
                  <span className="more-tags">+{matchedKeywords.length - 10} more</span>
                )}
              </div>
              
              {missingKeywords.length > 0 && (
                <div className="missing-section">
                  <span className="missing-label">💡 Recommended to Add: </span>
                  <div className="missing-tags-list">
                    {missingKeywords.slice(0, 4).map((kw, i) => (
                      <span key={i} className="mini-tag recommend">{kw.toUpperCase()}</span>
                    ))}
                  </div>
                </div>
              )}
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
                <Sparkles size={16} /> Perfect! Your resume draft is strong, aligned, and ATS-ready.
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
                    <label>Profile Photo</label>
                    <div className="photo-upload-container">
                      {resumeData.photoUrl ? (
                        <div className="photo-preview-wrapper">
                          <img src={resumeData.photoUrl} alt="Profile Preview" className="photo-preview-thumbnail" />
                          <button type="button" className="remove-photo-btn" onClick={handleRemovePhoto}>Remove Photo</button>
                        </div>
                      ) : (
                        <div className="photo-upload-placeholder">
                          <input
                            type="file"
                            accept="image/*"
                            id="photo-file-input"
                            onChange={handlePhotoChange}
                            style={{ display: "none" }}
                          />
                          <label htmlFor="photo-file-input" className="photo-upload-label">
                            Upload Profile Photo
                          </label>
                        </div>
                      )}
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
                        <div className="label-row-optimize" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <label style={{ margin: 0 }}>Description / Core Achievements</label>
                          <button 
                            type="button" 
                            className="optimize-btn-trigger" 
                            style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(124, 58, 237, 0.1)", color: "#c084fc", border: "1px solid rgba(124, 58, 237, 0.2)", borderRadius: "4px", padding: "2px 8px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}
                            onClick={() => handleOpenOptimizer("experience", index)}
                          >
                            <Sparkles size={12} /> Optimize with AI
                          </button>
                        </div>
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
                        <div className="label-row-optimize" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <label style={{ margin: 0 }}>Description</label>
                          <button 
                            type="button" 
                            className="optimize-btn-trigger" 
                            style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(124, 58, 237, 0.1)", color: "#c084fc", border: "1px solid rgba(124, 58, 237, 0.2)", borderRadius: "4px", padding: "2px 8px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}
                            onClick={() => handleOpenOptimizer("project", index)}
                          >
                            <Sparkles size={12} /> Optimize with AI
                          </button>
                        </div>
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
                    {resumeData.photoUrl && (
                      <div className="sidebar-photo-container">
                        <img src={resumeData.photoUrl} alt={resumeData.fullName} className="sidebar-photo" />
                      </div>
                    )}
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
                    {resumeData.photoUrl ? (
                      <div className="classic-header-content">
                        <div className="classic-photo-container">
                          <img src={resumeData.photoUrl} alt={resumeData.fullName} className="classic-photo" />
                        </div>
                        <div className="classic-header-text">
                          <h1 className="name" style={{ color: activeColor }}>{resumeData.fullName || "Your Full Name"}</h1>
                          <div className="job-title">{resumeData.title || "Job Title / Specialization"}</div>
                          
                          <div className="contact-row" style={{ justifyContent: "flex-start" }}>
                            {resumeData.email && <span>{resumeData.email}</span>}
                            {resumeData.phone && <span> • {resumeData.phone}</span>}
                            {resumeData.location && <span> • {resumeData.location}</span>}
                            {resumeData.website && <span> • {resumeData.website}</span>}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1 className="name" style={{ color: activeColor }}>{resumeData.fullName || "Your Full Name"}</h1>
                        <div className="job-title">{resumeData.title || "Job Title / Specialization"}</div>
                        
                        <div className="contact-row">
                          {resumeData.email && <span>{resumeData.email}</span>}
                          {resumeData.phone && <span> • {resumeData.phone}</span>}
                          {resumeData.location && <span> • {resumeData.location}</span>}
                          {resumeData.website && <span> • {resumeData.website}</span>}
                        </div>
                      </>
                    )}
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
                    {resumeData.photoUrl ? (
                      <div className="ats-header-flex">
                        <div className="ats-header-text">
                          <h1 className="name">{resumeData.fullName || "Your Full Name"}</h1>
                          <div className="job-title" style={{ color: activeColor }}>{resumeData.title || "Job Title / Specialization"}</div>
                          <div className="contact-details">
                            {resumeData.email && <span>{resumeData.email} | </span>}
                            {resumeData.phone && <span>{resumeData.phone} | </span>}
                            {resumeData.location && <span>{resumeData.location} | </span>}
                            {resumeData.website && <span>{resumeData.website}</span>}
                          </div>
                        </div>
                        <div className="ats-photo-container">
                          <img src={resumeData.photoUrl} alt={resumeData.fullName} className="ats-photo" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1 className="name">{resumeData.fullName || "Your Full Name"}</h1>
                        <div className="job-title" style={{ color: activeColor }}>{resumeData.title || "Job Title / Specialization"}</div>
                        <div className="contact-details">
                          {resumeData.email && <span>{resumeData.email} | </span>}
                          {resumeData.phone && <span>{resumeData.phone} | </span>}
                          {resumeData.location && <span>{resumeData.location} | </span>}
                          {resumeData.website && <span>{resumeData.website}</span>}
                        </div>
                      </>
                    )}
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

      {/* AI Bullet Optimizer Modal */}
      {optimizingField && (
        <div className="ai-modal-overlay">
          <div className="ai-modal-container">
            <div className="ai-modal-header">
              <div className="header-title">
                <Sparkles size={18} className="sparkle-icon" />
                <span>AI Achievement Optimizer (STAR Format)</span>
              </div>
              <button 
                type="button" 
                className="close-modal-btn" 
                onClick={() => setOptimizingField(null)}
              >
                &times;
              </button>
            </div>

            <div className="ai-modal-body">
              <div className="input-group">
                <label>Current Bullet Point / Achievement Description</label>
                <textarea
                  value={
                    optimizingField.type === "experience"
                      ? resumeData.experiences[optimizingField.index].description
                      : resumeData.projects[optimizingField.index].description
                  }
                  onChange={(e) => {
                    if (optimizingField.type === "experience") {
                      updateExperience(optimizingField.index, "description", e.target.value);
                    } else {
                      updateProject(optimizingField.index, "description", e.target.value);
                    }
                  }}
                  placeholder="Write what you did..."
                  rows={4}
                />
              </div>

              <div className="input-group">
                <label>Target Job Description (Optional - Helps tailor keywords)</label>
                <textarea
                  value={targetJobDesc}
                  onChange={(e) => setTargetJobDesc(e.target.value)}
                  placeholder="Paste the target job description to align keywords and required tech stack..."
                  rows={3}
                />
              </div>

              {!optimizeLoading && !optimizeResult && (
                <button 
                  type="button" 
                  className="optimize-action-btn"
                  onClick={handleRunOptimization}
                >
                  <Sparkles size={14} /> Optimize Achievement
                </button>
              )}

              {optimizeLoading && (
                <div className="optimize-loading">
                  <div className="spinner"></div>
                  <p>Analyzing metrics, action verbs, and formatting. Rewriting into STAR format...</p>
                </div>
              )}

              {optimizeError && (
                <div className="optimize-error">
                  <p>{optimizeError}</p>
                  <button type="button" className="optimize-action-btn" onClick={handleRunOptimization}>Retry Optimization</button>
                </div>
              )}

              {optimizeResult && (
                <div className="optimize-result-container">
                  <div className="result-card optimized">
                    <div className="card-header-label">✨ AI Optimized STAR Version</div>
                    <p className="result-text">{optimizeResult.optimized}</p>
                  </div>

                  <div className="result-card explanation">
                    <div className="card-header-label">💡 Recruiter Impact & Context</div>
                    <p className="result-text">{optimizeResult.explanation}</p>
                  </div>

                  {!localStorage.getItem("token") && (
                    <div className="guest-modal-banner">
                      ⚠️ Running in Preview Mode. Login or Sign up to access unlimited personalized AI enhancements.
                    </div>
                  )}

                  <div className="result-actions">
                    <button 
                      type="button" 
                      className="apply-opt-btn"
                      onClick={handleApplyOptimization}
                    >
                      Apply Optimization
                    </button>
                    <button 
                      type="button" 
                      className="discard-opt-btn"
                      onClick={() => setOptimizeResult(null)}
                    >
                      Modify & Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildResume;
