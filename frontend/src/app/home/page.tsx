"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { authAPI, Question } from "../../lib/auth-api";

export default function Home() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentQuestions();
  }, []);

  const fetchRecentQuestions = async () => {
    try {
      setLoading(true);
      const recentQuestions = await authAPI.getQuestions();
      setQuestions(recentQuestions.slice(0, 5)); // Show only 5 recent questions
      setError(null);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">MS</span>
              </div>
              <span className="text-xl font-bold text-slate-800">MentorStack</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/profile')} className="text-slate-600 hover:text-slate-800 font-medium">
                Profile
              </button>
              <button 
                onClick={() => router.push('/')}
                className="text-slate-600 hover:text-slate-800 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Welcome to MentorStack! 🎉
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your account has been created successfully. You&apos;re now ready to start your mentorship journey.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Find Mentors</h3>
            <p className="text-slate-600 mb-4">Connect with experienced professionals in your field</p>
            <button className="w-full py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">
              Browse Mentors
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">❓</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Ask Questions</h3>
            <p className="text-slate-600 mb-4">Get answers from the community</p>
            <button 
              onClick={() => router.push('/ask-question')}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Ask Question
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🏘️</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Join Communities</h3>
            <p className="text-slate-600 mb-4">Connect with like-minded individuals</p>
            <button 
              onClick={() => router.push('/community')}
              className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              Explore Communities
            </button>
          </div>
        </div>

        {/* Recent Questions */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Recent Questions</h2>
            <button 
              onClick={() => router.push('/questions')}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All →
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="text-slate-500 mt-2">Loading questions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Failed to load questions</h3>
              <p className="text-slate-500 mb-4">{error}</p>
              <button 
                onClick={fetchRecentQuestions}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
              >
                Try Again
              </button>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No questions yet!</h3>
              <p className="text-slate-500 mb-6">Be the first to ask a question and get help from the community.</p>
              <button 
                onClick={() => router.push('/ask-question')}
                className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition"
              >
                Ask Your First Question
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-800 hover:text-emerald-600 cursor-pointer">
                      {question.title}
                    </h3>
                    <span className="text-sm text-slate-500">{formatDate(question.createdAt)}</span>
                  </div>
                  
                  {question.description && (
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {question.description.length > 150 
                        ? question.description.substring(0, 150) + '...' 
                        : question.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>by {question.authorName}</span>
                      <span>{question.answerCount || 0} answers</span>
                    </div>
                    
                    {question.tags && question.tags.length > 0 && (
                      <div className="flex gap-1">
                        {question.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {question.tags.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">
                            +{question.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
