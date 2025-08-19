import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

import TestimonialsSection from './TestimonialsSection';
import TrustedBySection from './TrustedBySection';
import WhyAUJISection from './WhyAUJISection';
import CoreServices from './CoreServices';
import StepsSection from './StepsSection';
import CTASection from './CTASection';
import Footer from './Footer';

import handshakeImg from '../assets/Auji.png';

const Landing = () => {
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <>
      <section className="font-montaser flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-24 bg-[#f7faff] min-h-screen">
        <div className="w-full md:w-1/2 text-center md:pl-6">
          <img
            src={handshakeImg}
            alt="AUJI"
            className="max-w-5xl mx-auto"
            style={{ transform: 'translateY(-20px)' }}
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center items-end text-right space-y-6 md:pr-12">
          <h1 className="text-7xl md:text-8xl font-bold leading-tight text-gray-800 mt-8">
            احنا ندور وانت{' '}
            <span className="relative text-blue-600">
              اتطور
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-yellow-300 rounded"></span>
            </span>
          </h1>

          <p className="text-3xl md:text-4xl text-gray-700 leading-relaxed w-full">
            افتح أبواب مستقبلك مع أوجي – مساعدك الذكي للوظايف والتدريبات في الوطن العربي
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-12">
            <button
              onClick={goToRegister}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-md shadow transition text-xl"
            >
              ارفع السيرة الذاتية الآن
            </button>

            <button
              onClick={goToRegister}
              className="bg-yellow-300 hover:bg-yellow-400 text-gray-800 px-10 py-4 rounded-md shadow transition text-xl"
            >
              أنشئ سيرتك الذاتية الآن
            </button>

            <button
              onClick={goToRegister}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-10 py-4 rounded-md shadow transition text-xl"
            >
              سجل مجانًا
            </button>
          </div>
        </div>
      </section>

      <CoreServices />
      <TestimonialsSection />
      <WhyAUJISection />
      <StepsSection />
      <TrustedBySection />
      <CTASection />
      <Footer />

      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default Landing;
