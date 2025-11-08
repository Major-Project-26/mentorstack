"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "../../components/Layout";
import AvatarUpload from "../../components/AvatarUpload";
import { authAPI, MenteeProfile, MentorProfile } from "@/lib/auth-api";

export default function ProfilePage() {
  const [menteeProfile, setMenteeProfile] = useState<MenteeProfile | null>(null);
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [userRole, setUserRole] = useState<'mentor' | 'mentee' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("My Questions");
  const [bookmarks, setBookmarks] = useState<{
    questions: Array<{ questionId: number; title: string; createdAt: string }>;
    articles: Array<{ articleId: number; title: string; createdAt: string }>;
    posts: Array<{ postId: number; title: string; communityId: number; communityName?: string; createdAt: string }>;
  } | null>(null);
  const [bookmarkedSubTab, setBookmarkedSubTab] = useState<'Questions' | 'Articles' | 'Community Posts'>('Questions');
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // First get current user to determine role
        const user = await authAPI.getCurrentUser();
        setUserRole(user.user.role);

        if (user.user.role === 'mentee') {
          // Get mentee profile
          const profileData = await authAPI.getMenteeProfile();
          setMenteeProfile(profileData);
          setActiveTab("My Questions");
        } else if (user.user.role === 'mentor') {
          // Get mentor profile
          const profileData = await authAPI.getMentorProfile();
          setMentorProfile(profileData);
          setActiveTab("My Questions");
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  // Load bookmarks when Bookmarked tab becomes active for mentees
  useEffect(() => {
    const loadBookmarks = async () => {
      if (activeTab !== "Bookmarked") return;
      try {
        const res = await authAPI.getMyBookmarks();
        setBookmarks(res);
      } catch (e) {
        console.error("Failed to load bookmarks", e);
        setBookmarks({ questions: [], articles: [], posts: [] });
      }
    };
    loadBookmarks();
  }, [activeTab]);

  const handleSaveProfile = async () => {
    if (!menteeProfile && !mentorProfile) return;
    
    try {
      if (userRole === 'mentee' && menteeProfile) {
        await authAPI.updateMenteeProfile({
          name: menteeProfile.name,
          bio: menteeProfile.bio,
          skills: menteeProfile.skills
        });
      } else if (userRole === 'mentor' && mentorProfile) {
        await authAPI.updateMentorProfile({
          name: mentorProfile.name,
          bio: mentorProfile.bio,
          skills: mentorProfile.skills,
          location: mentorProfile.location || undefined
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64" style={{ backgroundColor: 'var(--color-neutral-dark)' }}>
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: 'var(--color-primary)' }}></div>
            <div className="text-lg" style={{ color: 'var(--color-tertiary)' }}>Loading profile...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!menteeProfile && !mentorProfile) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64" style={{ backgroundColor: 'var(--color-neutral-dark)' }}>
          <div className="text-lg" style={{ color: 'var(--color-tertiary)' }}>Profile not found</div>
        </div>
      </Layout>
    );
  }

  const profile = menteeProfile || mentorProfile;
  if (!profile) return null;

  return (
    <Layout>
      <div className="flex flex-1 p-8 gap-8 overflow-auto" style={{ backgroundColor: 'var(--color-neutral-dark)' }}>
        {/* Main Profile Content */}
        <div className="flex-1">
          {/* Profile Header with gradient and animation */}
          <div 
            className="rounded-2xl shadow-sm border p-8 mb-6 animate-fadeIn hover:shadow-lg transition-all duration-300"
            style={{
              backgroundColor: 'var(--color-neutral)',
              borderColor: 'var(--color-surface-dark)'
            }}
          >
            <div className="flex items-start gap-6">
              {/* Profile Picture with Upload */}
              <AvatarUpload
                currentAvatarUrl={profile.avatarUrl || null}
                onUploadSuccess={(newUrl) => {
                  if (menteeProfile) {
                    setMenteeProfile({ ...menteeProfile, avatarUrl: newUrl });
                  } else if (mentorProfile) {
                    setMentorProfile({ ...mentorProfile, avatarUrl: newUrl });
                  }
                }}
                onDeleteSuccess={() => {
                  if (menteeProfile) {
                    setMenteeProfile({ ...menteeProfile, avatarUrl: null });
                  } else if (mentorProfile) {
                    setMentorProfile({ ...mentorProfile, avatarUrl: null });
                  }
                }}
                size="xl"
                editable={true}
              />
              
              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2 animate-slideInRight">
                  <h1 className="text-3xl font-bold" style={{ color: 'var(--color-tertiary)' }}>{profile.name}</h1>
                  <span style={{ color: 'var(--color-tertiary-light)' }}>User{profile.id}</span>
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: userRole === 'mentor' ? 'var(--color-surface-light)' : 'var(--color-primary)',
                      color: userRole === 'mentor' ? 'var(--color-secondary)' : 'var(--color-neutral)'
                    }}
                  >
                    {userRole === 'mentor' ? '🎓 Mentor' : '📚 Mentee'}
                  </span>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="ml-auto p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:rotate-90"
                    style={{
                      color: 'var(--color-tertiary-light)',
                      backgroundColor: 'var(--color-surface-light)'
                    }}
                    title="Edit profile"
                    aria-label="Edit profile"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                
                {isEditing ? (
                  <div className="space-y-4 animate-fadeIn">
                    <textarea
                      value={profile.bio}
                      onChange={(e) => {
                        if (menteeProfile) {
                          setMenteeProfile({...menteeProfile, bio: e.target.value});
                        } else if (mentorProfile) {
                          setMentorProfile({...mentorProfile, bio: e.target.value});
                        }
                      }}
                      className="w-full p-3 rounded-lg resize-none transition-all duration-300 focus:ring-2 focus:outline-none"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-surface-dark)',
                        color: 'var(--color-tertiary)',
                        borderWidth: '1px',
                        borderStyle: 'solid'
                      }}
                      rows={2}
                      placeholder="Write a short description about yourself"
                    />
                    {userRole === 'mentor' && mentorProfile && (
                      <input
                        type="text"
                        value={mentorProfile.location || ''}
                        onChange={(e) => setMentorProfile({...mentorProfile, location: e.target.value})}
                        className="w-full p-3 rounded-lg transition-all duration-300 focus:ring-2 focus:outline-none"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-surface-dark)',
                          color: 'var(--color-tertiary)',
                          borderWidth: '1px',
                          borderStyle: 'solid'
                        }}
                        placeholder="Location (optional)"
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 animate-fadeIn">
                    <p className="mb-4" style={{ color: 'var(--color-tertiary)' }}>{profile.bio}</p>
                    {userRole === 'mentor' && mentorProfile?.location && (
                      <p className="text-sm" style={{ color: 'var(--color-tertiary-light)' }}>📍 {mentorProfile.location}</p>
                    )}
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-3 animate-fadeInUp">
                  <Link href="/ask-question">
                    <button 
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      style={{
                        backgroundColor: 'var(--color-surface-light)',
                        color: 'var(--color-secondary)'
                      }}
                    >
                      ❓ Ask Question
                    </button>
                  </Link>
                  <Link href="/create-article">
                    <button 
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      style={{
                        backgroundColor: 'var(--color-surface-light)',
                        color: 'var(--color-secondary)'
                      }}
                    >
                      ✍️ Write Article
                    </button>
                  </Link>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-tertiary)'
                    }}
                  >
                    {isEditing ? '❌ Cancel' : '✏️ Edit Profile'}
                  </button>
                  {isEditing && (
                    <button 
                      onClick={handleSaveProfile}
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fadeIn"
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-neutral)'
                      }}
                    >
                      💾 Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <div 
            className="rounded-2xl shadow-lg border animate-fadeIn"
            style={{
              backgroundColor: 'var(--color-neutral)',
              borderColor: 'var(--color-surface-dark)'
            }}
          >
            {/* Tab Navigation */}
            <div 
              className="px-6"
              style={{ 
                borderBottom: '1px solid var(--color-surface-dark)'
              }}
            >
              <div className="flex gap-8">
                {["My Questions", "Articles", "Posts", "Answered", "Bookmarked"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="py-4 font-medium border-b-2 transition-all duration-300 hover:scale-105"
                    style={{
                      borderColor: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                      color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-tertiary-light)'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Unified Tabs for Both Roles */}
              {profile && (
                <>
                  {activeTab === "My Questions" && (
                    <div className="animate-fadeIn">
                      {((menteeProfile?.questions || mentorProfile?.questions || []).length > 0) ? (
                        <div className="space-y-4">
                          {(menteeProfile?.questions || mentorProfile?.questions || []).map((question, index) => (
                            <div 
                              key={question.id} 
                              onClick={() => router.push(`/questions/${question.id}`)}
                              className="rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer animate-fadeInUp"
                              style={{
                                backgroundColor: 'var(--color-surface)',
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderColor: 'var(--color-surface-dark)',
                                animationDelay: `${index * 0.1}s`
                              }}
                            >
                              <h4 
                                className="font-semibold mb-2 transition-colors duration-300"
                                style={{ color: 'var(--color-tertiary)' }}
                              >
                                {question.title}
                              </h4>
                              {question.description && (
                                <p className="text-sm mb-3" style={{ color: 'var(--color-tertiary-light)' }}>{question.description}</p>
                              )}
                              {question.tags && question.tags.length > 0 && (
                                <div className="flex gap-2 mb-2">
                                  {question.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2 py-1 text-xs rounded-full"
                                      style={{
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'var(--color-neutral)'
                                      }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="text-xs" style={{ color: 'var(--color-tertiary-light)' }}>
                                {new Date(question.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 animate-fadeIn">
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-float"
                            style={{ backgroundColor: 'var(--color-surface-light)' }}
                          >
                            <span className="text-2xl">❓</span>
                          </div>
                          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-tertiary)' }}>No questions yet</h3>
                          <p className="mb-6" style={{ color: 'var(--color-tertiary-light)' }}>Start your learning journey by asking your first question.</p>
                          <Link href="/ask-question">
                            <button 
                              className="px-6 py-3 font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                              style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-neutral)'
                              }}
                            >
                              Ask Your First Question
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === "Posts" && (
                    <div className="animate-fadeIn">
                      {((menteeProfile?.communityPosts || []).length > 0) ? (
                        <div className="space-y-4">
                          {(menteeProfile?.communityPosts || []).map((post, index) => (
                            <div 
                              key={post.id} 
                              onClick={() => router.push(`/community/${post.communityId}/post/${post.id}`)}
                              className="rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer animate-fadeInUp"
                              style={{
                                backgroundColor: 'var(--color-surface)',
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderColor: 'var(--color-surface-dark)',
                                animationDelay: `${index * 0.1}s`
                              }}
                            >
                              <h4 className="font-semibold mb-2" style={{ color: 'var(--color-tertiary)' }}>{post.title}</h4>
                              <p className="text-sm mb-3 line-clamp-3" style={{ color: 'var(--color-tertiary-light)' }}>{post.content}</p>
                              <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-tertiary-light)' }}>
                                <span>in {post.communityName}</span>
                                <span>•</span>
                                <span>{post.upvotes - post.downvotes} votes</span>
                                <span>•</span>
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 animate-fadeIn">
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-float"
                            style={{ backgroundColor: 'var(--color-surface-light)' }}
                          >
                            <span className="text-2xl">💬</span>
                          </div>
                          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-tertiary)' }}>No community posts yet</h3>
                          <p style={{ color: 'var(--color-tertiary-light)' }}>Join a community and share your thoughts!</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "Articles" && (
                    <div className="animate-fadeIn">
                      {((menteeProfile?.articles || mentorProfile?.articles || []).length > 0) ? (
                        <div className="space-y-4">
                          {(menteeProfile?.articles || mentorProfile?.articles || []).map((article, index) => (
                            <div 
                              key={article.id} 
                              onClick={() => router.push(`/articles/${article.id}`)}
                              className="rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer animate-fadeInUp"
                              style={{
                                backgroundColor: 'var(--color-surface)',
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderColor: 'var(--color-surface-dark)',
                                animationDelay: `${index * 0.1}s`
                              }}
                            >
                              <h4 className="font-semibold mb-2" style={{ color: 'var(--color-tertiary)' }}>{article.title}</h4>
                              <p className="text-sm mb-3 line-clamp-3" style={{ color: 'var(--color-tertiary-light)' }}>{article.content}</p>
                              <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-tertiary-light)' }}>
                                {'upvotes' in article && 'downvotes' in article && (
                                  <>
                                    <span>{(article as any).upvotes - (article as any).downvotes} votes</span>
                                    <span>•</span>
                                  </>
                                )}
                                <span>Published on {new Date(article.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 animate-fadeIn">
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-float"
                            style={{ backgroundColor: 'var(--color-surface-light)' }}
                          >
                            <span className="text-2xl">📄</span>
                          </div>
                          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-tertiary)' }}>No articles yet</h3>
                          <p className="mb-6" style={{ color: 'var(--color-tertiary-light)' }}>Share your knowledge by writing your first article.</p>
                          <Link href="/create-article">
                            <button 
                              className="px-6 py-3 font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                              style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-neutral)'
                              }}
                            >
                              Write Your First Article
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "Answered" && (
                    <div className="animate-fadeIn">
                      {((menteeProfile?.answeredQuestions || mentorProfile?.answers || []).length > 0) ? (
                        <div className="space-y-4">
                          {(menteeProfile?.answeredQuestions || mentorProfile?.answers || []).map((answer, index) => {
                            const questionId = 'questionId' in answer ? answer.questionId : answer.question.id;
                            const questionTitle = 'questionTitle' in answer ? answer.questionTitle : answer.question.title;
                            const hasVotes = 'upvotes' in answer && 'downvotes' in answer;
                            
                            return (
                              <div 
                                key={answer.id} 
                                onClick={() => router.push(`/questions/${questionId}`)}
                                className="rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer animate-fadeInUp"
                                style={{
                                  backgroundColor: 'var(--color-surface)',
                                  borderWidth: '1px',
                                  borderStyle: 'solid',
                                  borderColor: 'var(--color-surface-dark)',
                                  animationDelay: `${index * 0.1}s`
                                }}
                              >
                                <h4 className="font-semibold mb-2" style={{ color: 'var(--color-tertiary)' }}>
                                  Re: {questionTitle}
                                </h4>
                                <p className="text-sm mb-3 line-clamp-3" style={{ color: 'var(--color-tertiary-light)' }}>{answer.content}</p>
                                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-tertiary-light)' }}>
                                  {hasVotes && (
                                    <>
                                      <span>{(answer as any).upvotes - (answer as any).downvotes} votes</span>
                                      <span>•</span>
                                    </>
                                  )}
                                  <span>Answered on {new Date(answer.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 animate-fadeIn">
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-float"
                            style={{ backgroundColor: 'var(--color-surface-light)' }}
                          >
                            <span className="text-2xl">💡</span>
                          </div>
                          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-tertiary)' }}>No answers yet</h3>
                          <p style={{ color: 'var(--color-tertiary-light)' }}>Start helping others by answering questions!</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "Bookmarked" && (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Sub-tabs navigation */}
                      <div 
                        className="-mx-6 px-6"
                        style={{ borderBottom: '1px solid var(--color-surface-dark)' }}
                      >
                        <div className="flex gap-6 overflow-x-auto">
                          {([
                            { key: 'Questions', count: bookmarks?.questions.length || 0 },
                            { key: 'Articles', count: bookmarks?.articles.length || 0 },
                            { key: 'Community Posts', count: bookmarks?.posts.length || 0 },
                          ] as Array<{ key: 'Questions' | 'Articles' | 'Community Posts'; count: number }>).map(({ key, count }) => (
                            <button
                              key={key}
                              onClick={() => setBookmarkedSubTab(key)}
                              className="py-3 font-medium border-b-2 transition-all duration-300 whitespace-nowrap hover:scale-105"
                              style={{
                                borderColor: bookmarkedSubTab === key ? 'var(--color-secondary)' : 'transparent',
                                color: bookmarkedSubTab === key ? 'var(--color-secondary)' : 'var(--color-tertiary-light)'
                              }}
                              aria-current={bookmarkedSubTab === key ? 'page' : undefined}
                            >
                              {key}
                              <span className="ml-2 text-xs" style={{ color: 'var(--color-tertiary-light)' }}>{count}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sub-tab content */}
                      {bookmarkedSubTab === 'Questions' && (
                        <div className="animate-fadeIn">
                          {bookmarks && bookmarks.questions.length > 0 ? (
                            <div className="space-y-3">
                              {bookmarks.questions.map((b, index) => (
                                <div 
                                  key={`q-${b.questionId}`} 
                                  className="rounded-lg p-3 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fadeInUp"
                                  style={{
                                    backgroundColor: 'var(--color-surface)',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: 'var(--color-surface-dark)',
                                    animationDelay: `${index * 0.05}s`
                                  }}
                                >
                                  <a 
                                    className="font-medium hover:underline" 
                                    style={{ color: 'var(--color-secondary)' }}
                                    href={`/questions/${b.questionId}`}
                                  >
                                    {b.title}
                                  </a>
                                  <div className="text-xs mt-1" style={{ color: 'var(--color-tertiary-light)' }}>
                                    Saved {new Date(b.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ color: 'var(--color-tertiary-light)' }}>No bookmarked questions.</div>
                          )}
                        </div>
                      )}

                      {bookmarkedSubTab === 'Articles' && (
                        <div className="animate-fadeIn">
                          {bookmarks && bookmarks.articles.length > 0 ? (
                            <div className="space-y-3">
                              {bookmarks.articles.map((b, index) => (
                                <div 
                                  key={`a-${b.articleId}`} 
                                  className="rounded-lg p-3 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fadeInUp"
                                  style={{
                                    backgroundColor: 'var(--color-surface)',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: 'var(--color-surface-dark)',
                                    animationDelay: `${index * 0.05}s`
                                  }}
                                >
                                  <a 
                                    className="font-medium hover:underline" 
                                    style={{ color: 'var(--color-secondary)' }}
                                    href={`/article/${b.articleId}`}
                                  >
                                    {b.title}
                                  </a>
                                  <div className="text-xs mt-1" style={{ color: 'var(--color-tertiary-light)' }}>
                                    Saved {new Date(b.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ color: 'var(--color-tertiary-light)' }}>No bookmarked articles.</div>
                          )}
                        </div>
                      )}

                      {bookmarkedSubTab === 'Community Posts' && (
                        <div className="animate-fadeIn">
                          {bookmarks && bookmarks.posts.length > 0 ? (
                            <div className="space-y-3">
                              {bookmarks.posts.map((b, index) => (
                                <div 
                                  key={`p-${b.postId}`} 
                                  className="rounded-lg p-3 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fadeInUp"
                                  style={{
                                    backgroundColor: 'var(--color-surface)',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: 'var(--color-surface-dark)',
                                    animationDelay: `${index * 0.05}s`
                                  }}
                                >
                                  <a 
                                    className="font-medium hover:underline" 
                                    style={{ color: 'var(--color-secondary)' }}
                                    href={`/community/${b.communityId}/post/${b.postId}`}
                                  >
                                    {b.title}
                                  </a>
                                  <div className="text-xs mt-1" style={{ color: 'var(--color-tertiary-light)' }}>
                                    Saved {new Date(b.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ color: 'var(--color-tertiary-light)' }}>No bookmarked posts.</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="w-80 flex flex-col gap-6">
          {/* Personal Details */}
          <div 
            className="rounded-2xl shadow-lg p-6 animate-fadeIn"
            style={{
              backgroundColor: 'var(--color-neutral)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-surface-dark)'
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-tertiary)' }}>📋 Personal Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-tertiary-light)' }}>Email</label>
                <p style={{ color: 'var(--color-tertiary)' }}>{profile.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-tertiary-light)' }}>Joined</label>
                <p style={{ color: 'var(--color-tertiary)' }}>{new Date(profile.joinedDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-tertiary-light)' }}>Reputation</label>
                <p style={{ color: 'var(--color-tertiary)' }}>{profile.reputation}</p>
              </div>
            </div>
          </div>

          {/* Skills/Knows About */}
          <div 
            className="rounded-2xl shadow-lg p-6 animate-fadeIn"
            style={{
              backgroundColor: 'var(--color-neutral)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-surface-dark)',
              animationDelay: '0.1s'
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-tertiary)' }}>🎯 Knows about</h3>
            
            {isEditing ? (
              <div className="space-y-2">
                {((userRole === 'mentee' ? menteeProfile?.skills : mentorProfile?.skills) || []).map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => {
                        if (userRole === 'mentee' && menteeProfile) {
                          const newSkills = [...menteeProfile.skills];
                          newSkills[index] = e.target.value;
                          setMenteeProfile({...menteeProfile, skills: newSkills});
                        } else if (userRole === 'mentor' && mentorProfile) {
                          const newSkills = [...mentorProfile.skills];
                          newSkills[index] = e.target.value;
                          setMentorProfile({...mentorProfile, skills: newSkills});
                        }
                      }}
                      className="flex-1 p-2 rounded-lg transition-all duration-300 focus:ring-2 focus:outline-none"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: 'var(--color-surface-dark)',
                        color: 'var(--color-tertiary)'
                      }}
                      placeholder="Enter skill"
                      aria-label={`Skill ${index + 1}`}
                    />
                    <button
                      onClick={() => {
                        if (userRole === 'mentee' && menteeProfile) {
                          const newSkills = menteeProfile.skills.filter((_, i) => i !== index);
                          setMenteeProfile({...menteeProfile, skills: newSkills});
                        } else if (userRole === 'mentor' && mentorProfile) {
                          const newSkills = mentorProfile.skills.filter((_, i) => i !== index);
                          setMentorProfile({...mentorProfile, skills: newSkills});
                        }
                      }}
                      className="transition-all duration-300 hover:scale-110"
                      style={{ color: 'var(--color-tertiary-light)' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    if (userRole === 'mentee' && menteeProfile) {
                      setMenteeProfile({...menteeProfile, skills: [...menteeProfile.skills, ""]});
                    } else if (userRole === 'mentor' && mentorProfile) {
                      setMentorProfile({...mentorProfile, skills: [...mentorProfile.skills, ""]});
                    }
                  }}
                  className="w-full p-2 rounded-lg border border-dashed transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: 'var(--color-surface-dark)',
                    color: 'var(--color-tertiary-light)'
                  }}
                >
                  + Add Skill
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {((userRole === 'mentee' ? menteeProfile?.skills : mentorProfile?.skills) || []).map((skill, index) => (
                  <div 
                    key={index} 
                    className="w-full h-6 rounded-full animate-fadeInUp"
                    style={{ 
                      backgroundColor: 'var(--color-surface)',
                      animationDelay: `${index * 0.05}s`
                    }}
                  >
                    <div 
                      className="h-full rounded-full flex items-center px-3"
                      style={{
                        background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))'
                      }}
                    >
                      <span className="text-xs font-medium" style={{ color: 'var(--color-neutral)' }}>{skill}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div 
            className="rounded-2xl shadow-lg p-6 animate-fadeIn"
            style={{
              backgroundColor: 'var(--color-neutral)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--color-surface-dark)',
              animationDelay: '0.2s'
            }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-tertiary)' }}>📊 Activity</h3>
            
            <div className="space-y-4">
              {userRole === 'mentee' && menteeProfile ? (
                <>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--color-tertiary-light)' }}>Questions Asked</span>
                    <span className="font-semibold" style={{ color: 'var(--color-tertiary)' }}>{menteeProfile.stats.questionsAsked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--color-tertiary-light)' }}>Bookmarks</span>
                    <span className="font-semibold" style={{ color: 'var(--color-tertiary)' }}>{menteeProfile.stats.bookmarksCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--color-tertiary-light)' }}>Mentorship Requests</span>
                    <span className="font-semibold" style={{ color: 'var(--color-tertiary)' }}>{menteeProfile.stats.mentorshipRequestsCount}</span>
                  </div>
                </>
              ) : userRole === 'mentor' && mentorProfile ? (
                <>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--color-tertiary-light)' }}>Answers Provided</span>
                    <span className="font-semibold" style={{ color: 'var(--color-tertiary)' }}>{mentorProfile.stats.answersProvided}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--color-tertiary-light)' }}>Articles Written</span>
                    <span className="font-semibold" style={{ color: 'var(--color-tertiary)' }}>{mentorProfile.stats.articlesWritten}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--color-tertiary-light)' }}>Mentees Connected</span>
                    <span className="font-semibold" style={{ color: 'var(--color-tertiary)' }}>{mentorProfile.stats.menteesConnected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--color-tertiary-light)' }}>Requests Received</span>
                    <span className="font-semibold" style={{ color: 'var(--color-tertiary)' }}>{mentorProfile.stats.mentorshipRequests}</span>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
