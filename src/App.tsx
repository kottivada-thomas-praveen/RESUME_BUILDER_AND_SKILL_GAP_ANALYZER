import Navbar from "./components/navbar/Navbar"
import Home from "./pages/home/Home"
import Featuressection from "./pages/featuressection/Featuressection"
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import BuildResume from "./pages/build-resume/BuildResume";
import AnalyzeResume from "./pages/analyze-resume/AnalyzeResume";

import "./components/navbar/Navbar.css"

function App(){
  return(
    <div> 
      <Navbar/>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/features" element={<Featuressection/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/build-resume" element={<BuildResume/>}/>
        <Route path="/analyze-resume" element={<AnalyzeResume/>}/>
      </Routes>
    </div>
  )
}

export default App;


// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./components/navbar/Navbar";
// import Signup from "./pages/signup/Signup";

// function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />

//       <Routes>
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
