'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { 
  FileText, 
  ImagePlus, 
  Tag, 
  Save, 
  X, 
  Loader2 
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

// Utility functions
function dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: mimeString });
}

const detectContentType = (dataURI: string) => {
  return dataURI.split(',')[0].split(':')[1].split(';')[0];
};

const CreateBlogPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [imagePreviewModal, setImagePreviewModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Error state for form validation
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    image?: string;
  }>({});

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Validate image type and size
          const img = new Image();
          img.onload = () => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type)) {
              setErrors(prev => ({
                ...prev, 
                image: 'Only JPEG, JPG, and PNG images are allowed.'
              }));
              return;
            }

            if (file.size > maxSizeInBytes) {
              setErrors(prev => ({
                ...prev, 
                image: 'Image must be less than 5MB.'
              }));
              return;
            }

            setCoverImage(reader.result as string);
            setErrors(prev => ({...prev, image: undefined}));
          };
          img.src = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags(prev => [...prev, trimmedTag]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const validateForm = () => {
    const newErrors: {title?: string, content?: string} = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) return;

    if (!user) {
      alert('Please log in to create a blog post.');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = coverImage;

      if (coverImage) {
        const fileName = `blog-images/public/${user.id}-${crypto.randomUUID()}`;
        const contentType = detectContentType(coverImage);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(fileName, dataURItoBlob(coverImage), {
            contentType: contentType,
          });

        if (uploadError) {
          alert(`Upload Error: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }

        imageUrl = supabase.storage.from('blog-images').getPublicUrl(fileName).data.publicUrl;
      }

      const blogPost = {
        title,
        content,
        tags,
        cover_image: imageUrl,
        author_id: user?.id,
        created_at: new Date(),
      };

      const { data, error } = await supabase.from('blogs').insert([blogPost]);

      if (error) {
        alert(`Submission Error: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      // Success notification or redirect
      
      router.push('/userblog');

    } catch (err) {
      alert('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Image Preview Modal */}
      {imagePreviewModal && coverImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] relative">
            <button 
              onClick={() => setImagePreviewModal(false)}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 z-10"
            >
              <X size={24} />
            </button>
            <img 
              src={coverImage} 
              alt="Cover Preview" 
              className="w-full h-full object-contain rounded-lg max-h-[70vh]" 
            />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="p-8">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
              <FileText className="mr-4 text-primary" size={40} />
              Create Your Blog Post
            </h1>
            <p className="text-gray-600 mt-2">
              Share your unique perspective with the world
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative w-full h-64 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-all cursor-pointer flex items-center justify-center"
              >
                {coverImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={coverImage}
                      alt="Cover"
                      className="w-full h-full object-cover rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreviewModal(true);
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoverImage(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImagePlus
                      className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary"
                    />
                    <p className="mt-2 text-sm text-gray-600 group-hover:text-primary">
                      Click to upload cover image
                    </p>
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mt-2">{errors.image}</p>
              )}
            </div>

            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Blog Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Enter your blog title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-2">{errors.title}</p>
              )}
            </div>

            {/* Content Input */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Blog Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className={`mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.content ? 'border-red-500' : ''}`}
                placeholder="Write your blog post here..."
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-2">{errors.content}</p>
              )}
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <div className="flex items-center mt-1">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-grow border text-black border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Add tags (Press Enter to add)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90 transition-colors"
                >
                  <Tag size={20} />
                </button>
              </div>

              {/* Tag List */}
              {tags?.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                    >
                      {tag}
                      <button 
                        onClick={() => removeTag(tag)} 
                        className="ml-2 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No tags added yet.</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={24} />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={24} />
                    Publish Blog Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPage;