'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  
  Pen, 
  ArrowRight, 
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

function HeroSection() {
    const router = useRouter();
  const { user } = useAuth();
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="relative z-10 text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mt-8">
              Unleash Your <span className="text-primary">Creativity</span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 sm:mt-4">
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
                    onClick={() => router.push('/createblog')}
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 font-medium text-white bg-primary hover:bg-primary/90 transition-all duration-300 ease-out"
                  >
                    <span className="relative flex items-center">
                      Create Blog <Pen className="ml-2 h-5 w-5" />
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
  )
}

export default HeroSection;