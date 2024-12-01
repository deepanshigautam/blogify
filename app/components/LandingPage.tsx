'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Footer from './Footer';
import BlogPostsSection from './BlogSection';
import FeatureSection from './FeatureSection';
import HeroSection from './HeroSection';
import Navbar from './Navbar';

const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  // Loader timeout
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // 1-second loader
    return () => clearTimeout(timer);
  }, []);

  // Animation Variants
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="h-12 w-12 border-4 border-white border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="flex flex-col min-h-screen bg-gray-50"
    >
      <Navbar />

      {/* Hero Section */}
      <motion.div variants={fadeInVariants}>
        <HeroSection />
      </motion.div>

      {/* Feature Section */}
      <motion.div
        whileInView="visible"
        initial="hidden"
        viewport={{ once: true, amount: 0.2 }} // Trigger earlier on mobile
        variants={fadeUpVariants}
        className=""
      >
        <FeatureSection />
      </motion.div>

      {/* Blog Posts Section */}
      <motion.div
        whileInView="visible"
        initial="hidden"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUpVariants}
        className=""
      >
        <BlogPostsSection />
      </motion.div>

      {/* Call to Action */}
      {!user && (
        <motion.div
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUpVariants}
          className="bg-primary/10 text-center py-12 sm:py-16 mt-12 sm:mt-16 px-4 sm:px-0"
        >
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
            Start Your Writing Journey Today
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Join a community of passionate writers and readers.
          </p>
          <button
            onClick={() => router.push('/auth/signup')}
            className="mt-6 bg-primary text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Create Your Account
          </button>
        </motion.div>
      )}

      {/* Footer */}
      <motion.div
        whileInView="visible"
        initial="hidden"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInVariants}
        className=""
      >
        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;
