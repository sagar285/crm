"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
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

const DeleteButton = ({ postId, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Prevent event bubbling

    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/plugins/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      onDelete(postId);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
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
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
};

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [userPlugins, setuserPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchuserPlugin = async () => {
    try {
      const response = await fetch("/api/user/plugins");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setuserPlugins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/plugins");
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
 
    fetchuserPlugin();
    fetchPosts();
  }, []);

  const handleInstallPlugin = async (e, id) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/plugins/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchuserPlugin();
      if (!response.ok) {
        throw new Error("Failed to update post");
      }

      // router.push('/');
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
    }
  };

  const handlePostDelete = (deletedPostId) => {
    setPosts(posts.filter((post) => post.id !== deletedPostId));
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
        <h1 className="text-3xl font-bold">Plugins</h1>
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
        <div className="text-center py-12"></div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            /* Your existing post card code */

            <Card  key={post.id} className="transition-all duration-200 hover:shadow-lg hover:border-gray-300">
              <CardHeader>
                <div className="flex flex-row justify-between">
                  <h2 className="text-xl font-semibold">{post.name}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => handleInstallPlugin(e, post.id)}
                      disabled={userPlugins?.some(
                        (p) => p.pluginId === post.id
                      )}
                      className={`px-4 py-2 rounded-md text-white ${
                        userPlugins?.some((p) => p.pluginId === post.id)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {userPlugins?.some((p) => p.pluginId === post.id)
                        ? "Installed"
                        : "Install"}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                {post.config?.fields?.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      <input type={field.type} required={field.required} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </MainLayout>
  );
}
