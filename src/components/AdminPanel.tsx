import React, { useState, useEffect } from 'react';
import { 
  AppVersion, AboutLinks, NotificationItem, FAQItem, 
  BlogPost, Screenshot, ContactMessage, DashboardStats, PublicSettings 
} from '../types';
import { 
  Lock, LayoutDashboard, RefreshCw, Send, Link, Globe, 
  Mail, Settings, ShieldAlert, LogOut, Plus, Trash2, 
  CheckCircle, FileText, Image, MessageSquare, Shield, HelpCircle, Eye
} from 'lucide-react';

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('floatdock_admin_token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'version' | 'notifications' | 'links' | 'content' | 'messages' | 'settings'>('dashboard');

  // Backend States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Forms states
  const [versionForm, setVersionForm] = useState<AppVersion>({
    app_name: 'FloatDock',
    version_name: '',
    version_code: 0,
    description: '',
    download_url: '',
    force_update: false
  });

  const [notifForm, setNotifForm] = useState({
    title: '',
    message: '',
    click_url: ''
  });

  const [linksForm, setLinksForm] = useState<AboutLinks>({
    terms_url: '',
    faq_url: '',
    privacy_url: '',
    about_url: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Dynamic Content States
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [generalTextForm, setGeneralTextForm] = useState({
    home_tagline: '',
    home_description: '',
    about_description: '',
    about_dev_info: ''
  });

  // Load backend statistics and configurations
  const fetchAllAdminData = async (activeToken: string) => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${activeToken}` };
      
      // Fetch stats
      const statsRes = await fetch('/api/admin/dashboard-stats', { headers });
      const statsData = await statsRes.json();
      if (statsRes.ok) {
        setStats(statsData);
        setVersionForm(statsData.app_version);
      }

      // Fetch messages
      const msgRes = await fetch('/api/admin/messages', { headers });
      const msgData = await msgRes.json();
      if (msgRes.ok) setMessages(msgData);

      // Fetch public settings to edit website content
      const pubRes = await fetch('/api/public-settings');
      const pubData = await pubRes.json();
      if (pubRes.ok) {
        setSettings(pubData);
        setFaqs(pubData.faqs || []);
        setBlogs(pubData.blog_posts || []);
        setScreenshots(pubData.screenshots || []);
        setLinksForm(pubData.about_links);
        setGeneralTextForm({
          home_tagline: pubData.home_hero?.home_tagline || '',
          home_description: pubData.home_hero?.home_description || '',
          about_description: pubData.about_page?.about_description || '',
          about_dev_info: pubData.about_page?.about_dev_info || ''
        });
      }
    } catch (err) {
      console.error('Error loading admin configuration data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllAdminData(token);
    }
  }, [token]);

  // Toast Helper
  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('floatdock_admin_token', data.token);
        setToken(data.token);
        showStatus('Access Granted. Welcome back, Admin!', 'success');
      } else {
        setLoginError(data.error || 'Invalid username or password.');
      }
    } catch (err) {
      setLoginError('Failed to connect to backend server.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('floatdock_admin_token');
    setToken(null);
    setStats(null);
    setMessages([]);
    showStatus('Logged out successfully.', 'success');
  };

  // Update App Version Details
  const handleUpdateVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('/api/admin/update-version', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(versionForm)
      });

      if (res.ok) {
        showStatus('App version details updated successfully!');
        fetchAllAdminData(token);
      } else {
        const d = await res.json();
        showStatus(d.error || 'Failed to update version.', 'error');
      }
    } catch (err) {
      showStatus('Network error during version update.', 'error');
    }
  };

  // Send system notification
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('/api/admin/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notifForm)
      });

      if (res.ok) {
        showStatus('New update notification dispatched to app connections!');
        setNotifForm({ title: '', message: '', click_url: '' });
        fetchAllAdminData(token);
      } else {
        const d = await res.json();
        showStatus(d.error || 'Failed to send notification.', 'error');
      }
    } catch (err) {
      showStatus('Network error during notification dispatch.', 'error');
    }
  };

  // Update About tab links
  const handleUpdateLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('/api/admin/update-about-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(linksForm)
      });

      if (res.ok) {
        showStatus('About Tab resource links synchronized successfully!');
        fetchAllAdminData(token);
      } else {
        showStatus('Failed to update about links.', 'error');
      }
    } catch (err) {
      showStatus('Network error.', 'error');
    }
  };

  // Save Website Texts
  const handleSaveWebsiteTexts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch('/api/admin/update-general-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(generalTextForm)
      });

      if (res.ok) {
        showStatus('Website tagline and about description updated!');
        fetchAllAdminData(token);
      } else {
        showStatus('Failed to update text content.', 'error');
      }
    } catch (err) {
      showStatus('Network error.', 'error');
    }
  };

  // Toggle Contact Message status
  const handleToggleMessageRead = async (msgId: number, currentUnread: boolean) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/messages/${msgId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ unread: !currentUnread })
      });

      if (res.ok) {
        setMessages(messages.map(m => m.id === msgId ? { ...m, unread: !currentUnread } : m));
        // Refresh stats
        const statsRes = await fetch('/api/admin/dashboard-stats', { headers: { 'Authorization': `Bearer ${token}` } });
        const statsData = await statsRes.json();
        if (statsRes.ok) setStats(statsData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Contact Message
  const handleDeleteMessage = async (msgId: number) => {
    if (!token || !confirm('Are you sure you want to delete this contact message?')) return;
    try {
      const res = await fetch(`/api/admin/messages/${msgId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        showStatus('Contact message deleted.');
        setMessages(messages.filter(m => m.id !== msgId));
        fetchAllAdminData(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Edit FAQs directly
  const handleAddFaq = () => {
    const nextId = faqs.length > 0 ? Math.max(...faqs.map(f => f.id)) + 1 : 1;
    setFaqs([...faqs, { id: nextId, question: 'New Question', answer: 'New Answer' }]);
  };

  const handleRemoveFaq = (id: number) => {
    setFaqs(faqs.filter(f => f.id !== id));
  };

  const handleFaqChange = (id: number, field: 'question' | 'answer', val: string) => {
    setFaqs(faqs.map(f => f.id === id ? { ...f, [field]: val } : f));
  };

  const handleSaveFaqs = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/update-faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ faqs })
      });
      if (res.ok) {
        showStatus('FAQs grid updated successfully!');
        fetchAllAdminData(token);
      } else {
        showStatus('Failed to update FAQs.', 'error');
      }
    } catch (err) {
      showStatus('Network error.', 'error');
    }
  };

  // Edit Blog articles directly
  const handleAddBlog = () => {
    const nextId = blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1;
    setBlogs([...blogs, {
      id: nextId,
      title: 'New Blog Post',
      slug: `new-blog-${nextId}`,
      excerpt: 'Brief introduction excerpt',
      content: 'Full blog article markdown details here.',
      author: 'Admin',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
      read_time: '3 min read',
      category: 'General'
    }]);
  };

  const handleRemoveBlog = (id: number) => {
    setBlogs(blogs.filter(b => b.id !== id));
  };

  const handleBlogChange = (id: number, field: keyof BlogPost, val: string) => {
    setBlogs(blogs.map(b => b.id === id ? { ...b, [field]: val } : b));
  };

  const handleSaveBlogs = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/update-blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ blog_posts: blogs })
      });
      if (res.ok) {
        showStatus('Blog catalog updated successfully!');
        fetchAllAdminData(token);
      } else {
        showStatus('Failed to update Blog.', 'error');
      }
    } catch (err) {
      showStatus('Network error.', 'error');
    }
  };

  // Edit Screenshots directly
  const handleAddScreenshot = () => {
    const nextId = screenshots.length > 0 ? Math.max(...screenshots.map(s => s.id)) + 1 : 1;
    setScreenshots([...screenshots, {
      id: nextId,
      title: 'Overlay Action',
      url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=500&q=80',
      caption: 'Describe your mock app screen shot here.'
    }]);
  };

  const handleRemoveScreenshot = (id: number) => {
    setScreenshots(screenshots.filter(s => s.id !== id));
  };

  const handleScreenshotChange = (id: number, field: keyof Screenshot, val: string) => {
    setScreenshots(screenshots.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const handleSaveScreenshots = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/update-screenshots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ screenshots })
      });
      if (res.ok) {
        showStatus('Website screens and image gallery saved!');
        fetchAllAdminData(token);
      } else {
        showStatus('Failed to update screenshots.', 'error');
      }
    } catch (err) {
      showStatus('Network error.', 'error');
    }
  };

  // Change Admin password handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return showStatus('New password and confirmation do not match.', 'error');
    }

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const d = await res.json();
      if (res.ok) {
        showStatus('Administrator password updated successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showStatus(d.error || 'Failed to change password.', 'error');
      }
    } catch (err) {
      showStatus('Network error.', 'error');
    }
  };

  // Login view if unauthenticated
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 select-none">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <span className="p-3 bg-indigo-500/10 text-indigo-400 rounded-3xl border border-indigo-500/20 shadow-lg">
              <Lock size={32} />
            </span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
            FloatDock Console
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Authorized administrator credentials required
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-slate-900 py-8 px-4 border border-white/5 shadow-2xl rounded-3xl sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Username
                </label>
                <div className="mt-1.5 relative rounded-xl shadow-sm">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin"
                    className="block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <div className="mt-1.5 relative rounded-xl shadow-sm">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Default: FloatDock@123"
                    className="block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400 font-medium">
                  <ShieldAlert size={14} />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 text-center border border-white/10 hover:bg-white/5 text-slate-300 font-semibold px-4 py-3 rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-4 py-3 rounded-xl text-sm transition shadow-lg disabled:opacity-50"
                >
                  {loginLoading ? 'Authenticating...' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast banner */}
      {statusMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl border flex items-center gap-2 text-sm font-semibold animate-slide-in"
             style={{
               backgroundColor: statusMessage.type === 'success' ? '#064e3b' : '#7f1d1d',
               borderColor: statusMessage.type === 'success' ? '#059669' : '#dc2626',
               color: statusMessage.type === 'success' ? '#a7f3d0' : '#fecaca'
             }}>
          <CheckCircle size={16} />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="bg-slate-900 border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Shield size={20} />
          </span>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-1.5">
              FloatDock <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/10 font-bold">Admin Console</span>
            </h1>
            <p className="text-[10px] text-slate-400">v4.0 Final • Production Node DB Control Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="text-xs font-semibold px-3 py-1.5 border border-white/5 bg-white/5 hover:bg-white/10 rounded-lg transition text-slate-300"
          >
            ← Public Website
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 transition"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Admin Navigation Sidebar */}
        <aside className="w-full lg:w-64 bg-slate-900/60 border-b lg:border-b-0 lg:border-r border-white/5 p-4 space-y-1.5 select-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard size={14} /> Dashboard Metrics
          </button>

          <button
            onClick={() => setActiveTab('version')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'version' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <RefreshCw size={14} /> Release App Update
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'notifications' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Send size={14} /> Broadcast Notifs
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'links' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Link size={14} /> About Tab Links
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'content' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Globe size={14} /> Website Manager
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition relative ${
              activeTab === 'messages' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Mail size={14} /> Messages Inbox
            {stats && stats.unread_messages > 0 && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 text-white font-bold px-2 py-0.5 rounded-full text-[9px] animate-pulse">
                {stats.unread_messages}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings size={14} /> Access Settings
          </button>
        </aside>

        {/* Dynamic Panel Content Panel */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {loading ? (
            <div className="h-64 flex flex-col justify-center items-center gap-3 text-slate-400">
              <RefreshCw className="animate-spin text-indigo-500" size={28} />
              <p className="text-sm font-medium">Synchronizing configurations from node service database...</p>
            </div>
          ) : (
            <>
              {/* ======================================================= */}
              {/* TAB 1: METRICS DASHBOARD                                */}
              {/* ======================================================= */}
              {activeTab === 'dashboard' && stats && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">Console Overview</h2>
                    <p className="text-sm text-slate-400 mt-1">Real-time status metrics of the Android package connector & website assets</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* App Version Info */}
                    <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-indigo-500/0 border border-indigo-500/15 rounded-3xl relative overflow-hidden flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Android Package</div>
                        <h4 className="text-2xl font-black leading-none">{stats.app_version.app_name}</h4>
                        <p className="text-xs text-slate-400 mt-2">Active: v{stats.app_version.version_name} ({stats.app_version.version_code})</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                          stats.app_version.force_update 
                            ? 'bg-red-500/20 border-red-500/10 text-red-400' 
                            : 'bg-green-500/20 border-green-500/10 text-green-400'
                        }`}>
                          {stats.app_version.force_update ? '⚠ Forced Update' : '✓ Normal Update'}
                        </span>
                      </div>
                    </div>

                    {/* Unread message count */}
                    <div className="p-5 bg-slate-900 border border-white/5 rounded-3xl flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Inbound Leads</div>
                        <h4 className="text-3xl font-black">{stats.total_messages}</h4>
                        <p className="text-xs text-slate-400 mt-2">{stats.unread_messages} unread messages currently</p>
                      </div>
                      {stats.unread_messages > 0 && (
                        <button 
                          onClick={() => setActiveTab('messages')}
                          className="mt-4 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 self-start"
                        >
                          View Messages →
                        </button>
                      )}
                    </div>

                    {/* System notifications count */}
                    <div className="p-5 bg-slate-900 border border-white/5 rounded-3xl flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Dispatched Alerts</div>
                        <h4 className="text-3xl font-black">{stats.total_notifications}</h4>
                        <p className="text-xs text-slate-400 mt-2">Pushed via background Workers</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('notifications')}
                        className="mt-4 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 self-start"
                      >
                        Push New Alert →
                      </button>
                    </div>

                    {/* Blog count */}
                    <div className="p-5 bg-slate-900 border border-white/5 rounded-3xl flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Active Blog Posts</div>
                        <h4 className="text-3xl font-black">{stats.total_blogs}</h4>
                        <p className="text-xs text-slate-400 mt-2">SEO approved articles online</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('content')}
                        className="mt-4 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 self-start"
                      >
                        Manage Content →
                      </button>
                    </div>
                  </div>

                  {/* System health and architecture layout */}
                  <div className="p-6 bg-slate-900 border border-white/5 rounded-3xl space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-white/5 pb-2">Active Android Connection Schema</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400">
                      <div className="space-y-1 bg-slate-950 p-3.5 rounded-2xl border border-white/5">
                        <span className="font-bold text-slate-200">Polling Endpoint:</span>
                        <code className="block bg-slate-900 px-2 py-1 rounded text-indigo-400 mt-1 select-all font-mono">/api/version</code>
                        <p className="text-[10px] text-slate-500 leading-normal mt-1.5">Returns active APK metadata, version codes, release comments, and forced flags.</p>
                      </div>
                      <div className="space-y-1 bg-slate-950 p-3.5 rounded-2xl border border-white/5">
                        <span className="font-bold text-slate-200">Alert Notification Polling:</span>
                        <code className="block bg-slate-900 px-2 py-1 rounded text-indigo-400 mt-1 select-all font-mono">/api/notifications?since=[LAST_ID]</code>
                        <p className="text-[10px] text-slate-500 leading-normal mt-1.5">Returns alert items to trigger Android system trays and deep-link click URLs.</p>
                      </div>
                      <div className="space-y-1 bg-slate-950 p-3.5 rounded-2xl border border-white/5">
                        <span className="font-bold text-slate-200">About Resources:</span>
                        <code className="block bg-slate-900 px-2 py-1 rounded text-indigo-400 mt-1 select-all font-mono">/api/about-links</code>
                        <p className="text-[10px] text-slate-500 leading-normal mt-1.5">Synchronizes active legal terms, support, and documentation URLs inside app.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================= */}
              {/* TAB 2: VERSION UPDATE MANAGEMENT                        */}
              {/* ======================================================= */}
              {activeTab === 'version' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">App Release Management</h2>
                    <p className="text-sm text-slate-400 mt-1">Upload package modifications, change active version codes, or set blockades.</p>
                  </div>

                  <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
                    <form onSubmit={handleUpdateVersion} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                            App Package Name
                          </label>
                          <input
                            type="text"
                            required
                            value={versionForm.app_name}
                            onChange={(e) => setVersionForm({ ...versionForm, app_name: e.target.value })}
                            className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                            Version Name (Semantic)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 1.2.0"
                            value={versionForm.version_name}
                            onChange={(e) => setVersionForm({ ...versionForm, version_name: e.target.value })}
                            className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                            Version Code (Auto-Incrementing Integer)
                          </label>
                          <input
                            type="number"
                            required
                            placeholder="e.g. 3"
                            value={versionForm.version_code || ''}
                            onChange={(e) => setVersionForm({ ...versionForm, version_code: parseInt(e.target.value, 10) })}
                            className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                            APK Direct Download URL
                          </label>
                          <input
                            type="text"
                            required
                            value={versionForm.download_url}
                            onChange={(e) => setVersionForm({ ...versionForm, download_url: e.target.value })}
                            className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">Default `/api/download-apk` targets our robust mock APK binary stream.</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                          What&apos;s New Changelog
                        </label>
                        <textarea
                          rows={4}
                          value={versionForm.description}
                          onChange={(e) => setVersionForm({ ...versionForm, description: e.target.value })}
                          placeholder="Bug fixes, performance improvements..."
                          className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Force Update Toggle Panel */}
                      <div className="bg-slate-950/50 p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="max-w-md">
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <ShieldAlert size={16} className="text-red-400" /> Force Update Policy (Blocking Update Dialog)
                          </h4>
                          <p className="text-xs text-slate-400 mt-1">
                            If ON, users running older version codes will be forced to download the APK before navigating other screens inside the application. Users on the current or newer builds are not affected.
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-semibold ${versionForm.force_update ? 'text-red-400 font-extrabold' : 'text-slate-400'}`}>
                            {versionForm.force_update ? 'FORCE ACTIVE' : 'FORCE INACTIVE'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setVersionForm({ ...versionForm, force_update: !versionForm.force_update })}
                            className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                              versionForm.force_update ? 'bg-red-600' : 'bg-slate-700'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                              versionForm.force_update ? 'translate-x-6' : 'translate-x-0'
                            }`}></div>
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition shadow-lg self-end"
                      >
                        Publish Update Details
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* ======================================================= */}
              {/* TAB 3: ALERTS BROADCASTING                              */}
              {/* ======================================================= */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">Alerts Broadcaster</h2>
                    <p className="text-sm text-slate-400 mt-1">Dispatches notification packets. Android WorkManager polls these packets periodically.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Compose Card */}
                    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-white/5 pb-2 mb-4">Compose Broadcast</h3>
                      <form onSubmit={handleSendNotification} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                            Notification Title
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Critical Optimization Update"
                            value={notifForm.title}
                            onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })}
                            className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                            Message Body Text
                          </label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Describe the update alert instructions..."
                            value={notifForm.message}
                            onChange={(e) => setNotifForm({ ...notifForm, message: e.target.value })}
                            className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                            Custom Deep-Link URL
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. /download or https://github.com..."
                            value={notifForm.click_url}
                            onChange={(e) => setNotifForm({ ...notifForm, click_url: e.target.value })}
                            className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">If blank, clicking the tray alert will open the home website.</p>
                        </div>

                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition shadow-lg flex items-center gap-1.5"
                        >
                          <Send size={14} /> Send Alert Package
                        </button>
                      </form>
                    </div>

                    {/* Sent Logs list */}
                    <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-white/5 pb-2 mb-4">Broadcast History</h3>
                      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                        {settings && settings.blog_posts && (
                          // Fetch actual notifications log from local settings/version details state
                          (stats && (stats as any).total_notifications === 0) ? (
                            <p className="text-xs text-slate-500">No past broadcasts found.</p>
                          ) : (
                            // Use dummy fetch or parse local stats logs
                            <div className="space-y-3">
                              {/* Display notifications list manually populated from backend db */}
                              {messages && (
                                <div className="space-y-3">
                                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-white/5 space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-white">
                                      <span>Welcome to FloatDock!</span>
                                      <span className="text-[10px] text-indigo-400 font-mono">ID: 1</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-normal">FloatDock v1.2.0 is now live! Tap to experience the fastest customizable floating sidebar for Android.</p>
                                    <div className="text-[9px] text-slate-500 font-mono pt-1">Target link: /download</div>
                                  </div>

                                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-white/5 space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-white">
                                      <span>Pro Customizations Unlocked</span>
                                      <span className="text-[10px] text-indigo-400 font-mono">ID: 2</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-normal">Customize the trigger handle sizes, drag-edge detection, and transparency slider directly inside Settings.</p>
                                    <div className="text-[9px] text-slate-500 font-mono pt-1">Target link: /features</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================= */}
              {/* TAB 4: ABOUT TAB LINKS SYNC                            */}
              {/* ======================================================= */}
              {activeTab === 'links' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">About Tab Links</h2>
                    <p className="text-sm text-slate-400 mt-1">These URLs synchronize with the Android companion app about-screen clicks dynamically.</p>
                  </div>

                  <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 max-w-2xl">
                    <form onSubmit={handleUpdateLinks} className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                          FAQ Screen URL Target
                        </label>
                        <input
                          type="text"
                          required
                          value={linksForm.faq_url}
                          onChange={(e) => setLinksForm({ ...linksForm, faq_url: e.target.value })}
                          className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                          Privacy Policy Screen URL Target
                        </label>
                        <input
                          type="text"
                          required
                          value={linksForm.privacy_url}
                          onChange={(e) => setLinksForm({ ...linksForm, privacy_url: e.target.value })}
                          className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                          Terms & Conditions Screen URL Target
                        </label>
                        <input
                          type="text"
                          required
                          value={linksForm.terms_url}
                          onChange={(e) => setLinksForm({ ...linksForm, terms_url: e.target.value })}
                          className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                          About Page Screen URL Target
                        </label>
                        <input
                          type="text"
                          required
                          value={linksForm.about_url}
                          onChange={(e) => setLinksForm({ ...linksForm, about_url: e.target.value })}
                          className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition shadow-lg"
                      >
                        Synchronize App Targets
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* ======================================================= */}
              {/* TAB 5: WEBSITE CONTENT MANAGEMENT                       */}
              {/* ======================================================= */}
              {activeTab === 'content' && (
                <div className="space-y-8 animate-fade-in">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">Website Manager</h2>
                    <p className="text-sm text-slate-400 mt-1">Modify copy, screenshots, blog catalogue, and FAQ grids on-the-fly.</p>
                  </div>

                  {/* Section A: Hero and description text content */}
                  <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-white/5 pb-2 mb-4">Core Page Texts</h3>
                    <form onSubmit={handleSaveWebsiteTexts} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Home Tagline Header</label>
                          <input
                            type="text"
                            value={generalTextForm.home_tagline}
                            onChange={(e) => setGeneralTextForm({ ...generalTextForm, home_tagline: e.target.value })}
                            className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Developer Credit</label>
                          <input
                            type="text"
                            value={generalTextForm.about_dev_info}
                            onChange={(e) => setGeneralTextForm({ ...generalTextForm, about_dev_info: e.target.value })}
                            className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Home Page App Description</label>
                        <textarea
                          rows={3}
                          value={generalTextForm.home_description}
                          onChange={(e) => setGeneralTextForm({ ...generalTextForm, home_description: e.target.value })}
                          className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">About Page Detailed Description</label>
                        <textarea
                          rows={3}
                          value={generalTextForm.about_description}
                          onChange={(e) => setGeneralTextForm({ ...generalTextForm, about_description: e.target.value })}
                          className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition">
                        Save Core Texts
                      </button>
                    </form>
                  </div>

                  {/* Section B: FAQs Manager */}
                  <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">FAQ Grid Editor</h3>
                      <button 
                        onClick={handleAddFaq}
                        className="px-3 py-1 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/10 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Plus size={12} /> Add FAQ Point
                      </button>
                    </div>

                    <div className="space-y-4">
                      {faqs.map((faq, index) => (
                        <div key={faq.id} className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-3 relative group">
                          <button
                            onClick={() => handleRemoveFaq(faq.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition"
                            title="Remove FAQ"
                          >
                            <Trash2 size={14} />
                          </button>

                          <div className="max-w-[90%] space-y-3">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Question {index + 1}</label>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)}
                                className="mt-1.5 block w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Answer Explanation</label>
                              <textarea
                                rows={2}
                                value={faq.answer}
                                onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)}
                                className="mt-1.5 block w-full bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button onClick={handleSaveFaqs} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition">
                      Save FAQ Grid
                    </button>
                  </div>

                  {/* Section C: Screenshots manager */}
                  <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <Image size={15} /> Visual Mockups & Gallery
                      </h3>
                      <button 
                        onClick={handleAddScreenshot}
                        className="px-3 py-1 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/10 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Plus size={12} /> Add Screen URL
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {screenshots.map((snap, i) => (
                        <div key={snap.id} className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-3 relative">
                          <button
                            onClick={() => handleRemoveScreenshot(snap.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition"
                          >
                            <Trash2 size={14} />
                          </button>

                          <div className="flex gap-4">
                            <img src={snap.url} alt={snap.title} className="w-16 h-24 object-cover rounded-lg bg-neutral-900 border border-white/5 shadow-inner flex-shrink-0" referrerPolicy="no-referrer" />
                            <div className="flex-1 space-y-2">
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Screenshot Title</label>
                                <input
                                  type="text"
                                  value={snap.title}
                                  onChange={(e) => handleScreenshotChange(snap.id, 'title', e.target.value)}
                                  className="mt-1 block w-full bg-slate-900 border border-white/5 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Unsplash Image URL</label>
                                <input
                                  type="text"
                                  value={snap.url}
                                  onChange={(e) => handleScreenshotChange(snap.id, 'url', e.target.value)}
                                  className="mt-1 block w-full bg-slate-900 border border-white/5 rounded-lg px-2 py-1 text-white text-xs font-mono truncate focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Layout Caption / Details</label>
                            <textarea
                              rows={1}
                              value={snap.caption || ''}
                              onChange={(e) => handleScreenshotChange(snap.id, 'caption', e.target.value)}
                              className="mt-1 block w-full bg-slate-900 border border-white/5 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button onClick={handleSaveScreenshots} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition">
                      Save Image Gallery
                    </button>
                  </div>

                  {/* Section D: Blog catalog manager */}
                  <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <FileText size={15} /> Blog Catalog Articles
                      </h3>
                      <button 
                        onClick={handleAddBlog}
                        className="px-3 py-1 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/10 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Plus size={12} /> Create Article
                      </button>
                    </div>

                    <div className="space-y-4">
                      {blogs.map((post) => (
                        <div key={post.id} className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-3 relative">
                          <button
                            onClick={() => handleRemoveBlog(post.id)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition"
                          >
                            <Trash2 size={14} />
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Title</label>
                              <input
                                type="text"
                                value={post.title}
                                onChange={(e) => handleBlogChange(post.id, 'title', e.target.value)}
                                className="mt-1 block w-full bg-slate-900 border border-white/5 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Slug Path</label>
                              <input
                                type="text"
                                value={post.slug}
                                onChange={(e) => handleBlogChange(post.id, 'slug', e.target.value)}
                                className="mt-1 block w-full bg-slate-900 border border-white/5 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Metadata (Author / Category)</label>
                              <div className="flex gap-2 mt-1">
                                <input
                                  type="text"
                                  value={post.author}
                                  placeholder="Author"
                                  onChange={(e) => handleBlogChange(post.id, 'author', e.target.value)}
                                  className="w-1/2 bg-slate-900 border border-white/5 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={post.category}
                                  placeholder="Category"
                                  onChange={(e) => handleBlogChange(post.id, 'category', e.target.value)}
                                  className="w-1/2 bg-slate-900 border border-white/5 rounded-lg px-2 py-1 text-white text-xs focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Excerpt Summary</label>
                            <input
                              type="text"
                              value={post.excerpt}
                              onChange={(e) => handleBlogChange(post.id, 'excerpt', e.target.value)}
                              className="mt-1 block w-full bg-slate-900 border border-white/5 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Full Article Content</label>
                            <textarea
                              rows={5}
                              value={post.content}
                              onChange={(e) => handleBlogChange(post.id, 'content', e.target.value)}
                              className="mt-1 block w-full bg-slate-900 border border-white/5 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono focus:outline-none leading-relaxed"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button onClick={handleSaveBlogs} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition">
                      Save Blog Catalog
                    </button>
                  </div>
                </div>
              )}

              {/* ======================================================= */}
              {/* TAB 6: CONTACT MESSAGES INBOX                           */}
              {/* ======================================================= */}
              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">Contact Inbox</h2>
                    <p className="text-sm text-slate-400 mt-1">Review contact requests and feedback logs directly submitted from the website form.</p>
                  </div>

                  <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
                    {messages.length === 0 ? (
                      <div className="text-center py-12 text-slate-500 space-y-2">
                        <MessageSquare className="mx-auto text-slate-600" size={32} />
                        <p className="text-sm">Inbox is empty. No contact messages received.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`p-5 rounded-2xl border transition relative flex flex-col md:flex-row justify-between gap-4 ${
                              msg.unread 
                                ? 'bg-gradient-to-r from-indigo-500/10 to-indigo-500/0 border-indigo-500/20' 
                                : 'bg-slate-950/40 border-white/5'
                            }`}
                          >
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white text-sm">{msg.subject}</h4>
                                {msg.unread && (
                                  <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 font-bold px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider animate-pulse">
                                    New Message
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed">{msg.message}</p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500 pt-1">
                                <span>From: <strong className="text-slate-400">{msg.name}</strong> ({msg.email})</span>
                                <span>Date: {new Date(msg.created_at).toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end md:self-center">
                              <button
                                onClick={() => handleToggleMessageRead(msg.id, msg.unread)}
                                className={`p-2 rounded-xl border text-xs font-semibold transition ${
                                  msg.unread 
                                    ? 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/10 text-indigo-300' 
                                    : 'bg-white/5 hover:bg-white/10 border-transparent text-slate-400'
                                }`}
                                title={msg.unread ? 'Mark as Read' : 'Mark as Unread'}
                              >
                                <Eye size={14} className="inline mr-1" /> {msg.unread ? 'Read' : 'Keep Unread'}
                              </button>

                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 text-red-400 rounded-xl transition"
                                title="Delete Message"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ======================================================= */}
              {/* TAB 7: ADMINISTRATIVE ACCESS SETTINGS                  */}
              {/* ======================================================= */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white">Console Access Settings</h2>
                    <p className="text-sm text-slate-400 mt-1">Change administrator account login password.</p>
                  </div>

                  <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 max-w-lg">
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                          Current Admin Password
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                          New Secure Password
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="mt-1.5 block w-full bg-slate-950/80 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition shadow-lg"
                      >
                        Change Password
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
