import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./BuildResume.css";
import { Stepper, Step, StepLabel, StepButton } from "@mui/material";
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
  FileCheck,
  Award,
  Layout,
  ExternalLink,
  Save,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  FileText,
  Share2,
  Copy,
  Check,
  SpellCheck,
  Layers
} from "lucide-react";

const Github = ({ size = 24, className = "", style, ...props }: { size?: number | string; className?: string; style?: React.CSSProperties } & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-github ${className}`}
    style={style}
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size = 24, className = "", style, ...props }: { size?: number | string; className?: string; style?: React.CSSProperties } & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-linkedin ${className}`}
    style={style}
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

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
  githubLink?: string;
  liveDemoLink?: string;
}

interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
  skills: string; // comma-separated
  softSkills?: string; // comma-separated
  languages?: string; // comma-separated
  certifications?: string; // comma-separated
  achievements?: string; // comma-separated
  githubContributions?: string;
  techStackFront?: string;
  techStackBack?: string;
  techStackDatabase?: string;
  techStackTools?: string;
  techStackCloud?: string;
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
  photoUrl?: string;
}

const SAMPLE_DATA: ResumeData = {
  fullName: "Alex Mercer",
  title: "Senior Software Engineer",
  email: "alex.mercer@email.com",
  phone: "+1 (555) 019-2834",
  location: "San Francisco, CA",
  website: "alexmercer.dev",
  linkedin: "linkedin.com/in/alexmercer",
  github: "github.com/alexmercer",
  portfolio: "alexmercer.dev/portfolio",
  summary: "Innovative Software Engineer with 6+ years of experience designing, building, and deploying high-performance web applications and distributed systems. Passionate about AI integrations, developer experience, system architecture, and creating clean, scalable code architectures.",
  skills: "React, TypeScript, Node.js, Express, PostgreSQL, Next.js, Docker, AWS, Git, REST APIs, Tailwind CSS",
  softSkills: "Technical Leadership, Team Mentorship, System Design, Agile Methodologies, Communication",
  languages: "English (Native), Spanish (Conversational), Japanese (Basic)",
  certifications: "AWS Certified Solutions Architect, Certified ScrumMaster (CSM), Google Cloud Professional Cloud Architect",
  achievements: "Reduced cloud infrastructure costs by 35% through container optimization, Mentored 5+ junior developers to promotion path, Architected SaaS platform handling 1M+ daily requests.",
  githubContributions: "Core maintainer for several popular open-source utility packages. Contributed to Webpack, React-Query, and Tailwind CSS ecosystems.",
  techStackFront: "React, TypeScript, Next.js, Redux, Tailwind CSS, HTML5/CSS3",
  techStackBack: "Node.js, Express, Go, Java, Spring Boot, GraphQL",
  techStackDatabase: "PostgreSQL, MongoDB, Redis, MySQL",
  techStackTools: "Docker, Kubernetes, Git, GitHub Actions, Jenkins, Webpack",
  techStackCloud: "AWS (S3, EC2, Lambda, ECS), GCP, Vercel",
  experiences: [
    {
      company: "ByteCraft Solutions",
      role: "Senior Software Developer",
      startDate: "2024-03",
      endDate: "Present",
      location: "San Francisco, CA",
      description: "Led development of a cloud-based SaaS dashboard, improving response times by 40%.\nDirected a team of 4 frontend engineers and introduced TypeScript, reducing runtime crashes by 25%.\nImplemented CI/CD pipelines utilizing GitHub Actions, speeding up release cycles by 50%."
    },
    {
      company: "AppSphere Inc.",
      role: "Full Stack Developer",
      startDate: "2022-06",
      endDate: "2024-02",
      location: "Remote",
      description: "Developed and maintained high-traffic customer portals. Integrated secure Stripe payments and designed scalable PostgreSQL database schemas, supporting 50k+ active daily users.\nOptimized SQL queries and indexed database tables to speed up overall reporting API latency by 30%."
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
      githubLink: "github.com/alexmercer/ai-planner",
      liveDemoLink: "ai-planner.alexmercer.dev",
      description: "A web application that generates personalized career roadmaps and matches users with online course suggestions based on skill gaps."
    },
    {
      name: "SwiftStore E-Commerce API",
      technologies: "Express, PostgreSQL, Redis",
      link: "github.com/alexmercer/swiftstore",
      githubLink: "github.com/alexmercer/swiftstore",
      liveDemoLink: "api.swiftstore.dev",
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
  linkedin: "",
  github: "",
  portfolio: "",
  summary: "",
  skills: "",
  softSkills: "",
  languages: "",
  certifications: "",
  achievements: "",
  githubContributions: "",
  techStackFront: "",
  techStackBack: "",
  techStackDatabase: "",
  techStackTools: "",
  techStackCloud: "",
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
  const [searchParams] = useSearchParams();
  const resumeIdParam = searchParams.get("id");
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("template-1");
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

  // MaterialUI Stepper State (SRS #1)
  const [activeStep, setActiveStep] = useState<number>(0);
  const [viewAllSections, setViewAllSections] = useState<boolean>(false);

  // Template Carousel State (SRS #3)
  const [showTemplateSelector, setShowTemplateSelector] = useState<boolean>(false);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  // Drag and Drop state (SRS #7)
  const [draggedExpIndex, setDraggedExpIndex] = useState<number | null>(null);
  const [draggedProjIndex, setDraggedProjIndex] = useState<number | null>(null);
  const [draggedSkillIndex, setDraggedSkillIndex] = useState<number | null>(null);

  // Grammar & Spell Check state (SRS #14)
  const [grammarChecking, setGrammarChecking] = useState<Record<string, boolean>>({});
  const [grammarIssues, setGrammarIssues] = useState<Record<string, any[]>>({});

  // Formatting & Page Length Check state (SRS #16)
  const [formattingReport, setFormattingReport] = useState<{
    estimatedPages: number;
    wordCount: number;
    warnings: string[];
    suggestions: string[];
  } | null>(null);

  // Cover Letter Generator Modal State (SRS #19)
  const [coverLetterModalOpen, setCoverLetterModalOpen] = useState(false);
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);
  const [targetCompany, setTargetCompany] = useState("");
  const [targetRoleInput, setTargetRoleInput] = useState("");
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string | null>(null);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  // Shareable Link & Tracking Modal State (SRS #20, #21)
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState<number | null>(null);

  // Fetch existing resume if query param ?id=123 is provided (SRS #10)
  useEffect(() => {
    if (resumeIdParam) {
      const id = parseInt(resumeIdParam, 10);
      if (!isNaN(id)) {
        setCurrentResumeId(id);
        Api.get(`/api/resumes/${id}`)
          .then((res) => {
            if (res.data && res.data.data) {
              const d = res.data.data;
              setResumeData({
                fullName: d.fullName || "",
                title: d.title || "",
                email: d.email || "",
                phone: d.phone || "",
                location: d.location || "",
                website: d.website || "",
                summary: d.summary || "",
                skills: d.skills || "",
                softSkills: d.softSkills || "",
                languages: d.languages || "",
                certifications: d.certifications || "",
                achievements: d.achievements || "",
                githubContributions: d.githubContributions || "",
                techStackFront: d.techStackFront || "",
                techStackBack: d.techStackBack || "",
                techStackDatabase: d.techStackDatabase || "",
                techStackTools: d.techStackTools || "",
                techStackCloud: d.techStackCloud || "",
                experiences: d.experiences || [],
                educations: d.educations || [],
                projects: d.projects || [],
                photoUrl: d.photoUrl || ""
              });
              if (d.templateName) setSelectedTemplate(d.templateName);
              if (d.accentColor) setSelectedColor(d.accentColor);
              if (d.shareToken) setShareToken(d.shareToken);
              if (d.targetJobDescription) setTargetJobDesc(d.targetJobDescription);
            }
          })
          .catch((err) => {
            console.error("Failed to load resume for editing:", err);
          });
      }
    }
  }, [resumeIdParam]);

  // Dedicated Target Job Panel State (SRS #4)
  const [showTargetJobPanel, setShowTargetJobPanel] = useState<boolean>(true);

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
    skills: true,
    additional: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const isSectionVisible = (stepIndex: number) => {
    return viewAllSections || activeStep === stepIndex;
  };

  const ACTION_VERBS = [
    "Spearheaded", "Architected", "Optimized", "Engineered", "Streamlined",
    "Automated", "Accelerated", "Delivered", "Transformed", "Pioneered",
    "Orchestrated", "Scaled", "Designed", "Executed", "Overhauled"
  ];

  const TEMPLATES_LIST = [
    {
      id: "template-1",
      title: "Professional ATS-Friendly",
      badge: "ATS-Friendly",
      desc: "Clean single-column typography optimized with dark blue accents (#1E3A8A) for passing automated screenings.",
      previewClass: "template-1-mock"
    },
    {
      id: "template-2",
      title: "Premium Executive",
      badge: "Premium Executive",
      desc: "30/70 structured layout with navy sidebar (#0F172A). Best for showcasing profile photo and core experience.",
      previewClass: "template-2-mock"
    },
    {
      id: "template-3",
      title: "Software Engineer Spec",
      badge: "Software Engineer",
      desc: "Developer-focused design featuring dark blue headers, monospace accents, and dedicated sections for tech stacks.",
      previewClass: "template-3-mock"
    },
    {
      id: "template-4",
      title: "Modern Creative",
      badge: "Modern Creative",
      desc: "Stunning design with purple/blue gradients, modern card layouts, subtle animations, and premium shadows.",
      previewClass: "template-4-mock"
    }
  ];

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
    if (selectedTemplate === "template-1") {
      formattingScore += 10;
    } else if (selectedTemplate === "template-3") {
      formattingScore += 9;
      tips.push("Software Engineer template has excellent tech readability.");
    } else if (selectedTemplate === "template-2") {
      formattingScore += 8;
      tips.push("Premium Executive sidebar layout is clean. Ensure key info is kept parsed.");
    } else if (selectedTemplate === "template-4") {
      formattingScore += 7;
      tips.push("Modern Creative template uses gradients; select Template 1 (ATS-Friendly) for ultimate compliance.");
    } else {
      formattingScore += 5;
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

  // Drag and drop experience reordering (SRS #7)
  const moveExperience = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= resumeData.experiences.length) return;
    setResumeData(prev => {
      const list = [...prev.experiences];
      const item = list.splice(fromIndex, 1)[0];
      list.splice(toIndex, 0, item);
      return { ...prev, experiences: list };
    });
  };

  // Drag and drop projects reordering (SRS #7)
  const moveProject = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= resumeData.projects.length) return;
    setResumeData(prev => {
      const list = [...prev.projects];
      const item = list.splice(fromIndex, 1)[0];
      list.splice(toIndex, 0, item);
      return { ...prev, projects: list };
    });
  };

  // Drag and drop skill reordering (SRS #7)
  const moveSkill = (fromIndex: number, toIndex: number) => {
    const list = resumeData.skills.split(",").map(s => s.trim()).filter(Boolean);
    if (toIndex < 0 || toIndex >= list.length) return;
    const item = list.splice(fromIndex, 1)[0];
    list.splice(toIndex, 0, item);
    setResumeData(prev => ({ ...prev, skills: list.join(", ") }));
  };

  const removeSkillChip = (indexToRemove: number) => {
    const list = resumeData.skills.split(",").map(s => s.trim()).filter(Boolean);
    const updated = list.filter((_, i) => i !== indexToRemove);
    setResumeData(prev => ({ ...prev, skills: updated.join(", ") }));
  };

  // Action verb insertion (SRS #6)
  const insertActionVerb = (type: "experience" | "project", index: number, verb: string) => {
    if (type === "experience") {
      const current = resumeData.experiences[index].description;
      const updated = current ? `${current}\n• ${verb} ` : `• ${verb} `;
      updateExperience(index, "description", updated);
    } else {
      const current = resumeData.projects[index].description;
      const updated = current ? `${current}\n• ${verb} ` : `• ${verb} `;
      updateProject(index, "description", updated);
    }
  };

  // Grammar & typo check (SRS #14)
  const handleCheckGrammar = async (type: "experience" | "project", index: number) => {
    const key = `${type}_${index}`;
    const text = type === "experience"
      ? resumeData.experiences[index].description
      : resumeData.projects[index].description;

    if (!text.trim()) {
      alert("Please write some bullet points first to check spelling and grammar.");
      return;
    }

    setGrammarChecking(prev => ({ ...prev, [key]: true }));
    try {
      const res = await Api.post("/api/grammar/check", { text });
      if (res.data?.data) {
        setGrammarIssues(prev => ({ ...prev, [key]: res.data.data.issues || [] }));
        if (!res.data.data.issues || res.data.data.issues.length === 0) {
          alert("✓ Flawless! No spelling or grammatical errors found.");
        }
      }
    } catch (e) {
      alert("Could not run grammar check. Using offline verification.");
    } finally {
      setGrammarChecking(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleApplyGrammarFix = (type: "experience" | "project", index: number, targetWord: string, replacement: string) => {
    const key = `${type}_${index}`;
    if (type === "experience") {
      const cur = resumeData.experiences[index].description;
      const rep = cur.replace(targetWord, replacement);
      updateExperience(index, "description", rep);
    } else {
      const cur = resumeData.projects[index].description;
      const rep = cur.replace(targetWord, replacement);
      updateProject(index, "description", rep);
    }
    setGrammarIssues(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter(i => !i.context.includes(targetWord))
    }));
  };

  // Real-time Formatting & Page Length Check (SRS #16)
  const handleValidateFormatting = async () => {
    try {
      const res = await Api.post("/api/resumes/validate-format", {
        fullName: resumeData.fullName,
        title: resumeData.title,
        email: resumeData.email,
        phone: resumeData.phone,
        summary: resumeData.summary,
        skills: resumeData.skills,
        experiences: resumeData.experiences,
        educations: resumeData.educations,
        projects: resumeData.projects
      });
      if (res.data?.data) {
        setFormattingReport(res.data.data);
      }
    } catch (e) {
      console.error("Failed to run format check", e);
    }
  };

  // Run formatting check on changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleValidateFormatting();
    }, 1500);
    return () => clearTimeout(timer);
  }, [resumeData.summary, resumeData.experiences, resumeData.projects]);

  // Cover Letter Generator (SRS #19)
  const handleGenerateCoverLetter = async () => {
    if (!targetCompany.trim()) {
      alert("Please enter the target company name.");
      return;
    }
    setCoverLetterLoading(true);
    try {
      const res = await Api.post("/api/cover-letter/generate", {
        companyName: targetCompany,
        targetRole: targetRoleInput || resumeData.title || "Software Engineer",
        applicantName: resumeData.fullName,
        skills: resumeData.skills
      });
      if (res.data?.data?.coverLetterText) {
        setGeneratedCoverLetter(res.data.data.coverLetterText);
      }
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to generate cover letter.");
    } finally {
      setCoverLetterLoading(false);
    }
  };

  // Share Resume & Tracking (SRS #20, #21)
  const handleGenerateShareLink = async () => {
    setShareLoading(true);
    try {
      let idToShare = currentResumeId;
      if (!idToShare) {
        const saveRes = await Api.post("/api/resumes", {
          fullName: resumeData.fullName,
          title: resumeData.title,
          email: resumeData.email,
          phone: resumeData.phone,
          location: resumeData.location,
          website: resumeData.website,
          summary: resumeData.summary,
          skills: resumeData.skills,
          templateName: selectedTemplate,
          accentColor: selectedColor,
          photoUrl: resumeData.photoUrl,
          atsScore: atsScore,
          experiences: resumeData.experiences,
          educations: resumeData.educations,
          projects: resumeData.projects
        });
        if (saveRes.data?.data?.id) {
          idToShare = saveRes.data.data.id;
          setCurrentResumeId(idToShare);
        }
      }

      if (idToShare) {
        const shareRes = await Api.post(`/api/resumes/${idToShare}/share`);
        if (shareRes.data?.data?.shareToken) {
          setShareToken(shareRes.data.data.shareToken);
          setShareModalOpen(true);
        }
      } else {
        alert("Please save your resume first before generating a public share link.");
      }
    } catch (e: any) {
      alert(e.response?.data?.message || "Please log in to generate a public shareable link.");
    } finally {
      setShareLoading(false);
    }
  };

  // Clone Resume Version (SRS #18)
  const handleCloneThisResume = async () => {
    if (!currentResumeId) {
      setResumeData(prev => ({
        ...prev,
        title: (prev.title || "Software Engineer") + " (Copy)"
      }));
      alert("Duplicated resume configuration! You can now edit this new copy.");
      return;
    }
    try {
      const res = await Api.post(`/api/resumes/${currentResumeId}/clone`);
      if (res.data?.data) {
        setCurrentResumeId(res.data.data.id);
        alert("Resume successfully cloned on your account with incremented version!");
      }
    } catch (e) {
      alert("Failed to clone resume on server.");
    }
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

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSaveResume = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSaveStatus({
        type: "error",
        message: "Authentication required! You must be logged in with Google, GitHub, or Email/Password to save resumes."
      });
      return;
    }

    setSaving(true);
    setSaveStatus(null);
    try {
      const payload = {
        fullName: resumeData.fullName,
        title: resumeData.title,
        email: resumeData.email,
        phone: resumeData.phone,
        location: resumeData.location,
        website: resumeData.website,
        summary: resumeData.summary,
        skills: resumeData.skills,
        templateName: selectedTemplate,
        accentColor: selectedColor,
        photoUrl: resumeData.photoUrl,
        atsScore: atsScore,
        experiences: resumeData.experiences,
        educations: resumeData.educations,
        projects: resumeData.projects
      };

      if (currentResumeId) {
        await Api.put(`/api/resumes/${currentResumeId}`, payload);
        setSaveStatus({
          type: "success",
          message: "Resume updated successfully in your account!"
        });
      } else {
        const res = await Api.post("/api/resumes", payload);
        if (res.data?.data?.id) {
          setCurrentResumeId(res.data.data.id);
        }
        setSaveStatus({
          type: "success",
          message: "Resume saved successfully to your account!"
        });
      }
    } catch (error: any) {
      console.error("Save Resume Error:", error);
      setSaveStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to save resume. Please ensure you are logged in."
      });
    } finally {
      setSaving(false);
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
          <button className="tool-btn templates-btn" onClick={() => setShowTemplateSelector(true)} style={{ backgroundColor: "#1e293b", color: "#e2e8f0", border: "1px solid #334155" }}>
            <Layout size={16} /> Choose Template
          </button>
          <button className="tool-btn cover-letter-btn" onClick={() => setCoverLetterModalOpen(true)} style={{ backgroundColor: "#4338ca", color: "#ffffff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "500" }}>
            <FileText size={16} /> Cover Letter
          </button>
          <button className="tool-btn share-btn" onClick={handleGenerateShareLink} disabled={shareLoading} style={{ backgroundColor: "#0284c7", color: "#ffffff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "500" }}>
            <Share2 size={16} /> {shareLoading ? "Sharing..." : "Share Link"}
          </button>
          <button className="tool-btn clone-btn" onClick={handleCloneThisResume} style={{ backgroundColor: "#0f766e", color: "#ffffff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "500" }}>
            <Copy size={16} /> Clone Version
          </button>
          <button className="tool-btn sample-btn" onClick={handleFillSample}>
            <RefreshCw size={16} /> Fill Sample
          </button>
          <button className="tool-btn reset-btn" onClick={handleReset}>
            <Trash2 size={16} /> Reset
          </button>
          <button className="tool-btn save-btn" onClick={handleSaveResume} disabled={saving} style={{ backgroundColor: "#2563eb", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "500" }}>
            <Save size={16} /> {saving ? "Saving..." : "Save Resume"}
          </button>
          <button className="tool-btn download-btn" onClick={handlePrint}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>

      {saveStatus && (
        <div style={{
          padding: "12px 20px",
          margin: "10px 20px 0 20px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "14px",
          fontWeight: "500",
          backgroundColor: saveStatus.type === "success" ? "#f0fdf4" : "#fef2f2",
          color: saveStatus.type === "success" ? "#166534" : "#991b1b",
          border: `1px solid ${saveStatus.type === "success" ? "#bbf7d0" : "#fca5a5"}`
        }}>
          {saveStatus.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{saveStatus.message}</span>
        </div>
      )}

      <div className="builder-content">
        {/* Left column: Editor */}
        <div className="editor-pane">
          {/* Real-time Formatting & Page Length Spill Warning (SRS #16) */}
          {formattingReport && (
            <div style={{
              backgroundColor: formattingReport.estimatedPages >= 3 ? "rgba(239, 68, 68, 0.12)" : formattingReport.estimatedPages >= 2 ? "rgba(245, 158, 11, 0.12)" : "rgba(16, 185, 129, 0.08)",
              border: `1px solid ${formattingReport.estimatedPages >= 3 ? "rgba(239, 68, 68, 0.35)" : formattingReport.estimatedPages >= 2 ? "rgba(245, 158, 11, 0.35)" : "rgba(16, 185, 129, 0.25)"}`,
              borderRadius: "10px",
              padding: "12px 16px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px"
            }}>
              <AlertCircle size={18} style={{ color: formattingReport.estimatedPages >= 2 ? "#f59e0b" : "#10b981", flexShrink: 0, marginTop: "2px" }} />
              <div style={{ flex: 1, fontSize: "12.5px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <strong style={{ color: formattingReport.estimatedPages >= 3 ? "#ef4444" : formattingReport.estimatedPages >= 2 ? "#f59e0b" : "#10b981" }}>
                    Format & Page Spill Check: ~{formattingReport.estimatedPages} {formattingReport.estimatedPages === 1 ? "Page" : "Pages"} ({formattingReport.wordCount} words)
                  </strong>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>SRS #16</span>
                </div>
                {formattingReport.warnings && formattingReport.warnings.length > 0 ? (
                  <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px", color: "#cbd5e1", lineHeight: 1.4 }}>
                    {formattingReport.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ margin: 0, color: "#94a3b8" }}>Optimal length! Fits cleanly without awkward page spillovers.</p>
                )}
              </div>
            </div>
          )}

          {/* MaterialUI Multi-step Stepper (SRS #1) */}
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#e2e8f0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Resume Creation Steps (SRS #1)
              </span>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#94a3b8", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={viewAllSections}
                  onChange={(e) => setViewAllSections(e.target.checked)}
                  style={{ accentColor: "#6366f1", cursor: "pointer" }}
                />
                <span>View All Sections</span>
              </label>
            </div>
            <Stepper activeStep={activeStep} alternativeLabel sx={{
              "& .MuiStepLabel-label": { color: "#94a3b8 !important", fontSize: "12px" },
              "& .MuiStepLabel-label.Mui-active": { color: "#818cf8 !important", fontWeight: "700" },
              "& .MuiStepLabel-label.Mui-completed": { color: "#10b981 !important" },
              "& .MuiStepIcon-root": { color: "#334155" },
              "& .MuiStepIcon-root.Mui-active": { color: "#6366f1" },
              "& .MuiStepIcon-root.Mui-completed": { color: "#10b981" },
            }}>
              {["Personal", "Experience", "Education", "Projects", "Skills", "Additional"].map((label, index) => (
                <Step key={label} completed={index < activeStep}>
                  <StepButton onClick={() => setActiveStep(index)}>
                    <StepLabel>{label}</StepLabel>
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            {!viewAllSections && (
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #1e293b" }}>
                <button
                  type="button"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                  style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#1e293b", border: "1px solid #334155", color: activeStep === 0 ? "#475569" : "#e2e8f0", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", cursor: activeStep === 0 ? "not-allowed" : "pointer" }}
                >
                  <ChevronLeft size={14} /> Previous Step
                </button>
                <button
                  type="button"
                  disabled={activeStep === 5}
                  onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
                  style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#4f46e5", border: "none", color: "#ffffff", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: activeStep === 5 ? "not-allowed" : "pointer" }}
                >
                  Next Step <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Dedicated Target Job Panel (SRS #4) */}
          <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setShowTargetJobPanel(!showTargetJobPanel)}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={16} style={{ color: "#818cf8" }} />
                <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#ffffff" }}>Target Job Description Input (SRS #4)</h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {targetJobDesc.trim() && (
                  <span style={{ fontSize: "11px", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>
                    Job Active
                  </span>
                )}
                {showTargetJobPanel ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {showTargetJobPanel && (
              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: 1.4 }}>
                  Paste target job requirements below. The builder will automatically evaluate keywords and personalize AI suggestions.
                </p>
                <textarea
                  value={targetJobDesc}
                  onChange={(e) => setTargetJobDesc(e.target.value)}
                  placeholder="Paste target job description here (e.g. Senior Full Stack Engineer with React, TypeScript, Spring Boot, AWS...)"
                  rows={3}
                  style={{ width: "100%", padding: "10px 12px", backgroundColor: "#0b1120", border: "1px solid #1e293b", borderRadius: "8px", color: "#e2e8f0", fontSize: "12.5px", fontFamily: "inherit" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    {targetJobDesc.trim() ? `${targetJobDesc.split(/\s+/).filter(Boolean).length} words parsed` : "No job text pasted yet"}
                  </span>
                  {targetJobDesc.trim() && (
                    <button
                      type="button"
                      onClick={() => setTargetJobDesc("")}
                      style={{ backgroundColor: "transparent", border: "none", color: "#94a3b8", fontSize: "11px", cursor: "pointer", textDecoration: "underline" }}
                    >
                      Clear Job Text
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Customization Options Bar */}
          <div className="customization-card">
            <h3>Style Customize</h3>
            <div className="custom-options">
              <div className="option-group">
                <label>Template</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} style={{ flex: 1 }}>
                    <option value="template-1">Professional ATS-Friendly</option>
                    <option value="template-2">Premium Executive</option>
                    <option value="template-3">Software Engineer Spec</option>
                    <option value="template-4">Modern Creative</option>
                  </select>
                  <button 
                    type="button" 
                    onClick={() => setShowTemplateSelector(true)}
                    className="select-template-btn"
                    style={{ backgroundColor: "#334155", color: "#ffffff", border: "none", borderRadius: "6px", padding: "0 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    title="Open Template Selector"
                  >
                    <Layout size={14} />
                  </button>
                </div>
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
            {isSectionVisible(0) && (
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
                          placeholder="alexmercer.dev"
                        />
                      </div>
                    </div>

                    <div className="input-row">
                      <div className="form-group">
                        <label>LinkedIn Profile URL</label>
                        <input
                          type="text"
                          name="linkedin"
                          value={resumeData.linkedin || ""}
                          onChange={handleFieldChange}
                          placeholder="linkedin.com/in/username"
                        />
                      </div>
                      <div className="form-group">
                        <label>GitHub Profile URL</label>
                        <input
                          type="text"
                          name="github"
                          value={resumeData.github || ""}
                          onChange={handleFieldChange}
                          placeholder="github.com/username"
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
            )}

            {/* 2. EXPERIENCE */}
            {isSectionVisible(1) && (
              <div className={`accordion-item ${openSections.experience ? "open" : ""}`}>
                <div className="accordion-header" onClick={() => toggleSection("experience")}>
                  <span className="title"><Briefcase size={18} /> Work Experience</span>
                  {openSections.experience ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>

                {openSections.experience && (
                  <div className="accordion-body">
                    {resumeData.experiences.map((exp, index) => (
                      <div
                        key={index}
                        className="array-item-card"
                        draggable
                        onDragStart={() => setDraggedExpIndex(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedExpIndex !== null && draggedExpIndex !== index) {
                            moveExperience(draggedExpIndex, index);
                            setDraggedExpIndex(null);
                          }
                        }}
                      >
                        <div className="item-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span title="Drag to reorder (SRS #7)" style={{ cursor: "grab", display: "flex", alignItems: "center", color: "#64748b" }}>
                              <GripVertical size={16} />
                            </span>
                            <h4 style={{ margin: 0 }}>Job #{index + 1}</h4>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => moveExperience(index, index - 1)}
                              title="Move Up (SRS #7)"
                              style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "4px", padding: "4px 6px", color: index === 0 ? "#475569" : "#cbd5e1", cursor: index === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center" }}
                            >
                              <ChevronUp size={14} />
                            </button>
                            <button
                              type="button"
                              disabled={index === resumeData.experiences.length - 1}
                              onClick={() => moveExperience(index, index + 1)}
                              title="Move Down (SRS #7)"
                              style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "4px", padding: "4px 6px", color: index === resumeData.experiences.length - 1 ? "#475569" : "#cbd5e1", cursor: index === resumeData.experiences.length - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center" }}
                            >
                              <ChevronDown size={14} />
                            </button>
                            <button className="delete-btn" onClick={() => removeExperience(index)} title="Remove Experience">
                              <Trash2 size={16} />
                            </button>
                          </div>
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
                          <div className="label-row-optimize" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "6px" }}>
                            <label style={{ margin: 0 }}>Description / Core Achievements</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <button
                                type="button"
                                onClick={() => handleCheckGrammar("experience", index)}
                                disabled={grammarChecking[`experience_${index}`]}
                                style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "4px", padding: "2px 8px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}
                              >
                                <SpellCheck size={12} /> {grammarChecking[`experience_${index}`] ? "Checking..." : "Check Grammar (SRS #14)"}
                              </button>
                              <button 
                                type="button" 
                                className="optimize-btn-trigger" 
                                style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(124, 58, 237, 0.1)", color: "#c084fc", border: "1px solid rgba(124, 58, 237, 0.2)", borderRadius: "4px", padding: "2px 8px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}
                                onClick={() => handleOpenOptimizer("experience", index)}
                              >
                                <Sparkles size={12} /> Optimize with AI
                              </button>
                            </div>
                          </div>

                          {/* Action Verb Chips Bar (SRS #6) */}
                          <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap", marginBottom: "8px", padding: "4px 8px", backgroundColor: "#0b1120", borderRadius: "6px", border: "1px solid #1e293b" }}>
                            <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "700" }}>Action Verbs:</span>
                            {ACTION_VERBS.slice(0, 7).map(verb => (
                              <button
                                key={verb}
                                type="button"
                                onClick={() => insertActionVerb("experience", index, verb)}
                                style={{ backgroundColor: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)", color: "#a5b4fc", fontSize: "10px", padding: "1px 6px", borderRadius: "4px", cursor: "pointer" }}
                                title={`Insert "${verb}" into bullet`}
                              >
                                + {verb}
                              </button>
                            ))}
                          </div>

                          <textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(index, "description", e.target.value)}
                            placeholder="Describe responsibilities and accomplishments. E.g. Spearheaded development of scalable APIs..."
                            rows={3}
                          />

                          {/* Grammar Issues (SRS #14) */}
                          {grammarIssues[`experience_${index}`] && grammarIssues[`experience_${index}`].length > 0 && (
                            <div style={{ backgroundColor: "#1e1b4b", border: "1px solid #3730a3", borderRadius: "6px", padding: "8px 12px", marginTop: "8px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                                <SpellCheck size={14} style={{ color: "#a5b4fc" }} />
                                <span style={{ fontSize: "11px", fontWeight: "700", color: "#c7d2fe" }}>Grammar & Spell Suggestions ({grammarIssues[`experience_${index}`].length}):</span>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                {grammarIssues[`experience_${index}`].map((issue: any, issueIdx: number) => (
                                  <div key={issueIdx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11.5px", color: "#e0e7ff" }}>
                                    <span>{issue.message} &mdash; <em>"{issue.context}"</em></span>
                                    {issue.replacements && issue.replacements[0] && (
                                      <button
                                        type="button"
                                        onClick={() => handleApplyGrammarFix("experience", index, issue.context, issue.replacements[0])}
                                        style={{ backgroundColor: "#4338ca", color: "#ffffff", border: "none", borderRadius: "4px", padding: "2px 8px", fontSize: "10px", cursor: "pointer", fontWeight: "600" }}
                                      >
                                        Fix &rarr; "{issue.replacements[0]}"
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <button className="add-btn" onClick={addExperience}>
                      <Plus size={16} /> Add Experience
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. EDUCATION */}
            {isSectionVisible(2) && (
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
            )}

            {/* 4. PROJECTS */}
            {isSectionVisible(3) && (
              <div className={`accordion-item ${openSections.projects ? "open" : ""}`}>
                <div className="accordion-header" onClick={() => toggleSection("projects")}>
                  <span className="title"><FolderGit2 size={18} /> Projects</span>
                  {openSections.projects ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>

                {openSections.projects && (
                  <div className="accordion-body">
                    {resumeData.projects.map((proj, index) => (
                      <div
                        key={index}
                        className="array-item-card"
                        draggable
                        onDragStart={() => setDraggedProjIndex(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedProjIndex !== null && draggedProjIndex !== index) {
                            moveProject(draggedProjIndex, index);
                            setDraggedProjIndex(null);
                          }
                        }}
                      >
                        <div className="item-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span title="Drag to reorder (SRS #7)" style={{ cursor: "grab", display: "flex", alignItems: "center", color: "#64748b" }}>
                              <GripVertical size={16} />
                            </span>
                            <h4 style={{ margin: 0 }}>Project #{index + 1}</h4>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => moveProject(index, index - 1)}
                              title="Move Up (SRS #7)"
                              style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "4px", padding: "4px 6px", color: index === 0 ? "#475569" : "#cbd5e1", cursor: index === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center" }}
                            >
                              <ChevronUp size={14} />
                            </button>
                            <button
                              type="button"
                              disabled={index === resumeData.projects.length - 1}
                              onClick={() => moveProject(index, index + 1)}
                              title="Move Down (SRS #7)"
                              style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "4px", padding: "4px 6px", color: index === resumeData.projects.length - 1 ? "#475569" : "#cbd5e1", cursor: index === resumeData.projects.length - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center" }}
                            >
                              <ChevronDown size={14} />
                            </button>
                            <button className="delete-btn" onClick={() => removeProject(index)} title="Remove Project">
                              <Trash2 size={16} />
                            </button>
                          </div>
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
                          <label>Main Project Link / URL</label>
                          <input
                            type="text"
                            value={proj.link}
                            onChange={(e) => updateProject(index, "link", e.target.value)}
                            placeholder="github.com/myusername/project"
                          />
                        </div>

                        <div className="input-row">
                          <div className="form-group">
                            <label>GitHub Repository Link</label>
                            <input
                              type="text"
                              value={proj.githubLink || ""}
                              onChange={(e) => updateProject(index, "githubLink", e.target.value)}
                              placeholder="github.com/username/repo"
                            />
                          </div>
                          <div className="form-group">
                            <label>Live Demo Link</label>
                            <input
                              type="text"
                              value={proj.liveDemoLink || ""}
                              onChange={(e) => updateProject(index, "liveDemoLink", e.target.value)}
                              placeholder="myproject.demo.com"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="label-row-optimize" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "6px" }}>
                            <label style={{ margin: 0 }}>Description</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <button
                                type="button"
                                onClick={() => handleCheckGrammar("project", index)}
                                disabled={grammarChecking[`project_${index}`]}
                                style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "4px", padding: "2px 8px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}
                              >
                                <SpellCheck size={12} /> {grammarChecking[`project_${index}`] ? "Checking..." : "Check Grammar (SRS #14)"}
                              </button>
                              <button 
                                type="button" 
                                className="optimize-btn-trigger" 
                                style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(124, 58, 237, 0.1)", color: "#c084fc", border: "1px solid rgba(124, 58, 237, 0.2)", borderRadius: "4px", padding: "2px 8px", fontSize: "11px", cursor: "pointer", fontWeight: 600 }}
                                onClick={() => handleOpenOptimizer("project", index)}
                              >
                                <Sparkles size={12} /> Optimize with AI
                              </button>
                            </div>
                          </div>

                          {/* Action Verb Chips Bar (SRS #6) */}
                          <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap", marginBottom: "8px", padding: "4px 8px", backgroundColor: "#0b1120", borderRadius: "6px", border: "1px solid #1e293b" }}>
                            <span style={{ fontSize: "10.5px", color: "#64748b", fontWeight: "700" }}>Action Verbs:</span>
                            {ACTION_VERBS.slice(0, 7).map(verb => (
                              <button
                                key={verb}
                                type="button"
                                onClick={() => insertActionVerb("project", index, verb)}
                                style={{ backgroundColor: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)", color: "#a5b4fc", fontSize: "10px", padding: "1px 6px", borderRadius: "4px", cursor: "pointer" }}
                                title={`Insert "${verb}" into bullet`}
                              >
                                + {verb}
                              </button>
                            ))}
                          </div>

                          <textarea
                            value={proj.description}
                            onChange={(e) => updateProject(index, "description", e.target.value)}
                            placeholder="Outline project goal and your achievements..."
                            rows={3}
                          />

                          {/* Grammar Issues (SRS #14) */}
                          {grammarIssues[`project_${index}`] && grammarIssues[`project_${index}`].length > 0 && (
                            <div style={{ backgroundColor: "#1e1b4b", border: "1px solid #3730a3", borderRadius: "6px", padding: "8px 12px", marginTop: "8px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                                <SpellCheck size={14} style={{ color: "#a5b4fc" }} />
                                <span style={{ fontSize: "11px", fontWeight: "700", color: "#c7d2fe" }}>Grammar & Spell Suggestions ({grammarIssues[`project_${index}`].length}):</span>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                {grammarIssues[`project_${index}`].map((issue: any, issueIdx: number) => (
                                  <div key={issueIdx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11.5px", color: "#e0e7ff" }}>
                                    <span>{issue.message} &mdash; <em>"{issue.context}"</em></span>
                                    {issue.replacements && issue.replacements[0] && (
                                      <button
                                        type="button"
                                        onClick={() => handleApplyGrammarFix("project", index, issue.context, issue.replacements[0])}
                                        style={{ backgroundColor: "#4338ca", color: "#ffffff", border: "none", borderRadius: "4px", padding: "2px 8px", fontSize: "10px", cursor: "pointer", fontWeight: "600" }}
                                      >
                                        Fix &rarr; "{issue.replacements[0]}"
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <button className="add-btn" onClick={addProject}>
                      <Plus size={16} /> Add Project
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 5. SKILLS */}
            {isSectionVisible(4) && (
              <div className={`accordion-item ${openSections.skills ? "open" : ""}`}>
                <div className="accordion-header" onClick={() => toggleSection("skills")}>
                  <span className="title"><Wrench size={18} /> Technical & Soft Skills</span>
                  {openSections.skills ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>

                {openSections.skills && (
                  <div className="accordion-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div className="form-group">
                      <label>Technical Skills (Separate with commas)</label>
                      <textarea
                        name="skills"
                        value={resumeData.skills}
                        onChange={handleFieldChange}
                        placeholder="React, TypeScript, Java, SQL, Git..."
                        rows={2}
                      />
                      <small className="help-text">Standard technical skills used across all templates.</small>

                      {resumeData.skills.trim() && (
                        <div style={{ marginTop: "10px" }}>
                          <small style={{ color: "#94a3b8", display: "block", marginBottom: "6px" }}>
                            Drag chips to reorder your skills (SRS #7):
                          </small>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {resumeData.skills.split(",").map(s => s.trim()).filter(Boolean).map((skill, sIdx, sArr) => (
                              <span
                                key={sIdx}
                                draggable
                                onDragStart={() => setDraggedSkillIndex(sIdx)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => {
                                  if (draggedSkillIndex !== null && draggedSkillIndex !== sIdx) {
                                    moveSkill(draggedSkillIndex, sIdx);
                                    setDraggedSkillIndex(null);
                                  }
                                }}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  backgroundColor: "#1e1b4b",
                                  color: "#c7d2fe",
                                  border: "1px solid #4338ca",
                                  borderRadius: "9999px",
                                  padding: "3px 8px",
                                  fontSize: "12px",
                                  cursor: "grab",
                                  userSelect: "none"
                                }}
                              >
                                <GripVertical size={12} style={{ color: "#818cf8" }} />
                                <span>{skill}</span>
                                <button
                                  type="button"
                                  disabled={sIdx === 0}
                                  onClick={() => moveSkill(sIdx, sIdx - 1)}
                                  style={{ background: "none", border: "none", color: sIdx === 0 ? "#475569" : "#a5b4fc", cursor: sIdx === 0 ? "default" : "pointer", padding: "0 1px" }}
                                  title="Move left"
                                >
                                  &larr;
                                </button>
                                <button
                                  type="button"
                                  disabled={sIdx === sArr.length - 1}
                                  onClick={() => moveSkill(sIdx, sIdx + 1)}
                                  style={{ background: "none", border: "none", color: sIdx === sArr.length - 1 ? "#475569" : "#a5b4fc", cursor: sIdx === sArr.length - 1 ? "default" : "pointer", padding: "0 1px" }}
                                  title="Move right"
                                >
                                  &rarr;
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeSkillChip(sIdx)}
                                  style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", padding: "0 2px", fontWeight: "bold" }}
                                  title="Remove skill"
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Soft Skills (Separate with commas)</label>
                      <textarea
                        name="softSkills"
                        value={resumeData.softSkills || ""}
                        onChange={handleFieldChange}
                        placeholder="Leadership, System Design, Communication, Problem Solving..."
                        rows={2}
                      />
                    </div>

                    <div style={{ borderTop: "1px dashed #334155", paddingTop: "12px", marginTop: "4px" }}>
                      <h4 style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Developer Tech Stack Grouping (Template 3 Only)</h4>
                      <div className="form-group" style={{ marginBottom: "10px" }}>
                        <label>Frontend Stack</label>
                        <input
                          type="text"
                          name="techStackFront"
                          value={resumeData.techStackFront || ""}
                          onChange={handleFieldChange}
                          placeholder="React, Next.js, Redux, HTML/CSS"
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: "10px" }}>
                        <label>Backend Stack</label>
                        <input
                          type="text"
                          name="techStackBack"
                          value={resumeData.techStackBack || ""}
                          onChange={handleFieldChange}
                          placeholder="Node.js, Express, Spring Boot, Go"
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: "10px" }}>
                        <label>Database Stack</label>
                        <input
                          type="text"
                          name="techStackDatabase"
                          value={resumeData.techStackDatabase || ""}
                          onChange={handleFieldChange}
                          placeholder="PostgreSQL, MongoDB, Redis, MySQL"
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: "10px" }}>
                        <label>Tools & Platforms</label>
                        <input
                          type="text"
                          name="techStackTools"
                          value={resumeData.techStackTools || ""}
                          onChange={handleFieldChange}
                          placeholder="Docker, Kubernetes, Git, Jenkins, Webpack"
                        />
                      </div>
                      <div className="form-group">
                        <label>Cloud Services</label>
                        <input
                          type="text"
                          name="techStackCloud"
                          value={resumeData.techStackCloud || ""}
                          onChange={handleFieldChange}
                          placeholder="AWS (S3, EC2, Lambda), GCP, Azure"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. ADDITIONAL INFO */}
            {isSectionVisible(5) && (
              <div className={`accordion-item ${openSections.additional ? "open" : ""}`}>
                <div className="accordion-header" onClick={() => toggleSection("additional")}>
                  <span className="title"><Award size={18} /> Additional Information</span>
                  {openSections.additional ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>

                {openSections.additional && (
                  <div className="accordion-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div className="form-group">
                      <label>Certifications (Separate with commas)</label>
                      <textarea
                        name="certifications"
                        value={resumeData.certifications || ""}
                        onChange={handleFieldChange}
                        placeholder="AWS Certified Solutions Architect, Certified ScrumMaster..."
                        rows={2}
                      />
                    </div>

                    <div className="form-group">
                      <label>Languages (Separate with commas)</label>
                      <textarea
                        name="languages"
                        value={resumeData.languages || ""}
                        onChange={handleFieldChange}
                        placeholder="English (Native), Spanish (Fluent), Japanese (Basic)..."
                        rows={2}
                      />
                    </div>

                    <div className="form-group">
                      <label>Achievements & Highlights (Separate with commas)</label>
                      <textarea
                        name="achievements"
                        value={resumeData.achievements || ""}
                        onChange={handleFieldChange}
                        placeholder="Reduced page latency by 40%, Mentored 5 junior engineers..."
                        rows={2}
                      />
                    </div>

                    <div className="form-group">
                      <label>GitHub Contributions Summary (Template 3 Only)</label>
                      <textarea
                        name="githubContributions"
                        value={resumeData.githubContributions || ""}
                        onChange={handleFieldChange}
                        placeholder="Active open-source contributor. Maintained react-query-helper with 2k+ downloads weekly..."
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

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
              
              {/* RENDER TEMPLATE 1: PROFESSIONAL ATS-FRIENDLY */}
              {selectedTemplate === "template-1" && (
                <div className="template-1-layout">
                  <header className="t1-header">
                    <h1 className="t1-name">{resumeData.fullName || "Your Full Name"}</h1>
                    <div className="t1-title" style={{ color: "#1E3A8A" }}>{resumeData.title || "Professional Title"}</div>
                    <div className="t1-contact-row">
                      {resumeData.phone && <span>{resumeData.phone}</span>}
                      {resumeData.email && <span> | {resumeData.email}</span>}
                      {resumeData.linkedin && <span> | {resumeData.linkedin}</span>}
                      {resumeData.github && <span> | {resumeData.github}</span>}
                      {resumeData.website && <span> | {resumeData.website}</span>}
                    </div>
                  </header>

                  {resumeData.summary && (
                    <div className="t1-section">
                      <h3 className="t1-section-title" style={{ color: "#1E3A8A", borderBottom: "1.5px solid #1E3A8A" }}>Professional Summary</h3>
                      <p className="t1-text">{resumeData.summary}</p>
                    </div>
                  )}

                  {(resumeData.skills || resumeData.softSkills) && (
                    <div className="t1-section">
                      <h3 className="t1-section-title" style={{ color: "#1E3A8A", borderBottom: "1.5px solid #1E3A8A" }}>Skills</h3>
                      {resumeData.skills && (
                        <p className="t1-text">
                          <strong>Technical Skills:</strong> {resumeData.skills.split(",").map(s => s.trim()).filter(Boolean).join(", ")}
                        </p>
                      )}
                      {resumeData.softSkills && (
                        <p className="t1-text" style={{ marginTop: "4px" }}>
                          <strong>Soft Skills:</strong> {resumeData.softSkills.split(",").map(s => s.trim()).filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  )}

                  {resumeData.experiences.length > 0 && (
                    <div className="t1-section">
                      <h3 className="t1-section-title" style={{ color: "#1E3A8A", borderBottom: "1.5px solid #1E3A8A" }}>Experience</h3>
                      {resumeData.experiences.map((exp, idx) => (
                        <div key={idx} className="t1-item">
                          <div className="t1-item-header">
                            <strong>{exp.company}</strong> — <em>{exp.role}</em>
                            <span className="t1-item-date">{exp.startDate} - {exp.endDate}</span>
                          </div>
                          <div className="t1-item-sub">{exp.location}</div>
                          <ul className="t1-bullets">
                            {exp.description.split("\n").map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.projects.length > 0 && (
                    <div className="t1-section">
                      <h3 className="t1-section-title" style={{ color: "#1E3A8A", borderBottom: "1.5px solid #1E3A8A" }}>Projects</h3>
                      {resumeData.projects.map((proj, idx) => (
                        <div key={idx} className="t1-item">
                          <div className="t1-item-header">
                            <strong>{proj.name}</strong> ({proj.technologies})
                            {proj.link && <span className="t1-item-link">{proj.link}</span>}
                          </div>
                          <p className="t1-text">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.educations.length > 0 && (
                    <div className="t1-section">
                      <h3 className="t1-section-title" style={{ color: "#1E3A8A", borderBottom: "1.5px solid #1E3A8A" }}>Education</h3>
                      {resumeData.educations.map((edu, idx) => (
                        <div key={idx} className="t1-item">
                          <div className="t1-item-header">
                            <strong>{edu.school}</strong>
                            <span className="t1-item-date">{edu.gradDate}</span>
                          </div>
                          <div className="t1-item-sub">{edu.degree} in {edu.field} | {edu.location}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.certifications && (
                    <div className="t1-section">
                      <h3 className="t1-section-title" style={{ color: "#1E3A8A", borderBottom: "1.5px solid #1E3A8A" }}>Certifications</h3>
                      <p className="t1-text">{resumeData.certifications.split(",").map(c => c.trim()).filter(Boolean).join(" • ")}</p>
                    </div>
                  )}

                  {resumeData.languages && (
                    <div className="t1-section">
                      <h3 className="t1-section-title" style={{ color: "#1E3A8A", borderBottom: "1.5px solid #1E3A8A" }}>Languages</h3>
                      <p className="t1-text">{resumeData.languages.split(",").map(l => l.trim()).filter(Boolean).join(", ")}</p>
                    </div>
                  )}
                </div>
              )}

              {/* RENDER TEMPLATE 2: PREMIUM EXECUTIVE */}
              {selectedTemplate === "template-2" && (
                <div className="template-2-layout">
                  {/* Left Sidebar 30% */}
                  <div className="t2-sidebar" style={{ backgroundColor: "#0F172A" }}>
                    {resumeData.photoUrl && (
                      <div className="t2-photo-container">
                        <img src={resumeData.photoUrl} alt={resumeData.fullName} className="t2-photo" />
                      </div>
                    )}
                    
                    <div className="t2-sidebar-section">
                      <h4 className="t2-sidebar-title">Contact</h4>
                      <div className="t2-contact-item"><Mail size={12} /> <span>{resumeData.email || "email@address.com"}</span></div>
                      <div className="t2-contact-item"><Phone size={12} /> <span>{resumeData.phone || "+1 (000) 000-0000"}</span></div>
                      <div className="t2-contact-item"><MapPin size={12} /> <span>{resumeData.location || "City, State"}</span></div>
                      {resumeData.website && (
                        <div className="t2-contact-item"><Globe size={12} /> <span>{resumeData.website}</span></div>
                      )}
                      {resumeData.linkedin && (
                        <div className="t2-contact-item"><Linkedin size={12} /> <span>{resumeData.linkedin}</span></div>
                      )}
                      {resumeData.github && (
                        <div className="t2-contact-item"><Github size={12} /> <span>{resumeData.github}</span></div>
                      )}
                    </div>

                    {resumeData.skills && (
                      <div className="t2-sidebar-section">
                        <h4 className="t2-sidebar-title">Expertise</h4>
                        <div className="t2-sidebar-tags">
                          {resumeData.skills.split(",").map(s => s.trim()).filter(Boolean).map((s, idx) => (
                            <span key={idx} className="t2-sidebar-tag">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {resumeData.languages && (
                      <div className="t2-sidebar-section">
                        <h4 className="t2-sidebar-title">Languages</h4>
                        <div className="t2-sidebar-list">
                          {resumeData.languages.split(",").map(l => l.trim()).filter(Boolean).map((l, idx) => (
                            <div key={idx} className="t2-list-item">{l}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {resumeData.certifications && (
                      <div className="t2-sidebar-section">
                        <h4 className="t2-sidebar-title">Certifications</h4>
                        <div className="t2-sidebar-list">
                          {resumeData.certifications.split(",").map(c => c.trim()).filter(Boolean).map((c, idx) => (
                            <div key={idx} className="t2-list-item" style={{ fontSize: "9px", marginBottom: "6px" }}><Award size={10} style={{ marginRight: "4px", display: "inline-block", verticalAlign: "middle" }} /> {c}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Main Content 70% */}
                  <div className="t2-main">
                    <div className="t2-header">
                      <h1 className="t2-name" style={{ color: "#0F172A" }}>{resumeData.fullName || "Your Full Name"}</h1>
                      <div className="t2-job-title" style={{ color: activeColor }}>{resumeData.title || "Professional Title"}</div>
                    </div>

                    {resumeData.summary && (
                      <div className="t2-section">
                        <h3 className="t2-section-title" style={{ color: "#0F172A", borderBottomColor: "#0F172A" }}>Professional Summary</h3>
                        <p className="t2-summary-text">{resumeData.summary}</p>
                      </div>
                    )}

                    {resumeData.experiences.length > 0 && (
                      <div className="t2-section">
                        <h3 className="t2-section-title" style={{ color: "#0F172A", borderBottomColor: "#0F172A" }}>Work Experience</h3>
                        {resumeData.experiences.map((exp, idx) => (
                          <div key={idx} className="t2-exp-item">
                            <div className="t2-item-row">
                              <strong className="t2-role">{exp.role}</strong>
                              <span className="t2-date">{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="t2-item-row sub">
                              <span className="t2-company">{exp.company}</span>
                              <span className="t2-location">{exp.location}</span>
                            </div>
                            <ul className="t2-bullet-list">
                              {exp.description.split("\n").map((b, bIdx) => (
                                <li key={bIdx}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.projects.length > 0 && (
                      <div className="t2-section">
                        <h3 className="t2-section-title" style={{ color: "#0F172A", borderBottomColor: "#0F172A" }}>Key Projects</h3>
                        {resumeData.projects.map((proj, idx) => (
                          <div key={idx} className="t2-project-item">
                            <div className="t2-item-row">
                              <strong className="t2-proj-name">{proj.name}</strong>
                              <span className="t2-proj-tech" style={{ color: activeColor }}>{proj.technologies}</span>
                            </div>
                            <p className="t2-proj-desc">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.educations.length > 0 && (
                      <div className="t2-section">
                        <h3 className="t2-section-title" style={{ color: "#0F172A", borderBottomColor: "#0F172A" }}>Education</h3>
                        {resumeData.educations.map((edu, idx) => (
                          <div key={idx} className="t2-edu-item">
                            <div className="t2-item-row">
                              <strong>{edu.school}</strong>
                              <span className="t2-date">{edu.gradDate}</span>
                            </div>
                            <div className="t2-item-row sub">
                              <span>{edu.degree} {edu.field ? `in ${edu.field}` : ""}</span>
                              <span>{edu.location}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.achievements && (
                      <div className="t2-section">
                        <h3 className="t2-section-title" style={{ color: "#0F172A", borderBottomColor: "#0F172A" }}>Key Achievements</h3>
                        <ul className="t2-achievements-list">
                          {resumeData.achievements.split(",").map(s => s.trim()).filter(Boolean).map((ach, idx) => (
                            <li key={idx}>{ach}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* RENDER TEMPLATE 3: SOFTWARE ENGINEER */}
              {selectedTemplate === "template-3" && (
                <div className="template-3-layout">
                  <header className="t3-header">
                    <div className="t3-header-main">
                      <h1 className="t3-name">{resumeData.fullName || "Developer Name"}</h1>
                      <div className="t3-title" style={{ color: "#1E3A8A" }}>{resumeData.title || "Software Engineer"}</div>
                    </div>
                    <div className="t3-contact-grid">
                      {resumeData.email && <div className="t3-contact-item"><Mail size={11} /> <span>{resumeData.email}</span></div>}
                      {resumeData.phone && <div className="t3-contact-item"><Phone size={11} /> <span>{resumeData.phone}</span></div>}
                      {resumeData.location && <div className="t3-contact-item"><MapPin size={11} /> <span>{resumeData.location}</span></div>}
                      {resumeData.website && <div className="t3-contact-item"><Globe size={11} /> <span>{resumeData.website}</span></div>}
                      {resumeData.github && <div className="t3-contact-item"><Github size={11} /> <span>{resumeData.github}</span></div>}
                      {resumeData.linkedin && <div className="t3-contact-item"><Linkedin size={11} /> <span>{resumeData.linkedin}</span></div>}
                    </div>
                  </header>

                  {resumeData.summary && (
                    <div className="t3-section">
                      <h3 className="t3-section-title" style={{ color: "#1E3A8A" }}>// PROFESSIONAL SUMMARY</h3>
                      <p className="t3-summary-body">{resumeData.summary}</p>
                    </div>
                  )}

                  {/* Grouped Skills */}
                  <div className="t3-section">
                    <h3 className="t3-section-title" style={{ color: "#1E3A8A" }}>// TECHNICAL SKILLS</h3>
                    <div className="t3-skills-grouped">
                      {resumeData.techStackFront && (
                        <div className="t3-skill-group-row">
                          <span className="t3-group-name">Frontend:</span>
                          <span className="t3-group-values">{resumeData.techStackFront}</span>
                        </div>
                      )}
                      {resumeData.techStackBack && (
                        <div className="t3-skill-group-row">
                          <span className="t3-group-name">Backend:</span>
                          <span className="t3-group-values">{resumeData.techStackBack}</span>
                        </div>
                      )}
                      {resumeData.techStackDatabase && (
                        <div className="t3-skill-group-row">
                          <span className="t3-group-name">Database:</span>
                          <span className="t3-group-values">{resumeData.techStackDatabase}</span>
                        </div>
                      )}
                      {resumeData.techStackTools && (
                        <div className="t3-skill-group-row">
                          <span className="t3-group-name">Tools/Platforms:</span>
                          <span className="t3-group-values">{resumeData.techStackTools}</span>
                        </div>
                      )}
                      {resumeData.techStackCloud && (
                        <div className="t3-skill-group-row">
                          <span className="t3-group-name">Cloud:</span>
                          <span className="t3-group-values">{resumeData.techStackCloud}</span>
                        </div>
                      )}
                      {/* Fallback to standard skills if groups are empty */}
                      {!resumeData.techStackFront && !resumeData.techStackBack && resumeData.skills && (
                        <div className="t3-skill-group-row">
                          <span className="t3-group-name">Technologies:</span>
                          <span className="t3-group-values">{resumeData.skills}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {resumeData.experiences.length > 0 && (
                    <div className="t3-section">
                      <h3 className="t3-section-title" style={{ color: "#1E3A8A" }}>// WORK EXPERIENCE</h3>
                      {resumeData.experiences.map((exp, idx) => (
                        <div key={idx} className="t3-exp-item">
                          <div className="t3-item-header">
                            <span className="t3-role">{exp.role} @ <strong>{exp.company}</strong></span>
                            <span className="t3-date">[{exp.startDate} - {exp.endDate}]</span>
                          </div>
                          <div className="t3-item-sub">{exp.location}</div>
                          <ul className="t3-bullets">
                            {exp.description.split("\n").map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.projects.length > 0 && (
                    <div className="t3-section">
                      <h3 className="t3-section-title" style={{ color: "#1E3A8A" }}>// PROJECTS</h3>
                      {resumeData.projects.map((proj, idx) => (
                        <div key={idx} className="t3-proj-item">
                          <div className="t3-proj-header">
                            <strong className="t3-proj-name">{proj.name}</strong>
                            <span className="t3-proj-tech">[{proj.technologies}]</span>
                          </div>
                          <p className="t3-proj-desc">{proj.description}</p>
                          <div className="t3-proj-links">
                            {proj.githubLink && (
                              <span className="t3-proj-link">
                                <Github size={10} style={{ display: "inline-block", marginRight: "3px" }} />
                                GitHub: <a href={`https://${proj.githubLink}`} target="_blank" rel="noopener noreferrer">{proj.githubLink}</a>
                              </span>
                            )}
                            {proj.liveDemoLink && (
                              <span className="t3-proj-link" style={{ marginLeft: "12px" }}>
                                <ExternalLink size={10} style={{ display: "inline-block", marginRight: "3px" }} />
                                Demo: <a href={`https://${proj.liveDemoLink}`} target="_blank" rel="noopener noreferrer">{proj.liveDemoLink}</a>
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {resumeData.githubContributions && (
                    <div className="t3-section">
                      <h3 className="t3-section-title" style={{ color: "#1E3A8A" }}>// OPEN SOURCE & GITHUB</h3>
                      <p className="t3-contributions-text">{resumeData.githubContributions}</p>
                    </div>
                  )}

                  {resumeData.certifications && (
                    <div className="t3-section">
                      <h3 className="t3-section-title" style={{ color: "#1E3A8A" }}>// CERTIFICATIONS</h3>
                      <div className="t3-certs-grid">
                        {resumeData.certifications.split(",").map((c, idx) => (
                          <div key={idx} className="t3-cert-item">&gt; {c.trim()}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resumeData.educations.length > 0 && (
                    <div className="t3-section">
                      <h3 className="t3-section-title" style={{ color: "#1E3A8A" }}>// EDUCATION</h3>
                      {resumeData.educations.map((edu, idx) => (
                        <div key={idx} className="t3-edu-item">
                          <div className="t3-item-header">
                            <span><strong>{edu.school}</strong> — {edu.degree} in {edu.field}</span>
                            <span className="t3-date">Class of {edu.gradDate.split("-")[0] || edu.gradDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* RENDER TEMPLATE 4: MODERN CREATIVE */}
              {selectedTemplate === "template-4" && (
                <div className="template-4-layout">
                  {/* Decorative Gradient Bar */}
                  <div className="t4-gradient-header-bar"></div>

                  <header className="t4-header">
                    <div className="t4-header-left">
                      {resumeData.photoUrl && (
                        <div className="t4-photo-container">
                          <img src={resumeData.photoUrl} alt={resumeData.fullName} className="t4-photo" />
                        </div>
                      )}
                      <div className="t4-header-text">
                        <h1 className="t4-name">{resumeData.fullName || "Creative Name"}</h1>
                        <div className="t4-title-gradient">{resumeData.title || "UX Architect / Engineer"}</div>
                      </div>
                    </div>
                    
                    <div className="t4-contact-card">
                      {resumeData.email && <div className="t4-contact-item"><Mail size={12} /> <span>{resumeData.email}</span></div>}
                      {resumeData.phone && <div className="t4-contact-item"><Phone size={12} /> <span>{resumeData.phone}</span></div>}
                      {resumeData.location && <div className="t4-contact-item"><MapPin size={12} /> <span>{resumeData.location}</span></div>}
                      
                      <div className="t4-portfolio-links">
                        {resumeData.website && (
                          <a href={`https://${resumeData.website}`} target="_blank" rel="noopener noreferrer" className="t4-link-btn">
                            <Globe size={11} /> Portfolio
                          </a>
                        )}
                        {resumeData.linkedin && (
                          <a href={`https://${resumeData.linkedin}`} target="_blank" rel="noopener noreferrer" className="t4-link-btn">
                            <Linkedin size={11} /> LinkedIn
                          </a>
                        )}
                        {resumeData.github && (
                          <a href={`https://${resumeData.github}`} target="_blank" rel="noopener noreferrer" className="t4-link-btn">
                            <Github size={11} /> GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </header>

                  {resumeData.summary && (
                    <div className="t4-card t4-section">
                      <h3 className="t4-section-title">About Me</h3>
                      <p className="t4-summary-body">{resumeData.summary}</p>
                    </div>
                  )}

                  {resumeData.skills && (
                    <div className="t4-card t4-section">
                      <h3 className="t4-section-title">Skills & Toolkit</h3>
                      <div className="t4-skills-tags">
                        {resumeData.skills.split(",").map(s => s.trim()).filter(Boolean).map((s, idx) => (
                          <span key={idx} className="t4-skill-tag">{s}</span>
                        ))}
                        {resumeData.softSkills && resumeData.softSkills.split(",").map(s => s.trim()).filter(Boolean).map((s, idx) => (
                          <span key={idx} className="t4-skill-tag soft">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {resumeData.experiences.length > 0 && (
                    <div className="t4-card t4-section">
                      <h3 className="t4-section-title">Experience Timeline</h3>
                      <div className="t4-timeline">
                        {resumeData.experiences.map((exp, idx) => (
                          <div key={idx} className="t4-timeline-item">
                            <div className="t4-timeline-dot"></div>
                            <div className="t4-timeline-content">
                              <div className="t4-timeline-header">
                                <strong className="t4-role">{exp.role}</strong>
                                <span className="t4-date">{exp.startDate} - {exp.endDate}</span>
                              </div>
                              <div className="t4-timeline-sub">
                                <span className="t4-company">{exp.company}</span>
                                <span className="t4-loc"> • {exp.location}</span>
                              </div>
                              <ul className="t4-bullets">
                                {exp.description.split("\n").map((b, bIdx) => (
                                  <li key={bIdx}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {resumeData.projects.length > 0 && (
                    <div className="t4-card t4-section">
                      <h3 className="t4-section-title">Featured Projects</h3>
                      <div className="t4-projects-grid">
                        {resumeData.projects.map((proj, idx) => (
                          <div key={idx} className="t4-project-card">
                            <div className="t4-project-header">
                              <strong className="t4-proj-name">{proj.name}</strong>
                              <span className="t4-proj-tech">{proj.technologies}</span>
                            </div>
                            <p className="t4-proj-desc">{proj.description}</p>
                            {proj.link && (
                              <a href={`https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="t4-proj-link">
                                <ExternalLink size={10} /> View Project Link
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="t4-two-col-grid">
                    {resumeData.educations.length > 0 && (
                      <div className="t4-card t4-section">
                        <h3 className="t4-section-title">Education</h3>
                        {resumeData.educations.map((edu, idx) => (
                          <div key={idx} className="t4-edu-item">
                            <strong>{edu.degree} in {edu.field}</strong>
                            <div className="t4-edu-school">{edu.school}</div>
                            <div className="t4-edu-meta">{edu.gradDate} | {edu.location}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.certifications && (
                      <div className="t4-card t4-section">
                        <h3 className="t4-section-title">Certificates</h3>
                        <ul className="t4-cert-list">
                          {resumeData.certifications.split(",").map((c, idx) => (
                            <li key={idx}>{c.trim()}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
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

      {/* Template Carousel Modal (SRS #3) */}
      {showTemplateSelector && (
        <div className="template-selector-overlay">
          <div className="template-selector-container carousel-container">
            <div className="template-selector-header">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    Template Selector Carousel
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Slide between professional, ATS-optimized resume templates
                  </p>
                </div>
                <button
                  type="button"
                  className="close-modal-btn"
                  onClick={() => setShowTemplateSelector(false)}
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Carousel Interactive View */}
            <div className="carousel-slide-wrapper" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "20px 0" }}>
              <button
                type="button"
                onClick={() => setCarouselIndex(prev => (prev === 0 ? TEMPLATES_LIST.length - 1 : prev - 1))}
                className="carousel-arrow-btn"
                style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", cursor: "pointer" }}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="carousel-active-card" style={{ flex: 1, backgroundColor: "#0f172a", border: selectedTemplate === TEMPLATES_LIST[carouselIndex].id ? "2px solid #6366f1" : "1px solid #1e293b", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
                <span className="template-tag" style={{ backgroundColor: "rgba(99, 102, 241, 0.15)", color: "#818cf8", fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "12px", textTransform: "uppercase" }}>
                  {TEMPLATES_LIST[carouselIndex].badge}
                </span>
                <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "700", marginTop: "12px", marginBottom: "6px" }}>
                  {TEMPLATES_LIST[carouselIndex].title}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "13px", maxWidth: "420px", margin: "0 auto 16px auto", lineHeight: "1.5" }}>
                  {TEMPLATES_LIST[carouselIndex].desc}
                </p>

                <div className={`template-preview-mock ${TEMPLATES_LIST[carouselIndex].previewClass}`} style={{ margin: "0 auto 20px auto", maxWidth: "260px", height: "140px" }}>
                  <div className="mock-header"></div>
                  <div className="mock-body-line"></div>
                  <div className="mock-body-line short"></div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(TEMPLATES_LIST[carouselIndex].id);
                    setShowTemplateSelector(false);
                  }}
                  className="select-template-confirm-btn"
                  style={{ backgroundColor: selectedTemplate === TEMPLATES_LIST[carouselIndex].id ? "#10b981" : "#4f46e5", color: "#ffffff", border: "none", padding: "10px 24px", borderRadius: "10px", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
                >
                  {selectedTemplate === TEMPLATES_LIST[carouselIndex].id ? "✓ Currently Selected" : "Apply This Template"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setCarouselIndex(prev => (prev === TEMPLATES_LIST.length - 1 ? 0 : prev + 1))}
                className="carousel-arrow-btn"
                style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", cursor: "pointer" }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Slide Dots Indicator */}
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", paddingBottom: "10px" }}>
              {TEMPLATES_LIST.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setCarouselIndex(idx)}
                  style={{
                    width: carouselIndex === idx ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    backgroundColor: carouselIndex === idx ? "#6366f1" : "#334155",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cover Letter Generator Modal (SRS #19) */}
      {coverLetterModalOpen && (
        <div className="ai-modal-overlay">
          <div className="ai-modal-container" style={{ maxWidth: "640px" }}>
            <div className="ai-modal-header">
              <div className="header-title">
                <FileText size={18} className="sparkle-icon" />
                <span>AI Cover Letter Generator (SRS #19)</span>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setCoverLetterModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className="ai-modal-body" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="input-group">
                <label>Target Company Name *</label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. Google, Netflix, Stripe..."
                  style={{ width: "100%", padding: "10px 14px", backgroundColor: "#0b1120", border: "1px solid #1e293b", borderRadius: "8px", color: "#ffffff", fontSize: "13px" }}
                />
              </div>

              <div className="input-group">
                <label>Target Role (Defaults to resume title)</label>
                <input
                  type="text"
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  placeholder={resumeData.title || "Full Stack Engineer"}
                  style={{ width: "100%", padding: "10px 14px", backgroundColor: "#0b1120", border: "1px solid #1e293b", borderRadius: "8px", color: "#ffffff", fontSize: "13px" }}
                />
              </div>

              {!generatedCoverLetter && (
                <button
                  type="button"
                  onClick={handleGenerateCoverLetter}
                  disabled={coverLetterLoading || !targetCompany.trim()}
                  className="optimize-action-btn"
                  style={{ backgroundColor: "#4f46e5", color: "#ffffff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "600", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <Sparkles size={16} /> {coverLetterLoading ? "Generating Tailored Draft..." : "Generate Cover Letter"}
                </button>
              )}

              {generatedCoverLetter && (
                <div className="space-y-4">
                  <div className="input-group">
                    <label>Generated Cover Letter Draft</label>
                    <textarea
                      value={generatedCoverLetter}
                      onChange={(e) => setGeneratedCoverLetter(e.target.value)}
                      rows={12}
                      style={{ width: "100%", padding: "14px", backgroundColor: "#0b1120", border: "1px solid #1e293b", borderRadius: "10px", color: "#e2e8f0", fontSize: "13px", lineHeight: "1.6", fontFamily: "inherit" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(generatedCoverLetter);
                        setCopiedCoverLetter(true);
                        setTimeout(() => setCopiedCoverLetter(false), 2500);
                      }}
                      style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#1e293b", border: "1px solid #334155", color: "#e2e8f0", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}
                    >
                      {copiedCoverLetter ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      {copiedCoverLetter ? "Copied to Clipboard!" : "Copy Letter"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([generatedCoverLetter], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `Cover_Letter_${targetCompany}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#4f46e5", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                    >
                      <Download size={14} /> Download .txt
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shareable Link & Tracking Modal (SRS #20, #21) */}
      {shareModalOpen && (
        <div className="ai-modal-overlay">
          <div className="ai-modal-container" style={{ maxWidth: "540px" }}>
            <div className="ai-modal-header">
              <div className="header-title">
                <Share2 size={18} className="sparkle-icon" />
                <span>Shareable Web Link & Tracking (SRS #20, #21)</span>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShareModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className="ai-modal-body" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                Your resume is now publicly accessible via this secure read-only URL. You can paste it into your LinkedIn profile, GitHub readme, or job applications.
              </p>

              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/public/resume/${shareToken || ""}`}
                  style={{ flex: 1, padding: "10px 14px", backgroundColor: "#0b1120", border: "1px solid #1e293b", borderRadius: "8px", color: "#818cf8", fontSize: "12px", fontFamily: "monospace" }}
                />
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(`${window.location.origin}/public/resume/${shareToken}`);
                    setCopiedShareLink(true);
                    setTimeout(() => setCopiedShareLink(false), 2500);
                  }}
                  style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#4f46e5", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                >
                  {copiedShareLink ? <Check size={14} /> : <Copy size={14} />}
                  {copiedShareLink ? "Copied!" : "Copy"}
                </button>
              </div>

              <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "10px", padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>Telemetry Tracking</span>
                  <p style={{ margin: "2px 0 0 0", color: "#ffffff", fontSize: "13px", fontWeight: 600 }}>Active link visits & PDF downloads are tracked live</p>
                </div>
                <a
                  href={`/public/resume/${shareToken}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#818cf8", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none", fontWeight: 600 }}
                >
                  Preview Page &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildResume;
