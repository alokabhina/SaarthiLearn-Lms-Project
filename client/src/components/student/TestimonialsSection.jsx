import React from 'react';
import { assets, dummyTestimonial } from '../../assets/assets';

const TestimonialsSection = () => {
  return (
    <section className="w-full bg-[#0a1126] py-20 px-6 md:px-20 lg:px-40 text-[#c0d7ff]">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-4">
          What our learners say
        </h2>
        <p className="text-lg text-[#d1d7e0]/90 leading-relaxed">
          Real stories, real results. Discover how our platform has empowered learners to reach their goals.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyTestimonial.map((t, i) => (
          <div
            key={i}
            className="
              bg-[#1a2a4d]/50 backdrop-blur-sm 
              rounded-2xl overflow-hidden
              shadow-[0_8px_24px_rgba(0,0,0,0.3)]
              transition-transform duration-300
              hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(100,255,218,0.2)]
            "
          >
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-4 bg-[#1a2a4d]">
              <img
                src={t.image}
                alt={t.name}
                className="h-14 w-14 rounded-full border-2 border-[#64ffda]"
              />
              <div>
                <h3 className="text-xl font-semibold text-white">{t.name}</h3>
                <p className="text-[#a1a1aa] text-sm">{t.role}</p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {/* Rating */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, idx) => (
                  <img
                    key={idx}
                    src={ idx < Math.floor(t.rating) ? assets.star : assets.star_blank }
                    alt="star"
                    className="h-5 w-5"
                  />
                ))}
              </div>
              {/* Feedback */}
              <p className="mt-4 text-[#d1d7e0]/80 text-sm leading-relaxed">
                “{t.feedback.length > 120 ? t.feedback.slice(0, 120) + '…' : t.feedback}”
              </p>
            </div>

            {/* CTA */}
            <div className="px-6 pb-6">
              <a
                href="#"
                className="
                  inline-block text-[#64ffda] 
                  hover:text-[#3d5af1] 
                  font-medium 
                  underline
                "
              >
                Read full story
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
