import React, { useState, useEffect } from "react";
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

const AnalyzeResume: React.FC = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobText, setJobText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [results, setResults] = useState<AnalysisResults | null>(null);

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

  // Handle file drop / select simulation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      // Simulate reading file text
      setResumeText(`[Extracted from file: ${file.name}]\n\nAlex Mercer\nEmail: alex.mercer@email.com\nTitle: Full Stack Engineer\nSkills: React, JavaScript, SQL, MySQL, Git, Redux, HTML, CSS\n\nExperience:\n- Built frontend using React.\n- Handled databases in MySQL.\n- Used Git for version control.`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      setResumeText(`[Extracted from file: ${file.name}]\n\nAlex Mercer\nEmail: alex.mercer@email.com\nSkills: React, JavaScript, SQL, MySQL, Git, Redux, HTML, CSS`);
    }
  };

  // Actual keyword extraction & calculation algorithm
  const performAnalysis = () => {
    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobText.toLowerCase();

    // 1. Keyword overlap
    const resumeSkills: string[] = [];
    const jobSkills: string[] = [];

    TECH_KEYWORDS.forEach(keyword => {
      // Create a regex to match word boundary or keyword variations
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

    const keywordMatchPct = jobSkills.length > 0 
      ? Math.round((matching.length / jobSkills.length) * 100) 
      : 80;

    // 2. Formatting Score (simple checks: length, structures)
    let formatting = 70;
    if (resumeText.length > 300) formatting += 15;
    if (resumeText.includes("EXPERIENCE") || resumeText.includes("Experience")) formatting += 10;
    if (resumeText.includes("EDUCATION") || resumeText.includes("Education")) formatting += 5;
    formatting = Math.min(formatting, 100);

    // 3. Section completeness checks
    let sections = 40;
    if (resumeLower.includes("email") || resumeLower.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/)) sections += 20;
    if (resumeLower.includes("phone") || resumeLower.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/)) sections += 15;
    if (resumeLower.includes("summary") || resumeLower.includes("profile")) sections += 15;
    if (resumeLower.includes("skills") || resumeLower.includes("expertise")) sections += 10;
    sections = Math.min(sections, 100);

    // 4. Bullet metrics (quantifiable stats check)
    let bullets = 40;
    const hasNumbers = resumeText.match(/\b\d+%\b|\b\d+\s+years\b|\b\$\d+\b|\b\d+x\b|\bincreased\s+\d+\b|\breduced\s+\d+\b/i);
    if (hasNumbers) bullets += 40;
    if (resumeText.split("\n").filter(line => line.trim().startsWith("-") || line.trim().startsWith("•")).length > 4) bullets += 20;

    // 5. Total Score
    const totalScore = Math.round((keywordMatchPct * 0.5) + (formatting * 0.2) + (sections * 0.15) + (bullets * 0.15));

    // 6. Actionable recommendations
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

    if (resumeText.length < 200) {
      recs.push({
        id: recId++,
        type: "medium" as const,
        text: "Increase resume length and detail depth",
        description: "A short resume might rank lower on relevance algorithms. Aim to describe your work experience in more detail (at least 3-4 bullet points per job)."
      });
    }

    if (formatting < 90) {
      recs.push({
        id: recId++,
        type: "low" as const,
        text: "Standardize formatting & fonts",
        description: "Keep headings consistent and use bullet points instead of paragraphs for job duties to help ATS scanners digest your text."
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
                <span>PDF, DOCX, TXT or paste text</span>
              </div>

              {/* Upload Zone */}
              <div
                className={`upload-zone ${fileName ? "uploaded" : ""}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="resume-file-input"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <Upload size={32} className="upload-icon" />
                {fileName ? (
                  <div className="file-info">
                    <strong>{fileName}</strong>
                    <button className="remove-file-btn" onClick={() => setFileName(null)}>Remove</button>
                  </div>
                ) : (
                  <div>
                    <p>Drag and drop your resume file here or</p>
                    <label htmlFor="resume-file-input" className="file-label">
                      Browse Files
                    </label>
                  </div>
                )}
              </div>

              <div className="textarea-wrapper">
                <label>Or Paste Resume Text</label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your full resume text details here..."
                  rows={12}
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

              <button className="analyze-submit-btn" onClick={handleStartScan}>
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
            
            {/* Dashboard Header */}
            <div className="results-header-card">
              <div className="header-info">
                <h2>ATS Match Analysis Report</h2>
                <p>Calculated keyword match overlap and structural assessment</p>
              </div>
              <button className="tool-btn download-btn hide-on-print" onClick={handlePrint}>
                <Download size={16} /> Export PDF Report
              </button>
            </div>

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
                    <div className="keyword-tags">
                      {results.missingSkills.map((skill, i) => (
                        <span key={i} className="skill-tag missing">{skill.toUpperCase()}</span>
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

export default AnalyzeResume;
