import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Herosection from "./Herosection";
import StatsBar from "./StatsBar";
import Featuressection from "../featuressection/Featuressection";
import HowItWorks from "./HowItWorks";
import ServicesSection from "./servicesection/Services";
import AboutSection from "./about/About";
import FAQSection from "./FAQSection";
import ContactSection from "./contact/Contact";
import Footer from "./Footer";

export const Home: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* 1. Hero Section */}
      <Herosection />

      {/* 2. Stats & Proof Bar */}
      <StatsBar />

      {/* 3. Features Grid */}
      <Featuressection />

      {/* 4. How It Works (3 Steps) */}
      <HowItWorks />

      {/* 5. Core Services */}
      <ServicesSection />

      {/* 6. About Us / Technology Engine */}
      <AboutSection />

      {/* 7. FAQ Accordion */}
      <FAQSection />

      {/* 8. Contact Form */}
      <ContactSection />

      {/* 9. Professional Footer */}
      <Footer />
    </div>
  );
};

export default Home;
