import { BaseAPI, API_BASE_URL } from './base';
import type { Article, Question } from './types';

export class TagsAPI extends BaseAPI {
  async getAllTags(): Promise<Array<{
    name: string;
    articleCount: number;
    questionCount: number;
    communityPostCount: number;
    totalCount: number;
    color: string;
  }>> {
    const response = await fetch(`${API_BASE_URL}/tags/all`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getTagContent(tagName: string): Promise<{
    tagName: string;
    stats: {
      totalArticles: number;
      totalQuestions: number;
      totalCommunities: number;
      totalContent: number;
    };
    articles: Article[];
    questions: Question[];
    communities: Array<{
      id: number;
      name: string;
      description: string;
      skills: string[];
      creatorName: string;
      memberCount: number;
      postCount: number;
      createdAt: string;
    }>;
  }> {
    const response = await fetch(`${API_BASE_URL}/tags/${encodeURIComponent(tagName)}/content`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}
