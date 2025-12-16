import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import SuccessStories from "./SuccessStories";
import CTA from "./CTA";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />

        <SuccessStories />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
