'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/admin-api';
import {
    Users,
    Search,
    Edit,
    UserX,
    Mail,
    Briefcase,
    MapPin,
    Star,
    Award,
    MessageSquare,
    FileText,
    BookOpen,
    Calendar,
    ChevronLeft,
    Filter,
    MoreVertical,
    CheckCircle,
    XCircle
} from 'lucide-react';

// Hardcoded data for now
const HARDCODED_MENTORS = [
    {
        id: 1,
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@mentorstack.com',
        role: 'mentor',
        avatarUrl: null,
        jobTitle: 'Senior Software Engineer',
        department: 'Engineering',
        bio: 'Passionate about mentoring junior developers in full-stack development and system design.',
        skills: ['React', 'Node.js', 'System Design', 'TypeScript', 'AWS'],
        location: 'San Francisco, CA',
        reputation: 1250,
        createdAt: '2024-01-15T08:00:00Z',
        _count: {
            questions: 15,
            answers: 89,
            articles: 12,
            mentorConnections: 8,
            menteeConnections: 0,
            communityPosts: 23
        }
    },
    {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@mentorstack.com',
        role: 'mentor',
        avatarUrl: null,
        jobTitle: 'Tech Lead',
        department: 'Product Development',
        bio: 'Experienced in guiding teams through agile transformations and cloud migrations.',
        skills: ['Leadership', 'DevOps', 'Kubernetes', 'Python', 'Microservices'],
        location: 'New York, NY',
        reputation: 980,
        createdAt: '2024-02-10T10:30:00Z',
        _count: {
            questions: 8,
            answers: 67,
            articles: 9,
            mentorConnections: 12,
            menteeConnections: 0,
            communityPosts: 18
        }
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@mentorstack.com',
        role: 'mentor',
        avatarUrl: null,
        jobTitle: 'Data Science Manager',
        department: 'Analytics',
        bio: 'Helping aspiring data scientists learn ML/AI and best practices in data engineering.',
        skills: ['Machine Learning', 'Python', 'TensorFlow', 'Data Visualization', 'SQL'],
        location: 'Austin, TX',
        reputation: 1450,
        createdAt: '2024-01-20T14:15:00Z',
        _count: {
            questions: 12,
            answers: 102,
            articles: 15,
            mentorConnections: 15,
            menteeConnections: 0,
            communityPosts: 31
        }
    },
    {
        id: 4,
        name: 'James Williams',
        email: 'james.williams@mentorstack.com',
        role: 'mentor',
        avatarUrl: null,
        jobTitle: 'Principal Engineer',
        department: 'Infrastructure',
        bio: 'Mentor focused on cloud architecture, scalability, and performance optimization.',
        skills: ['AWS', 'Azure', 'Terraform', 'Docker', 'Performance Optimization'],
        location: 'Seattle, WA',
        reputation: 820,
        createdAt: '2024-03-05T09:00:00Z',
        _count: {
            questions: 6,
            answers: 54,
            articles: 7,
            mentorConnections: 6,
            menteeConnections: 0,
            communityPosts: 14
        }
    }
];

const HARDCODED_MENTEES = [
    {
        id: 5,
        name: 'Alex Thompson',
        email: 'alex.thompson@mentorstack.com',
        role: 'mentee',
        avatarUrl: null,
        jobTitle: 'Junior Developer',
        department: 'Engineering',
        bio: 'Eager to learn full-stack development and best coding practices.',
        skills: ['JavaScript', 'React', 'HTML/CSS', 'Git'],
        location: 'Boston, MA',
        reputation: 145,
        createdAt: '2024-04-12T11:20:00Z',
        _count: {
            questions: 28,
            answers: 12,
            articles: 2,
            mentorConnections: 0,
            menteeConnections: 2,
            communityPosts: 8
        }
    },
    {
        id: 6,
        name: 'Priya Patel',
        email: 'priya.patel@mentorstack.com',
        role: 'mentee',
        avatarUrl: null,
        jobTitle: 'Data Analyst',
        department: 'Analytics',
        bio: 'Looking to transition into data science and machine learning.',
        skills: ['SQL', 'Excel', 'Python', 'Statistics'],
        location: 'Chicago, IL',
        reputation: 210,
        createdAt: '2024-03-28T13:45:00Z',
        _count: {
            questions: 35,
            answers: 18,
            articles: 1,
            mentorConnections: 0,
            menteeConnections: 3,
            communityPosts: 12
        }
    },
    {
        id: 7,
        name: 'David Kim',
        email: 'david.kim@mentorstack.com',
        role: 'mentee',
        avatarUrl: null,
        jobTitle: 'Software Engineer Intern',
        department: 'Product Development',
        bio: 'Computer Science student seeking guidance in backend development.',
        skills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
        location: 'Los Angeles, CA',
        reputation: 98,
        createdAt: '2024-05-03T10:00:00Z',
        _count: {
            questions: 42,
            answers: 5,
            articles: 0,
            mentorConnections: 0,
            menteeConnections: 1,
            communityPosts: 6
        }
    },
    {
        id: 8,
        name: 'Sophie Martinez',
        email: 'sophie.martinez@mentorstack.com',
        role: 'mentee',
        avatarUrl: null,
        jobTitle: 'Frontend Developer',
        department: 'Engineering',
        bio: 'Passionate about UI/UX and modern frontend frameworks.',
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
        location: 'Denver, CO',
        reputation: 187,
        createdAt: '2024-04-18T15:30:00Z',
        _count: {
            questions: 22,
            answers: 15,
            articles: 3,
            mentorConnections: 0,
            menteeConnections: 2,
            communityPosts: 10
        }
    },
    {
        id: 9,
        name: 'Ryan Foster',
        email: 'ryan.foster@mentorstack.com',
        role: 'mentee',
        avatarUrl: null,
        jobTitle: 'Associate Developer',
        department: 'Engineering',
        bio: 'Learning cloud technologies and DevOps practices.',
        skills: ['Docker', 'Linux', 'Python', 'CI/CD'],
        location: 'Portland, OR',
        reputation: 156,
        createdAt: '2024-05-10T09:15:00Z',
        _count: {
            questions: 31,
            answers: 9,
            articles: 1,
            mentorConnections: 0,
            menteeConnections: 1,
            communityPosts: 7
        }
    }
];

type User = typeof HARDCODED_MENTORS[0];

export default function AdminUsersPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'mentors' | 'mentees'>('mentors');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            if (!adminAPI.isAuthenticated()) {
                router.push('/admin/login');
            }
        } catch (error) {
            router.push('/admin/login');
        }
    };

    const users = activeTab === 'mentors' ? HARDCODED_MENTORS : HARDCODED_MENTEES;

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleViewUser = (user: User) => {
        setSelectedUser(user);
        setIsEditing(false);
        setShowModal(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeactivateUser = (user: User) => {
        if (confirm(`Are you sure you want to deactivate ${user.name}?`)) {
            alert(`User ${user.name} would be deactivated (backend not implemented)`);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setIsEditing(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="p-2 hover:bg-slate-100 rounded-lg transition"
                            >
                                <ChevronLeft className="w-5 h-5 text-slate-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <Users className="w-7 h-7 text-emerald-600" />
                                    User Management
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    View and manage mentor and mentee accounts
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm text-slate-600">Total Users</p>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {HARDCODED_MENTORS.length + HARDCODED_MENTEES.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tabs and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
                    <div className="p-6">
                        {/* Tabs */}
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setActiveTab('mentors')}
                                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${activeTab === 'mentors'
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Award className="w-5 h-5" />
                                    <span>Mentors ({HARDCODED_MENTORS.length})</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('mentees')}
                                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${activeTab === 'mentees'
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Users className="w-5 h-5" />
                                    <span>Mentees ({HARDCODED_MENTEES.length})</span>
                                </div>
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, job title, or skills..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Active {activeTab === 'mentors' ? 'Mentors' : 'Mentees'}</p>
                                <p className="text-2xl font-bold text-slate-800 mt-1">{filteredUsers.length}</p>
                            </div>
                            <div className="p-3 bg-emerald-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Total Questions</p>
                                <p className="text-2xl font-bold text-slate-800 mt-1">
                                    {filteredUsers.reduce((sum, u) => sum + u._count.questions, 0)}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <MessageSquare className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Total Answers</p>
                                <p className="text-2xl font-bold text-slate-800 mt-1">
                                    {filteredUsers.reduce((sum, u) => sum + u._count.answers, 0)}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <FileText className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600">Total Reputation</p>
                                <p className="text-2xl font-bold text-slate-800 mt-1">
                                    {filteredUsers.reduce((sum, u) => sum + u.reputation, 0)}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Star className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">User</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Job Title</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Skills</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Reputation</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Activity</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Joined</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold shadow-md">
                                                    {getInitials(user.name)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800">{user.name}</p>
                                                    <p className="text-sm text-slate-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-slate-700 flex items-center gap-1">
                                                    <Briefcase className="w-4 h-4 text-slate-400" />
                                                    {user.jobTitle}
                                                </p>
                                                <p className="text-sm text-slate-500">{user.department}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {user.skills.slice(0, 3).map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-md font-medium"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {user.skills.length > 3 && (
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                                                        +{user.skills.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="font-semibold text-slate-800">{user.reputation}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="text-sm text-slate-600">
                                                    <span className="font-medium">{user._count.questions}</span> questions
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    <span className="font-medium">{user._count.answers}</span> answers
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-slate-600">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(user.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewUser(user)}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition text-sm font-medium flex items-center gap-1"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeactivateUser(user)}
                                                    className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium flex items-center gap-1"
                                                >
                                                    <UserX className="w-4 h-4" />
                                                    Deactivate
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-600 font-medium">No users found</p>
                                <p className="text-sm text-slate-400 mt-1">Try adjusting your search criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* User Detail/Edit Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                {isEditing ? (
                                    <>
                                        <Edit className="w-6 h-6 text-emerald-600" />
                                        Edit User Profile
                                    </>
                                ) : (
                                    <>
                                        <Users className="w-6 h-6 text-emerald-600" />
                                        User Profile
                                    </>
                                )}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-slate-100 rounded-lg transition"
                            >
                                <XCircle className="w-6 h-6 text-slate-600" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Profile Header */}
                            <div className="flex items-start gap-6 pb-6 border-b border-slate-200">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                    {getInitials(selectedUser.name)}
                                </div>
                                <div className="flex-1">
                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                defaultValue={selectedUser.name}
                                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                                placeholder="Full Name"
                                            />
                                            <input
                                                type="email"
                                                defaultValue={selectedUser.email}
                                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                                placeholder="Email"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="text-2xl font-bold text-slate-800">{selectedUser.name}</h3>
                                            <p className="text-slate-600 flex items-center gap-2 mt-1">
                                                <Mail className="w-4 h-4" />
                                                {selectedUser.email}
                                            </p>
                                            <div className="flex items-center gap-4 mt-3">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${selectedUser.role === 'mentor'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                                                </span>
                                                <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                                                    <Star className="w-5 h-5 fill-yellow-500" />
                                                    {selectedUser.reputation} Rep
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Professional Info */}
                            <div>
                                <h4 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-emerald-600" />
                                    Professional Information
                                </h4>
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            defaultValue={selectedUser.jobTitle || ''}
                                            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                            placeholder="Job Title"
                                        />
                                        <input
                                            type="text"
                                            defaultValue={selectedUser.department || ''}
                                            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                            placeholder="Department"
                                        />
                                        <input
                                            type="text"
                                            defaultValue={selectedUser.location || ''}
                                            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                            placeholder="Location"
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-sm text-slate-500 mb-1">Job Title</p>
                                            <p className="font-semibold text-slate-800">{selectedUser.jobTitle || 'N/A'}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="text-sm text-slate-500 mb-1">Department</p>
                                            <p className="font-semibold text-slate-800">{selectedUser.department || 'N/A'}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-4 col-span-2">
                                            <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                Location
                                            </p>
                                            <p className="font-semibold text-slate-800">{selectedUser.location || 'N/A'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bio */}
                            <div>
                                <h4 className="text-lg font-bold text-slate-800 mb-3">Bio</h4>
                                {isEditing ? (
                                    <textarea
                                        defaultValue={selectedUser.bio || ''}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 min-h-[100px]"
                                        placeholder="User bio..."
                                    />
                                ) : (
                                    <p className="text-slate-600 bg-slate-50 rounded-lg p-4">
                                        {selectedUser.bio || 'No bio provided'}
                                    </p>
                                )}
                            </div>

                            {/* Skills */}
                            <div>
                                <h4 className="text-lg font-bold text-slate-800 mb-3">Skills</h4>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        defaultValue={selectedUser.skills.join(', ')}
                                        className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                                        placeholder="Skills (comma-separated)"
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUser.skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Activity Stats */}
                            <div>
                                <h4 className="text-lg font-bold text-slate-800 mb-3">Activity Statistics</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                                        <MessageSquare className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-blue-700">{selectedUser._count.questions}</p>
                                        <p className="text-sm text-blue-600">Questions</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4 text-center">
                                        <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-green-700">{selectedUser._count.answers}</p>
                                        <p className="text-sm text-green-600">Answers</p>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                                        <BookOpen className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-purple-700">{selectedUser._count.articles}</p>
                                        <p className="text-sm text-purple-600">Articles</p>
                                    </div>
                                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                                        <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-orange-700">{selectedUser._count.communityPosts}</p>
                                        <p className="text-sm text-orange-600">Posts</p>
                                    </div>
                                    <div className="bg-pink-50 rounded-lg p-4 text-center">
                                        <Award className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-pink-700">
                                            {selectedUser._count.mentorConnections + selectedUser._count.menteeConnections}
                                        </p>
                                        <p className="text-sm text-pink-600">Connections</p>
                                    </div>
                                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                        <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-yellow-700">{selectedUser.reputation}</p>
                                        <p className="text-sm text-yellow-600">Reputation</p>
                                    </div>
                                </div>
                            </div>

                            {/* Member Since */}
                            <div className="bg-slate-50 rounded-lg p-4">
                                <p className="text-sm text-slate-500 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Member since {formatDate(selectedUser.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
                            <button
                                onClick={handleCloseModal}
                                className="px-6 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            {isEditing && (
                                <button
                                    onClick={() => {
                                        alert('Save functionality would update the database (not implemented)');
                                        handleCloseModal();
                                    }}
                                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition shadow-md"
                                >
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
