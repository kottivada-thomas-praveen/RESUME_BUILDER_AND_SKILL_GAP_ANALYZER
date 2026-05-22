

import React, { useState } from "react";
import "./Signup.css";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Rocket,
  Users,
} from "lucide-react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      alert("Account created successfully!");
    }, 2500);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* LEFT SIDE */}
        <div className="signup-left">
          {/* LOGO */}
          <div className="logo">
            <div className="logo-box"></div>
            <h2>TechNova</h2>
          </div>

          {/* HEADING */}
          <div className="signup-content">
            <h1>
              Create your <span>account</span>
            </h1>

            <p>
              Join TechNova and explore a world of possibilities to grow your
              skills.
            </p>

            {/* SOCIAL BUTTONS */}
            <div className="social-buttons">
              <button className="social-btn">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                  alt="google"
                />
                Sign up with Google
              </button>

              <button className="social-btn">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                  alt="github"
                />
                Sign up with GitHub
              </button>
            </div>

            {/* DIVIDER */}
            <div className="divider">
              <span></span>
              <p>or</p>
              <span></span>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <User size={20} />
                <input type="text" placeholder="Full name" required />
              </div>

              <div className="input-box">
                <Mail size={20} />
                <input type="email" placeholder="Email address" required />
              </div>

              <div className="input-box">
                <Lock size={20} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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
              <div className="password-rules">
                <p>✔ At least 8 characters</p>
                <p>✔ Includes a number</p>
                <p>✔ Includes an uppercase letter</p>
              </div>

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
              Already have an account? <span>Sign in</span>
            </div>

            {/* FEATURES */}
            <div className="features">
              <div className="feature-box">
                <ShieldCheck size={28} />
                <h4>Secure & Private</h4>
                <p>Your data is safe with us.</p>
              </div>

              <div className="feature-box">
                <Rocket size={28} />
                <h4>Fast & Easy</h4>
                <p>Get started in just a few steps.</p>
              </div>

              <div className="feature-box">
                <Users size={28} />
                <h4>Join Community</h4>
                <p>Connect and learn with others.</p>
              </div>
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

      {/* FOOTER */}
      <div className="brands">
        <p>Trusted by learners and teams worldwide</p>

        <div className="brand-logos">
          <span>Google</span>
          <span>Microsoft</span>
          <span>GitHub</span>
          <span>Slack</span>
          <span>Dropbox</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;