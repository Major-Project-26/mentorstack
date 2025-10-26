import { BaseAPI, API_BASE_URL } from './base';
import type { MenteeProfile, MentorProfile, UpdateProfileResponse } from './types';

export class ProfilesAPI extends BaseAPI {
  // Mentee profile methods
  async getMenteeProfile(): Promise<MenteeProfile> {
    const response = await fetch(`${API_BASE_URL}/mentees/profile/me`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<MenteeProfile>(response);
  }

  async updateMenteeProfile(data: { name: string; bio: string; skills: string[] }): Promise<UpdateProfileResponse> {
    const response = await fetch(`${API_BASE_URL}/mentees/profile/me`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse<UpdateProfileResponse>(response);
  }

  // Mentor profile methods
  async getMentorProfile(): Promise<MentorProfile> {
    const response = await fetch(`${API_BASE_URL}/mentors/profile/me`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<MentorProfile>(response);
  }

  async updateMentorProfile(data: { name: string; bio: string; skills: string[]; location?: string }): Promise<UpdateProfileResponse> {
    const response = await fetch(`${API_BASE_URL}/mentors/profile/me`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse<UpdateProfileResponse>(response);
  }
}
