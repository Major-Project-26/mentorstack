"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminAPI, Community } from "@/lib/admin-api";
import {
  Users,
  Search,
  Trash2,
  Eye,
  MessageSquare,
  Hash,
  Star
} from "lucide-react";

// Local reusable metric chip matching emerald/cyan glass theme
function MetricChip({ label, value, icon }: Readonly<{ label: string; value: string | number | React.ReactNode; icon?: React.ReactNode }>) {
  return (
    <div className="relative rounded-lg px-3 py-2 bg-gradient-to-br from-emerald-50 to-cyan-50 ring-1 ring-emerald-200/60 shadow-sm">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-emerald-700/90 flex items-center gap-1">
        {icon}{label}
      </div>
      <div className="mt-0.5 text-emerald-700 font-medium text-sm truncate" title={typeof value === 'string' || typeof value === 'number' ? String(value) : label}>
        {value ?? 0}
      </div>
    </div>
  );
}

export default function CommunitiesAdminPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  type CommunityDetails = {
    id: number;
    name: string;
    description: string;
    skills?: string[];
    createdAt: string;
    createdBy?: { id: number; name: string; email: string; reputation?: number };
    _count?: { members: number; posts: number };
    members?: Array<{ id: number; userRole: string; joinedAt: string; user: { id: number; name: string; email: string; reputation?: number } }>;
    posts?: Array<{ id: number; title: string; content: string; createdAt: string; upvotes: number; downvotes: number; author?: { id: number; name: string; email: string } }>;
    analytics?: {
      memberGrowth?: Array<{ month: string; members: number }>;
      postActivity?: Array<{ date: string; posts: number }>;
      topContributors?: Array<{ userRole: string; joinedAt: string; user: { id: number; name: string; email: string; reputation: number; _count: { communityPosts: number; answers: number } } }>;
    };
  };
  const [detailedCommunity, setDetailedCommunity] = useState<CommunityDetails | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    loadCommunities();
  }, [currentPage, searchTerm]);

  const loadCommunities = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getCommunities(currentPage, 20);
      setCommunities(response.communities);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load communities");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCommunity = async (communityId: number) => {
    if (confirm("Are you sure you want to delete this community? This action cannot be undone.")) {
      try {
        await adminAPI.deleteCommunity(communityId);
        loadCommunities(); // Reload communities
      } catch (err) {
        console.error("Failed to delete community:", err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCommunityDetails = async (community: Community) => {
    setSelectedCommunity(community);
    setShowCommunityModal(true);
    setDetailedCommunity(null);
    setDetailError(null);
    try {
      setDetailLoading(true);
      const data = await adminAPI.getCommunityDetails(community.id);
      setDetailedCommunity(data);
    } catch (e: any) {
      setDetailError(e.message || 'Failed to load community details');
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading && communities.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-emerald-700 via-cyan-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
              <Users className="w-7 h-7 text-emerald-500" /> Communities Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">Curate, moderate and analyze platform communities.</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="rounded-xl px-5 py-3 bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-xl border border-emerald-200/70 shadow-[0_6px_24px_-6px_rgba(16,185,129,0.35)]">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700/80">Total</span>
              <div className="text-xl font-bold text-emerald-700 -mt-0.5">{communities.length}</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl border border-emerald-200/50 shadow-[0_8px_32px_-8px_rgba(16,185,129,0.25)]">
          <div className="relative max-w-lg">
            <div className="absolute inset-0 rounded-lg pointer-events-none border border-emerald-200/40" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search communities by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm rounded-lg bg-white/70 border border-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:border-emerald-400 placeholder-emerald-600/40 shadow-inner"
            />
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredCommunities.map((community) => (
            <div
              key={community.id}
              className="group relative rounded-2xl border border-emerald-200/50 bg-gradient-to-br from-white/85 to-white/60 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(16,185,129,0.35)] p-6 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-inner">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight text-gray-900 line-clamp-1" title={community.name}>{community.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">{community.description}</p>
                </div>
                <div className="flex flex-col items-end text-[11px] text-gray-500">
                  <span className="font-medium">{formatDate(community.createdAt)}</span>
                  <span className="mt-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60">ID {community.id}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <MetricChip label="Members" value={community._count.members} icon={<Users className="w-3.5 h-3.5" />} />
                <MetricChip label="Posts" value={community._count.posts} icon={<MessageSquare className="w-3.5 h-3.5" />} />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1" title={community.createdBy?.name || 'Unknown'}>
                  <Star className="w-3.5 h-3.5 text-emerald-500" /> {community.createdBy?.name || 'Unknown'}
                </span>
                <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5 text-cyan-500" /> {(community as any).skills ? (community as any).skills.length : 0} skills</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-emerald-100/60">
                <button
                  onClick={() => openCommunityDetails(community)}
                  className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                >
                  <Eye className="w-4 h-4" /> Details
                </button>
                <button
                  onClick={() => handleDeleteCommunity(community.id)}
                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCommunities.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No communities found</h3>
            <p className="text-gray-500">
              {searchTerm ? "Try adjusting your search criteria" : "No communities have been created yet"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="rounded-xl p-5 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl border border-emerald-200/50 shadow-[0_8px_30px_-10px_rgba(16,185,129,0.25)]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/70 border border-emerald-200/60 hover:border-emerald-300 hover:bg-emerald-50/70 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/70 border border-emerald-200/60 hover:border-emerald-300 hover:bg-emerald-50/70 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Community Detail Modal */}
        {showCommunityModal && selectedCommunity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-slate-900/85 to-cyan-900/90 backdrop-blur-sm" />
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl border border-emerald-200/50 shadow-[0_10px_50px_-10px_rgba(16,185,129,0.4)]">
              <div className="px-8 pt-6 pb-5 border-b border-emerald-100/60">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-emerald-700 to-cyan-600 bg-clip-text text-transparent">Community Details</h3>
                  <button
                    onClick={() => setShowCommunityModal(false)}
                    className="rounded-lg p-2 text-emerald-600 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
              </div>
              <div className="px-8 py-6 space-y-10">
                {detailLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
                  </div>
                )}
                {detailError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                    {detailError}
                  </div>
                )}
                {(!detailLoading && !detailError && detailedCommunity) && (
                  <>
                    {/* Overview */}
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-inner">
                          <Users className="w-8 h-8" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-2xl font-semibold text-gray-900 tracking-tight truncate" title={detailedCommunity.name}>{detailedCommunity.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Created {formatDate(detailedCommunity.createdAt)} • ID {detailedCommunity.id}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700/90 leading-relaxed mb-5 whitespace-pre-wrap">{detailedCommunity.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <MetricChip label="Members" value={detailedCommunity._count?.members ?? 0} icon={<Users className="w-3.5 h-3.5" />} />
                        <MetricChip label="Posts" value={detailedCommunity._count?.posts ?? 0} icon={<MessageSquare className="w-3.5 h-3.5" />} />
                        <MetricChip label="Skills" value={(detailedCommunity.skills || []).length} icon={<Hash className="w-3.5 h-3.5" />} />
                        <MetricChip label="Creator Rep" value={detailedCommunity.createdBy?.reputation ?? '—'} icon={<Star className="w-3.5 h-3.5" />} />
                      </div>
                      {detailedCommunity.skills && detailedCommunity.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {detailedCommunity.skills.map((s: string, i: number) => (
                            <span key={s + i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-emerald-800 bg-emerald-50 ring-1 ring-inset ring-emerald-200/60">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Members */}
                    <div className="space-y-3">
                      <h5 className="text-sm font-semibold tracking-wide text-emerald-700/90 uppercase">Recent Members</h5>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {detailedCommunity.members && detailedCommunity.members.length > 0 ? detailedCommunity.members.map((m: any) => (
                          <div key={m.id} className="flex items-center justify-between rounded-lg px-3 py-2 bg-gradient-to-br from-emerald-50 to-cyan-50 ring-1 ring-emerald-200/50">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white flex items-center justify-center text-xs font-semibold">
                                {m.user.name?.charAt(0) || 'U'}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[13px] font-medium text-gray-800 truncate" title={m.user.name}>{m.user.name}</p>
                                <p className="text-[10px] text-gray-500 truncate" title={m.user.email}>{m.user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-medium">
                              <span className="px-2 py-0.5 rounded-full bg-white/70 text-emerald-700 ring-1 ring-emerald-200/60">{m.userRole}</span>
                              <span className="text-gray-500">Rep {m.user.reputation}</span>
                              <span className="text-gray-400">{new Date(m.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                          </div>
                        )) : (
                          <p className="text-xs text-gray-500">No members found.</p>
                        )}
                      </div>
                    </div>

                    {/* Recent Posts */}
                    <div className="space-y-3">
                      <h5 className="text-sm font-semibold tracking-wide text-emerald-700/90 uppercase">Recent Posts</h5>
                      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                        {detailedCommunity.posts && detailedCommunity.posts.length > 0 ? detailedCommunity.posts.map((p: any) => (
                          <div key={p.id} className="rounded-lg p-3 bg-gradient-to-br from-white/80 to-white/60 ring-1 ring-emerald-200/50">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h6 className="text-[13px] font-semibold text-gray-800 line-clamp-1" title={p.title}>{p.title}</h6>
                              <span className="text-[10px] text-gray-500">{new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <p className="text-[11px] text-gray-600 line-clamp-2 mb-1">{p.content}</p>
                            <div className="flex items-center justify-between text-[10px] text-gray-500">
                              <span>↑ {p.upvotes} • ↓ {p.downvotes}</span>
                              <span className="truncate max-w-[140px]" title={p.author?.name || 'Unknown'}>{p.author?.name || 'Unknown'}</span>
                            </div>
                          </div>
                        )) : (
                          <p className="text-xs text-gray-500">No posts yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Analytics */}
                    <div className="space-y-5">
                      <h5 className="text-sm font-semibold tracking-wide text-emerald-700/90 uppercase">Analytics</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Member Growth */}
                        <div className="rounded-xl p-4 bg-gradient-to-br from-emerald-50 to-cyan-50 ring-1 ring-emerald-200/60">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700/90 mb-2">Member Growth (6 mo)</p>
                          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                            {detailedCommunity.analytics?.memberGrowth?.map((g: any) => (
                              <div key={g.month} className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-600">{g.month}</span>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-20 rounded-full bg-emerald-100 overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (g.members / (detailedCommunity._count?.members || 1)) * 100)}%` }} />
                                  </div>
                                  <span className="text-emerald-700 font-medium">{g.members}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Post Activity */}
                        <div className="rounded-xl p-4 bg-gradient-to-br from-emerald-50 to-cyan-50 ring-1 ring-emerald-200/60">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700/90 mb-2">Post Activity (30 days)</p>
                          <div className="grid grid-cols-5 gap-1 text-[10px] max-h-40 overflow-y-auto pr-1">
                            {detailedCommunity.analytics?.postActivity?.map((d: any) => (
                              <div key={d.date} className="flex flex-col items-center gap-1 p-1 rounded bg-white/70">
                                <div className="h-6 w-full rounded-sm bg-emerald-100 overflow-hidden">
                                  <div className="h-full bg-cyan-500" style={{ height: '100%', width: '100%', transform: `scaleY(${Math.min(1, d.posts / 5)})`, transformOrigin: 'bottom' }} />
                                </div>
                                <span className="font-medium text-emerald-700">{d.posts}</span>
                                <span className="text-gray-500 truncate" title={d.date}>{d.date.slice(5)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Top Contributors */}
                      <div className="rounded-xl p-4 bg-gradient-to-br from-white/85 to-white/60 ring-1 ring-emerald-200/60">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700/90 mb-3">Top Contributors</p>
                        <div className="space-y-2">
                          {detailedCommunity.analytics?.topContributors?.map((c: any) => (
                            <div key={c.user.id} className="flex items-center justify-between rounded-md px-3 py-2 bg-gradient-to-r from-emerald-50 to-cyan-50 ring-1 ring-emerald-200/50">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white flex items-center justify-center text-xs font-semibold">
                                  {c.user.name?.charAt(0) || 'U'}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[12px] font-medium text-gray-800 truncate" title={c.user.name}>{c.user.name}</p>
                                  <p className="text-[10px] text-gray-500 truncate" title={c.user.email}>{c.user.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-[10px] font-medium">
                                <span className="text-emerald-700">Rep {c.user.reputation}</span>
                                <span className="text-gray-600">Posts {c.user._count.communityPosts}</span>
                                <span className="text-gray-500">Answers {c.user._count.answers}</span>
                              </div>
                            </div>
                          ))}
                          {(!detailedCommunity.analytics?.topContributors || detailedCommunity.analytics.topContributors.length === 0) && (
                            <p className="text-xs text-gray-500">No contributors data.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex justify-end gap-3 pt-4 border-t border-emerald-100/60">
                  <button
                    onClick={() => setShowCommunityModal(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-white/70 border border-emerald-200/60 text-emerald-700 hover:bg-emerald-50/70"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDeleteCommunity(selectedCommunity.id)}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete Community
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
