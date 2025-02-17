// app/posts/[id]/page.js
"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { Plus, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [installedPlugins, setInstalledPlugins] = useState([]);
  const [showPluginModal, setShowPluginModal] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
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

    const fetchInstalledPlugins = async () => {
      try {
        const response = await fetch("/api/user/plugins");
        if (!response.ok) {
          throw new Error("Failed to fetch plugins");
        }
        const data = await response.json();
        setInstalledPlugins(data);
      } catch (err) {
        console.error("Error fetching plugins:", err);
      }
    };

    fetchPost();
    fetchInstalledPlugins();
  }, [id]);

  const addPluginToPost = async (pluginId) => {
    try {
      const response = await fetch(`/api/posts/plugins/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pluginId: pluginId, postId: id }),
      });

      if (!response.ok) {
        alert("Failed to add plugin");
        throw new Error("Failed to add plugin");
      }

      const updatedPost = await response.json();
      alert("plugin added successfully");

      setShowPluginModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding plugin:", error);
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
        <div className="text-gray-500">Post not found</div>
      </div>
    );
  }

  const PluginRenderer = ({ post }) => {
    return (
      <div className="space-y-6">
        {post?.plugins?.map((plugin) => (
          <div key={plugin.id} className="border rounded-lg p-4">
            {console.log(plugin.plugin, "plugin console")}

            {/* Text Plugin */}
            {plugin.plugin.type === "text" && (
              <div className="flex flex-col gap-3">
                {plugin.plugin.config?.fields?.map((field, index) => (
                  <input
                    key={index}
                    type={field.type}
                    placeholder={field.label}
                    required={field.required}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>
            )}

            {/* Image Plugin (Slider) */}
            {plugin.plugin.type === "image" && (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                className="w-full max-w-md mx-auto"
              >
                {plugin.plugin.config?.images?.map((field, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={field.url}
                      alt={field.name}
                      width={600} // Set a proper width
                      height={256} // Set a proper height
                      className="w-full h-64 object-cover rounded-md shadow-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            {/* Video Plugin */}
            {console.log(
              plugin.plugin.config.video?.url,
              "plugin.plugin.config.video?.url"
            )}
            {plugin.plugin.type === "video" &&
              plugin.plugin.config?.video?.url && (
                <video
                  controls
                  className="w-full h-64 object-cover rounded-md shadow-lg"
                  src={"/intro.mp4"}
                >
                  Your browser does not support the video tag.
                </video>
              )}
          </div>
        ))}
      </div>
    );
  };

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
        Back to Posts
      </Link>

      <article className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-500 mb-6">
          {new Date(post.createdAt).toLocaleDateString()} •{" "}
          {new Date(post.createdAt).toLocaleTimeString()}
        </p>
        <div
          className="prose max-w-none prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:underline prose-p:my-4 prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.content, {
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
            }),
          }}
        />

        {/* Display active plugins */}
        <PluginRenderer post={post} />

        <div className="mt-8 pt-6 border-t">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Post Extensions</h2>
            <button
              onClick={() => setShowPluginModal(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Plugin
            </button>
          </div>
        </div>
      </article>

      {showPluginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Plugin to Post</h3>
              <button
                onClick={() => setShowPluginModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {installedPlugins.map((plugin) => (
                <button
                  key={plugin.id}
                  onClick={() => addPluginToPost(plugin.plugin.id)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-medium">{plugin.plugin.name}</h4>
                    <p className="text-sm text-gray-500">
                      {plugin.plugin.description}
                    </p>
                  </div>
                  <Plus className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
