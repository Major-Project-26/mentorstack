"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, Tag } from "../../lib/auth-api";
import Layout from "../../components/Layout";

export default function Tags() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const popularTags = await authAPI.getPopularTags();
      setTags(popularTags);
      setError(null);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTagClick = (tagName: string) => {
    // Navigate to articles filtered by this tag
    router.push(`/articles?category=${encodeURIComponent(tagName)}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-800 mb-4">
                Explore Topics
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Discover articles and content organized by topics and skills
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">
                  {filteredTags.length} topics found
                </span>
                <select 
                  title="Sort topics"
                  className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tags Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="text-slate-500 mt-2">Loading topics...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Failed to load topics</h3>
              <p className="text-slate-500 mb-4">{error}</p>
              <button 
                onClick={fetchTags}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredTags.map((tag, index) => (
                <div
                  key={index}
                  onClick={() => handleTagClick(tag.name)}
                  className={`${tag.color} border-2 border-transparent hover:border-emerald-300 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg group`}
                >
                  <div className="text-center">
                    <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">
                      {tag.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {tag.count} {tag.count === 1 ? 'article' : 'articles'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredTags.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No topics found</h3>
              <p className="text-slate-500">Try adjusting your search terms</p>
            </div>
          )}
        </div>

        {/* Additional Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Featured Topics */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Featured Topics</h3>
              <div className="space-y-3">
                {tags.slice(0, 5).map((tag, index) => (
                  <div 
                    key={index}
                    onClick={() => handleTagClick(tag.name)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${tag.color.replace('bg-', 'bg-').replace('-100', '-500')}`}></div>
                      <span className="font-medium text-slate-700">{tag.name}</span>
                    </div>
                    <span className="text-sm text-slate-500">{tag.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Trending Now</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-sm">🔥</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Web Development</p>
                    <p className="text-sm text-slate-500">+15 new articles this week</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">⚡</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">AI & Machine Learning</p>
                    <p className="text-sm text-slate-500">+12 new articles this week</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">🚀</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Cybersecurity</p>
                    <p className="text-sm text-slate-500">+8 new articles this week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
