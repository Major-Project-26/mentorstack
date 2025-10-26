import { BaseAPI, API_BASE_URL } from './base';
import type { Article, ArticlesResponse, Tag } from './types';

export class ArticlesAPI extends BaseAPI {
  async getArticles(page = 1, limit = 10, category?: string): Promise<ArticlesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (category) {
      params.append('category', category);
    }

    const response = await fetch(`${API_BASE_URL}/articles?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<ArticlesResponse>(response);
  }

  async getArticle(id: number): Promise<Article> {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<Article>(response);
  }

  async createArticle(formData: FormData): Promise<{ message: string; article: Article }> {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: formData,
    });
    return this.handleResponse<{ message: string; article: Article }>(response);
  }

  async updateArticle(articleId: number, formData: FormData): Promise<{ message: string; article: Article }> {
    const response = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: formData,
    });
    return this.handleResponse<{ message: string; article: Article }>(response);
  }

  async deleteArticle(articleId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async voteOnArticle(articleId: number, voteType: 'upvote' | 'downvote'): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/articles/${articleId}/vote`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ voteType }),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async getPopularTags(): Promise<Tag[]> {
    const response = await fetch(`${API_BASE_URL}/articles/tags/popular`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<Tag[]>(response);
  }

  async getMyArticles(): Promise<Article[]> {
    const response = await fetch(`${API_BASE_URL}/articles/my-articles`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<Article[]>(response);
  }

  async searchArticles(query: string): Promise<Article[]> {
    const response = await fetch(`${API_BASE_URL}/articles/search/${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<Article[]>(response);
  }
}
