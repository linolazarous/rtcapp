import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  Search, 
  Clock, 
  BookOpen, 
  Users, 
  ArrowRight,
  Filter,
  GraduationCap
} from 'lucide-react';
import { formatPrice, getCourseTypeLabel, getCourseTypeColor } from '../lib/utils';

const CoursesPage = () => {
  const { api } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [courseType, setCourseType] = useState(searchParams.get('type') || 'all');

  useEffect(() => {
    fetchCourses();
  }, [courseType]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (courseType && courseType !== 'all') {
        params.append('course_type', courseType);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      const response = await api.get(`/courses?${params.toString()}`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleTypeChange = (value) => {
    setCourseType(value);
    setSearchParams(prev => {
      if (value === 'all') {
        prev.delete('type');
      } else {
        prev.set('type', value);
      }
      return prev;
    });
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] pt-20">
      {/* Hero Section */}
      <section className="py-12 md:py-20 border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              Course <span className="gradient-text">Catalog</span>
            </h1>
            <p className="text-[#A1A1AA] max-w-2xl mx-auto mb-8">
              Explore our comprehensive catalog of diploma, bachelor, and certification programs
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#52525B]" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] h-12"
                  data-testid="search-input"
                />
              </form>
              <Select value={courseType} onValueChange={handleTypeChange}>
                <SelectTrigger 
                  className="w-full md:w-[200px] bg-[#121212] border-[#27272A] text-white h-12"
                  data-testid="type-filter"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0A] border-[#27272A]">
                  <SelectItem value="all">All Programs</SelectItem>
                  <SelectItem value="diploma">Diploma Programs</SelectItem>
                  <SelectItem value="bachelor">Bachelor Programs</SelectItem>
                  <SelectItem value="certification">Certifications</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-[#A1A1AA]">
              Showing <span className="text-white font-medium">{filteredCourses.length}</span> programs
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#0A0A0A] border border-[#27272A] h-80 animate-pulse" />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <GraduationCap className="w-16 h-16 text-[#27272A] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
              <p className="text-[#A1A1AA]">Try adjusting your search or filters</p>
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
                    className="block bg-[#0A0A0A] border border-[#27272A] card-hover group h-full"
                    data-testid={`course-card-${course.id}`}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-[#121212] relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img 
                          src="/images/logo.webp" 
                          alt=""
                          className="h-12 w-auto opacity-20"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 text-xs font-bold ${getCourseTypeColor(course.course_type)}`}>
                          {getCourseTypeLabel(course.course_type)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#CCFF00] transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-[#A1A1AA] mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-4 text-xs text-[#52525B] mb-4">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {course.credit_hours} Credits
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration_months} Months
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {course.enrolled_count || 0} Students
                        </span>
                      </div>

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#27272A]">
                        <span className="text-xl font-bold text-white">
                          {formatPrice(course.price)}
                        </span>
                        <span className="text-[#CCFF00] flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CoursesPage;
