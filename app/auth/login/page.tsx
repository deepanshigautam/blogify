'use client'
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Log in with GitHub OAuth
  const logInWithGitHub = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });

    if (error) {
      console.error('Error:', error.message);
      setLoading(false);
      return;
    }

    // Redirect after successful login
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="bg-background p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-primary mb-4">Login</h1>
        
        <button
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300"
          onClick={logInWithGitHub}
          disabled={loading}
        >
          {loading ? 'Logging In...' : 'Log In with GitHub'}
        </button>
      </div>
    </div>
  );
};

export default Login;
