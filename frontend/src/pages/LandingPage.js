import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { 
  Play, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Award, 
  Zap,
  Brain,
  Shield,
  Globe,
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

const LandingPage = () => {
  const [stats, setStats] = useState({ courses: 0, students: 0, certificates: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/courses?is_published=true`);
        setStats(prev => ({ ...prev, courses: response.data.length }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Personal AI tutor available 24/7 to answer questions and explain concepts'
    },
    {
      icon: BookOpen,
      title: 'Industry-Aligned Curriculum',
      description: 'Courses designed with input from tech industry leaders and experts'
    },
    {
      icon: Award,
      title: 'Recognized Certifications',
      description: 'Earn certificates valued by employers worldwide'
    },
    {
      icon: Clock,
      title: 'Self-Paced Learning',
      description: 'Learn at your own pace with lifetime access to course materials'
    },
    {
      icon: Shield,
      title: 'Job-Ready Skills',
      description: 'Practical projects and hands-on experience for real-world applications'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with learners and professionals from around the world'
    }
  ];

  const programs = [
    {
      type: 'Diploma Programs',
      credits: '60 Credit Hours',
      duration: '12-18 Months',
      price: '$2,499',
      color: 'from-[#CCFF00] to-[#B3E600]'
    },
    {
      type: 'Bachelor Programs',
      credits: '120 Credit Hours',
      duration: '24 Months',
      price: '$4,499',
      color: 'from-[#00FF66] to-[#00CC52]'
    },
    {
      type: 'Certifications',
      credits: '120 Credit Hours',
      duration: '24 Months',
      price: '$799',
      color: 'from-[#7C3AED] to-[#5B21B6]'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Developer at Google',
      image: 'https://images.pexels.com/photos/4709288/pexels-photo-4709288.jpeg',
      quote: 'Right Tech Centre transformed my career. The AI tutor was incredibly helpful in understanding complex concepts.'
    },
    {
      name: 'Michael Chen',
      role: 'Data Scientist at Microsoft',
      image: 'https://images.pexels.com/photos/6424589/pexels-photo-6424589.jpeg',
      quote: 'The self-paced learning allowed me to balance work while upgrading my skills. Highly recommended!'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1753998941587-5befe71f4572?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHw0fHxzdHVkZW50JTIwY29kaW5nJTIwbGFwdG9wJTIwZGFyayUyMGVudmlyb25tZW50fGVufDB8fHx8MTc2OTQ5NTc5M3ww&ixlib=rb-4.1.0&q=85"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 video-overlay" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex justify-center mb-8">
              <img 
                src="/images/logo.webp" 
                alt="Right Tech Centre" 
                className="h-16 md:h-24 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
              <span className="text-white">Future-Proof Your</span>
              <br />
              <span className="gradient-text">Tech Career</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#A1A1AA] max-w-3xl mx-auto">
              AI-Powered Tech Education Platform. Master cutting-edge skills with personalized AI tutoring, 
              industry-aligned curriculum, and globally recognized certifications.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/programs" data-testid="explore-programs-btn">
                <Button 
                  size="lg" 
                  className="bg-[#CCFF00] text-black hover:bg-[#B3E600] rounded-full font-bold px-8 py-6 text-lg btn-glow"
                >
                  Explore Programs
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/register" data-testid="get-started-btn">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-[#3F3F46] text-white hover:border-[#CCFF00] hover:text-[#CCFF00] rounded-full px-8 py-6 text-lg"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black gradient-text">{stats.courses || '57'}+</div>
              <div className="text-sm text-[#A1A1AA] mt-1">Programs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black gradient-text">10K+</div>
              <div className="text-sm text-[#A1A1AA] mt-1">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black gradient-text">95%</div>
              <div className="text-sm text-[#A1A1AA] mt-1">Satisfaction</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-[#3F3F46] rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-[#CCFF00] rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Why Choose <span className="gradient-text">Right Tech Centre</span>
            </h2>
            <p className="text-[#A1A1AA] max-w-2xl mx-auto">
              Experience the future of tech education with our innovative platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0A0A0A] border border-[#27272A] p-6 card-hover group"
              >
                <div className="w-12 h-12 bg-[#CCFF00]/10 flex items-center justify-center mb-4 group-hover:bg-[#CCFF00]/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-[#CCFF00]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-[#A1A1AA]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 md:py-32 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Our <span className="gradient-text">Programs</span>
            </h2>
            <p className="text-[#A1A1AA] max-w-2xl mx-auto">
              Choose from diploma, bachelor, and certification programs designed for your career goals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((program, index) => (
              <motion.div
                key={program.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#121212] border border-[#27272A] p-8 card-hover group relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${program.color}`} />
                <h3 className="text-xl font-bold text-white mb-4">{program.type}</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-[#A1A1AA]">
                    <CheckCircle className="w-4 h-4 text-[#CCFF00]" />
                    {program.credits}
                  </li>
                  <li className="flex items-center gap-2 text-[#A1A1AA]">
                    <CheckCircle className="w-4 h-4 text-[#CCFF00]" />
                    {program.duration}
                  </li>
                  <li className="flex items-center gap-2 text-[#A1A1AA]">
                    <CheckCircle className="w-4 h-4 text-[#CCFF00]" />
                    AI Tutor Support
                  </li>
                  <li className="flex items-center gap-2 text-[#A1A1AA]">
                    <CheckCircle className="w-4 h-4 text-[#CCFF00]" />
                    Official Certificate
                  </li>
                </ul>
                <div className="mb-6">
                  <span className="text-3xl font-black text-white">{program.price}</span>
                  <span className="text-[#52525B] ml-2">starting</span>
                </div>
                <Link 
                  to={`/programs?type=${program.type.toLowerCase().split(' ')[0]}`}
                  className="block"
                >
                  <Button 
                    className="w-full bg-transparent border border-[#3F3F46] text-white hover:border-[#CCFF00] hover:text-[#CCFF00]"
                  >
                    View Programs
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tutor Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#CCFF00]/5 to-[#00FF66]/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-[#CCFF00]/10 px-4 py-2 rounded-full mb-6">
                <Zap className="w-4 h-4 text-[#CCFF00]" />
                <span className="text-sm text-[#CCFF00] font-medium">Powered by GPT-5.2</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                Meet Your Personal <span className="gradient-text">AI Tutor</span>
              </h2>
              <p className="text-[#A1A1AA] mb-8 leading-relaxed">
                Get instant help whenever you need it. Our AI tutor understands your course context 
                and provides personalized explanations, generates practice questions, and helps you 
                master complex concepts.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#CCFF00] mt-0.5" />
                  <span className="text-white">24/7 availability for instant support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#CCFF00] mt-0.5" />
                  <span className="text-white">Context-aware explanations based on your lesson</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#CCFF00] mt-0.5" />
                  <span className="text-white">Generate practice quizzes on any topic</span>
                </li>
              </ul>
              <Link to="/ai-tutor">
                <Button className="bg-[#CCFF00] text-black hover:bg-[#B3E600] rounded-full font-bold px-8 btn-glow">
                  Try AI Tutor
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#0A0A0A] border border-[#27272A] p-6 rounded-lg"
            >
              {/* Mock Chat Interface */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#121212] flex items-center justify-center">
                    <span className="text-sm">👤</span>
                  </div>
                  <div className="bg-[#121212] px-4 py-3 rounded-lg max-w-[80%]">
                    <p className="text-sm text-white">Can you explain how neural networks learn?</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-[#CCFF00]/10 px-4 py-3 rounded-lg max-w-[80%]">
                    <p className="text-sm text-white">
                      Neural networks learn through a process called backpropagation. 
                      Here's a simplified explanation:
                    </p>
                    <ol className="text-sm text-[#A1A1AA] mt-2 list-decimal list-inside space-y-1">
                      <li>Forward pass - data flows through the network</li>
                      <li>Calculate error - compare output with expected result</li>
                      <li>Backward pass - adjust weights to reduce error</li>
                    </ol>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#CCFF00] flex items-center justify-center">
                    <Brain className="w-4 h-4 text-black" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Student <span className="gradient-text">Success Stories</span>
            </h2>
            <p className="text-[#A1A1AA] max-w-2xl mx-auto">
              Join thousands of graduates who've transformed their careers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#121212] border border-[#27272A] p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#CCFF00] text-[#CCFF00]" />
                  ))}
                </div>
                <p className="text-white mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-[#A1A1AA]">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#CCFF00]/10 via-[#00FF66]/10 to-[#CCFF00]/10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
              Ready to <span className="gradient-text">Level Up</span>?
            </h2>
            <p className="text-lg text-[#A1A1AA] mb-8 max-w-2xl mx-auto">
              Join Right Tech Centre today and start your journey towards a successful tech career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-[#CCFF00] text-black hover:bg-[#B3E600] rounded-full font-bold px-10 py-6 text-lg btn-glow"
                >
                  Start Learning Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-[#3F3F46] text-white hover:border-[#CCFF00] hover:text-[#CCFF00] rounded-full px-10 py-6 text-lg"
                >
                  Browse Courses
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
