import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { toast } from 'sonner';
import { 
  Clock, 
  BookOpen, 
  Users, 
  Award,
  Play,
  CheckCircle,
  Lock,
  ArrowLeft,
  GraduationCap,
  FileText,
  Brain
} from 'lucide-react';
import { formatPrice, getCourseTypeLabel, getCourseTypeColor } from '../lib/utils';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { api, isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchCourseAndEnrollment();
  }, [courseId]);

  const fetchCourseAndEnrollment = async () => {
    try {
      setLoading(true);
      const courseResponse = await api.get(`/courses/${courseId}`);
      setCourse(courseResponse.data);

      if (isAuthenticated) {
        try {
          const enrollmentsResponse = await api.get('/enrollments');
          const userEnrollment = enrollmentsResponse.data.find(
            e => e.course_id === courseId
          );
          setEnrollment(userEnrollment);
        } catch (error) {
          console.error('Error fetching enrollment:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase this course');
      navigate('/login', { state: { from: `/courses/${courseId}` } });
      return;
    }

    try {
      setPurchasing(true);
      const response = await api.post('/payments/checkout', {
        course_id: courseId,
        origin_url: window.location.origin
      });
      
      window.location.href = response.data.checkout_url;
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error(error.response?.data?.detail || 'Failed to initiate payment');
    } finally {
      setPurchasing(false);
    }
  };

  const handleStartLearning = () => {
    navigate(`/learn/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-20 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#CCFF00] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#050505] pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Course not found</h2>
          <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-20">
      {/* Header */}
      <section className="py-8 md:py-12 border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#A1A1AA] hover:text-white mb-6 transition-colors"
            data-testid="back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className={`inline-block px-3 py-1 text-xs font-bold mb-4 ${getCourseTypeColor(course.course_type)}`}>
                  {getCourseTypeLabel(course.course_type)}
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
                  {course.title}
                </h1>
                <p className="text-lg text-[#A1A1AA] mb-6">
                  {course.description}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2 text-[#A1A1AA]">
                    <BookOpen className="w-4 h-4 text-[#CCFF00]" />
                    <span>{course.credit_hours} Credit Hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#A1A1AA]">
                    <Clock className="w-4 h-4 text-[#CCFF00]" />
                    <span>{course.duration_months} Months</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#A1A1AA]">
                    <Users className="w-4 h-4 text-[#CCFF00]" />
                    <span>{course.enrolled_count || 0} Students</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#A1A1AA]">
                    <GraduationCap className="w-4 h-4 text-[#CCFF00]" />
                    <span>{course.modules?.length || 0} Modules</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Purchase Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#0A0A0A] border border-[#27272A] p-6 sticky top-24"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-[#121212] mb-6 relative overflow-hidden flex items-center justify-center">
                  <img 
                    src="/images/logo.webp" 
                    alt=""
                    className="h-12 w-auto opacity-30"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <Play className="absolute w-12 h-12 text-white/50" />
                </div>

                {enrollment ? (
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[#A1A1AA]">Your Progress</span>
                        <span className="text-[#CCFF00]">{Math.round(enrollment.progress)}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2 bg-[#27272A]" />
                    </div>
                    <Button 
                      onClick={handleStartLearning}
                      className="w-full bg-[#CCFF00] text-black hover:bg-[#B3E600] font-bold py-6 btn-glow"
                      data-testid="continue-learning-btn"
                    >
                      {enrollment.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                    </Button>
                    {enrollment.status === 'completed' && (
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/certificates')}
                        className="w-full mt-3 border-[#27272A] text-white hover:border-[#CCFF00]"
                      >
                        <Award className="w-4 h-4 mr-2" />
                        View Certificate
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-black text-white mb-4">
                      {formatPrice(course.price)}
                    </div>
                    <Button 
                      onClick={handlePurchase}
                      disabled={purchasing}
                      className="w-full bg-[#CCFF00] text-black hover:bg-[#B3E600] font-bold py-6 btn-glow"
                      data-testid="enroll-btn"
                    >
                      {purchasing ? 'Processing...' : 'Enroll Now'}
                    </Button>
                    <p className="text-xs text-[#52525B] text-center mt-4">
                      30-day money-back guarantee
                    </p>
                  </>
                )}

                {/* Features */}
                <div className="mt-6 pt-6 border-t border-[#27272A] space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#A1A1AA]">
                    <CheckCircle className="w-4 h-4 text-[#CCFF00]" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#A1A1AA]">
                    <CheckCircle className="w-4 h-4 text-[#CCFF00]" />
                    <span>AI Tutor support</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#A1A1AA]">
                    <CheckCircle className="w-4 h-4 text-[#CCFF00]" />
                    <span>Certificate upon completion</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#A1A1AA]">
                    <CheckCircle className="w-4 h-4 text-[#CCFF00]" />
                    <span>Self-paced learning</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-6">Course Curriculum</h2>
              
              <Accordion type="single" collapsible className="space-y-3">
                {course.modules?.map((module, index) => (
                  <AccordionItem 
                    key={module.id || index} 
                    value={`module-${index}`}
                    className="bg-[#0A0A0A] border border-[#27272A] px-6"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-8 h-8 bg-[#121212] flex items-center justify-center text-sm font-bold text-[#CCFF00]">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{module.title}</h3>
                          <p className="text-xs text-[#52525B]">{module.duration_hours || 4} credit hours</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="pl-12 space-y-3">
                        <p className="text-sm text-[#A1A1AA] mb-4">{module.description}</p>
                        
                        {/* Module objectives */}
                        {module.objectives?.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs text-[#52525B] uppercase tracking-wider">Learning Objectives</p>
                            {module.objectives.map((obj, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-[#A1A1AA]">
                                <CheckCircle className="w-3 h-3 text-[#CCFF00] mt-1" />
                                {obj}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Lesson structure */}
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-3 text-sm text-[#52525B]">
                            <Play className="w-4 h-4" />
                            Video Lesson (30 min)
                          </div>
                          <div className="flex items-center gap-3 text-sm text-[#52525B]">
                            <FileText className="w-4 h-4" />
                            Reading Materials (30 min)
                          </div>
                          <div className="flex items-center gap-3 text-sm text-[#52525B]">
                            <Brain className="w-4 h-4" />
                            AI Practice Session (30 min)
                          </div>
                          <div className="flex items-center gap-3 text-sm text-[#52525B]">
                            <Award className="w-4 h-4" />
                            Quiz & Assessment
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {(!course.modules || course.modules.length === 0) && (
                <div className="bg-[#0A0A0A] border border-[#27272A] p-8 text-center">
                  <BookOpen className="w-12 h-12 text-[#27272A] mx-auto mb-4" />
                  <p className="text-[#A1A1AA]">Course curriculum coming soon</p>
                </div>
              )}
            </div>

            {/* What you'll learn */}
            <div className="lg:col-span-1">
              <div className="bg-[#0A0A0A] border border-[#27272A] p-6">
                <h3 className="font-bold text-white mb-4">What You'll Learn</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-[#A1A1AA]">
                    <CheckCircle className="w-4 h-4 text-[#CCFF00] mt-0.5 shrink-0" />
                    Master fundamental concepts and principles
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#A1A1AA]">
                    <CheckCircle className="w-4 h-4 text-[#CCFF00] mt-0.5 shrink-0" />
                    Build real-world projects and portfolio
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#A1A1AA]">
                    <CheckCircle className="w-4 h-4 text-[#CCFF00] mt-0.5 shrink-0" />
                    Prepare for industry certifications
                  </li>
                  <li className="flex items-start gap-3 text-sm text-[#A1A1AA]">
                    <CheckCircle className="w-4 h-4 text-[#CCFF00] mt-0.5 shrink-0" />
                    Get personalized AI tutoring support
                  </li>
                </ul>
              </div>

              <div className="bg-[#0A0A0A] border border-[#27272A] p-6 mt-6">
                <h3 className="font-bold text-white mb-4">This Course Includes</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-[#A1A1AA]">
                    <BookOpen className="w-4 h-4 text-[#CCFF00]" />
                    {course.modules?.length || 0} comprehensive modules
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#A1A1AA]">
                    <Clock className="w-4 h-4 text-[#CCFF00]" />
                    {course.credit_hours} hours of content
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#A1A1AA]">
                    <Brain className="w-4 h-4 text-[#CCFF00]" />
                    AI Tutor support
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#A1A1AA]">
                    <Award className="w-4 h-4 text-[#CCFF00]" />
                    Certificate of completion
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailPage;
