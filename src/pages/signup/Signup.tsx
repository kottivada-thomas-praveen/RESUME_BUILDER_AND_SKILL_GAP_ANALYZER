

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../api/Api";
import "./Signup.css";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await Api.post("/api/auth/signup", { name, email, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.name || name);
        localStorage.setItem("email", response.data.email || email);
        localStorage.setItem("role", response.data.role || "USER");
      }
      
      setLoading(false);
      alert("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      const msg = error.response?.data?.message || "Registration failed. Please try again.";
      setErrorMsg(msg);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* LEFT SIDE */}
        <div className="signup-left">
          {/* LOGO */}
          <div className="logo">
            <div className="logo-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Sparkles size={22} />
            </div>
            <h2>Careercraft <span style={{ color: "#5d3df5" }}></span></h2>
          </div>

          {/* HEADING */}
          <div className="signup-content">
            <h1>
              Create your <span>account</span>
            </h1>

            <p>
              Join Careercraft and explore a world of possibilities to grow your
              career.
            </p>

            {/* SOCIAL BUTTONS */}
            <div className="social-buttons">
              <button type="button" className="social-btn" aria-label="Sign up with Google">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                  alt="google"
                />
              </button>

              <button type="button" className="social-btn" aria-label="Sign up with GitHub">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                  alt="github"
                />
              </button>
            </div>

            {/* DIVIDER */}
            <div className="divider">
              <span></span>
              <p>or</p>
              <span></span>
            </div>

            {errorMsg && (
              <div className="error-message" style={{ color: "#ef4444", marginBottom: "15px", fontSize: "14px", fontWeight: "500", textAlign: "center" }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <User size={20} />
                <input 
                  type="text" 
                  placeholder="Full name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>

              <div className="input-box">
                <Mail size={20} />
                <input 
                  type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="input-box">
                <Lock size={20} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsTypingPassword(true)}
                  onBlur={() => setIsTypingPassword(false)}
                  required
                />

                <div
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>

              {/* PASSWORD RULES */}
              {(isTypingPassword || password.length > 0) && (
                <div className="password-rules" style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  marginTop: "8px",
                  fontSize: "12px",
                  color: "#64748b",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", color: password.length >= 8 ? "#22c55e" : "#94a3b8", transition: "color 0.2s" }}>
                    {password.length >= 8 ? "✔" : "○"} 8+ chars
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", color: /\d/.test(password) ? "#22c55e" : "#94a3b8", transition: "color 0.2s" }}>
                    {/\d/.test(password) ? "✔" : "○"} Number
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", color: /[A-Z]/.test(password) ? "#22c55e" : "#94a3b8", transition: "color 0.2s" }}>
                    {/[A-Z]/.test(password) ? "✔" : "○"} Uppercase
                  </span>
                </div>
              )}

              {/* BUTTON */}
              <button type="submit" className="create-btn" disabled={loading}>
                {loading ? (
                  <div className="loader-wrapper">
                    <div className="loader"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            {/* SIGN IN */}
            <div className="signin-text">
              Already have an account? <span style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>Sign in</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="signup-right">
          <div className="right-content">
            <h2>
              Your journey to <br />
              learn, build and <br />
              grow <span>starts here.</span>
            </h2>

            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/programmer-working-on-laptop-3305669-2757111.png"
              alt="illustration"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;