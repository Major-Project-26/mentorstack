import { BaseAPI, API_BASE_URL } from './base';
import type {
  Community,
  CommunityCategory,
  CommunityMember,
  CommunityPost,
} from './types';

export class CommunitiesAPI extends BaseAPI {
  // Communities
  async getCommunities(): Promise<Community[]> {
    const response = await fetch(`${API_BASE_URL}/communities?includeSkills=true`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<Community[]>(response);
  }

  async getCommunityCategories(): Promise<CommunityCategory[]> {
    const response = await fetch(`${API_BASE_URL}/communities/categories`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<CommunityCategory[]>(response);
  }

  async getCommunity(id: number): Promise<Community> {
    const response = await fetch(`${API_BASE_URL}/communities/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<Community>(response);
  }

  async createCommunity(data: { name: string; description: string; skills: string[] }): Promise<Community> {
    const response = await fetch(`${API_BASE_URL}/communities`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Community>(response);
  }

  async updateCommunity(id: number, data: { name: string; description: string; skills: string[] }): Promise<Community> {
    const response = await fetch(`${API_BASE_URL}/communities/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Community>(response);
  }

  async deleteCommunity(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/communities/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async joinCommunity(communityId: number): Promise<{ message: string; member: CommunityMember }> {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/join`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<{ message: string; member: CommunityMember }>(response);
  }

  async leaveCommunity(communityId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/leave`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async checkCommunityMembership(communityId: number): Promise<{ isMember: boolean }> {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/membership`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<{ isMember: boolean }>(response);
  }

  // Community Posts
  async getCommunityPosts(communityId: number, page = 1, limit = 10): Promise<CommunityPost[]> {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/posts?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<CommunityPost[]>(response);
  }

  async createCommunityPost(
    communityId: number,
    data: { title: string; content: string; imageUrls?: string[]; tags?: string[] } | FormData
  ): Promise<CommunityPost> {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/posts`, {
      method: 'POST',
      headers: this.getHeaders(true, !isFormData),
      body: isFormData ? data : JSON.stringify(data),
    });
    return this.handleResponse<CommunityPost>(response);
  }

  async updateCommunityPost(
    communityId: number,
    postId: number,
    data: { title: string; content: string; tags?: string[] } | FormData
  ): Promise<CommunityPost> {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/posts/${postId}`, {
      method: 'PUT',
      headers: this.getHeaders(true, !isFormData),
      body: isFormData ? data : JSON.stringify(data),
    });
    return this.handleResponse<CommunityPost>(response);
  }

  async deleteCommunityPost(communityId: number, postId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/posts/${postId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async voteOnCommunityPost(
    communityId: number,
    postId: number,
    voteType: 'upvote' | 'downvote'
  ): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/posts/${postId}/vote`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ voteType }),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async searchCommunities(query: string): Promise<Community[]> {
    const response = await fetch(`${API_BASE_URL}/communities/search/${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<Community[]>(response);
  }
}
