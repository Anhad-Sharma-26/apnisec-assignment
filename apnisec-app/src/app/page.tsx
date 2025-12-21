import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-white text-2xl font-bold">ApniSec</div>
        <Link 
          href="/login"
          className="bg-white text-indigo-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Login
        </Link>
      </nav>

      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold text-white mb-6">
          Your Trusted Cybersecurity Partner
        </h1>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Protect your digital assets with comprehensive security solutions. Cloud Security, VAPT, and Reteam Assessments all in one platform.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/register"
            className="bg-white text-indigo-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
          <Link 
            href="/login"
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-900 transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 border border-white border-opacity-20">
            <div className="text-4xl mb-4">☁️</div>
            <h3 className="text-2xl font-bold text-white mb-4">Cloud Security</h3>
            <p className="text-gray-200">Comprehensive cloud infrastructure security assessments and monitoring to protect your cloud assets.</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 border border-white border-opacity-20">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-4">VAPT</h3>
            <p className="text-gray-200">Vulnerability Assessment and Penetration Testing to identify and fix security weaknesses.</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 border border-white border-opacity-20">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-white mb-4">Reteam Assessment</h3>
            <p className="text-gray-200">Red team exercises to test your organization's detection and response capabilities.</p>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-6 py-12 text-center text-gray-300 border-t border-white border-opacity-20">
        <p className="mb-4">© 2024 ApniSec. All rights reserved.</p>
        <p>Professional Cybersecurity Solutions</p>
      </footer>
    </div>
  );
}