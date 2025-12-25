'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchProfile(token);
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch('/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        setFormData({ name: data.data.name || '', email: data.data.email });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Profile updated successfully!');
        localStorage.setItem('user', JSON.stringify(data.data));
      } else {
        setMessage(data.error || 'Update failed');
      }
    } catch (err) {
      setMessage('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-900">AnhadSec Dashboard</h1>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h2 className="text-2xl font-bold mb-8">User Profile</h2>

          {message && (
            <div className={`px-4 py-3 rounded mb-6 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-sm">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-sm">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 mt-8"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t">
            <h3 className="font-semibold mb-4 text-lg">Account Info</h3>
            <p className="text-gray-600 mb-2">User ID: {user?.id}</p>
            <p className="text-gray-600">Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}