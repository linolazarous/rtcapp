import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  Award,
  TrendingUp,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { formatPrice, formatDate, getCourseTypeLabel } from '../lib/utils';

const AdminDashboard = () => {
  const { api } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, usersRes, coursesRes] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/users'),
        api.get('/courses?is_published=true')
      ]);
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { new_role: newRole });
      toast.success('User role updated');
      fetchData();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  const stats = analytics ? [
    {
      label: 'Total Users',
      value: analytics.total_users,
      icon: Users,
      color: 'from-[#CCFF00] to-[#B3E600]'
    },
    {
      label: 'Total Courses',
      value: analytics.total_courses,
      icon: BookOpen,
      color: 'from-[#00FF66] to-[#00CC52]'
    },
    {
      label: 'Enrollments',
      value: analytics.total_enrollments,
      icon: TrendingUp,
      color: 'from-[#7C3AED] to-[#5B21B6]'
    },
    {
      label: 'Revenue',
      value: formatPrice(analytics.total_revenue || 0),
      icon: DollarSign,
      color: 'from-[#CCFF00] to-[#00FF66]'
    }
  ] : [];

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-20 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#CCFF00] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-20" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black text-white mb-2">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-[#A1A1AA]">Manage your platform</p>
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
              className="bg-[#0A0A0A] border border-[#27272A] p-6 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`} />
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-[#CCFF00]" />
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-sm text-[#52525B]">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-[#0A0A0A] border border-[#27272A] p-1">
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
            >
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="courses"
              className="data-[state=active]:bg-[#CCFF00] data-[state=active]:text-black"
            >
              Courses
            </TabsTrigger>
          </TabsList>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#52525B]" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] h-12"
            />
          </div>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-[#0A0A0A] border border-[#27272A] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#27272A]">
                      <th className="text-left p-4 text-sm font-medium text-[#A1A1AA]">User</th>
                      <th className="text-left p-4 text-sm font-medium text-[#A1A1AA]">Email</th>
                      <th className="text-left p-4 text-sm font-medium text-[#A1A1AA]">Role</th>
                      <th className="text-left p-4 text-sm font-medium text-[#A1A1AA]">Joined</th>
                      <th className="text-right p-4 text-sm font-medium text-[#A1A1AA]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-[#27272A] hover:bg-[#121212]">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#CCFF00] flex items-center justify-center">
                              <span className="text-black font-bold text-sm">
                                {user.full_name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-white font-medium">{user.full_name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-[#A1A1AA]">{user.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-bold ${
                            user.role === 'admin' ? 'bg-[#7C3AED] text-white' :
                            user.role === 'instructor' ? 'bg-[#00FF66] text-black' :
                            'bg-[#27272A] text-white'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-[#52525B]">{formatDate(user.created_at)}</td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#0A0A0A] border-[#27272A]">
                              <DropdownMenuItem 
                                onClick={() => handleRoleChange(user.id, 'student')}
                                className="cursor-pointer"
                              >
                                Set as Student
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleRoleChange(user.id, 'instructor')}
                                className="cursor-pointer"
                              >
                                Set as Instructor
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleRoleChange(user.id, 'admin')}
                                className="cursor-pointer"
                              >
                                Set as Admin
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="bg-[#0A0A0A] border border-[#27272A] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#27272A]">
                      <th className="text-left p-4 text-sm font-medium text-[#A1A1AA]">Course</th>
                      <th className="text-left p-4 text-sm font-medium text-[#A1A1AA]">Type</th>
                      <th className="text-left p-4 text-sm font-medium text-[#A1A1AA]">Price</th>
                      <th className="text-left p-4 text-sm font-medium text-[#A1A1AA]">Enrolled</th>
                      <th className="text-left p-4 text-sm font-medium text-[#A1A1AA]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="border-b border-[#27272A] hover:bg-[#121212]">
                        <td className="p-4">
                          <span className="text-white font-medium line-clamp-1">{course.title}</span>
                        </td>
                        <td className="p-4 text-[#A1A1AA]">{getCourseTypeLabel(course.course_type)}</td>
                        <td className="p-4 text-white">{formatPrice(course.price)}</td>
                        <td className="p-4 text-[#A1A1AA]">{course.enrolled_count || 0}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-bold ${
                            course.is_published ? 'bg-[#00FF66] text-black' : 'bg-[#27272A] text-white'
                          }`}>
                            {course.is_published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
