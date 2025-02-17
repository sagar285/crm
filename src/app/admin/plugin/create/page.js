"use client";
import { useState } from "react";

const CreatePlugin = () => {
  const [plugin, setPlugin] = useState({
    name: "",
    type: "",
    description: "",
  });

  const handleChange = (e) => {
    setPlugin({ ...plugin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Plugin Created:", plugin);
    // Here you can send data to the backend (API call) to store the plugin info
    try {
        const response = await fetch('/api/plugins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...plugin }),
        });

        if (!response.ok) {
            throw new Error('Failed to create post');
        }

        router.push('/');
    } catch (error) {
        console.error('Error creating post:', error);
    } finally {
    
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4">Create a Plugin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Plugin Name</label>
          <input
            type="text"
            name="name"
            value={plugin.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700">Plugin Type</label>
          <select
            name="type"
            value={plugin.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Type</option>
            <option value="image-slider">Image Slider</option>
            <option value="video-embed">Video Embed</option>
            <option value="custom">Custom Plugin</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={plugin.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Create Plugin
        </button>
      </form>
    </div>
  );
};

export default CreatePlugin;