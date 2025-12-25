'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'cloud-security',
    title: '',
    description: '',
    priority: 'medium',
    status: 'open'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData || '{}'));
    fetchIssues(token);
  }, []);

  const fetchIssues = async (token: string, type?: string) => {
    try {
      const url = type ? `/api/issues?type=${type}` : '/api/issues';
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setIssues(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setFormData({ type: 'cloud-security', title: '', description: '', priority: 'medium', status: 'open' });
        fetchIssues(token!);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteIssue = async (id: string) => {
    if (!confirm('Delete this issue?')) return;
    
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/issues/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchIssues(token!);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleFilterChange = (type: string) => {
    setFilter(type);
    const token = localStorage.getItem('token');
    fetchIssues(token!, type || undefined);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.name || user?.email}! 👋</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/profile" className="text-gray-300 hover:text-cyan-400 font-medium transition">Profile</Link>
            <button onClick={handleLogout} className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 font-medium transition">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl border border-indigo-500 border-opacity-30 p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-cyan-400 mb-6">Create New Issue</h2>
              
              <form onSubmit={handleCreateIssue} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Issue Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 bg-opacity-60 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition"
                  >
                    <option value="cloud-security">Cloud Security</option>
                    <option value="reteam-assessment">Reteam Assessment</option>
                    <option value="vapt">VAPT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter issue title"
                    className="w-full px-4 py-2 bg-gray-900 bg-opacity-60 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the issue..."
                    className="w-full px-4 py-2 bg-gray-900 bg-opacity-60 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition resize-none"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Priority (Optional)</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 bg-opacity-60 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Status (Optional)</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 bg-opacity-60 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 text-gray-900 py-3 rounded-lg font-bold hover:bg-cyan-400 transition mt-6"
                >
                  Create Issue
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl border border-indigo-500 border-opacity-30 p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-cyan-400 mb-6">Filter Issues</h2>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  onClick={() => handleFilterChange('')}
                  className={`px-5 py-2 rounded-lg font-medium transition ${!filter ? 'bg-cyan-500 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange('cloud-security')}
                  className={`px-5 py-2 rounded-lg font-medium transition ${filter === 'cloud-security' ? 'bg-cyan-500 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  Cloud Security
                </button>
                <button
                  onClick={() => handleFilterChange('reteam-assessment')}
                  className={`px-5 py-2 rounded-lg font-medium transition ${filter === 'reteam-assessment' ? 'bg-cyan-500 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  Reteam Assessment
                </button>
                <button
                  onClick={() => handleFilterChange('vapt')}
                  className={`px-5 py-2 rounded-lg font-medium transition ${filter === 'vapt' ? 'bg-cyan-500 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  VAPT
                </button>
              </div>

              <h3 className="text-lg font-bold text-cyan-400 mb-4">Your Issues ({issues.length})</h3>

              {issues.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-cyan-400 text-lg font-semibold mb-2">No issues found</p>
                  <p className="text-gray-400">Create your first issue to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {issues.map((issue) => (
                    <div key={issue.id} className="bg-gray-800 bg-opacity-50 rounded-lg p-5 border border-gray-700">
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-block px-3 py-1 bg-cyan-500 bg-opacity-20 text-cyan-400 rounded-full text-xs font-bold">
                          {issue.type.replace('-', ' ').toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleDeleteIssue(issue.id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                      <h4 className="text-white font-bold mb-2">{issue.title}</h4>
                      <p className="text-gray-400 text-sm mb-3">{issue.description}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Priority: <span className="text-gray-400">{issue.priority}</span></span>
                        <span>Status: <span className="text-gray-400">{issue.status}</span></span>
                        <span>Created: <span className="text-gray-400">{new Date(issue.createdAt).toLocaleDateString()}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}