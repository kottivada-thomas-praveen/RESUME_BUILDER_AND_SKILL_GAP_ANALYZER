import React, { useState } from "react";
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
        await Api.post("/auth/forgot-password", { email: forgotEmail });
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
        await Api.post("/auth/reset-password", { token: otp, newPassword: newPassword });
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
            <div className="social-buttons">

              <button type="button" aria-label="Sign in with Google">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                  alt="google"
                />
              </button>

              <button type="button" aria-label="Sign in with Microsoft">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/732/732221.png"
                  alt="microsoft"
                />
              </button>

              <button type="button" aria-label="Sign in with Apple">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/0/747.png"
                  alt="apple"
                />
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