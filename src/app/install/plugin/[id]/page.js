"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import PluginConfigModal from "@/components/PluginConfigModal";
import { Settings } from "lucide-react";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/user/plugins/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSaveConfig = async (updatedPlugin) => {
    console.log(updatedPlugin,"updatedPlugin");
    try {
      const response = await fetch(`/api/user/plugins/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPlugin),
      });

      if (!response.ok) {
        throw new Error('Failed to update plugin configuration');
      }

      const updatedData = await response.json();
      setPost(updatedData);
      setShowConfigModal(false);
    } catch (error) {
      console.error('Error updating plugin:', error);
      // Handle error appropriately
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-1/4 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-gray-500">Plugin not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Plugins
      </Link>

      <article className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Settings size={16} className="mr-2" />
            Configure Plugin
          </button>
        </div>

        <p className="text-gray-500 mb-6">
          {new Date(post.createdAt).toLocaleDateString()} •{" "}
          {new Date(post.createdAt).toLocaleTimeString()}
        </p>

        {/* Plugin preview or other content */}
      </article>

      {showConfigModal && (
        <PluginConfigModal
          plugin={post}
          onSave={handleSaveConfig}
          onClose={() => setShowConfigModal(false)}
        />
      )}
    </div>
  );
}