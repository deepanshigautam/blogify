'use client'; // Ensure this page is rendered client-side

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation'; // Import from 'next/navigation' in Next.js 13+

const SignUp = () => {
  const router = useRouter(); // useRouter from next/navigation
  const [loading, setLoading] = useState(false);

  // Sign up with GitHub OAuth
  const signUpWithGitHub = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });

    if (error) {
      console.error('Error:', error.message);
      setLoading(false);
      return;
    }

    // Redirect after successful signup
    router.push('/'); // Redirect to the homepage after signup
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="bg-background p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-primary mb-4">Sign Up</h1>
        
        <button
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300"
          onClick={signUpWithGitHub}
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up with GitHub'}
        </button>
      </div>
    </div>
  );
};

export default SignUp;
