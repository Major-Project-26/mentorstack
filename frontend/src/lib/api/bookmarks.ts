import { BaseAPI, API_BASE_URL } from './base';

export class BookmarksAPI extends BaseAPI {
  async getMyBookmarks(): Promise<{
    questions: Array<{ questionId: number; title: string; createdAt: string }>;
    articles: Array<{ articleId: number; title: string; createdAt: string }>;
    posts: Array<{ postId: number; title: string; communityId: number; communityName?: string; createdAt: string }>;
  }> {
    const response = await fetch(`${API_BASE_URL}/bookmarks`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async addQuestionBookmark(questionId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/bookmarks/questions/${questionId}`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async removeQuestionBookmark(questionId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/bookmarks/questions/${questionId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async addArticleBookmark(articleId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/bookmarks/articles/${articleId}`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async removeArticleBookmark(articleId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/bookmarks/articles/${articleId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async addCommunityPostBookmark(postId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/bookmarks/community-posts/${postId}`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async removeCommunityPostBookmark(postId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/bookmarks/community-posts/${postId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }
}
