import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import "./Navbar.css";

function Navbar(){
    const navigate = useNavigate();
    const [menuActive, setMenuActive] = useState(false);

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    const closeMenu = () => {
        setMenuActive(false);
    };

    return(
        <div>
          <nav className="navbar">
            <div className="logo" onClick={() => { navigate("/"); closeMenu(); }} style={{ cursor: "pointer" }}>
                <Sparkles size={24} className="logo-icon" />
                <span className="logo-text">Careercraft <span className="highlight"></span></span>
            </div>

            <div className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                {menuActive ? <X size={28} /> : <Menu size={28} />}
            </div>

            <ul className={`nav-links ${menuActive ? "active" : ""}`}>
              <li><Link to="/#home" onClick={closeMenu}>HOME</Link></li>
              <li><Link to="/#features" onClick={closeMenu}>FEATURES</Link></li>
              <li><Link to="/#services" onClick={closeMenu}>SERVICES</Link></li>
              <li><Link to="/#about" onClick={closeMenu}>ABOUT</Link></li>
              <li><Link to="/#contact" onClick={closeMenu}>CONTACT US</Link></li>
              
              <div className="nav-buttons">
                <div className="sign-btn">
                  <Link to="/login" onClick={closeMenu}><button>LOGIN</button></Link>
                </div>
                <div className="gs-btn">
                  <Link to="/signup" onClick={closeMenu}><button>GET STARTED</button></Link>
                </div>
              </div>
            </ul>
          </nav>
        </div>
    )
}

export default Navbar;


// import "./Navbar.css";
// import { useNavigate } from "react-router-dom";

// function Navbar() {
//   const navigate = useNavigate();

//   return (
//     <div>
//       <nav className="navbar">
        
//         <div className="logo" onClick={() => navigate("/")}>
//           <p>rbsga</p>
//         </div>

//         <ul className="nav-links">
//           <li onClick={() => navigate("/")}>HOME</li>

//           <li onClick={() => navigate("/features")}>FEATURES</li>

//           <li onClick={() => navigate("/services")}>SERVICES</li>

//           <li onClick={() => navigate("/about")}>ABOUT</li>

//           <li onClick={() => navigate("/contact")}>CONTACT US</li>

//           <div className="sign-btn">
//             <button onClick={() => navigate("/signup")}>
//               SIGN UP
//             </button>
//           </div>

//           <div className="gs-btn">
//             <button onClick={() => navigate("/signup")}>
//               GET STARTED
//             </button>
//           </div>
//         </ul>
//       </nav>
//     </div>
//   );
// }

// export default Navbar;