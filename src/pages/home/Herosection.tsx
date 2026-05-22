import "./Herosection.css";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Herosection() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="main-heading">
        <h1>Build Smarter Resumes.</h1>
        <h1>Discover Missing Skills.</h1>
        <h1>
          Get <span className="Career">Career Ready.</span>
        </h1>
        <br />
        <div className="matter">
          <h6>
            Create professional ATS-friendly resumes in minutes and <br />{" "}
            analyze your skill gaps with AI-powered insights tailored <br /> to
            your dream job.
          </h6>
        </div>
        <button className="resume-btn" onClick={() => navigate("/build-resume")}>
          BUILD MY RESUME <FileText/>
        </button>
        <button className="analyze-btn" onClick={() => navigate("/analyze-resume")}>
          ANALYZE My Resume 
        </button>
      </div>
      <div className="hero-img">
        <img src="src\assets\Resume-amico.svg" alt="" className="home-img" />
      </div>
    </section>
  );
}

export default Herosection;
