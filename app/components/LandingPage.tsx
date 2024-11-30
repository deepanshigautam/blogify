'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Pen, 
  Globe, 
  ArrowRight, 
  Zap, 
  Shield, 
  MessageCircle,
  FileText,
  Users,
  Send,
  Heart,
  Linkedin,
  Twitter,
  Facebook,
  Instagram
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

const LandingPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const extendedFeatures = [
    {
      icon: <FileText className="w-12 h-12 text-primary" />,
      title: "Advanced Writing Tools",
      description: "Powerful editing and formatting options to refine your content.",
      color: "bg-blue-50"
    },
    {
      icon: <Users className="w-12 h-12 text-primary" />,
      title: "Community Collaboration",
      description: "Collaborate, get feedback, and connect with fellow writers.",
      color: "bg-green-50"
    },
    {
      icon: <Send className="w-12 h-12 text-primary" />,
      title: "Easy Publishing",
      description: "Seamless publishing process with wide distribution options.",
      color: "bg-purple-50"
    },
    {
      icon: <Heart className="w-12 h-12 text-primary" />,
      title: "Personalized Experience",
      description: "Tailored content recommendations and writing insights.",
      color: "bg-orange-50"
    }
  ];

  const blogPosts = [
    {
      title: "The Art of Storytelling",
      excerpt: "Discover the secrets to crafting compelling narratives that captivate readers.",
      author: "Emma Johnson",
      date: "May 15, 2024",
      readTime: "5 min read",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Digital Writing in the AI Era",
      excerpt: "Exploring how artificial intelligence is reshaping content creation.",
      author: "Alex Rodriguez",
      date: "April 22, 2024",
      readTime: "7 min read",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Building a Writing Habit",
      excerpt: "Practical strategies to consistently improve your writing skills.",
      author: "Sarah Lee",
      date: "March 10, 2024",
      readTime: "6 min read",
      image: "/api/placeholder/400/250"
    }
  ];

  const socialLinks = [
    { icon: <Linkedin className="w-6 h-6" />, href: "#" },
    { icon: <Twitter className="w-6 h-6" />, href: "#" },
    { icon: <Facebook className="w-6 h-6" />, href: "#" },
    { icon: <Instagram className="w-6 h-6" />, href: "#" }
  ];

  return (
    <main className="min-h-screen bg-white antialiased">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="relative z-10 text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
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

      {/* Extended Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Advanced Features for Writers
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Empower your writing journey with our comprehensive toolkit
            </p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {extendedFeatures.map((feature, index) => (
              <article 
                key={index} 
                className={`flex flex-col items-center text-center p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 ${feature.color}`}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Latest Blog Posts
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Insights, stories, and inspiration from our community
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article 
                key={index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{post.author}</span>
                    <div className="flex items-center space-x-2">
                      <span>{post.date}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={() => router.push('/blog')}
              className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all"
            >
              View All Posts
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Blogify</h3>
              <p className="text-gray-400">
                A platform where creativity meets community, empowering writers and readers worldwide.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <nav className="space-y-2">
                <a href="#" className="text-gray-400 hover:text-white">Home</a>
                <a href="#" className="text-gray-400 hover:text-white">Features</a>
                <a href="#" className="text-gray-400 hover:text-white">Blog</a>
                <a href="#" className="text-gray-400 hover:text-white">Contact</a>
              </nav>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <nav className="space-y-2">
                <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a>
              </nav>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500">
              © {new Date().getFullYear()} Blogify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Call to Action - Conditionally render */}
      {!user && (
        <section className="bg-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl mb-4">
              Start Your Writing Journey Today
            </h2>
            <p className="text-xl opacity-80 mb-8">
              Join a community of passionate writers and readers
            </p>
            <nav>
              <button 
                onClick={() => router.push('/auth/signup')}
                className="bg-white text-primary px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Create Your Account
              </button>
            </nav>
          </div>
        </section>
      )}
    </main>
  );
};

export default LandingPage;