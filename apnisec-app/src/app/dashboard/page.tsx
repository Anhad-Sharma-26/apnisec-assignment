'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
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
        setShowModal(false);
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-900">AnhadSec Dashboard</h1>
          <div className="flex gap-6 items-center">
            <Link href="/profile" className="text-gray-700 hover:text-indigo-900 font-medium">Profile</Link>
            <button onClick={handleLogout} className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 font-medium">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-bold mb-3">Welcome, {user?.name || user?.email}!</h2>
          <p className="text-gray-600 text-lg">Manage your security issues and track assessments</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleFilterChange('')}
              className={`px-5 py-2.5 rounded-lg font-medium transition ${!filter ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('cloud-security')}
              className={`px-5 py-2.5 rounded-lg font-medium transition ${filter === 'cloud-security' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Cloud Security
            </button>
            <button
              onClick={() => handleFilterChange('reteam-assessment')}
              className={`px-5 py-2.5 rounded-lg font-medium transition ${filter === 'reteam-assessment' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Reteam Assessment
            </button>
            <button
              onClick={() => handleFilterChange('vapt')}
              className={`px-5 py-2.5 rounded-lg font-medium transition ${filter === 'vapt' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              VAPT
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-medium"
          >
            Create Issue
          </button>
        </div>

        <div className="grid gap-6">
          {issues.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500 text-lg">
              No issues found. Create your first issue!
            </div>
          ) : (
            issues.map((issue) => (
              <div key={issue.id} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-3">
                      {issue.type.replace('-', ' ').toUpperCase()}
                    </span>
                    <h3 className="text-xl font-bold">{issue.title}</h3>
                  </div>
                  <button
                    onClick={() => handleDeleteIssue(issue.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-600 mb-5 leading-relaxed">{issue.description}</p>
                <div className="flex gap-6 text-sm text-gray-500">
                  <span className="font-medium">Priority: <span className="text-gray-700">{issue.priority}</span></span>
                  <span className="font-medium">Status: <span className="text-gray-700">{issue.status}</span></span>
                  <span className="font-medium">Created: <span className="text-gray-700">{new Date(issue.createdAt).toLocaleDateString()}</span></span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Create New Issue</h2>
            <form onSubmit={handleCreateIssue} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="cloud-security">Cloud Security</option>
                  <option value="reteam-assessment">Reteam Assessment</option>
                  <option value="vapt">VAPT</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium">
                  Create
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 py-3 rounded-lg hover:bg-gray-400 font-medium">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}