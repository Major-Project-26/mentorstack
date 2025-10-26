import { BaseAPI, API_BASE_URL } from './base';
import type { Question, Answer } from './types';

export class QuestionsAPI extends BaseAPI {
  async getQuestions(): Promise<Question[]> {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<Question[]>(response);
  }

  async getQuestion(questionId: number): Promise<Question> {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<Question>(response);
  }

  async submitQuestion(title: string, body: string, tags: string[]): Promise<{ message: string; question: Question }> {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ title, body, tags }),
    });
    return this.handleResponse<{ message: string; question: Question }>(response);
  }

  async updateQuestion(questionId: number, data: { title: string; body: string; tags: string[] }): Promise<{ message: string; question: Question }> {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return this.handleResponse<{ message: string; question: Question }>(response);
  }

  async deleteQuestion(questionId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  // Answer methods
  async submitAnswer(questionId: number, content: string): Promise<{ message: string; answer: Answer }> {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answers`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ content }),
    });
    return this.handleResponse<{ message: string; answer: Answer }>(response);
  }

  async updateAnswer(questionId: number, answerId: number, content: string): Promise<{ message: string; answer: Answer }> {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answers/${answerId}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify({ content }),
    });
    return this.handleResponse<{ message: string; answer: Answer }>(response);
  }

  async deleteAnswer(questionId: number, answerId: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answers/${answerId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async voteOnAnswer(questionId: number, answerId: number, voteType: 'upvote' | 'downvote'): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answers/${answerId}/vote`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ voteType }),
    });
    return this.handleResponse<{ message: string }>(response);
  }
}
