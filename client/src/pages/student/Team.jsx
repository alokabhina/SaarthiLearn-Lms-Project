import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const teamMembers = [
  {
    name: 'Shalvi Gaur',
    role: 'Frontend Developer',
    about: 'Crafts engaging and responsive user interfaces using React and Tailwind CSS. Passionate about creating seamless web experiences.',
    github: 'https://github.com/shalvi-hub',
    portfolio: 'https://shalvi-gaur.vercel.app/',
    linkedin: 'https://www.linkedin.com/in/shalvi-gaur-3617b332b/',
    instagram: '', // Added to ensure all icons are displayed
    email: 'gaurshalvi5@gmail.com',
    image: assets.Shalvi_image,
    skills: ['React', 'Tailwind CSS', 'JavaScript'],
    rollNumber: '2315077260164',
    accountNumber: '20',
    subject: 'B.Sc. Computer Science',
    college: 'Digvijay Nath PG College',
    certificate: 'Shalvi_Gaur_certificate_of_internship.pdf'
  },
  {
    name: 'Alok Abhinandan',
    role: 'Full Stack Developer',
    about: 'Develops robust full-stack solutions with expertise in both frontend and backend. Leads the team with vision and technical precision.',
    github: 'https://github.com/alokabhina',
    portfolio: 'https://alok-abhinandan-protfolio.vercel.app',
    linkedin: 'https://www.linkedin.com/in/alok-abhinandan-866619241',
    instagram: 'https://www.instagram.com/alok_abhinandan4?igsh=Zm85eTFkZjdwNG5l',
    email: 'alokabhinandan123@gmail.com',
    image: assets.Alok_image,
    skills: ['Node.js', 'React', 'MongoDB'],
    rollNumber: '2315077260140',
    accountNumber: '17',
    subject: 'B.Sc. Computer Science',
    college: 'Digvijay Nath PG College',
    certificate: 'Alok_Abhinandan_certificate_of_internship.pdf',
    isGroupLeader: true
  },
  {
    name: 'Kriti Pandey',
    role: 'UI/UX Designer',
    about: 'Designs intuitive and user-friendly interfaces with a focus on aesthetics. Enhances user experience through thoughtful design.',
    instagram: 'https://www.instagram.com/kritipandey23?igsh=MTl2ZHBvY3F3bm56cw==',
    portfolio: 'https://kriti-pandey.vercel.app/',
    linkedin: 'https://www.linkedin.com/in/kriti-pandey-27aa62332',
    github: '', // Added to ensure all icons are displayed
    email: 'kritipandey090@gmail.com',
    image: assets.Kriti_image,
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    rollNumber: '2315077260169',
    accountNumber: '18',
    subject: 'B.Sc. Computer Science',
    college: 'Digvijay Nath PG College',
    certificate: 'Kriti_Pandey_certificate_of_internship.pdf'
  },
  {
    name: 'Sumit Abhinandan',
    role: 'Material Designer',
    about: 'Creates visually appealing color palettes and material designs. Ensures consistent and vibrant aesthetics across the platform.',
    instagram: 'https://www.instagram.com/sumit.abhinandan?igsh=MTJjajJ1YWY2ZG12bw==',
    portfolio: 'https://www.instagram.com/sumit.abhinandan?igsh=MW1qeGs2bTlvN3FuNQ==',
    linkedin: 'https://www.linkedin.com/in/sumit-abhinandan-795717261',
    github: '', // Added to ensure all icons are displayed
    email: 'sumitabhinandan231@gmail.com',
    image: assets.Sumit_image,
    skills: ['Color Theory', 'Material Design', 'Graphic Design'],
    rollNumber: '2315077260251',
    accountNumber: '16',
    subject: 'B.Sc. Computer Science',
    college: 'Digvijay Nath PG College',
    certificate: 'Sumit_Abhinandan_certificate_of_internship.pdf'
  },
];

const Team = () => {
  const navigate = useNavigate();
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, member: null });

  const handleMouseMove = (e, member) => {
    setTooltipPos({
      x: e.clientX + 10,
      y: e.clientY + 10,
      visible: true,
      member
    });
  };

  const handleMouseLeave = () => {
    setTooltipPos({ ...tooltipPos, visible: false });
  };

  const handleDownloadCertificate = (certificate) => {
    const link = document.createElement('a');
    link.href = `/certificates/${certificate}`;
    link.download = certificate;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#1a1a2e_0%,_#0a1126_70%)] text-white px-4 py-12 font-sans">
      {/* Starry Background Effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#64ffda] opacity-20"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 8px 2px rgba(100, 255, 218, 0.3)`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#64ffda] to-[#00bfff]">
            Ignite: Unleashing the Future of Learning
          </h1>
          <p className="text-gray-400 text-xl max-w-xl mx-auto font-semibold">
            Where Innovation Meets Educational Excellence
          </p>
        </motion.section>

        {/* Group Photo */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={assets.group_image}
            alt="Team Ignite Group Photo"
            className="w-full max-w-2xl mx-auto h-56 object-cover rounded-lg shadow-[0_0_15px_2px_rgba(100,255,218,0.4)]"
          />
        </motion.div>

        {/* Team Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#64ffda] to-[#00bfff]">
            Meet the Ignite Team
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-[#1a1a2e] rounded-lg p-6 shadow-lg hover:shadow-[0_0_20px_3px_rgba(100,255,218,0.5)] transition-all flex flex-col items-center min-h-[400px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onMouseMove={(e) => handleMouseMove(e, member)}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mb-4 border-2 border-[#64ffda]"
                />
                <h2 className="text-lg font-bold text-center">
                  {member.name}
                  {member.isGroupLeader && (
                    <span className="text-[#FFD700] ml-1">(Group Leader)</span>
                  )}
                </h2>
                <p className="text-[#64ffda] text-center mb-2">{member.role}</p>
                <p className="text-gray-400 text-sm text-center mb-4">{member.about}</p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {member.skills.map((skill, i) => (
                    <span key={i} className="text-xs bg-[#2a2a4e] text-[#64ffda] px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Display Email ID with Icon */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <img src={assets.email_icon} alt="Email Icon" className="w-4 h-4" />
                  <p className="text-gray-400 text-sm text-center">{member.email}</p>
                </div>

                {/* Social Media Icons (Always show all 4) */}
                <div className="flex justify-center gap-4 mb-4">
                  {/* GitHub */}
                  {member.github ? (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#64ffda]">
                      <img src={assets.github_icon} alt="GitHub" className="w-5 h-5" />
                    </a>
                  ) : (
                    <span className="text-gray-400 opacity-50 cursor-not-allowed">
                      <img src={assets.github_icon} alt="GitHub" className="w-5 h-5" />
                    </span>
                  )}

                  {/* Portfolio */}
                  {member.portfolio ? (
                    <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#64ffda]">
                      <img src={assets.portfolio_icon} alt="Portfolio" className="w-5 h-5" />
                    </a>
                  ) : (
                    <span className="text-gray-400 opacity-50 cursor-not-allowed">
                      <img src={assets.portfolio_icon} alt="Portfolio" className="w-5 h-5" />
                    </span>
                  )}

                  {/* LinkedIn */}
                  {member.linkedin ? (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#64ffda]">
                      <img src={assets.linkedin_icon} alt="LinkedIn" className="w-5 h-5" />
                    </a>
                  ) : (
                    <span className="text-gray-400 opacity-50 cursor-not-allowed">
                      <img src={assets.linkedin_icon} alt="LinkedIn" className="w-5 h-5" />
                    </span>
                  )}

                  {/* Instagram */}
                  {member.instagram ? (
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#64ffda]">
                      <img src={assets.instagram_icon} alt="Instagram" className="w-5 h-5" />
                    </a>
                  ) : (
                    <span className="text-gray-400 opacity-50 cursor-not-allowed">
                      <img src={assets.instagram_icon} alt="Instagram" className="w-5 h-5" />
                    </span>
                  )}
                </div>

                {/* Spacer to push the button to the bottom */}
                <div className="flex-grow"></div>

                <button
                  onClick={() => handleDownloadCertificate(member.certificate)}
                  className="w-full py-2 bg-gradient-to-r from-[#64ffda] to-[#00bfff] text-[#0a1126] rounded-lg font-bold hover:shadow-[0_0_10px_2px_rgba(100,255,218,0.5)]"
                >
                  Certificate of Internship
                </button>
              </motion.div>
            ))}
            {/* Tooltip for College Data */}
            {tooltipPos.visible && (
              <motion.div
                className="fixed bg-[#2a2a4e] text-white text-xs p-4 rounded-lg shadow-[0_0_10px_2px_rgba(100,255,218,0.4)] max-w-xs"
                style={{ top: tooltipPos.y, left: tooltipPos.x }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <p><strong>Roll No:</strong> {tooltipPos.member.rollNumber}</p>
                <p><strong>Account No:</strong> {tooltipPos.member.accountNumber}</p>
                <p><strong>Subject:</strong> {tooltipPos.member.subject}</p>
                <p><strong>College:</strong> {tooltipPos.member.college}</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* The Fire of Ignite Section */}
        <section className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#64ffda] to-[#00bfff]">
            The Fire of Ignite
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            "Ignite" is more than a name—it's our mission to spark curiosity, fuel passion, and light up the path to knowledge. Our team pours heart and code into creating a learning platform that burns bright with innovation and accessibility.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { title: 'Blazing Engagement', icon: assets.play_icon, description: 'Interactive courses that keep you hooked' },
              { title: 'Radiant Insights', icon: assets.lesson_icon, description: 'Track progress with smart analytics' },
              { title: 'Inclusive Spark', icon: assets.person_tick_icon, description: 'Learning designed for all' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="bg-[#1a1a2e] p-6 rounded-lg shadow-lg hover:shadow-[0_0_15px_2px_rgba(100,255,218,0.4)]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <img src={feature.icon} alt={feature.title} className="w-8 h-8 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#64ffda] to-[#00bfff] text-[#0a1126] font-bold hover:shadow-[0_0_20px_3px_rgba(100,255,218,0.5)] transition"
            whileHover={{ scale: 1.05 }}
          >
            Ignite Your Journey
          </motion.button>
        </section>

        {/* About SaarthiLearn Section */}
        <section className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#64ffda] to-[#00bfff]">
            About SaarthiLearn LMS
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            <strong>SaarthiLearn LMS</strong> is a cutting-edge <strong>learning</strong> management system crafted to revolutionize education. Designed by <strong>The Ignite Team</strong> as our <strong>2024</strong> B.Sc. capstone project, it empowers students with <strong>interactive</strong> courses, intuitive progress tracking, and a <strong>accessible</strong> interface that fosters seamless <strong>learning</strong>. With a focus on <strong>innovation</strong>, SaarthiLearn bridges technology and education, creating meaningful digital experiences for learners everywhere.
          </p>
        </section>

        {/* College Section */}
        <section className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#64ffda] to-[#00bfff]">
            Our Foundation: Digvijay Nath PG College ☀️
          </h2>
          <p className="text-gray-400 text-lg mb-4">
            Established in 1969 | Gorakhpur, Uttar Pradesh
          </p>
          <div className="flex justify-center mb-6">
            <img src={assets.LogoDVNPG} alt="Digvijay Nath PG College Logo" className="w-32 h-32 rounded-full shadow-[0_0_15px_2px_rgba(100,255,218,0.4)]" />
          </div>
          <p className="text-gray-400 text-lg mb-4">
            Inspired by the <strong>visionary</strong> Brahmleen Mahant Digvijay Nath Ji Maharaj, <strong>Digvijay Nath Postgraduate College</strong> has stood as a beacon of <strong>knowledge</strong>, <strong>discipline</strong>, and <strong>holistic</strong> student development for over five decades. With a commitment to <strong>excellence</strong> and <strong>cultural values</strong>, it nurtures students to become <strong>leaders</strong> of tomorrow.
          </p>
          <p className="text-gray-400 text-lg mb-8">
            This website, <strong>SaarthiLearn LMS</strong>, is the <strong>capstone project</strong> by the final-year B.Sc. students of <strong>2025</strong>, built with <strong>dedication</strong> and <strong>innovation</strong>. Developed under the banner of <strong>The Ignite Team</strong>, it embodies our collective <strong>passion</strong> for <strong>technology</strong>, <strong>modern education</strong>, and meaningful digital experiences — proudly representing the spirit of <strong>Digvijay Nath PG College</strong>.
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} SaarthiLearn. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Team;