import React, { useState, useEffect } from 'react';
import { communityService } from '@/services/communityService';
import { useAuth } from '@/contexts/AuthContext';

interface Post {
  id: string; author_name: string; avatar: string; title: string; content: string;
  likes_count: number; comments_count: number; tag: string; createdAt: string; liked: boolean;
}
interface Comment { id: string; author: string; avatar: string; content: string; createdAt: string; }

const TAGS = ['All', 'Disease', 'Pesticides', 'Irrigation', 'Soil', 'Market', 'General'];
const tagColors: Record<string, { bg: string; text: string }> = {
  Disease: { bg: 'rgba(239,68,68,0.12)', text: '#f87171' }, Pesticides: { bg: 'rgba(234,179,8,0.12)', text: '#fbbf24' },
  Irrigation: { bg: 'rgba(56,189,248,0.12)', text: '#38bdf8' }, Soil: { bg: 'rgba(234,88,12,0.12)', text: '#fb923c' },
  Market: { bg: 'rgba(168,85,247,0.12)', text: '#c084fc' }, General: { bg: 'rgba(34,197,94,0.12)', text: '#4ade80' },
};
const SEED_POSTS: Post[] = [
  { id: '1', author_name: 'Ramesh Kumar', avatar: '👨‍🌾', title: 'Wheat leaves turning yellow', content: 'My crop leaves are turning yellow from the tips. Nitrogen deficiency or disease?', likes_count: 10, comments_count: 2, tag: 'Disease', createdAt: '2h ago', liked: false },
  { id: '2', author_name: 'Suresh Singh', avatar: '🧑‍🌾', title: 'Best organic pesticide solution', content: 'Neem oil spray weekly works great against aphids. Mix 5ml neem oil + 1L water + dish soap.', likes_count: 25, comments_count: 5, tag: 'Pesticides', createdAt: '5h ago', liked: false },
  { id: '3', author_name: 'Priya Devi', avatar: '👩‍🌾', title: 'Drip irrigation for small fields', content: 'Switched to drip irrigation — water usage dropped 40% and yield improved significantly!', likes_count: 34, comments_count: 8, tag: 'Irrigation', createdAt: '1d ago', liked: false },
];

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [showComposer, setShowComposer] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tag: 'General' });
  const [search, setSearch] = useState('');
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(false);

  // ── Fetch posts on mount ──────────────────────────────────────────
  useEffect(() => {
    communityService.getPosts('all')
      .then(apiPosts => {
        if (apiPosts && apiPosts.length > 0) {
          setApiAvailable(true);
          // Map API shape → local Post shape
          const mapped: Post[] = apiPosts.map((p: any) => ({
            id: p.id ?? String(Math.random()),
            author_name: p.author_name ?? p.authorName ?? 'Farmer',
            avatar: '👨‍🌾',
            title: p.title ?? '',
            content: p.content ?? '',
            likes_count: p.likes ?? p.likes_count ?? 0,
            comments_count: p.comments ?? p.comments_count ?? 0,
            tag: p.tag ?? 'General',
            createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recently',
            liked: false,
          }));
          setPosts([...mapped, ...SEED_POSTS]);
        }
      })
      .catch(() => { /* Backend unavailable — use seed posts */ })
      .finally(() => setLoadingPosts(false));
  }, []);

  const filtered = posts.filter(p =>
    (activeTag === 'All' || p.tag === activeTag) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    const authorName = user?.username ?? user?.name ?? 'You';
    const optimistic: Post = {
      id: Date.now().toString(), author_name: authorName, avatar: '🧑‍🌾',
      title: newPost.title.trim(), content: newPost.content.trim(),
      likes_count: 0, comments_count: 0, tag: newPost.tag, createdAt: 'Just now', liked: false,
    };
    setPosts([optimistic, ...posts]);
    setNewPost({ title: '', content: '', tag: 'General' });
    setShowComposer(false);
    // ── POST /community/post ──────────────────────────────────────
    if (apiAvailable) {
      communityService.createPost({ author_name: authorName, title: optimistic.title, content: optimistic.content })
        .catch(console.error);
    }
  };

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes_count: p.liked ? p.likes_count - 1 : p.likes_count + 1 } : p));
    // ── POST /community/like/:postId ──────────────────────────────
    if (apiAvailable) communityService.likePost(id).catch(console.error);
  };

  const handleOpenComments = async (post: Post) => {
    setSelectedPost(post);
    setNewComment('');
    if (apiAvailable) {
      setLoadingComments(true);
      try {
        const apiComments = await communityService.getComments(post.id);
        setComments(apiComments.map((c: any) => ({
          id: c.id ?? String(Math.random()), author: c.authorName ?? c.author ?? 'Farmer',
          avatar: '👨‍🌾', content: c.content ?? '', createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recently',
        })));
      } catch { setComments([]); }
      finally { setLoadingComments(false); }
    } else {
      setComments(post.id === '1' ? [
        { id: 'c1', author: 'Mohan Lal', avatar: '👨‍🌾', content: 'Yellow tips usually mean nitrogen deficiency. Try urea top dressing.', createdAt: '1h ago' },
        { id: 'c2', author: 'Geeta Sharma', avatar: '👩‍🌾', content: 'Could also be iron chlorosis. Check your soil pH first.', createdAt: '45m ago' },
      ] : []);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost) return;
    const authorName = user?.username ?? user?.name ?? 'You';
    const comment: Comment = { id: Date.now().toString(), author: authorName, avatar: '🧑‍🌾', content: newComment.trim(), createdAt: 'Just now' };
    setComments(prev => [...prev, comment]);
    setPosts(prev => prev.map(p => p.id === selectedPost.id ? { ...p, comments_count: p.comments_count + 1 } : p));
    setNewComment('');
    // ── POST /community/comment ──────────────────────────────────
    if (apiAvailable) {
      communityService.addComment({ postId: selectedPost.id, authorName, content: comment.content }).catch(console.error);
    }
  };

  const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' } as React.CSSProperties;

  return (
    <div className="min-h-screen py-10 px-4 relative overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div aria-hidden className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Kisan Community</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Share knowledge · Grow together 🌱 {apiAvailable && <span className="text-green-400">• Connected to backend</span>}
            </p>
          </div>
          <button onClick={() => setShowComposer(v => !v)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: 'white', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}>
            ✍️ Post
          </button>
        </div>

        {showComposer && (
          <div className="rounded-2xl p-5 mb-6" style={card}>
            <h2 className="font-bold text-white mb-4">Ask the Community</h2>
            <input className="w-full rounded-xl px-4 py-3 text-sm text-white mb-3 outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              placeholder="Title of your question..." value={newPost.title}
              onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} />
            <textarea rows={3} className="w-full rounded-xl px-4 py-3 text-sm text-white mb-3 outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              placeholder="Describe your problem..." value={newPost.content}
              onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} />
            <div className="flex flex-wrap gap-2 mb-4">
              {TAGS.filter(t => t !== 'All').map(t => {
                const tc = tagColors[t]; const active = newPost.tag === t;
                return <button key={t} onClick={() => setNewPost(p => ({ ...p, tag: t }))}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                  style={active ? { background: tc.bg, color: tc.text, border: `1px solid ${tc.text}` } : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>{t}</button>;
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreatePost} disabled={!newPost.title.trim() || !newPost.content.trim()}
                className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: 'white' }}>Publish Post</button>
              <button onClick={() => setShowComposer(false)} className="px-5 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
            placeholder="🔍  Search posts..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="flex gap-1.5 flex-wrap">
            {TAGS.map(t => (
              <button key={t} onClick={() => setActiveTag(t)} className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={activeTag === t ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.4)' }
                  : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>{t}</button>
            ))}
          </div>
        </div>

        {loadingPosts && <div className="text-center py-8 text-white/40">Loading posts from backend...</div>}

        <div className="space-y-4">
          {!loadingPosts && filtered.length === 0 && (
            <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <p className="text-4xl mb-3">🌾</p><p className="text-sm">No posts found. Be the first to start a discussion!</p>
            </div>
          )}
          {filtered.map(post => {
            const tc = tagColors[post.tag] ?? tagColors.General;
            return (
              <div key={post.id} className="rounded-2xl p-5 transition-all duration-300 hover:scale-[1.01]" style={card}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{post.avatar}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{post.author_name}</p>
                      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{post.createdAt}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0"
                    style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.text}33` }}>{post.tag}</span>
                </div>
                <h3 className="font-bold text-white mb-1.5">{post.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{post.content}</p>
                <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 text-sm font-semibold transition-all hover:scale-110"
                    style={{ color: post.liked ? '#f87171' : 'rgba(255,255,255,0.4)' }}>
                    {post.liked ? '❤️' : '🤍'} {post.likes_count}
                  </button>
                  <button onClick={() => handleOpenComments(post)}
                    className="flex items-center gap-1.5 text-sm font-semibold transition-all hover:scale-110"
                    style={{ color: selectedPost?.id === post.id ? '#38bdf8' : 'rgba(255,255,255,0.4)' }}>
                    💬 {post.comments_count}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {selectedPost && (
          <div className="mt-6 rounded-2xl p-5" style={{ ...card, border: '1px solid rgba(56,189,248,0.2)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">💬 Comments — <span style={{ color: '#38bdf8' }}>{selectedPost.title}</span></h2>
              <button onClick={() => setSelectedPost(null)} className="text-xs px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>Close</button>
            </div>
            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
              {loadingComments && <p className="text-sm text-center py-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading comments...</p>}
              {!loadingComments && comments.length === 0 && <p className="text-sm text-center py-8" style={{ color: 'rgba(255,255,255,0.3)' }}>No comments yet. Be the first!</p>}
              {comments.map(c => (
                <div key={c.id} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <span className="text-xl shrink-0">{c.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-white">{c.author}</span>
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{c.createdAt}</span>
                    </div>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <input className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                placeholder="Write your reply..." value={newComment}
                onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddComment()} />
              <button onClick={handleAddComment} disabled={!newComment.trim()}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#0284c7,#38bdf8)', color: 'white' }}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
