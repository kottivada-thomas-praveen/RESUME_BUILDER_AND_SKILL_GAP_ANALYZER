import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Herosection from "./Herosection";
import Featuressection from "../featuressection/Featuressection";
import ServicesSection from "./servicesection/Services";
import AboutSection from "./about/About";
import ContactSection from "./contact/Contact";

const Home: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if there is a hash in the URL (e.g. #services)
    if (location.hash) {
      const targetId = location.hash.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        // Wait slightly for DOM rendering
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      // If no hash, scroll to top of page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="home-page-container">
      <div id="home">
        <Herosection />
      </div>
      
      <div id="features">
        <Featuressection />
      </div>
      
      <div id="services">
        <ServicesSection />
      </div>
      
      <div id="about">
        <AboutSection />
      </div>
      
      <div id="contact">
        <ContactSection />
      </div>
    </div>
  );
};

export default Home;
