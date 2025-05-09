import React from 'react';
import { assets } from '../../assets/assets';

const Companies = () => {
  const companies = [
    { src: assets.microsoft_logo, alt: 'Microsoft' },
    { src: assets.walmart_logo, alt: 'Walmart' },
    { src: assets.accenture_logo, alt: 'Accenture' },
    { src: assets.adobe_logo, alt: 'Adobe' },
    { src: assets.paypal_logo, alt: 'PayPal' },
  ];

  return (
    <section className="w-full py-16 bg-[#0a1126] border-t border-b border-[#2a3a6e]">
      <div className="max-w-6xl mx-auto text-center px-6">
        <h2 className="text-lg md:text-xl font-semibold text-[#c0d7ff] mb-8 relative inline-block">
          Trusted by learners from
          <span className="absolute left-1/2 bottom-[-6px] w-16 h-1 bg-[#64ffda] rounded-full -translate-x-1/2"></span>
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {companies.map((company, idx) => (
            <div
              key={idx}
              className="
                group flex items-center justify-center 
                bg-[#1a2a4d] backdrop-blur-sm 
                rounded-lg p-6 border border-[#2a3a6e]
                hover:shadow-[0_4px_20px_rgba(100,255,218,0.2)]
                transition-all duration-300
              "
            >
              <img
                src={company.src}
                alt={company.alt}
                className="
                  w-24 md:w-32 object-contain 
                  filter brightness-0 invert-[90%] 
                  group-hover:filter-none 
                  transition-filter duration-300
                "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Companies;
