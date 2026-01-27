import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner';
import { 
  BookOpen, 
  Clock, 
  Award, 
  ArrowRight,
  Play,
  GraduationCap,
  Target,
  TrendingUp,
  Brain
} from 'lucide-react';
import { formatDate, getCourseTypeLabel, getCourseTypeColor } from '../lib/utils';

const StudentDashboard = () => {
  const { user, api } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [enrollmentsRes, certificatesRes] = await Promise.all([
        api.get('/enrollments'),
        api.get('/certificates')
      ]);
      setEnrollments(enrollmentsRes.data);
      setCertificates(certificatesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Enrolled Courses',
      value: enrollments.length,
      icon: BookOpen,
      color: 'text-[#CCFF00]'
    },
    {
      label: 'In Progress',
      value: enrollments.filter(e => e.status === 'active' && e.progress > 0).length,
      icon: Target,
      color: 'text-[#00FF66]'
    },
    {
      label: 'Completed',
      value: enrollments.filter(e => e.status === 'completed').length,
      icon: TrendingUp,
      color: 'text-[#7C3AED]'
    },
    {
      label: 'Certificates',
      value: certificates.length,
      icon: Award,
      color: 'text-[#CCFF00]'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-20 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#CCFF00] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-20" data-testid="student-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black text-white mb-2">
            Welcome back, <span className="gradient-text">{user?.full_name?.split(' ')[0]}</span>
          </h1>
          <p className="text-[#A1A1AA]">Continue your learning journey</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-[#0A0A0A] border border-[#27272A] p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-sm text-[#52525B]">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Continue Learning</h2>
                <Link to="/my-courses" className="text-sm text-[#CCFF00] hover:underline">
                  View All
                </Link>
              </div>

              {enrollments.length === 0 ? (
                <div className="bg-[#0A0A0A] border border-[#27272A] p-8 text-center">
                  <BookOpen className="w-12 h-12 text-[#27272A] mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">No courses yet</h3>
                  <p className="text-[#A1A1AA] mb-6">Start your learning journey today</p>
                  <Link to="/courses">
                    <Button className="bg-[#CCFF00] text-black hover:bg-[#B3E600]">
                      Browse Courses
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.slice(0, 3).map((enrollment) => (
                    <EnrollmentCard key={enrollment.id} enrollment={enrollment} api={api} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Certificates */}
            {certificates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Your Certificates</h2>
                  <Link to="/certificates" className="text-sm text-[#CCFF00] hover:underline">
                    View All
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certificates.slice(0, 2).map((cert) => (
                    <div 
                      key={cert.id}
                      className="bg-[#0A0A0A] border border-[#27272A] p-6 card-hover"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#CCFF00]/10 flex items-center justify-center">
                          <Award className="w-6 h-6 text-[#CCFF00]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white mb-1 line-clamp-1">{cert.course_title}</h3>
                          <p className="text-xs text-[#52525B]">Issued {formatDate(cert.issued_at)}</p>
                          <p className="text-xs text-[#CCFF00] mt-2">ID: {cert.certificate_number}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0A0A0A] border border-[#27272A] p-6"
            >
              <h3 className="font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/ai-tutor"
                  className="flex items-center gap-3 p-3 bg-[#121212] hover:bg-[#1a1a1a] transition-colors group"
                >
                  <Brain className="w-5 h-5 text-[#CCFF00]" />
                  <span className="text-sm text-white">Ask AI Tutor</span>
                  <ArrowRight className="w-4 h-4 text-[#52525B] ml-auto group-hover:text-[#CCFF00] transition-colors" />
                </Link>
                <Link 
                  to="/courses"
                  className="flex items-center gap-3 p-3 bg-[#121212] hover:bg-[#1a1a1a] transition-colors group"
                >
                  <BookOpen className="w-5 h-5 text-[#CCFF00]" />
                  <span className="text-sm text-white">Browse Courses</span>
                  <ArrowRight className="w-4 h-4 text-[#52525B] ml-auto group-hover:text-[#CCFF00] transition-colors" />
                </Link>
                <Link 
                  to="/certificates"
                  className="flex items-center gap-3 p-3 bg-[#121212] hover:bg-[#1a1a1a] transition-colors group"
                >
                  <GraduationCap className="w-5 h-5 text-[#CCFF00]" />
                  <span className="text-sm text-white">View Certificates</span>
                  <ArrowRight className="w-4 h-4 text-[#52525B] ml-auto group-hover:text-[#CCFF00] transition-colors" />
                </Link>
              </div>
            </motion.div>

            {/* Learning Tip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#CCFF00]/10 to-[#00FF66]/10 border border-[#27272A] p-6"
            >
              <h3 className="font-bold text-white mb-2">Learning Tip</h3>
              <p className="text-sm text-[#A1A1AA]">
                Consistency is key! Try to spend at least 30 minutes each day on your courses to maintain momentum.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnrollmentCard = ({ enrollment, api }) => {
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${enrollment.course_id}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };
    fetchCourse();
  }, [enrollment.course_id, api]);

  if (!course) {
    return (
      <div className="bg-[#0A0A0A] border border-[#27272A] h-32 animate-pulse" />
    );
  }

  return (
    <div 
      className="bg-[#0A0A0A] border border-[#27272A] p-6 card-hover cursor-pointer"
      onClick={() => navigate(`/learn/${course.id}`)}
    >
      <div className="flex gap-4">
        <div className="w-24 h-16 bg-[#121212] flex items-center justify-center shrink-0">
          <img 
            src="/images/logo.webp" 
            alt=""
            className="h-6 w-auto opacity-30"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className={`inline-block px-2 py-0.5 text-xs font-bold mb-2 ${getCourseTypeColor(course.course_type)}`}>
            {getCourseTypeLabel(course.course_type)}
          </span>
          <h3 className="font-bold text-white line-clamp-1 mb-2">{course.title}</h3>
          <div className="flex items-center gap-4 text-xs text-[#52525B] mb-3">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {course.modules?.length || 0} Modules
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {course.credit_hours} Hours
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={enrollment.progress} className="flex-1 h-2 bg-[#27272A]" />
            <span className="text-sm text-[#CCFF00] font-medium">{Math.round(enrollment.progress)}%</span>
          </div>
        </div>
        <Button 
          size="icon"
          className="bg-[#CCFF00] text-black hover:bg-[#B3E600] shrink-0"
        >
          <Play className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default StudentDashboard;
