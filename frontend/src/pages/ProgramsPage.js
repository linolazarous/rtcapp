import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Award,
  CheckCircle,
  GraduationCap
} from 'lucide-react';
import { formatPrice, getCourseTypeLabel, getCourseTypeColor } from '../lib/utils';

const ProgramsPage = () => {
  const { api } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'diploma');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses?is_published=true');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchParams({ type: value });
  };

  const programInfo = {
    diploma: {
      title: 'Diploma Programs',
      credits: 60,
      duration: '12-18 Months',
      description: 'Focused programs providing essential skills and knowledge for specific tech careers.',
      features: [
        '60 Credit Hours',
        '15 Comprehensive Modules',
        'Self-Paced Learning',
        'AI Tutor Support',
        'Official Certificate'
      ],
      price: 2499
    },
    bachelor: {
      title: 'Bachelor Programs',
      credits: 120,
      duration: '24 Months',
      description: 'Comprehensive degree programs for in-depth expertise and career advancement.',
      features: [
        '120 Credit Hours',
        '30 Comprehensive Modules',
        'Capstone Project',
        'Industry Partnerships',
        'Bachelor Degree Certificate'
      ],
      price: 4499
    },
    certification: {
      title: 'Certification Programs',
      credits: 120,
      duration: '24 Months',
      description: 'Industry-recognized certifications to validate your skills and expertise.',
      features: [
        '120 Credit Hours',
        'Exam Preparation',
        'Practice Tests',
        'Industry Recognition',
        'Professional Certificate'
      ],
      price: 799
    }
  };

  const filteredCourses = courses.filter(course => course.course_type === activeTab);

  return (
    <div className="min-h-screen bg-[#050505] pt-20">
      {/* Hero */}
      <section className="py-12 md:py-20 border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              Our <span className="gradient-text">Programs</span>
            </h1>
            <p className="text-[#A1A1AA] text-lg">
              Choose from diploma, bachelor, and certification programs designed to advance your tech career
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programs Tabs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="w-full max-w-xl mx-auto grid grid-cols-3 bg-[#0A0A0A] border border-[#27272A] p-1 mb-12">
              <TabsTrigger 
                value="diploma"
                className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                Diploma
              </TabsTrigger>
              <TabsTrigger 
                value="bachelor"
                className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                Bachelor
              </TabsTrigger>
              <TabsTrigger 
                value="certification"
                className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
              >
                Certification
              </TabsTrigger>
            </TabsList>

            {['diploma', 'bachelor', 'certification'].map((type) => (
              <TabsContent key={type} value={type}>
                {/* Program Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0A0A0A] border border-[#27272A] p-8 mb-12"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4">{programInfo[type].title}</h2>
                      <p className="text-[#A1A1AA] mb-6">{programInfo[type].description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm mb-6">
                        <div className="flex items-center gap-2 text-[#A1A1AA]">
                          <BookOpen className="w-4 h-4 text-[#CCFF00]" />
                          <span>{programInfo[type].credits} Credit Hours</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#A1A1AA]">
                          <Clock className="w-4 h-4 text-[#CCFF00]" />
                          <span>{programInfo[type].duration}</span>
                        </div>
                      </div>

                      <div className="text-3xl font-black text-white mb-2">
                        {formatPrice(programInfo[type].price)}
                        <span className="text-sm text-[#52525B] font-normal ml-2">starting</span>
                      </div>
                    </div>

                    <div className="bg-[#121212] p-6">
                      <h3 className="font-bold text-white mb-4">Program Features</h3>
                      <ul className="space-y-3">
                        {programInfo[type].features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-[#A1A1AA]">
                            <CheckCircle className="w-4 h-4 text-[#CCFF00]" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Course List */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">
                    Available {programInfo[type].title} ({filteredCourses.length})
                  </h3>

                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-[#0A0A0A] border border-[#27272A] h-48 animate-pulse" />
                      ))}
                    </div>
                  ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-12">
                      <GraduationCap className="w-12 h-12 text-[#27272A] mx-auto mb-4" />
                      <p className="text-[#A1A1AA]">No programs available in this category</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCourses.map((course, index) => (
                        <motion.div
                          key={course.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link 
                            to={`/courses/${course.id}`}
                            className="block bg-[#0A0A0A] border border-[#27272A] p-6 card-hover group h-full"
                          >
                            <span className={`inline-block px-3 py-1 text-xs font-bold mb-3 ${getCourseTypeColor(course.course_type)}`}>
                              {getCourseTypeLabel(course.course_type)}
                            </span>
                            <h4 className="font-bold text-white mb-2 group-hover:text-[#CCFF00] transition-colors line-clamp-2">
                              {course.title}
                            </h4>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#27272A]">
                              <span className="text-lg font-bold text-white">{formatPrice(course.price)}</span>
                              <span className="text-[#CCFF00] flex items-center gap-1 text-sm">
                                View
                                <ArrowRight className="w-4 h-4" />
                              </span>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default ProgramsPage;
