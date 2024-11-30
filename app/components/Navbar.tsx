'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Home, Zap, Book, MessageCircle } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const NavLinks = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Features', icon: Zap, path: '/features' },
    { name: 'Blog', icon: Book, path: '/blog' },
    { name: 'Contact', icon: MessageCircle, path: '/contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div 
          onClick={() => router.push('/')} 
          className="flex items-center cursor-pointer group"
        >
          <span className="text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors">
            Blogify
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {NavLinks.map((link) => (
            <div 
              key={link.name}
              onClick={() => router.push(link.path)}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary cursor-pointer group"
            >
              <link.icon 
                className="w-5 h-5 group-hover:text-primary transition-colors" 
              />
              <span className="font-medium group-hover:text-primary transition-colors">
                {link.name}
              </span>
            </div>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/auth/login')}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              {/* User Avatar */}
              <div 
                className="relative group cursor-pointer"
                onClick={() => router.push('/dashboard')}
              >
                <img
                  src={user.user_metadata?.avatar_url ?? '/default-avatar.png'}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                />
                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;