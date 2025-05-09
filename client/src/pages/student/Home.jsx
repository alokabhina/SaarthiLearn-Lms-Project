import React from 'react';
import Footer from '../../components/student/Footer';
import Hero from '../../components/student/Hero';
import Companies from '../../components/student/Companies';
import CoursesSection from '../../components/student/CoursesSection';
import TestimonialsSection from '../../components/student/TestimonialsSection';
import CallToAction from '../../components/student/CallToAction';

const Home = () => {
  return (
    <div className="flex flex-col items-center text-center">
   <header className="w-full shadow-[0_0_15px_rgba(100,255,218,0.4)]">
  <Hero />
</header>
      <Companies />
      <CoursesSection />
      <TestimonialsSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
