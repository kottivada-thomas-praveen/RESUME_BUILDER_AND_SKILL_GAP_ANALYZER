import "./Navbar.css"
import { Link, useNavigate } from "react-router-dom";

function Navbar(){
    const navigate = useNavigate();

    return(
        <div>
          <nav className="navbar">
            <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                <p>rbsga</p>
            </div>

            <ul className="nav-links">
              <li><Link to="/#home">HOME</Link></li>
              <li><Link to="/#features">FEATURES</Link></li>
              <li><Link to="/#services">SERVICES</Link></li>
              <li><Link to="/#about">ABOUT</Link></li>
              <li><Link to="/#contact">CONTACT US</Link></li>
              
              <div className="sign-btn">
                <Link to="/login"><button>LOGIN</button></Link>
              </div>
              <div className="gs-btn">
                <Link to="/signup"><button>GET STARTED</button></Link>
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