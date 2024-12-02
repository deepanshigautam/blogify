"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Define the type for a blog interface
interface Blog {
  id: string;
  title: string;
  content: string;
  tags: string[];
  cover_image: string | null;
  author_id: string;
  likes?: number;
  comments?: number;
  likedBy?: string[]; // Track users who liked the post
}

const UserBlogPage = () => {
  // Use the defined type for blogs
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(
    null
  );

  const toggleLike = (blogId: string) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === blogId
          ? {
              ...blog,
              likes: blog.likedBy?.includes(currentUser || "")
                ? (blog.likes ?? 0) - 1
                : (blog.likes ?? 0) + 1,
              likedBy: blog.likedBy?.includes(currentUser || "")
                ? blog.likedBy.filter((user) => user !== currentUser)
                : [...(blog.likedBy || []), currentUser || ""],
            }
          : blog
      )
    );
  };

  const fetchBlogs = async () => {
    try {
      // Simulate current user (in real app, this would come from authentication)
      setCurrentUser("user123");

      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, content, tags, cover_image, author_id");

      console.log("Fetched Blogs:", data);
      if (error) {
        console.error("Error fetching blogs:", error.message);
      } else if (!data || data.length === 0) {
        console.warn("No blogs found in the database");
      }

      // Augment blogs with social interactions
      const augmentedBlogs = (data || []).map((blog) => ({
        ...blog,
        likes: Math.floor(Math.random() * 100), // Simulated likes
        comments: Math.floor(Math.random() * 50), // Simulated comments
        likedBy: [], // Initialize liked users
      }));

      setBlogs(augmentedBlogs);
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

 

  const handleDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", deleteConfirmation);

      if (error) throw error;

      // Remove the blog from state
      setBlogs((prevBlogs) =>
        prevBlogs.filter((blog) => blog.id !== deleteConfirmation)
      );

      // Close the confirmation modal
      setDeleteConfirmation(null);
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  const openEditModal = (blog: Blog) => {
    setSelectedBlog(blog);
  };

  const closeEditModal = () => {
    setSelectedBlog(null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlog) return;

    try {
      const { error } = await supabase
        .from("blogs")
        .update({
          title: selectedBlog.title,
          content: selectedBlog.content,
          tags: selectedBlog.tags,
        })
        .eq("id", selectedBlog.id);

      if (error) throw error;

      // Update blogs in state
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === selectedBlog.id ? selectedBlog : blog
        )
      );

      closeEditModal();
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">No blogs found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto lg:px-20 md:px-16 px-4 py-8 ">
      {/* Edit Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-8 rounded-lg w-[500px] max-w-full shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-black">Edit Blog</h2>
            <input
              type="text"
              value={selectedBlog.title}
              onChange={(e) =>
                setSelectedBlog({ ...selectedBlog, title: e.target.value })
              }
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Blog Title"
            />
            <textarea
              value={selectedBlog.content}
              onChange={(e) =>
                setSelectedBlog({ ...selectedBlog, content: e.target.value })
              }
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md mb-4 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Blog Content"
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      <h1 className="text-5xl  text-center mb-12 text-white font-serif font-bold">
        Community Blogs
      </h1>
      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[400px] max-w-full shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to permanently delete this blog post?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {blog.cover_image ? (
              <img
                src={blog.cover_image}
                alt={blog.title || "Blog Cover"}
                className="w-full h-60 object-cover"
              />
            ) : (
              <div className="w-full h-60 bg-gray-200 flex justify-center items-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}

            {/* Content */}
            <div className="p-4 flex flex-col">
              <h2 className="text-xl font-semibold mb-2 text-black">
                {blog.title || "Untitled Blog"}
              </h2>
              <p className="text-gray-600 mb-4">
                {blog.content.length > 150
                  ? `${blog.content.slice(0, 150)}...`
                  : blog.content}
              </p>

              {/* Icons Section */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  {/* Like, Comment, and Share Icons */}
                  <button
                    onClick={() => toggleLike(blog.id)}
                    className={`flex items-center space-x-2 text-sm ${
                      blog.likedBy?.includes(currentUser || "")
                        ? "text-red-500"
                        : "text-gray-600 hover:text-red-500"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill={
                        blog.likedBy?.includes(currentUser || "")
                          ? "currentColor"
                          : "none"
                      }
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{blog.likes || 0}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <span>{blog.comments || 0}</span>
                  </button>
                  <button className="text-gray-600 hover:text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.486 9 12c0-.486-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* edit and delete */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => openEditModal(blog)}
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirmation(blog.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              {blog.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBlogPage;
