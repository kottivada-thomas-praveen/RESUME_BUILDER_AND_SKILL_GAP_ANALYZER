import "./Herosection.css";
import { FileText, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Herosection() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="main-heading">
        <h1>
          Build Smarter Resumes.<br />
          Discover Missing Skills.<br />
          Get <span className="Career">Career Ready.</span>
        </h1>
        <p className="hero-subtitle">
          Create professional, ATS-friendly resumes in minutes and analyze your skill gaps with AI-powered insights tailored to your dream job.
        </p>
        <div className="hero-buttons">
          <button className="resume-btn" onClick={() => navigate("/build-resume")}>
            Build My Resume <FileText size={18} />
          </button>
          <button className="analyze-btn" onClick={() => navigate("/analyze-resume")}>
            Analyze My Resume <Sparkles size={18} />
          </button>
        </div>
      </div>
      <div className="hero-img">
        <img src="src/assets/Resume-amico.svg" alt="Career growth illustration" className="home-img" />
      </div>
    </section>
  );
}

export default Herosection;
