import React from "react";
import { ArrowRight, BookOpen, Calendar } from "lucide-react";

const blogPosts = [
  {
    title: "Mastering the Art of Writing",
    excerpt: "Unlock the secrets of compelling storytelling and elevate your writing craft to new heights.",
    image: "/api/placeholder/800/500",
    author: "Emily Rodriguez",
    date: "Nov 15, 2024",
    readTime: "5 min read",
    category: "Creativity",
  },
  {
    title: "The Future of AI in Writing",
    excerpt: "Explore how artificial intelligence is reshaping the landscape of creative writing and content creation.",
    image: "/api/placeholder/800/500",
    author: "Alex Chen",
    date: "Oct 22, 2024",
    readTime: "7 min read",
    category: "Technology",
  },
  {
    title: "Storytelling Techniques",
    excerpt: "Master the art of narrative construction with proven strategies that captivate and engage readers.",
    image: "/api/placeholder/800/500",
    author: "Michael Thompson",
    date: "Sep 30, 2024",
    readTime: "6 min read",
    category: "Storytelling",
  },
];

const BlogPostsSection = () => {
  return (
    <section id="blog" className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Latest Blog Posts
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Insights, stories, and inspiration from our creative community
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="
                group 
                bg-white 
                rounded-2xl 
                overflow-hidden 
                border 
                border-gray-200 
                shadow-lg 
                hover:shadow-xl 
                transition-all 
                duration-300 
                transform 
                hover:-translate-y-2
              "
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="
                    absolute 
                    top-4 
                    right-4 
                    bg-primary/10 
                    text-primary 
                    px-3 
                    py-1 
                    rounded-full 
                    text-xs 
                    font-medium
                  "
                >
                  {post.category}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <h3
                  className="
                    text-xl 
                    font-bold 
                    text-gray-900 
                    group-hover:text-primary 
                    transition-colors 
                    duration-300
                  "
                >
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{post.date}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 mt-4">
                  <button
                    className="
                      w-full 
                      text-center 
                      text-primary 
                      font-semibold 
                      hover:text-primary/90 
                      transition-colors 
                      flex 
                      items-center 
                      justify-center
                    "
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            className="
              inline-flex 
              items-center 
              px-8 
              py-3 
              bg-primary 
              text-white 
              rounded-full 
              font-semibold 
              hover:bg-primary/90 
              transition-all 
              group
            "
          >
            View All Posts
            <ArrowRight
              className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogPostsSection;
