'use client'
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Github } from 'lucide-react';

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

    router.push('/');
  };

  return (
    <div className="min-h-screen dark:bg-neutral-900 dark:text-white bg-neutral-200 flex items-center justify-center p-4">
      <div className="dark:bg-neutral-800  bg-neutral-500 rounded-2xl shadow-2xl w-full max-w-md p-10 border dark:border-neutral-700 border:neutral-400">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white text-neutral-800 mb-2">Welcome</h1>
          <p className="dark:text-neutral-400 text-neutral-200">Sign up to get started</p>
        </div>

        <div className="space-y-4">
          <button
            className="w-full flex items-center justify-center gap-3 bg-neutral-700 text-white py-3 px-4 rounded-lg 
            hover:bg-neutral-600 transition-colors duration-300 ease-in-out 
            focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-opacity-50
            disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={signUpWithGitHub}
            disabled={loading}
          >
            <Github className="w-6 h-6" />
            {loading ? 'Signing Up...' : 'Continue with GitHub'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="dark:text-neutral-500 text-neutral-700 text-sm">
            By signing up, you agree to our{' '}
            <a href="#" className="dark:text-neutral-300 text-neutral-800 hover:text-white transition-colors">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;