"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  FileText,
  ImagePlus,
  Tag,
  Save,
  X,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { marked } from "marked";

// Utility functions
function dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: mimeString });
}

const detectContentType = (dataURI: string) => {
  return dataURI.split(",")[0].split(":")[1].split(";")[0];
};

const markdownToHtml = (markdown: string): string => {
  // Create a temporary div to render markdown as HTML
  const tempDiv = document.createElement("div");

  // Use ReactDOMServer to render markdown to HTML (you'll need to import this)
  import("react-dom/server").then((ReactDOMServer) => {
    tempDiv.innerHTML = ReactDOMServer.renderToStaticMarkup(
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {markdown}
      </ReactMarkdown>
    );
  });

  return tempDiv.innerHTML;
};

const CreateBlogPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [imagePreviewModal, setImagePreviewModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [createdAt, setCreatedAt] = useState<Date | null>(null);

  useEffect(() => {
    setCreatedAt(new Date()); // Initialize the createdAt timestamp
  }, []);

  const handlePasteContent = (
    event: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    const pastedText = event.clipboardData.getData("text");
    setContent((prev) => prev + pastedText);
  };

  const handlePasteImage = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === "string") {
              // Validate image type and size
              const img = new Image();
              img.onload = () => {
                const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
                const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

                if (!allowedTypes.includes(blob.type)) {
                  setErrors((prev) => ({
                    ...prev,
                    image: "Only JPEG, JPG, and PNG images are allowed.",
                  }));
                  return;
                }

                if (blob.size > maxSizeInBytes) {
                  setErrors((prev) => ({
                    ...prev,
                    image: "Image must be less than 5MB.",
                  }));
                  return;
                }

                // If validation passes, set the cover image
                setCoverImage(reader.result as string);
                setErrors((prev) => ({ ...prev, image: undefined }));
              };
              img.src = reader.result as string;
            }
          };
          reader.readAsDataURL(blob);
          break; // Stop after the first image is found
        }
      }
    }
  };

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
        if (typeof reader.result === "string") {
          // Validate image type and size
          const img = new Image();
          img.onload = () => {
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type)) {
              setErrors((prev) => ({
                ...prev,
                image: "Only JPEG, JPG, and PNG images are allowed.",
              }));
              return;
            }

            if (file.size > maxSizeInBytes) {
              setErrors((prev) => ({
                ...prev,
                image: "Image must be less than 5MB.",
              }));
              return;
            }

            setCoverImage(reader.result as string);
            setErrors((prev) => ({ ...prev, image: undefined }));
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
      setTags((prev) => [...prev, trimmedTag]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) return;

    if (!user) {
      alert("Please log in to create a blog post.");
      return;
    }

    // Additional content validation
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setErrors((prev) => ({ ...prev, content: "Content cannot be empty" }));
      console.error("Content is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = coverImage;

      if (coverImage) {
        const fileName = `blog-images/public/${user.id}-${crypto.randomUUID()}`;
        const contentType = detectContentType(coverImage);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(fileName, dataURItoBlob(coverImage), {
            contentType: contentType,
          });

        if (uploadError) {
          alert(`Upload Error: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }

        imageUrl = supabase.storage.from("blog-images").getPublicUrl(fileName)
          .data.publicUrl;
      }

      // Convert Markdown to Plain Text (more conservative approach)
      const plainTextContent = trimmedContent
        // Remove headers like # or ## from the start of the line
        .replace(/^#+\s*/gm, "") // Removes '#' (headers)
        // Remove Markdown italic and bold syntax
        .replace(/\*\*([^\*]+)\*\*/g, "$1") // Bold
        .replace(/\*([^\*]+)\*/g, "$1") // Italic
        // Remove Markdown links [text](url)
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Links
        // Optionally: Remove extra newlines or replace them with spaces
        .replace(/\n+/g, " ") // Removes multiple line breaks, replace with a single space
        .trim();

      // Optionally store the original Markdown content in `markdown_content` if needed
      const blogPost = {
        title,
        content: plainTextContent, // Save plain text content
        markdown_content: content, // Optionally store original Markdown content
        tags,
        cover_image: imageUrl,
        author_id: user?.id,
        created_at: new Date(),
        is_public: isPublic,
      };

      const { data, error } = await supabase.from("blogs").insert([blogPost]);

      if (error) {
        console.error("Submission Error:", error);
        alert(`Submission Error: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      // Success notification or redirect
      router.push("/userblog");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred.");
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
                onPaste={handlePasteImage} // Attach the paste handler
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
                    <ImagePlus className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary" />
                    <p className="mt-2 text-sm text-gray-600 group-hover:text-primary">
                      Click to upload cover image or paste an image here
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
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Blog Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`mt-1 block w-full border text-black border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.title ? "border-red-500" : ""
                }`}
                placeholder="Enter your blog title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-2">{errors.title}</p>
              )}
            </div>
            {/* Content Input */}
            <div>
              <label
                htmlFor="content"
                className=" text-sm font-medium text-gray-700 flex items-center justify-between"
              >
                <span>Blog Content</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="flex items-center text-sm text-primary hover:bg-primary/10 px-2 py-1 rounded"
                  >
                    {isPreviewMode ? (
                      <>
                        <FileText className="mr-1" size={16} /> Edit
                      </>
                    ) : (
                      <>
                        <Eye className="mr-1" size={16} /> Preview
                      </>
                    )}
                  </button>
                </div>
              </label>
              {isPreviewMode ? (
                <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 prose max-w-full">
                  {content ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className="text-black"
                    >
                      {content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-black italic">No content to preview</p>
                  )}
                </div>
              ) : (
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onPaste={handlePasteContent}
                  rows={10}
                  className={`mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.content ? "border-red-500" : ""
                  }`}
                  placeholder="Write your blog post here... (Markdown supported)"
                />
              )}
              <p className="text-sm text-gray-500 mt-1">
                Tip: You can use Markdown formatting and paste content directly
              </p>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent form submission
                      addTag();
                    }
                  }}
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
            {/* privacy toggle  */}
            <div className="flex items-center mb-4">
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className="flex items-center text-sm text-primary hover:bg-primary/10 px-2 py-1 rounded"
              >
                {isPublic ? (
                  <>
                    <Eye className="mr-1" size={16} /> Public
                  </>
                ) : (
                  <>
                    <EyeOff className="mr-1" size={16} /> Private
                  </>
                )}
              </button>
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
