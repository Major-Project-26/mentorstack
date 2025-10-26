/**
 * @deprecated This file is kept for backward compatibility
 * Please use imports from '@/lib/api' instead
 * 
 * Example:
 * import apiClient from '@/lib/api';
 * import { type User, type Community } from '@/lib/api';
 */

// Re-export everything from the new modular API
export * from './api';
export { default, authAPI } from './api';

// Note: The original 1248-line auth-api.ts has been modularized into:
// - lib/api/base.ts - Base API class with common utilities
// - lib/api/types.ts - All TypeScript interfaces and types
// - lib/api/auth.ts - Authentication related APIs
// - lib/api/communities.ts - Community and post APIs
// - lib/api/bookmarks.ts - Bookmark management APIs
// - lib/api/profiles.ts - User profile APIs (mentee/mentor)
// - lib/api/mentors.ts - Mentor and mentorship request APIs
// - lib/api/questions.ts - Question and answer APIs
// - lib/api/articles.ts - Article management APIs
// - lib/api/tags.ts - Tag-based content retrieval APIs
// - lib/api/index.ts - Main entry point combining all modules

