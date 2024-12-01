import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Home, Zap, Book, MessageCircle, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const NavLinks = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Features', icon: Zap, path: '#features' },
    { name: 'Blog', icon: Book, path: '#blog' },
    { name: 'Contact', icon: MessageCircle, path: '#contact' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center relative">
        {/* Logo */}
        <div
          onClick={() => router.push('/')}
          className="flex items-center cursor-pointer group"
        >
          <span className="text-2xl font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors">
            Blogify
          </span>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="text-gray-700 hover:text-indigo-600 transition-colors p-2"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {NavLinks.map((link) => (
            <div
              key={link.name}
              onClick={() => router.push(link.path)}
              className="relative flex items-center space-x-2 text-gray-700 hover:text-indigo-600 cursor-pointer group"
            >
              <link.icon
                className="w-5 h-5 group-hover:text-indigo-600 transition-colors"
              />
              <span className="font-medium group-hover:text-indigo-600 transition-colors">
                {link.name}
              </span>
              {/* Underline effect */}
              <span className="absolute -bottom-1 left-0 w-0 h-1 rounded-full bg-indigo-600 transition-all duration-300 group-hover:w-1/2"></span>
            </div>
          ))}
        </div>

        {/* Rest of the code remains the same as the previous implementation */}
        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/auth/login')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div
                className="relative group cursor-pointer"
                onClick={() => router.push('/dashboard')}
              >
                <img
                  src={user.user_metadata?.avatar_url ?? '/default-avatar.png'}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full ring-2 ring-indigo-200 group-hover:ring-indigo-300 transition-all"
                />
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Overlay (unchanged) */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white md:hidden z-40 pt-16 animate-fade-in">
            {/* ... (previous mobile menu implementation) ... */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;