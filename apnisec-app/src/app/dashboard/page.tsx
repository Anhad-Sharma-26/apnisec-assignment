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
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-900">ApniSec Dashboard</h1>
          <div className="flex gap-4 items-center">
            <Link href="/profile" className="text-gray-700 hover:text-indigo-900">Profile</Link>
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name || user?.email}!</h2>
          <p className="text-gray-600">Manage your security issues and track assessments</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('')}
              className={`px-4 py-2 rounded-lg ${!filter ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('cloud-security')}
              className={`px-4 py-2 rounded-lg ${filter === 'cloud-security' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              Cloud Security
            </button>
            <button
              onClick={() => handleFilterChange('reteam-assessment')}
              className={`px-4 py-2 rounded-lg ${filter === 'reteam-assessment' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              Reteam Assessment
            </button>
            <button
              onClick={() => handleFilterChange('vapt')}
              className={`px-4 py-2 rounded-lg ${filter === 'vapt' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              VAPT
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Create Issue
          </button>
        </div>

        <div className="grid gap-4">
          {issues.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No issues found. Create your first issue!
            </div>
          ) : (
            issues.map((issue) => (
              <div key={issue.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm mb-2">
                      {issue.type.replace('-', ' ').toUpperCase()}
                    </span>
                    <h3 className="text-xl font-bold">{issue.title}</h3>
                  </div>
                  <button
                    onClick={() => handleDeleteIssue(issue.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-600 mb-4">{issue.description}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>Priority: {issue.priority}</span>
                  <span>Status: {issue.status}</span>
                  <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Create New Issue</h2>
            <form onSubmit={handleCreateIssue} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
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
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                  Create
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400">
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