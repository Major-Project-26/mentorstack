import { BaseAPI, API_BASE_URL } from './base';
import type { Mentor } from './types';

export class MentorsAPI extends BaseAPI {
  async getMentors(): Promise<Mentor[]> {
    const response = await fetch(`${API_BASE_URL}/mentors`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<Mentor[]>(response);
  }

  // Mentor List methods (with request status)
  async getMentorsWithStatus(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/mentor-list/mentors`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<any[]>(response);
  }

  async getMentorshipRequestsByStatus(status: 'pending' | 'accepted' | 'rejected'): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/mentor-list/requests/${status}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<any[]>(response);
  }

  async sendMentorshipRequest(mentorId: string, message: string): Promise<{ message: string; request: any }> {
    const response = await fetch(`${API_BASE_URL}/mentor-list/request`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ mentorId, message }),
    });
    return this.handleResponse<{ message: string; request: any }>(response);
  }

  async cancelMentorshipRequest(mentorId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/mentor-list/request/${mentorId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async getMentorStats(mentorId: string): Promise<{
    answersProvided: number;
    articlesWritten: number;
    activeConnections: number;
    totalAcceptedRequests: number;
    reputation: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/mentor-list/mentor/${mentorId}/stats`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  // Mentee Request Methods (For Mentors)
  async getAllMentorshipRequests(): Promise<{
    success: boolean;
    requests: Array<{
      id: string;
      menteeId: number;
      name: string;
      email: string;
      avatar?: string;
      jobTitle?: string;
      department?: string;
      bio?: string;
      skills: string[];
      status: 'Pending' | 'Accepted' | 'Rejected';
      fullMessage: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
    total: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/mentee-request/requests`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async acceptMentorshipRequest(requestId: string): Promise<{
    success: boolean;
    message: string;
    data: {
      requestId: number;
      status: string;
      connectionId: number;
      conversationId: number;
      mentee: {
        id: number;
        name: string;
        email: string;
        avatarUrl?: string;
      };
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/mentee-request/accept/${requestId}`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }

  async rejectMentorshipRequest(requestId: string): Promise<{
    success: boolean;
    message: string;
    data: {
      requestId: number;
      status: string;
      mentee: {
        id: number;
        name: string;
        email: string;
        avatarUrl?: string;
      };
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/mentee-request/reject/${requestId}`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });
    return this.handleResponse(response);
  }
}
