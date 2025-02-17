"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/testLayout";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-4 border-b border-gray-200 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);



const PostContent = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      "p",
      "a",
      "strong",
      "em",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });

  const words = sanitizedContent.split(" ");
  const initialText = words.slice(0, 50).join(" "); // Show first 300 words
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="prose max-w-none prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:underline prose-p:my-4 prose-p:leading-relaxed">
      <div
        dangerouslySetInnerHTML={{
          __html: isExpanded ? sanitizedContent : initialText + "...",
        }}
      />
      {!isExpanded && words.length > 300 && (
        <button
          className="mt-2 text-blue-600 hover:text-blue-800 underline"
          onClick={() => setIsExpanded(true)}
        >
          Read More
        </button>
      )}
    </div>
  );
};

// Usage



const DeleteButton = ({ postId, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Prevent event bubbling

    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      onDelete(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
      title="Delete post"
    >
      <svg
        className="w-4 h-4 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
};

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

 

  useEffect(() => {

    if (status == "unauthenticated") {
      router.push("/auth/signin");
      return;
    }
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [status,router]);

  const handlePostDelete = (deletedPostId) => {
    setPosts(posts.filter(post => post.id !== deletedPostId));
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }


return (
  <MainLayout>
  <div className="max-w-4xl mx-auto p-4 space-y-6">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Posts</h1>
      <Link 
        href="/admin/posts/create" 
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create Post
      </Link>
      {/* <Link 
        href="/admin/plugin/create" 
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 4v16m8-8H4"
          />
        </svg>
        Create Plugin
      </Link> */}
    </div>

    {loading ? (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <Card key={n}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    ) : posts.length === 0 ? (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-500 mb-6">Get started by creating your first post</p>
        <Link 
          href="/admin/posts/create" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Your First Post
        </Link>
      </div>
    ) : (
      <div className="space-y-4">
        {posts.map((post) => (
          /* Your existing post card code */
          <Link href={`/posts/${post.id}`} key={post.id} className="block">
            <Card className="transition-all duration-200 hover:shadow-lg hover:border-gray-300">
              <CardHeader>
                <div className="flex flex-row justify-between">
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <div className="flex space-x-2">
                    <Link
                      href={`/posts/edit/${post.id}`}
                      className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </Link>
                    <DeleteButton postId={post.id} onDelete={handlePostDelete} />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
              <PostContent content={post.content} />;
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    )}
  </div>
  </MainLayout>
);
}