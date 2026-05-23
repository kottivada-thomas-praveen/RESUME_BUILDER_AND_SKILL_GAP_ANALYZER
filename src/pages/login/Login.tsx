// import "./Login.css";
// import { Mail, Lock, Form } from "lucide-react";
// import {Email, Password,SecurityShield} from "lucide-react"

// const Login = () => {
//   return (
//     <div className="login-page">
//       <div className="left-side">
//         <h1>rbsga</h1><br />
//         <h1>Welcome Back!</h1><br />
//         <h2>Sign in to continue to your account and explore more</h2>
//         <img src="src\assets\undraw_remote-worker_0l91.svg" alt="" />
        
//       </div>
//       <div className="right-side"></div>
//     </div>
//   );
// };

// export default Login;


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
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await Api.post("/auth/login", { email, password });
      
      if (response.data && response.data.token) {
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

              <p className="forgot-password">
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
    </div>
  );
};

export default Login;