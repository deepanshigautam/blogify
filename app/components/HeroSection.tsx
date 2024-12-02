import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pen, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

function HeroSection() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateBlog = () => {
    setIsLoading(true);
    // Simulate a loading effect
    setTimeout(() => {
      setIsLoading(false);
      router.push('/createblog');
    }, 1000); // 1 second delay to show loading state
  };

  return (
    <header className="relative overflow-hidden dark:bg-neutral-800">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Circles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl "></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/20 rounded-full blur-2xl "></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/3 left-1/6 w-16 h-16 bg-primary/10 transform rotate-45 -translate-x-1/2 -translate-y-1/2 "></div>
        <div className="absolute bottom-1/3 right-1/6 w-24 h-24 bg-amber-500/10 transform -rotate-45 translate-x-1/2 translate-y-1/2 "></div>
        
        {/* Gradient Mesh */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-primary/10 via-amber-500/10 to-primary/10 mix-blend-multiply"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28 relative z-10">
        <div className="relative z-20 text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl mt-8">
          Voices of <span className="text-amber-500">Creativity</span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 dark:text-white sm:mt-4 italic">
            A platform where ideas flourish and stories come to life
          </p>
          <nav className="mt-8 flex justify-center space-x-4">
            {!user ? (
              <button
                onClick={() => router.push('/auth/signup')}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 font-medium text-white bg-primary hover:bg-primary/90 transition-all duration-300 ease-out"
              >
                <span className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </button>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={handleCreateBlog}
                  disabled={isLoading}
                  className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 font-medium text-white bg-primary hover:bg-primary/90 transition-all duration-300 ease-out ${
                    isLoading ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  <span className="relative flex items-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Create Blog <Pen className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </span>
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 font-medium text-primary border border-primary bg-white hover:bg-primary/5 transition-all duration-300 ease-out"
                >
                  <span className="relative">Dashboard</span>
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default HeroSection;