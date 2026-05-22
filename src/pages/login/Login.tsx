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


import "./Login.css";
import {
  Mail,
  Lock,
  Eye,
  LogIn,
  User,
  Sparkles,
} from "lucide-react";

const Login = () => {
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
              <span> Sign up</span>
            </p>
          </div>

          <div className="form-section">

            <h1>Login</h1>

            <p className="subtitle">
              Welcome back! Please enter your details.
            </p>

            {/* EMAIL */}
            <div className="input-group">
              <label>Email</label>

              <div className="input-box">
                <Mail size={20} />
                <input
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <label>Password</label>

              <div className="input-box">
                <Lock size={20} />

                <input
                  type="password"
                  placeholder="Enter your password"
                />

                <Eye size={20} className="eye-icon" />
              </div>
            </div>

            <p className="forgot-password">
              Forgot password?
            </p>

            {/* BUTTON */}
            <button className="login-btn">
              <LogIn size={20} />
              Login
            </button>

            {/* DIVIDER */}
            <div className="divider">
              <span></span>
              <p>or continue with</p>
              <span></span>
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="social-buttons">

              <button>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
                  alt="google"
                />
                Google
              </button>

              <button>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/732/732221.png"
                  alt="microsoft"
                />
                Microsoft
              </button>

              <button>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/0/747.png"
                  alt="apple"
                />
                Apple
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