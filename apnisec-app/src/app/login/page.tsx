'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.data.tokens.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl border border-indigo-500 border-opacity-30 p-10 shadow-2xl">
          <h1 className="text-3xl font-bold text-cyan-400 mb-8 text-center">Secure Login</h1>
          
          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-500 text-red-300 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className="w-full px-4 py-3 bg-gray-900 bg-opacity-60 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-900 bg-opacity-60 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 text-gray-900 py-3 rounded-lg font-bold hover:bg-cyan-400 transition disabled:opacity-50 mt-6"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Register
            </Link>
          </p>
        </div>
        
        <Link href="/" className="block mt-6 text-center text-gray-400 hover:text-gray-300 text-sm">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}