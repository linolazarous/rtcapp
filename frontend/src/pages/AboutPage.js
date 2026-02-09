import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  Target, 
  Users, 
  Award, 
  Globe,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Continuously evolving our curriculum to reflect the latest industry trends and technologies.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive global network of learners, educators, and industry professionals.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering high-quality education that meets international standards.'
    },
    {
      icon: Target,
      title: 'Accessibility',
      description: 'Making tech education accessible to learners worldwide through flexible, self-paced programs.'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Students Worldwide' },
    { value: '57+', label: 'Programs Offered' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '85%', label: 'Employment Rate' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-20">
      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#CCFF00]/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              About <span className="gradient-text">Right Tech Centre</span>
            </h1>
            <p className="text-lg text-[#A1A1AA] leading-relaxed">
              Right Tech Centre is a technology-focused, innovative educational institution dedicated to 
              empowering tomorrow's innovators. Our mission is to deliver cutting-edge education and training 
              that equips learners with the technical expertise, critical thinking ability, and creative skills 
              required to thrive in a rapidly evolving global technology landscape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-[#A1A1AA]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                Our <span className="gradient-text">Mission</span>
              </h2>
              <p className="text-[#A1A1AA] mb-6 leading-relaxed">
                Right Tech Centre is committed to shaping the future of tech education through practical, 
                industry-aligned, and AI-powered learning experiences. We specialize in delivering high-quality 
                technology education to students, professionals, and organizations.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#CCFF00] mt-0.5" />
                  <span className="text-white">Job-ready skills through hands-on projects</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#CCFF00] mt-0.5" />
                  <span className="text-white">Real-world problem-solving experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#CCFF00] mt-0.5" />
                  <span className="text-white">Globally competitive certifications</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1760999896198-b7e780e42500?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjB0ZWNoJTIwb2ZmaWNlJTIwbmVvbiUyMGxpZ2h0aW5nfGVufDB8fHx8MTc2OTQ5NTc5NXww&ixlib=rb-4.1.0&q=85"
                alt="Tech Education"
                className="w-full aspect-video object-cover border border-[#27272A]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Our <span className="gradient-text">Values</span>
            </h2>
            <p className="text-[#A1A1AA] max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#121212] border border-[#27272A] p-6 card-hover"
              >
                <div className="w-12 h-12 bg-[#CCFF00]/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-[#CCFF00]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                <p className="text-sm text-[#A1A1AA]">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Who We <span className="gradient-text">Serve</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#0A0A0A] border border-[#27272A] p-8 text-center"
            >
              <div className="w-16 h-16 bg-[#CCFF00]/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#CCFF00]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Students</h3>
              <p className="text-[#A1A1AA]">
                Individuals entering the tech industry seeking comprehensive education and certifications
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#0A0A0A] border border-[#27272A] p-8 text-center"
            >
              <div className="w-16 h-16 bg-[#00FF66]/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#00FF66]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Professionals</h3>
              <p className="text-[#A1A1AA]">
                Working professionals seeking to upskill or reskill in emerging technologies
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#0A0A0A] border border-[#27272A] p-8 text-center"
            >
              <div className="w-16 h-16 bg-[#7C3AED]/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-[#7C3AED]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Organizations</h3>
              <p className="text-[#A1A1AA]">
                Companies requiring workforce technology training and development programs
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#CCFF00]/10 via-[#00FF66]/10 to-[#CCFF00]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              Ready to Start Your <span className="gradient-text">Journey</span>?
            </h2>
            <p className="text-[#A1A1AA] mb-8 max-w-2xl mx-auto">
              Join thousands of learners who have transformed their careers with Right Tech Centre
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses">
                <Button className="bg-[#CCFF00] text-black hover:bg-[#B3E600] rounded-full font-bold px-8 py-6 text-lg btn-glow">
                  Explore Programs
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="border-[#3F3F46] text-white hover:border-[#CCFF00] hover:text-[#CCFF00] rounded-full px-8 py-6 text-lg">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
