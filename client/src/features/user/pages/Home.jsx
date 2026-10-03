import React from "react";
import Hero from "../components/Hero";
import PopularCourses from "../components/PopularCourses";
import WhyChooseUs from "../components/WhyChooseUs";
import CertificateShowcase from "../components/CertificateShowcase";
import HomeAbout from "../components/HomeAbout";
import HowItWorks from "../components/HowItWorks";
import DemoCTA from "../components/DemoCTA";
import Testimonials from "../components/Testimonials";
import LatestBlogs from "../components/LatestBlogs";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA";
import VideoSection from "../components/VideoSection";

const Home = () => {
  return (
    <main>
      <Hero />
      <HomeAbout />
      <PopularCourses />
      <WhyChooseUs />
      <VideoSection />
      <CertificateShowcase />
      <HowItWorks />
      <DemoCTA />
      <Testimonials />
      <LatestBlogs />
      <FAQ />
      <FinalCTA />
    </main>
  );
};

export default Home;