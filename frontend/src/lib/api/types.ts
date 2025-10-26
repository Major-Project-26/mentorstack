// Shared type definitions for API

// Auth types
export interface SignupData {
  email: string;
  password: string;
  role: 'mentor' | 'mentee';
  firstName: string;
  lastName: string;
  skills: string[];
  bio: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'mentor' | 'mentee' | 'admin';
  avatarUrl?: string | null;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface UserResponse {
  user: User;
}

// Profile types
export interface MenteeProfile {
  id: number;
  name: string;
  email: string;
  bio: string;
  avatarUrl?: string | null;
  skills: string[];
  reputation: number;
  joinedDate: string;
  questions: Question[];
  communityPosts: Array<{
    id: number;
    title: string;
    content: string;
    communityId: number;
    communityName: string;
    createdAt: string;
    upvotes: number;
    downvotes: number;
  }>;
  answeredQuestions: Array<{
    id: number;
    questionId: number;
    questionTitle: string;
    content: string;
    createdAt: string;
    upvotes: number;
    downvotes: number;
  }>;
  articles: Array<{
    id: number;
    title: string;
    content: string;
    createdAt: string;
    upvotes: number;
    downvotes: number;
  }>;
  stats: {
    questionsAsked: number;
    bookmarksCount: number;
    mentorshipRequestsCount: number;
  };
}

export interface MentorProfile {
  id: number;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  skills: string[];
  location: string | null;
  jobTitle: string | null;
  department: string | null;
  reputation: number;
  joinedDate: string;
  questions: Question[];
  answers: Array<{
    id: number;
    content: string;
    createdAt: string;
    question: {
      id: number;
      title: string;
      createdAt: string;
    };
  }>;
  articles: Array<{
    id: number;
    title: string;
    content: string;
    createdAt: string;
  }>;
  connections: Array<{
    id: number;
    acceptedAt: string;
    mentee: {
      id: number;
      name: string;
      email: string;
    };
  }>;
  mentorshipRequests: Array<{
    id: number;
    status: string;
    requestMessage?: string;
    createdAt: string;
    mentee: {
      id: number;
      name: string;
    };
  }>;
  stats: {
    answersProvided: number;
    articlesWritten: number;
    menteesConnected: number;
    mentorshipRequests: number;
  };
}

export interface UpdateProfileResponse {
  message: string;
  profile: {
    id: number;
    name: string;
    bio: string;
    skills: string[];
  };
}

// Mentor types
export interface Mentor {
  id: number;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  skills: string[];
  location: string | null;
  reputation: number;
  jobTitle: string | null;
  department: string | null;
  createdAt: string;
}

// Question & Answer types
export interface Question {
  id: number;
  title: string;
  description?: string;
  tags: string[];
  createdAt: string;
  authorId?: number;
  authorName: string;
  answerCount?: number;
  answers?: Answer[];
}

export interface Answer {
  id: number;
  questionId: number;
  content: string;
  authorId?: number;
  authorName: string;
  authorRole: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  voteScore: number;
  userVote?: 'upvote' | 'downvote' | null;
}

// Community types
export interface Community {
  id: number;
  name: string;
  description: string;
  skills: string[];
  createdById: number;
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
  memberSkills?: string[];
  _count: {
    members: number;
    posts: number;
  };
}

export interface CommunityCategory {
  name: string;
  count: number;
  communities: string[];
}

export interface CommunityPost {
  id: number;
  communityId: number;
  authorId?: number;
  userRole: string;
  userId: number;
  userName?: string;
  title: string;
  content: string;
  imageUrls: string[];
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  votes: CommunityPostVote[];
  userVote: 'upvote' | 'downvote' | null;
  tags?: string[];
  _count: {
    votes: number;
  };
}

export interface CommunityPostVote {
  id: number;
  userRole: string;
  userId: number;
  postId: number;
  voteType: 'upvote' | 'downvote';
  createdAt: string;
  updatedAt: string;
}

export interface CommunityMember {
  id: number;
  communityId: number;
  userRole: string;
  userId: number;
  joinedAt: string;
  updatedAt: string;
}

// Article types
export interface Article {
  id: number;
  title: string;
  content: string;
  imageUrls: string[];
  authorId?: number;
  authorName: string;
  authorBio?: string;
  authorAvatar?: string;
  upvotes: number;
  downvotes: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesResponse {
  articles: Article[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalArticles: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Tag types
export interface Tag {
  name: string;
  count: number;
  color: string;
}
