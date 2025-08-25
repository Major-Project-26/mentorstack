"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { authAPI, Article, ArticlesResponse } from "../../lib/auth-api";
import Layout from "../../components/Layout";

export default function Articles() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ArticlesResponse['pagination'] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    'All',
    'Web Development',
    'AI', 
    'Cybersecurity',
    'IoT',
    'Frontend',
    'Backend',
    'NLP'
  ];

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const category = selectedCategory === 'All' ? undefined : selectedCategory;
      const response = await authAPI.getArticles(currentPage, 10, category);
      setArticles(response.articles);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    
    // Update URL
    const url = new URL(window.location.href);
    if (category === 'All') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', category);
    }
    window.history.pushState({}, '', url.toString());
  };

  const handleVote = async (articleId: number, voteType: 'upvote' | 'downvote') => {
    try {
      await authAPI.voteOnArticle(articleId, voteType);
      // Refresh articles to get updated vote counts
      fetchArticles();
    } catch (err) {
      console.error('Error voting on article:', err);
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

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Articles</h1>
                <p className="text-lg text-slate-600">
                  Discover insightful articles from our community of mentors
                </p>
              </div>
              
              <button
                onClick={() => router.push('/create-post')}
                className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create a Post
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar with Categories */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-emerald-100 text-emerald-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Category Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800">
                    {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
                  </h2>
                  {pagination && (
                    <span className="text-sm text-slate-600">
                      {pagination.totalArticles} articles found
                    </span>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                  <p className="text-slate-500 mt-2">Loading articles...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Failed to load articles</h3>
                  <p className="text-slate-500 mb-4">{error}</p>
                  <button 
                    onClick={fetchArticles}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                  >
                    Try Again
                  </button>
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">No articles found</h3>
                  <p className="text-slate-500 mb-6">
                    {selectedCategory === 'All' 
                      ? 'Be the first to create an article!' 
                      : `No articles in ${selectedCategory} category yet.`}
                  </p>
                  <button 
                    onClick={() => router.push('/create-post')}
                    className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition"
                  >
                    Create First Article
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {articles.map((article) => (
                    <div key={article.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Vote Section */}
                          <div className="flex flex-col items-center gap-1 min-w-[60px]">
                            <button
                              onClick={() => handleVote(article.id, 'upvote')}
                              title="Upvote article"
                              className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <span className="text-sm font-medium text-slate-700">
                              {article.upvotes - article.downvotes}
                            </span>
                            <button
                              onClick={() => handleVote(article.id, 'downvote')}
                              title="Downvote article"
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>

                          {/* Article Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-xl font-semibold text-slate-800 hover:text-emerald-600 cursor-pointer line-clamp-2">
                                {article.title}
                              </h3>
                              {article.imageUrls && article.imageUrls.length > 0 && (
                                <div className="ml-4 flex-shrink-0">
                                  <Image 
                                    src={article.imageUrls[0]} 
                                    alt={article.title}
                                    width={96}
                                    height={96}
                                    className="w-24 h-24 object-cover rounded-lg"
                                  />
                                </div>
                              )}
                            </div>
                            
                            <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                              {truncateContent(article.content)}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-sm text-slate-500">
                                <span>{formatDate(article.createdAt)}</span>
                                <span>•</span>
                                <span>by {article.authorName}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button 
                                  title="Comments"
                                  className="text-slate-400 hover:text-slate-600 p-1"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.476L3 21l1.476-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                                  </svg>
                                </button>
                                <span className="text-sm text-slate-500">0 Comments</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={!pagination.hasPrevPage}
                      className="px-3 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <span className="px-4 py-2 text-sm text-slate-600">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-3 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
