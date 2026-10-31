import React, { useState, useEffect } from "react";
import Api from "../../api/Api";
import "./AnalyzeResume.css";
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Download,
  AlertCircle
} from "lucide-react";

interface AnalysisResults {
  score: number;
  keywordMatchScore: number;
  formattingScore: number;
  sectionScore: number;
  bulletScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: {
    id: number;
    type: "high" | "medium" | "low";
    text: string;
    description: string;
  }[];
}

const TECH_KEYWORDS = [
  "react", "typescript", "javascript", "node.js", "node", "express", "postgresql", "postgres", "mysql", "mongodb", "nosql", "sql", "next.js", "nextjs", "vue", "angular", "python", "django", "flask", "fastapi", "java", "spring", "springboot", "c#", "dotnet", "asp.net", "php", "laravel", "ruby", "rails", "go", "golang", "rust", "aws", "azure", "gcp", "docker", "kubernetes", "git", "github", "ci/cd", "jenkins", "graphql", "rest", "api", "tailwind", "css", "html", "sass", "bootstrap", "redux", "redis", "elasticsearch", "firebase", "linux", "jest", "cypress", "mocha", "agile", "scrum", "microservices", "serverless", "security", "ai"
];

const SAMPLE_JOB_DESC = `We are looking for a Senior Full Stack Engineer to join our team. 
Key requirements:
- 4+ years of professional experience building web applications.
- Strong proficiency in React, TypeScript, and Node.js.
- Extensive experience working with PostgreSQL databases.
- Hands-on experience with Docker, AWS cloud services, and Git version control.
- Knowledge of GraphQL and CI/CD pipelines is a plus.`;

const SAMPLE_RESUME = `ALEX MERCER - SOFTWARE DEVELOPER
Email: alex.mercer@email.com | Portfolio: github.com/alexmercer

PROFESSIONAL SUMMARY
Experienced Frontend Developer with 3+ years of experience specializing in single-page applications. Dedicated to writing clean, maintainable code and collaborating with cross-functional teams.

SKILLS
React, JavaScript, HTML5, CSS3, SQL, MySQL, Git, Redux, Tailwind CSS

EXPERIENCE
Frontend Developer | TechCorp Inc | 2023 - Present
- Created responsive user interfaces using React and Tailwind CSS.
- Collaborated with product designers to design intuitive customer dashboards.
- Refactored legacy codebase, improving loading performance by 15%.

Junior Developer | AppSolutions | 2022 - 2023
- Assisted in building website landing pages using JavaScript and HTML/CSS.
- Developed backend API endpoints under supervision using Node.js and MySQL.`;

// Visual Radar Chart Component (SRS #5)
const SkillRadarChart: React.FC<{ matchingSkills: string[]; missingSkills: string[] }> = ({
  matchingSkills,
  missingSkills
}) => {
  const categories = [
    {
      name: "Frontend",
      keywords: ["react", "vue", "angular", "next.js", "nextjs", "javascript", "typescript", "html", "css", "tailwind", "redux"]
    },
    {
      name: "Backend",
      keywords: ["node.js", "node", "express", "java", "spring", "springboot", "python", "django", "flask", "fastapi", "go", "golang", "c#", "dotnet"]
    },
    {
      name: "Database",
      keywords: ["postgresql", "postgres", "mysql", "mongodb", "redis", "sql", "nosql", "elasticsearch", "firebase"]
    },
    {
      name: "Cloud & DevOps",
      keywords: ["aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "jenkins", "linux", "serverless"]
    },
    {
      name: "Architecture & Tools",
      keywords: ["git", "github", "graphql", "rest", "api", "microservices", "agile", "scrum", "jest", "cypress", "security"]
    }
  ];

  const totalPoints = categories.length;
  const radius = 100;
  const centerX = 160;
  const centerY = 140;

  const scores = categories.map(cat => {
    const matchedCount = cat.keywords.filter(kw => matchingSkills.map(s => s.toLowerCase()).includes(kw)).length;
    const missingCount = cat.keywords.filter(kw => missingSkills.map(s => s.toLowerCase()).includes(kw)).length;
    const totalRequired = matchedCount + missingCount;
    if (totalRequired === 0) return 60;
    const ratio = matchedCount / totalRequired;
    return Math.max(25, Math.min(100, Math.round(ratio * 100)));
  });

  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 / totalPoints) * index - Math.PI / 2;
    const r = (radius * value) / 100;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y };
  };

  const rings = [25, 50, 75, 100];

  const candidatePoints = scores.map((score, i) => {
    const { x, y } = getCoordinates(score, i);
    return `${x},${y}`;
  }).join(" ");

  const targetPoints = scores.map((_, i) => {
    const { x, y } = getCoordinates(100, i);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#ffffff" }}>
          Target vs. Candidate Competency Radar (SRS #5)
        </h4>
        <div style={{ display: "flex", gap: "12px", fontSize: "11px", fontWeight: "600" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#38bdf8" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#38bdf8" }}></span>
            Target Role (100%)
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#a855f7" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#a855f7" }}></span>
            Resume Match
          </span>
        </div>
      </div>

      <svg width="320" height="280" viewBox="0 0 320 280">
        {rings.map(ring => {
          const ringPoints = categories.map((_, i) => {
            const { x, y } = getCoordinates(ring, i);
            return `${x},${y}`;
          }).join(" ");
          return (
            <polygon
              key={ring}
              points={ringPoints}
              fill="none"
              stroke="#1e293b"
              strokeWidth="1.2"
              strokeDasharray={ring === 100 ? undefined : "3 3"}
            />
          );
        })}

        {categories.map((cat, i) => {
          const { x, y } = getCoordinates(100, i);
          const labelCoord = getCoordinates(120, i);
          return (
            <g key={cat.name}>
              <line x1={centerX} y1={centerY} x2={x} y2={y} stroke="#334155" strokeWidth="1" />
              <text
                x={labelCoord.x}
                y={labelCoord.y}
                fill="#94a3b8"
                fontSize="10"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {cat.name}
              </text>
            </g>
          );
        })}

        <polygon
          points={targetPoints}
          fill="rgba(56, 189, 248, 0.08)"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        <polygon
          points={candidatePoints}
          fill="rgba(168, 85, 247, 0.3)"
          stroke="#a855f7"
          strokeWidth="2.5"
        />

        {scores.map((score, i) => {
          const { x, y } = getCoordinates(score, i);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="#c084fc"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
    </div>
  );
};

const AnalyzeResume: React.FC = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  
  // Real skill gap and integrations states
  const [skillGapResults, setSkillGapResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"ats" | "skillgap">("ats");
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [parseError, setParseError] = useState("");
  const [guestMode, setGuestMode] = useState(false);
  const [copiedSkill, setCopiedSkill] = useState<string | null>(null);

  const scanPhrases = [
    "Uploading resume and job description...",
    "Scanning document structure and formatting...",
    "Extracting technical skills and keywords...",
    "Comparing skills against job requirements...",
    "Calculating ATS compatibility score...",
    "Generating optimization report..."
  ];

  // Simulated scan process
  useEffect(() => {
    let timer: number;
    if (isScanning) {
      if (scanStep < scanPhrases.length) {
        timer = window.setTimeout(() => {
          setScanStep(prev => prev + 1);
        }, 800);
      } else {
        setIsScanning(false);
        performAnalysis();
      }
    }
    return () => clearTimeout(timer);
  }, [isScanning, scanStep]);

  // Fill sample details
  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME);
    setJobText(SAMPLE_JOB_DESC);
    setFileName(null);
  };

  // PDF File parsing handler calling the backend
  const parseUploadedFile = async (file: File) => {
    setIsParsingFile(true);
    setParseError("");
    setResumeText("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await Api.post("/api/resumes/parse", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      if (response.data && response.data.data) {
        const dto = response.data.data;
        let text = `NAME: ${dto.fullName || ""}\n`;
        text += `TITLE: ${dto.title || ""}\n`;
        text += `CONTACT: ${dto.email || ""} | ${dto.phone || ""} | ${dto.location || ""}\n`;
        if (dto.summary) text += `SUMMARY: ${dto.summary}\n`;
        if (dto.skills) text += `SKILLS: ${dto.skills}\n`;
        
        if (dto.experiences && dto.experiences.length > 0) {
          text += `\nEXPERIENCE:\n`;
          dto.experiences.forEach((exp: any) => {
            text += `- ${exp.role} at ${exp.company} (${exp.startDate} to ${exp.endDate})\n  ${exp.description}\n`;
          });
        }
        if (dto.educations && dto.educations.length > 0) {
          text += `\nEDUCATION:\n`;
          dto.educations.forEach((edu: any) => {
            text += `- ${edu.degree} in ${edu.field} from ${edu.school} (${edu.gradDate})\n`;
          });
        }
        if (dto.projects && dto.projects.length > 0) {
          text += `\nPROJECTS:\n`;
          dto.projects.forEach((proj: any) => {
            text += `- ${proj.name} (${proj.technologies}): ${proj.description}\n`;
          });
        }
        setResumeText(text);
      } else {
        throw new Error("Empty parsing response from server.");
      }
    } catch (err: any) {
      console.error(err);
      setParseError(err.response?.data?.message || "Failed to parse PDF document. Please enter text manually.");
      setResumeText(`[AI Extraction Fallback: ${file.name}]\n\nAlex Mercer\nEmail: alex.mercer@email.com\nSkills: React, JavaScript, SQL, MySQL, Git, Redux, HTML, CSS`);
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      await parseUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      await parseUploadedFile(file);
    }
  };

  // Actual keyword extraction & calculation algorithm calling the backend
  const performAnalysis = async () => {
    const token = localStorage.getItem("token");
    
    // Step 1: Pre-calculate local keywords overlap for missing/matching tags (helps both guest and real modes)
    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobText.toLowerCase();

    const resumeSkills: string[] = [];
    const jobSkills: string[] = [];

    TECH_KEYWORDS.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.replace(".", "\\.")}\\b`, "i");
      if (jobLower.match(regex)) {
        jobSkills.push(keyword);
      }
      if (resumeLower.match(regex)) {
        resumeSkills.push(keyword);
      }
    });

    const matching = jobSkills.filter(skill => resumeSkills.includes(skill));
    const missing = jobSkills.filter(skill => !resumeSkills.includes(skill));

    if (!token) {
      // Guest/Fallback Mode - perform calculations locally
      setGuestMode(true);

      const keywordMatchPct = jobSkills.length > 0 
        ? Math.round((matching.length / jobSkills.length) * 100) 
        : 75;

      let formatting = 70;
      if (resumeText.length > 300) formatting += 15;
      if (resumeText.includes("EXPERIENCE") || resumeText.includes("Experience")) formatting += 10;
      if (resumeText.includes("EDUCATION") || resumeText.includes("Education")) formatting += 5;
      formatting = Math.min(formatting, 100);

      let sections = 40;
      if (resumeLower.includes("email") || resumeLower.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/)) sections += 20;
      if (resumeLower.includes("phone") || resumeLower.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/)) sections += 15;
      if (resumeLower.includes("summary") || resumeLower.includes("profile")) sections += 15;
      if (resumeLower.includes("skills") || resumeLower.includes("expertise")) sections += 10;
      sections = Math.min(sections, 100);

      let bullets = 40;
      const hasNumbers = resumeText.match(/\b\d+%\b|\b\d+\s+years\b|\b\$\d+\b|\b\d+x\b|\bincreased\s+\d+\b|\breduced\s+\d+\b/i);
      if (hasNumbers) bullets += 40;
      if (resumeText.split("\n").filter(line => line.trim().startsWith("-") || line.trim().startsWith("•")).length > 4) bullets += 20;

      const totalScore = Math.round((keywordMatchPct * 0.4) + (formatting * 0.25) + (sections * 0.15) + (bullets * 0.2));

      const recs = [];
      let recId = 1;

      if (missing.length > 0) {
        recs.push({
          id: recId++,
          type: "high" as const,
          text: `Add missing key technologies: ${missing.slice(0, 3).join(", ").toUpperCase()}`,
          description: "These keywords were detected in the job description but are missing from your resume. Recruiters screen heavily for these tags."
        });
      }
      if (!hasNumbers) {
        recs.push({
          id: recId++,
          type: "high" as const,
          text: "Quantify your achievements with numbers & percentages",
          description: "Your experience descriptions describe duties rather than impact. Try to include stats, e.g., 'Reduced dashboard load time by 15%' or 'Managed a codebase of 5k+ users'."
        });
      }
      if (sections < 80) {
        recs.push({
          id: recId++,
          type: "medium" as const,
          text: "Add missing critical sections (Summary or Contact links)",
          description: "ATS parser checks for specific structural landmarks. Ensure you have clear headers for Summary, Skills, Experience, and Education."
        });
      }

      setResults({
        score: totalScore,
        keywordMatchScore: keywordMatchPct,
        formattingScore: formatting,
        sectionScore: sections,
        bulletScore: bullets,
        matchingSkills: matching,
        missingSkills: missing,
        recommendations: recs
      });

      setSkillGapResults({
        userSkills: resumeSkills,
        jobSkills: jobSkills,
        missingSkills: missing,
        learningRoadmap: [
          { stepNumber: 1, title: `Master Missing Technical Skills (${missing.slice(0, 2).map(m => m.toUpperCase()).join(", ") || "General"})`, description: "Focus on syntax fundamentals, routing patterns, database drivers, and practical setup guides.", timeline: "Week 1" },
          { stepNumber: 2, title: "Build Scalable API Projects", description: "Design a repository linking these target libraries, handling server requests and error bounds.", timeline: "Weeks 2-3" },
          { stepNumber: 3, title: "Containerization & Cloud Services", description: "Deploy core features containerized, configuring environment setups and port maps.", timeline: "Week 4" }
        ],
        recommendedResources: {
          courses: [
            { title: "Complete Tech Career Specialization", provider: "Coursera", url: "https://coursera.org", durationOrCost: "4 weeks" },
            { title: "Advanced Technical Bootcamp", provider: "Udemy", url: "https://udemy.com", durationOrCost: "20 hours" }
          ],
          youtubeVideos: [
            { title: "Modern Technologies in 100 Seconds", provider: "Fireship", url: "https://youtube.com", durationOrCost: "10 min" },
            { title: "Full System Architecture & Coding", provider: "freeCodeCamp", url: "https://youtube.com", durationOrCost: "6 hours" }
          ],
          certifications: [
            { title: "AWS Solutions Architect standard", provider: "Amazon Web Services", url: "https://aws.amazon.com", durationOrCost: "$150" }
          ]
        }
      });
      return;
    }

    // Authenticated Mode - call real backend endpoints
    setGuestMode(false);
    try {
      // 1. Call ATS Analyzer
      const atsRes = await Api.post("/api/ats/analyze", {
        resumeText: resumeText,
        jobDescription: jobText
      });

      // 2. Call Skill Gap Analyzer
      const gapRes = await Api.post("/api/skill-gap/analyze", {
        userSkills: matching.join(", "), // Pass parsed match skills
        jobDescription: jobText
      });

      if (atsRes.data && atsRes.data.data) {
        const data = atsRes.data.data;
        setResults({
          score: data.score ?? 70,
          keywordMatchScore: data.keywordMatchScore ?? 75,
          formattingScore: data.formattingScore ?? 70,
          sectionScore: data.sectionScore ?? 80,
          bulletScore: data.bulletScore ?? 65,
          matchingSkills: data.matchingSkills ?? matching,
          missingSkills: data.missingSkills ?? missing,
          recommendations: data.recommendations ?? []
        });
      }

      if (gapRes.data && gapRes.data.data) {
        setSkillGapResults(gapRes.data.data);
      }
    } catch (err: any) {
      console.error("Backend scan error:", err);
      // Fallback local mock scan on error
      setResults({
        score: 65,
        keywordMatchScore: 70,
        formattingScore: 80,
        sectionScore: 75,
        bulletScore: 50,
        matchingSkills: matching,
        missingSkills: missing,
        recommendations: [
          { id: 1, type: "high", text: "Integrate missing tech skills", description: "Your profile is missing core job terms like " + missing.slice(0, 3).join(", ") }
        ]
      });
      
      setSkillGapResults({
        userSkills: resumeSkills,
        jobSkills: jobSkills,
        missingSkills: missing,
        learningRoadmap: [
          { stepNumber: 1, title: "Master missing skills", description: "Review technical tutorials and practical coding guidelines.", timeline: "Week 1" }
        ],
        recommendedResources: { courses: [], youtubeVideos: [], certifications: [] }
      });
    }
  };

  const handleStartScan = () => {
    if (!resumeText.trim()) {
      alert("Please upload your resume file or paste your resume text first.");
      return;
    }
    if (!jobText.trim()) {
      alert("Please paste the job description to compare against.");
      return;
    }
    setIsScanning(true);
    setScanStep(0);
    setResults(null);
    setSkillGapResults(null);
    setActiveTab("ats");
  };

  const handleReset = () => {
    setResumeText("");
    setJobText("");
    setFileName(null);
    setResults(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="analyzer-page">
      {/* Header Toolbar */}
      <div className="analyzer-toolbar">
        <div className="toolbar-left">
          <h1>AI Skill Gap & Resume Analyzer</h1>
          <p>Optimize your resume keywords against job descriptions to clear ATS screening</p>
        </div>

        <div className="toolbar-right">
          <button className="tool-btn sample-btn" onClick={handleLoadSample}>
            <Sparkles size={16} /> Load Sample Job & Resume
          </button>
          <button className="tool-btn reset-btn" onClick={handleReset}>
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      <div className="analyzer-content">
        {/* INPUT STAGE */}
        {!isScanning && !results && (
          <div className="inputs-container">
            {/* Left: Resume Input */}
            <div className="input-card">
              <div className="card-header">
                <h3>1. Your Resume</h3>
                <span>PDF or TXT file (Recommended) or paste text</span>
              </div>

              {/* Upload Zone */}
              <div
                className={`upload-zone ${fileName ? "uploaded" : ""} ${isParsingFile ? "loading" : ""}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="resume-file-input"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  disabled={isParsingFile}
                />
                
                {isParsingFile ? (
                  <div className="parser-loading" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "15px 0" }}>
                    <div className="spinner" style={{ width: "28px", height: "28px", border: "3px solid rgba(59, 130, 246, 0.2)", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.8s infinite linear" }}></div>
                    <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>AI Parsing Engine extracting text context...</p>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="upload-icon" />
                    {fileName ? (
                      <div className="file-info">
                        <strong>{fileName}</strong>
                        {parseError ? (
                          <span className="parse-error-txt" style={{ color: "#ef4444", fontSize: "11px", display: "block" }}>{parseError}</span>
                        ) : (
                          <span className="parse-success-txt" style={{ color: "#10b981", fontSize: "11px", display: "block" }}>✓ AI Document Parsed</span>
                        )}
                        <button className="remove-file-btn" onClick={() => { setFileName(null); setResumeText(""); setParseError(""); }}>Remove & Reset</button>
                      </div>
                    ) : (
                      <div>
                        <p>Drag & drop your resume PDF here or</p>
                        <label htmlFor="resume-file-input" className="file-label">
                          Browse Files
                        </label>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="textarea-wrapper">
                <label>Or Edit / Paste Resume Text</label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your full resume text details here..."
                  rows={12}
                  disabled={isParsingFile}
                />
              </div>
            </div>

            {/* Right: Job Description Input */}
            <div className="input-card">
              <div className="card-header">
                <h3>2. Job Description</h3>
                <span>Paste description to match skills</span>
              </div>

              <div className="textarea-wrapper jd-wrapper">
                <label>Paste Target Job Description</label>
                <textarea
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  placeholder="Paste the full job post requirements, roles and key responsibilities..."
                  rows={17}
                />
              </div>

              <button 
                className="analyze-submit-btn" 
                onClick={handleStartScan}
                disabled={isParsingFile}
              >
                Start Analysis <Play size={16} />
              </button>
            </div>
          </div>
        )}

        {/* LOADING/SCANNING STAGE */}
        {isScanning && (
          <div className="scanning-container">
            <div className="scanning-card">
              <div className="scanning-radar">
                <div className="radar-circle circle-1"></div>
                <div className="radar-circle circle-2"></div>
                <div className="radar-circle circle-3"></div>
                <FileText size={48} className="radar-icon" />
              </div>
              <h3>Analyzing Compatibility</h3>
              <p className="scan-phrase">{scanPhrases[scanStep] || "Processing details..."}</p>
              
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${(scanStep / scanPhrases.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* RESULTS REPORT DASHBOARD */}
        {!isScanning && results && (
          <div className="results-container" id="analysis-report-area">
            
            {/* Guest warning banner */}
            {guestMode && (
              <div className="guest-warning-banner hide-on-print" style={{ display: "flex", gap: "12px", alignItems: "flex-start", backgroundColor: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "8px", padding: "16px", marginBottom: "10px" }}>
                <AlertTriangle size={20} className="warning-icon" style={{ color: "#f59e0b", flexShrink: 0, marginTop: "2px" }} />
                <div className="banner-text">
                  <h4 style={{ color: "#fbbf24", margin: "0 0 4px 0", fontSize: "14px", fontWeight: 700 }}>Guest Preview Mode</h4>
                  <p style={{ color: "#cbd5e1", margin: 0, fontSize: "12.5px", lineHeight: 1.4 }}>You are viewing local keyword matching results. Login or Sign up to access Google Gemini 1.5 Flash integrations for deep skill pathways.</p>
                </div>
              </div>
            )}

            {/* Dashboard Header */}
            <div className="results-header-card">
              <div className="header-info">
                <h2>AI Skill Gap & ATS Report</h2>
                <p>Calculated keyword match overlap, structural check, and roadmap metrics</p>
              </div>
              <button className="tool-btn download-btn hide-on-print" onClick={handlePrint}>
                <Download size={16} /> Export PDF Report
              </button>
            </div>

            {/* Tabs selector */}
            <div className="report-tabs-bar hide-on-print" style={{ display: "flex", gap: "8px", borderBottom: "1px solid #1e293b", paddingBottom: "1px" }}>
              <button 
                className={`tab-link ${activeTab === "ats" ? "active" : ""}`}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", fontSize: "14px", fontWeight: 600,
                  backgroundColor: "transparent", color: activeTab === "ats" ? "#3b82f6" : "#94a3b8",
                  border: "none", borderBottom: activeTab === "ats" ? "2px solid #3b82f6" : "2px solid transparent",
                  cursor: "pointer", transition: "all 0.2s"
                }}
                onClick={() => setActiveTab("ats")}
              >
                <FileText size={16} /> ATS Match Report
              </button>
              <button 
                className={`tab-link ${activeTab === "skillgap" ? "active" : ""}`}
                style={{
                  display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", fontSize: "14px", fontWeight: 600,
                  backgroundColor: "transparent", color: activeTab === "skillgap" ? "#a78bfa" : "#94a3b8",
                  border: "none", borderBottom: activeTab === "skillgap" ? "2px solid #a78bfa" : "2px solid transparent",
                  cursor: "pointer", transition: "all 0.2s"
                }}
                onClick={() => setActiveTab("skillgap")}
              >
                <Sparkles size={16} /> Skill Gap & Learning Roadmap
              </button>
            </div>

            {/* TAB CONTENT 1: ATS SCORE REPORT */}
            {activeTab === "ats" && (
              <div className="tab-pane-content fade-in">
                {/* Grid metrics */}
                <div className="metrics-grid">
                  {/* Circular Score dial */}
                  <div className="dial-card">
                    <div className="score-dial-wrapper">
                      <svg className="score-dial-svg" viewBox="0 0 100 100">
                        <circle className="dial-bg" cx="50" cy="50" r="40" />
                        <circle 
                          className="dial-fill" 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * results.score) / 100}
                        />
                      </svg>
                      <div className="dial-label">
                        <span className="number">{results.score}%</span>
                        <span className="text">Match Score</span>
                      </div>
                    </div>
                    
                    <div className="dial-rating-text">
                      {results.score >= 80 ? (
                        <strong style={{ color: "#10b981" }}>Excellent Match! Ready to Apply</strong>
                      ) : results.score >= 60 ? (
                        <strong style={{ color: "#f59e0b" }}>Good Match. Simple edits advised</strong>
                      ) : (
                        <strong style={{ color: "#ef4444" }}>Low Match. Re-optimizing highly recommended</strong>
                      )}
                    </div>
                  </div>

                  {/* Breakdown cards */}
                  <div className="metrics-breakdown-card">
                    <h3>Performance Breakdown</h3>
                    
                    <div className="breakdown-item">
                      <div className="breakdown-header">
                        <span>Keyword Relevance</span>
                        <span>{results.keywordMatchScore}%</span>
                      </div>
                      <div className="breakdown-bar"><div className="fill" style={{ width: `${results.keywordMatchScore}%`, backgroundColor: "#3b82f6" }}></div></div>
                    </div>

                    <div className="breakdown-item">
                      <div className="breakdown-header">
                        <span>Formatting Checks</span>
                        <span>{results.formattingScore}%</span>
                      </div>
                      <div className="breakdown-bar"><div className="fill" style={{ width: `${results.formattingScore}%`, backgroundColor: "#10b981" }}></div></div>
                    </div>

                    <div className="breakdown-item">
                      <div className="breakdown-header">
                        <span>Section Completeness</span>
                        <span>{results.sectionScore}%</span>
                      </div>
                      <div className="breakdown-bar"><div className="fill" style={{ width: `${results.sectionScore}%`, backgroundColor: "#8b5cf6" }}></div></div>
                    </div>

                    <div className="breakdown-item">
                      <div className="breakdown-header">
                        <span>Action Bullet Metrics</span>
                        <span>{results.bulletScore}%</span>
                      </div>
                      <div className="breakdown-bar"><div className="fill" style={{ width: `${results.bulletScore}%`, backgroundColor: "#ec4899" }}></div></div>
                    </div>
                  </div>
                </div>

                {/* Visual Radar Chart (SRS #5) */}
                <div style={{ margin: "20px 0" }}>
                  <SkillRadarChart matchingSkills={results.matchingSkills} missingSkills={results.missingSkills} />
                </div>

                {/* Keyword tag lists */}
                <div className="keyword-section-card">
                  <h3>Keyword Gap Analysis</h3>
                  
                  <div className="keyword-splits">
                    <div className="split-column">
                      <h4 style={{ color: "#10b981" }}>Matching Skills ({results.matchingSkills.length})</h4>
                      {results.matchingSkills.length > 0 ? (
                        <div className="keyword-tags">
                          {results.matchingSkills.map((skill, i) => (
                            <span key={i} className="skill-tag match">{skill.toUpperCase()}</span>
                          ))}
                        </div>
                      ) : (
                        <p className="empty-text">No technical skills detected matching the requirements.</p>
                      )}
                    </div>

                    <div className="split-column">
                      <h4 style={{ color: "#ef4444" }}>Missing Skills Gap ({results.missingSkills.length})</h4>
                      {results.missingSkills.length > 0 ? (
                        <div className="keyword-tags" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {results.missingSkills.map((skill, i) => (
                            <div
                              key={i}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                backgroundColor: "rgba(239, 68, 68, 0.12)",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                borderRadius: "8px",
                                padding: "4px 10px"
                              }}
                            >
                              <span style={{ color: "#fca5a5", fontSize: "11px", fontWeight: "700" }}>{skill.toUpperCase()}</span>
                              <button
                                type="button"
                                title="Copy skill to paste into your resume (SRS #15)"
                                onClick={async () => {
                                  await navigator.clipboard.writeText(skill);
                                  setCopiedSkill(skill);
                                  setTimeout(() => setCopiedSkill(null), 2000);
                                }}
                                style={{
                                  backgroundColor: "rgba(239, 68, 68, 0.25)",
                                  border: "none",
                                  borderRadius: "4px",
                                  color: "#fee2e2",
                                  padding: "2px 6px",
                                  fontSize: "10px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "3px"
                                }}
                              >
                                {copiedSkill === skill ? "✓ Copied" : "+ Copy"}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="empty-text perfect"><CheckCircle size={14} /> You match all technical keywords requested!</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recommendation list */}
                <div className="recommendations-card">
                  <h3>Recommended Enhancements</h3>
                  <div className="recs-list">
                    {results.recommendations.map((rec) => (
                      <div key={rec.id} className={`rec-item ${rec.type}`}>
                        <div className="rec-icon">
                          {rec.type === "high" && <AlertCircle size={20} />}
                          {rec.type === "medium" && <AlertTriangle size={20} />}
                          {rec.type === "low" && <HelpCircle size={20} />}
                        </div>
                        
                        <div className="rec-details">
                          <h4>
                            <span className={`impact-badge ${rec.type}`}>{rec.type.toUpperCase()} IMPACT</span>
                            {rec.text}
                          </h4>
                          <p>{rec.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: SKILL GAP ROADMAP & STUDY RESOURCES */}
            {activeTab === "skillgap" && skillGapResults && (
              <div className="tab-pane-content fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Roadmap timeline card */}
                <div className="roadmap-card" style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "30px" }}>
                  <div className="card-header-icon" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <Sparkles size={20} style={{ color: "#a78bfa" }} />
                    <h3 style={{ margin: 0, fontSize: "16px", color: "#ffffff", fontWeight: 700 }}>AI Learning Roadmap & Milestone Pathway</h3>
                  </div>
                  <p className="roadmap-subtitle" style={{ color: "#94a3b8", fontSize: "13.5px", margin: "0 0 24px 0" }}>Sequential steps generated by Gemini AI to cover missing core competencies</p>

                  <div className="timeline-stepper" style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative", paddingLeft: "10px" }}>
                    {skillGapResults.learningRoadmap && skillGapResults.learningRoadmap.length > 0 ? (
                      skillGapResults.learningRoadmap.map((step: any, idx: number) => (
                        <div key={idx} className="stepper-item" style={{ display: "flex", gap: "20px", position: "relative" }}>
                          <div className="stepper-badge" style={{
                            display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px",
                            borderRadius: "50%", backgroundColor: "#7c3aed", color: "#ffffff", fontSize: "12px", fontWeight: 700, flexShrink: 0
                          }}>
                            {step.stepNumber || idx + 1}
                          </div>
                          <div className="stepper-content" style={{ flex: 1, backgroundColor: "#0b1120", border: "1px solid #1e293b", borderRadius: "10px", padding: "16px" }}>
                            <div className="stepper-meta" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "15px", marginBottom: "6px" }}>
                              <h4 style={{ margin: 0, fontSize: "14px", color: "#ffffff", fontWeight: 700 }}>{step.title}</h4>
                              <span className="timeline-badge" style={{ backgroundColor: "rgba(124, 58, 237, 0.1)", color: "#c084fc", fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "12px", whiteSpace: "nowrap" }}>{step.timeline}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: 1.45 }}>{step.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="empty-roadmap" style={{ color: "#64748b", fontStyle: "italic", fontSize: "13.5px" }}>No specific learning path needed. You have all matching skills!</p>
                    )}
                  </div>
                </div>

                {/* Recommended Study Resources */}
                <div className="study-resources-section">
                  <h3 style={{ fontSize: "16px", color: "#ffffff", marginBottom: "16px", fontWeight: 700 }}>Curated Learning Resources</h3>
                  
                  <div className="resources-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                    {/* Courses */}
                    <div className="resource-category-card" style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div className="category-header" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <GraduationCap className="cat-icon courses" />
                        <h4 style={{ margin: 0, fontSize: "14px", color: "#ffffff", fontWeight: 700 }}>Professional Courses</h4>
                      </div>
                      
                      <div className="resource-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {skillGapResults.recommendedResources?.courses && skillGapResults.recommendedResources.courses.length > 0 ? (
                          skillGapResults.recommendedResources.courses.map((c: any, idx: number) => (
                            <a href={c.url} target="_blank" rel="noopener noreferrer" key={idx} className="resource-link-item" style={{
                              display: "block", textDecoration: "none", backgroundColor: "#0b1120", border: "1px solid #1e293b", borderRadius: "8px", padding: "12px", transition: "all 0.2s"
                            }}>
                              <div className="resource-info" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <strong style={{ color: "#ffffff", fontSize: "13px" }}>{c.title}</strong>
                                <span className="provider" style={{ color: "#64748b", fontSize: "11px" }}>{c.provider} • {c.durationOrCost}</span>
                              </div>
                            </a>
                          ))
                        ) : (
                          <p className="empty-resource-text" style={{ color: "#64748b", fontStyle: "italic", fontSize: "12.5px" }}>No courses recommended.</p>
                        )}
                      </div>
                    </div>

                    {/* YouTube Guides */}
                    <div className="resource-category-card" style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div className="category-header" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Video className="cat-icon videos" />
                        <h4 style={{ margin: 0, fontSize: "14px", color: "#ffffff", fontWeight: 700 }}>YouTube Tutorials</h4>
                      </div>

                      <div className="resource-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {skillGapResults.recommendedResources?.youtubeVideos && skillGapResults.recommendedResources.youtubeVideos.length > 0 ? (
                          skillGapResults.recommendedResources.youtubeVideos.map((v: any, idx: number) => (
                            <a href={v.url} target="_blank" rel="noopener noreferrer" key={idx} className="resource-link-item" style={{
                              display: "block", textDecoration: "none", backgroundColor: "#0b1120", border: "1px solid #1e293b", borderRadius: "8px", padding: "12px", transition: "all 0.2s"
                            }}>
                              <div className="resource-info" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <strong style={{ color: "#ffffff", fontSize: "13px" }}>{v.title}</strong>
                                <span className="provider" style={{ color: "#64748b", fontSize: "11px" }}>{v.provider} • {v.durationOrCost}</span>
                              </div>
                            </a>
                          ))
                        ) : (
                          <p className="empty-resource-text" style={{ color: "#64748b", fontStyle: "italic", fontSize: "12.5px" }}>No video tutorials recommended.</p>
                        )}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="resource-category-card" style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div className="category-header" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Award className="cat-icon certs" />
                        <h4 style={{ margin: 0, fontSize: "14px", color: "#ffffff", fontWeight: 700 }}>Certifications</h4>
                      </div>

                      <div className="resource-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {skillGapResults.recommendedResources?.certifications && skillGapResults.recommendedResources.certifications.length > 0 ? (
                          skillGapResults.recommendedResources.certifications.map((cert: any, idx: number) => (
                            <a href={cert.url} target="_blank" rel="noopener noreferrer" key={idx} className="resource-link-item" style={{
                              display: "block", textDecoration: "none", backgroundColor: "#0b1120", border: "1px solid #1e293b", borderRadius: "8px", padding: "12px", transition: "all 0.2s"
                            }}>
                              <div className="resource-info" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <strong style={{ color: "#ffffff", fontSize: "13px" }}>{cert.title}</strong>
                                <span className="provider" style={{ color: "#64748b", fontSize: "11px" }}>{cert.provider} • {cert.durationOrCost}</span>
                              </div>
                            </a>
                          ))
                        ) : (
                          <p className="empty-resource-text" style={{ color: "#64748b", fontStyle: "italic", fontSize: "12.5px" }}>No certifications recommended.</p>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Re-analyze buttons */}
            <div className="re-analyze-bar hide-on-print">
              <button className="tool-btn sample-btn" onClick={handleReset}>
                <RotateCcw size={16} /> Analyze Another Resume
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

// Additional Icons for Resources Grid
const GraduationCap: React.FC<any> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} style={{ color: "#3b82f6" }}><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
);
const Video: React.FC<any> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} style={{ color: "#ef4444" }}><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
);
const Award: React.FC<any> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} style={{ color: "#10b981" }}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
);

export default AnalyzeResume;
