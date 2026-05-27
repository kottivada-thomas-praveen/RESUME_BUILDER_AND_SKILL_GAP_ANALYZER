

import React, { useState, useEffect } from "react";
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
  X,
} from "lucide-react";

const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  // Advanced features states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [showMockOAuthModal, setShowMockOAuthModal] = useState(false);
  const [mockOAuthProvider, setMockOAuthProvider] = useState("");

  const isGoogleConfigured = !!import.meta.env.VITE_GOOGLE_CLIENT_ID && 
    !import.meta.env.VITE_GOOGLE_CLIENT_ID.includes("your_google_client_id_here");

  const isGithubConfigured = !!import.meta.env.VITE_GITHUB_CLIENT_ID && 
    !import.meta.env.VITE_GITHUB_CLIENT_ID.includes("your_github_client_id_here");

  // Timer for automatic redirection upon success
  useEffect(() => {
    let interval: any = null;
    if (showSuccessModal) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showSuccessModal, navigate]);

  useEffect(() => {
    // Check for GitHub OAuth Callback Code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const githubCode = urlParams.get("code");

    if (githubCode) {
      const handleGithubCallback = async () => {
        setLoading(true);
        setErrorMsg("");
        try {
          const response = await Api.post("/api/auth/github-login", { code: githubCode });
          if (response.data && response.data.data && response.data.data.token) {
            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem("name", response.data.data.name || "");
            localStorage.setItem("email", response.data.data.email || "");
            localStorage.setItem("role", response.data.data.role || "USER");
          }
          setLoading(false);
          // Remove query params from URL
          window.history.replaceState({}, document.title, window.location.pathname);
          // Instead of immediate redirect, show our success modal!
          setShowSuccessModal(true);
        } catch (err: any) {
          setLoading(false);
          console.error("GitHub Login Error:", err);
          setErrorMsg(err.response?.data?.message || "GitHub authentication failed. Please try again.");
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      };
      handleGithubCallback();
    }

    // Load Google Sign-In SDK
    const loadGoogleSdk = () => {
      if (!isGoogleConfigured) return;
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if ((window as any).google) {
          (window as any).google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleLoginResponse,
          });

          // Render the Google Button
          const btnElem = document.getElementById("google-signup-btn");
          if (btnElem) {
            (window as any).google.accounts.id.renderButton(btnElem, {
              type: "standard",
              theme: "filled_blue",
              size: "large",
              text: "signup_with",
              shape: "rectangular",
              width: "280"
            });
          }
        }
      };
      document.body.appendChild(script);
    };

    loadGoogleSdk();
  }, [navigate]);

  const handleGoogleLoginResponse = async (googleResponse: any) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const idToken = googleResponse.credential;
      const decoded = decodeJwt(idToken);
      
      const email = decoded?.email || "";
      const name = decoded?.name || "Google User";

      const response = await Api.post("/api/auth/google-login", {
        idToken: idToken,
        email: email,
        name: name
      });

      if (response.data && response.data.data && response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("name", response.data.data.name || name);
        localStorage.setItem("email", response.data.data.email || email);
        localStorage.setItem("role", response.data.data.role || "USER");
      }

      setLoading(false);
      setShowSuccessModal(true);
    } catch (err: any) {
      setLoading(false);
      console.error("Google Login Error:", err);
      setErrorMsg(err.response?.data?.message || "Google authentication failed. Please try again.");
    }
  };

  const handleGithubLoginClick = () => {
    if (isGithubConfigured) {
      const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI || "http://localhost:5173/login";
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user%20user:email`;
    } else {
      handleMockOAuthClick("GitHub");
    }
  };

  const handleMockOAuthClick = (provider: string) => {
    setMockOAuthProvider(provider);
    setShowMockOAuthModal(true);
  };

  const handleMockOAuthSubmit = async () => {
    setLoading(true);
    setShowMockOAuthModal(false);
    setErrorMsg("");
    try {
      const response = await Api.post("/api/auth/google-login", {
        idToken: `mock-${mockOAuthProvider.toLowerCase()}-id-token-123456`,
        email: `${mockOAuthProvider.toLowerCase()}_demo@careercraft.com`,
        name: `${mockOAuthProvider} Demo User`
      });

      if (response.data && response.data.data && response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("name", response.data.data.name || `${mockOAuthProvider} Demo User`);
        localStorage.setItem("email", response.data.data.email || `${mockOAuthProvider.toLowerCase()}_demo@careercraft.com`);
        localStorage.setItem("role", response.data.data.role || "USER");
      }

      setLoading(false);
      setShowSuccessModal(true);
    } catch (err: any) {
      setLoading(false);
      console.error("Mock Login Error:", err);
      setErrorMsg(err.response?.data?.message || "Mock authentication failed. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await Api.post("/api/auth/signup", { name, email, password });
      
      if (response.data && response.data.data && response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("name", response.data.data.name || name);
        localStorage.setItem("email", response.data.data.email || email);
        localStorage.setItem("role", response.data.data.role || "USER");
      } else if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.name || name);
        localStorage.setItem("email", response.data.email || email);
        localStorage.setItem("role", response.data.role || "USER");
      }
      
      setLoading(false);
      setShowSuccessModal(true);
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
            <div className="social-buttons" style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", alignItems: "center", marginTop: "15px", marginBottom: "15px" }}>
              {isGoogleConfigured ? (
                <div id="google-signup-btn" style={{ height: "40px" }}></div>
              ) : (
                <button 
                  type="button" 
                  aria-label="Sign up with Google (Demo Mode)" 
                  onClick={() => handleMockOAuthClick("Google")}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    width: "280px", 
                    height: "40px", 
                    border: "1px solid #dadce0", 
                    borderRadius: "4px", 
                    background: "white", 
                    cursor: "pointer", 
                    padding: "0 12px",
                    transition: "background-color 0.2s, border-color 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                    e.currentTarget.style.borderColor = "#ccc";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.borderColor = "#dadce0";
                  }}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                    alt="google"
                    style={{ width: "18px", height: "18px", marginRight: "10px" }}
                  />
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "#3c4043", fontFamily: "Roboto, arial, sans-serif" }}>
                    Sign up with Google
                  </span>
                </button>
              )}
              
              <button 
                type="button" 
                aria-label={isGithubConfigured ? "Sign up with GitHub" : "Sign up with GitHub (Demo Mode)"}
                onClick={handleGithubLoginClick}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  width: "280px", 
                  height: "40px", 
                  border: "1px solid #dadce0", 
                  borderRadius: "4px", 
                  background: "white", 
                  cursor: "pointer", 
                  padding: "0 12px",
                  transition: "background-color 0.2s, border-color 0.2s"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                  e.currentTarget.style.borderColor = "#ccc";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.borderColor = "#dadce0";
                }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                  alt="github"
                  style={{ width: "18px", height: "18px", marginRight: "10px" }}
                />
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#3c4043", fontFamily: "Roboto, arial, sans-serif" }}>
                  Sign up with GitHub
                </span>
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

      {/* 1. SUCCESS REDIRECTION MODAL */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal-content">
            <div className="success-checkmark-wrapper">
              <div className="success-checkmark-circle">
                <Sparkles size={32} className="success-sparkle-icon" />
              </div>
            </div>
            <h2>Account Created!</h2>
            <p>Welcome to Careercraft AI. Your professional profile has been initialized successfully.</p>
            <div className="redirect-loader-container">
              <div className="redirect-loader-bar" style={{ animationDuration: '4s' }}></div>
            </div>
            <p className="redirect-timer">
              Redirecting to dashboard in <span>{countdown}</span> seconds...
            </p>
            <button className="dashboard-direct-btn" onClick={() => navigate("/")}>
              Go to Dashboard Now
            </button>
          </div>
        </div>
      )}

      {/* 2. MOCK OAUTH POPUP MODAL */}
      {showMockOAuthModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{mockOAuthProvider} Authentication</h2>
              <button className="close-modal-btn" onClick={() => setShowMockOAuthModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <img 
                  src={mockOAuthProvider === "Google" ? "https://cdn-icons-png.flaticon.com/512/300/300221.png" : "https://cdn-icons-png.flaticon.com/512/25/25231.png"} 
                  alt={mockOAuthProvider} 
                  style={{ width: '48px', height: '48px' }}
                />
              </div>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
                Google & GitHub OAuth are fully integrated! To use your own live client keys, configure your `.env` variables.
              </p>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', margin: '15px 0', border: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b', textAlign: 'left' }}>
                <strong>Simulated OAuth Profile:</strong><br />
                📧 {mockOAuthProvider.toLowerCase()}_demo@careercraft.com<br />
                👤 {mockOAuthProvider} Demo User
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                type="button" 
                className="modal-cancel-btn" 
                onClick={() => setShowMockOAuthModal(false)}
                style={{ flex: 1, padding: '12px', fontSize: '14px', borderRadius: '10px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="create-btn" 
                onClick={handleMockOAuthSubmit}
                style={{ flex: 1, padding: '12px', fontSize: '14px', borderRadius: '10px', marginTop: 0, cursor: 'pointer' }}
              >
                Simulate 1-Click Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;