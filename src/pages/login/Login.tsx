import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../api/Api";
import "./Login.css";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  User,
  Sparkles,
  X,
  Key,
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

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1 = Enter Email, 2 = Enter Token & Reset
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

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
          navigate("/");
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
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if ((window as any).google) {
          (window as any).google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "your_google_client_id.apps.googleusercontent.com",
            callback: handleGoogleLoginResponse,
          });

          // Render the Google Button
          const btnElem = document.getElementById("google-signin-btn");
          if (btnElem) {
            (window as any).google.accounts.id.renderButton(btnElem, {
              type: "standard",
              theme: "filled_blue",
              size: "large",
              text: "continue_with",
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
      navigate("/");
    } catch (err: any) {
      setLoading(false);
      console.error("Google Login Error:", err);
      setErrorMsg(err.response?.data?.message || "Google authentication failed. Please try again.");
    }
  };

  const handleGithubLoginClick = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || "your_github_client_id_here";
    const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI || "http://localhost:5173/login";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user%20user:email`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await Api.post("/api/auth/login", { email, password });
      
      if (response.data && response.data.data && response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("name", response.data.data.name || "");
        localStorage.setItem("email", response.data.data.email || email);
        localStorage.setItem("role", response.data.data.role || "USER");
      } else if (response.data && response.data.token) {
        // Fallback for simple direct wrapper response
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.name || "");
        localStorage.setItem("email", response.data.email || email);
        localStorage.setItem("role", response.data.role || "USER");
      }
      
      setLoading(false);
      navigate("/");
    } catch (error: any) {
      setLoading(false);
      console.error(error);
      const msg = error.response?.data?.message || "Invalid email or password. Please try again.";
      setErrorMsg(msg);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setForgotSuccess("");

    if (forgotStep === 1) {
      try {
        await Api.post("/api/auth/forgot-password", { email: forgotEmail });
        setForgotLoading(false);
        setForgotSuccess("We found the account! A secure OTP reset token has been generated.");
        // Transition to Step 2
        setForgotStep(2);
      } catch (error: any) {
        setForgotLoading(false);
        const msg = error.response?.data?.message || "User not found with this email address.";
        setForgotError(msg);
      }
    } else {
      try {
        await Api.post("/api/auth/reset-password", { token: otp, newPassword: newPassword });
        setForgotLoading(false);
        setForgotSuccess("Password updated successfully! You can now log in.");
        // Short delay, then close modal
        setTimeout(() => {
          setShowForgotModal(false);
        }, 1500);
      } catch (error: any) {
        setForgotLoading(false);
        const msg = error.response?.data?.message || "Invalid or expired OTP reset token.";
        setForgotError(msg);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* LEFT SIDE */}
        <div className="left-section">

          <div className="brand">
            <div className="brand-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Sparkles size={22} />
            </div>
            <h2>Careercraft <span style={{ color: "#2563eb" }}>AI</span></h2>
          </div>

          <div className="left-content">
            <h1>Welcome Back!</h1>

            <p>
              Sign in to continue to your account
              and explore more.
            </p>
          </div>

          <div className="illustration-wrapper">

            <div className="card-icon">
              <User size={22} />
            </div>

            <div className="shield-icon">
              <Lock size={30} />
            </div>

            <img
              src="src\assets\undraw_remote-worker_0l91.svg"
              alt="illustration"
              className="illustration"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-section">

          <div className="top-text">
            <p>
              Don’t have an account?
              <span style={{ cursor: "pointer" }} onClick={() => navigate("/signup")}> Sign up</span>
            </p>
          </div>

          <div className="form-section">

            <h1>Login</h1>

            <p className="subtitle">
              Welcome back! Please enter your details.
            </p>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              {errorMsg && (
                <div className="error-message" style={{ color: "#ef4444", marginBottom: "15px", fontSize: "14px", fontWeight: "500", textAlign: "center" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* EMAIL */}
              <div className="input-group">
                <label>Email</label>

                <div className="input-box">
                  <Mail size={20} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="input-group">
                <label>Password</label>

                <div className="input-box">
                  <Lock size={20} />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsTypingPassword(true)}
                    onBlur={() => setIsTypingPassword(false)}
                    required
                  />

                  <div 
                    className="eye-icon" 
                    onClick={() => setShowPassword(!showPassword)} 
                    style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
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
              </div>

              <p className="forgot-password" onClick={() => {
                setShowForgotModal(true);
                setForgotStep(1);
                setForgotEmail("");
                setOtp("");
                setNewPassword("");
                setForgotError("");
                setForgotSuccess("");
              }}>
                Forgot password?
              </p>

              {/* BUTTON */}
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    Logging in...
                  </span>
                ) : (
                  <>
                    <LogIn size={20} />
                    Login
                  </>
                )}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="divider">
              <span></span>
              <p>or continue with</p>
              <span></span>
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="social-buttons" style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", alignItems: "center", marginTop: "15px" }}>
              <div id="google-signin-btn" style={{ height: "40px" }}></div>
              
              <button 
                type="button" 
                aria-label="Sign in with GitHub" 
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
                  Continue with GitHub
                </span>
              </button>
            </div>

            <div className="safe-text">
              <Lock size={16} />
              <p>Your data is safe with us.</p>
            </div>

          </div>
        </div>
      </div>

      {/* DYNAMIC FORGOT PASSWORD MODAL OVERLAY */}
      {showForgotModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            <div className="modal-header">
              <h2>Reset Password</h2>
              <button className="close-modal-btn" onClick={() => setShowForgotModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleForgotSubmit}>
              <div className="modal-body">
                
                {forgotError && (
                  <div className="error-message" style={{ color: "#ef4444", marginBottom: "15px", fontSize: "13px", fontWeight: "500" }}>
                    ⚠️ {forgotError}
                  </div>
                )}
                {forgotSuccess && (
                  <div className="success-message" style={{ color: "#22c55e", marginBottom: "15px", fontSize: "13px", fontWeight: "500" }}>
                    ✔ {forgotSuccess}
                  </div>
                )}

                {forgotStep === 1 ? (
                  <>
                    <p>Enter the email address associated with your account to verify your profile and send a secure OTP reset token.</p>
                    
                    <div className="input-group">
                      <label>Account Email</label>
                      <div className="input-box">
                        <Mail size={18} />
                        <input
                          type="email"
                          placeholder="name@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p>Account verified! Check your server log output for the generated OTP Reset Token and enter it below with your new password.</p>
                    
                    <div className="input-group">
                      <label>OTP Reset Token</label>
                      <div className="input-box">
                        <Key size={18} />
                        <input
                          type="text"
                          placeholder="Paste OTP / reset token"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="input-group" style={{ marginTop: "15px" }}>
                      <label>New Secure Password</label>
                      <div className="input-box">
                        <Lock size={18} />
                        <input
                          type="password"
                          placeholder="Min 6 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowForgotModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="login-btn" style={{ width: "auto", padding: "0 20px" }} disabled={forgotLoading}>
                  {forgotLoading ? "Processing..." : forgotStep === 1 ? "Verify & Send OTP" : "Reset Password"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Login;