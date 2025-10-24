import React from "react";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import ProductsSection from "../components/landing/ProductsSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import StatsSection from "../components/landing/StatsSection";
import TemplateShowcase from "../components/landing/TemplateShowcase";
import ProductDemoSection from "../components/landing/ProductDemoSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <ProductsSection />
        <StatsSection />
        <FeaturesSection />
        <TemplateShowcase />
        <ProductDemoSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
