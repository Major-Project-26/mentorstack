// Main API client - combines all API modules
import { AuthAPI } from './auth';
import { CommunitiesAPI } from './communities';
import { BookmarksAPI } from './bookmarks';
import { ProfilesAPI } from './profiles';
import { MentorsAPI } from './mentors';
import { QuestionsAPI } from './questions';
import { ArticlesAPI } from './articles';
import { TagsAPI } from './tags';

// Re-export all types
export * from './types';
export { API_BASE_URL } from './base';

class APIClient extends AuthAPI {
  communities: CommunitiesAPI;
  bookmarks: BookmarksAPI;
  profiles: ProfilesAPI;
  mentors: MentorsAPI;
  questions: QuestionsAPI;
  articles: ArticlesAPI;
  tags: TagsAPI;

  constructor() {
    super();
    this.communities = new CommunitiesAPI();
    this.bookmarks = new BookmarksAPI();
    this.profiles = new ProfilesAPI();
    this.mentors = new MentorsAPI();
    this.questions = new QuestionsAPI();
    this.articles = new ArticlesAPI();
    this.tags = new TagsAPI();
  }

  // Backward compatibility methods - delegate to modules
  
  // Bookmarks
  async getMyBookmarks() {
    return this.bookmarks.getMyBookmarks();
  }

  async addQuestionBookmark(questionId: number) {
    return this.bookmarks.addQuestionBookmark(questionId);
  }

  async removeQuestionBookmark(questionId: number) {
    return this.bookmarks.removeQuestionBookmark(questionId);
  }

  async addArticleBookmark(articleId: number) {
    return this.bookmarks.addArticleBookmark(articleId);
  }

  async removeArticleBookmark(articleId: number) {
    return this.bookmarks.removeArticleBookmark(articleId);
  }

  async addCommunityPostBookmark(postId: number) {
    return this.bookmarks.addCommunityPostBookmark(postId);
  }

  async removeCommunityPostBookmark(postId: number) {
    return this.bookmarks.removeCommunityPostBookmark(postId);
  }

  // Profiles
  async getMenteeProfile() {
    return this.profiles.getMenteeProfile();
  }

  async updateMenteeProfile(data: Parameters<ProfilesAPI['updateMenteeProfile']>[0]) {
    return this.profiles.updateMenteeProfile(data);
  }

  async getMentorProfile() {
    return this.profiles.getMentorProfile();
  }

  async updateMentorProfile(data: Parameters<ProfilesAPI['updateMentorProfile']>[0]) {
    return this.profiles.updateMentorProfile(data);
  }

  // Mentors
  async getMentors() {
    return this.mentors.getMentors();
  }

  async getMentorsWithStatus() {
    return this.mentors.getMentorsWithStatus();
  }

  async getMentorshipRequestsByStatus(status: 'pending' | 'accepted' | 'rejected') {
    return this.mentors.getMentorshipRequestsByStatus(status);
  }

  async sendMentorshipRequest(mentorId: string, message: string) {
    return this.mentors.sendMentorshipRequest(mentorId, message);
  }

  async cancelMentorshipRequest(mentorId: string) {
    return this.mentors.cancelMentorshipRequest(mentorId);
  }

  async getMentorStats(mentorId: string) {
    return this.mentors.getMentorStats(mentorId);
  }

  async getAllMentorshipRequests() {
    return this.mentors.getAllMentorshipRequests();
  }

  async acceptMentorshipRequest(requestId: string) {
    return this.mentors.acceptMentorshipRequest(requestId);
  }

  async rejectMentorshipRequest(requestId: string) {
    return this.mentors.rejectMentorshipRequest(requestId);
  }

  // Questions
  async getQuestions() {
    return this.questions.getQuestions();
  }

  async getQuestion(questionId: number) {
    return this.questions.getQuestion(questionId);
  }

  async submitQuestion(title: string, body: string, tags: string[]) {
    return this.questions.submitQuestion(title, body, tags);
  }

  async updateQuestion(questionId: number, data: Parameters<QuestionsAPI['updateQuestion']>[1]) {
    return this.questions.updateQuestion(questionId, data);
  }

  async deleteQuestion(questionId: number) {
    return this.questions.deleteQuestion(questionId);
  }

  async submitAnswer(questionId: number, content: string) {
    return this.questions.submitAnswer(questionId, content);
  }

  async updateAnswer(questionId: number, answerId: number, content: string) {
    return this.questions.updateAnswer(questionId, answerId, content);
  }

  async deleteAnswer(questionId: number, answerId: number) {
    return this.questions.deleteAnswer(questionId, answerId);
  }

  async voteOnAnswer(questionId: number, answerId: number, voteType: 'upvote' | 'downvote') {
    return this.questions.voteOnAnswer(questionId, answerId, voteType);
  }

  // Articles
  async getArticles(page?: number, limit?: number, category?: string) {
    return this.articles.getArticles(page, limit, category);
  }

  async getArticle(id: number) {
    return this.articles.getArticle(id);
  }

  async createArticle(formData: FormData) {
    return this.articles.createArticle(formData);
  }

  async updateArticle(articleId: number, formData: FormData) {
    return this.articles.updateArticle(articleId, formData);
  }

  async deleteArticle(articleId: number) {
    return this.articles.deleteArticle(articleId);
  }

  async voteOnArticle(articleId: number, voteType: 'upvote' | 'downvote') {
    return this.articles.voteOnArticle(articleId, voteType);
  }

  async getPopularTags() {
    return this.articles.getPopularTags();
  }

  async getMyArticles() {
    return this.articles.getMyArticles();
  }

  async searchArticles(query: string) {
    return this.articles.searchArticles(query);
  }

  // Tags
  async getAllTags() {
    return this.tags.getAllTags();
  }

  async getTagContent(tagName: string) {
    return this.tags.getTagContent(tagName);
  }

  // Communities (delegate to communities module)
  async getCommunities() {
    return this.communities.getCommunities();
  }

  async getCommunityCategories() {
    return this.communities.getCommunityCategories();
  }

  async getCommunity(id: number) {
    return this.communities.getCommunity(id);
  }

  async createCommunity(data: Parameters<CommunitiesAPI['createCommunity']>[0]) {
    return this.communities.createCommunity(data);
  }

  async updateCommunity(id: number, data: Parameters<CommunitiesAPI['updateCommunity']>[1]) {
    return this.communities.updateCommunity(id, data);
  }

  async deleteCommunity(id: number) {
    return this.communities.deleteCommunity(id);
  }

  async joinCommunity(communityId: number) {
    return this.communities.joinCommunity(communityId);
  }

  async leaveCommunity(communityId: number) {
    return this.communities.leaveCommunity(communityId);
  }

  async checkCommunityMembership(communityId: number) {
    return this.communities.checkCommunityMembership(communityId);
  }

  async getCommunityPosts(communityId: number, page?: number, limit?: number) {
    return this.communities.getCommunityPosts(communityId, page, limit);
  }

  async createCommunityPost(communityId: number, data: Parameters<CommunitiesAPI['createCommunityPost']>[1]) {
    return this.communities.createCommunityPost(communityId, data);
  }

  async updateCommunityPost(communityId: number, postId: number, data: Parameters<CommunitiesAPI['updateCommunityPost']>[2]) {
    return this.communities.updateCommunityPost(communityId, postId, data);
  }

  async deleteCommunityPost(communityId: number, postId: number) {
    return this.communities.deleteCommunityPost(communityId, postId);
  }

  async voteOnCommunityPost(communityId: number, postId: number, voteType: 'upvote' | 'downvote') {
    return this.communities.voteOnCommunityPost(communityId, postId, voteType);
  }

  async searchCommunities(query: string) {
    return this.communities.searchCommunities(query);
  }
}

// Create singleton instance
const apiClient = new APIClient();

export default apiClient;
export const authAPI = apiClient; // For backward compatibility
