export default function Home() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>ApniSec Assignment - API Testing</h1>
      <p>Server is running! ✅</p>
      
      <h2>Available Endpoints:</h2>
      <ul>
        <li>POST /api/auth/register - Register new user</li>
        <li>POST /api/auth/login - Login user</li>
        <li>GET /api/auth/me - Get current user (protected)</li>
        <li>POST /api/auth/logout - Logout user (protected)</li>
      </ul>

      <h2>Test the APIs:</h2>
      <p>Open browser console (F12) and run the test scripts!</p>
    </div>
  );
}