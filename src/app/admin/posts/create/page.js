'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import PostPreview from '@/components/PostPreview';
import CustomEditor from '@/components/RichTextEditor';

const CreatePost = () => {
    const router = useRouter();
    const [post, setPost] = useState({
        title: '',
        slug: '',
        content: '',
        status: 'draft'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    // Generate slug from title
    useEffect(() => {
        if (post.title) {
            const slug = post.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setPost(prev => ({ ...prev, slug }));
        }
    }, [post.title]);

    const handleEditorChange = (data) => {
        setPost(prev => ({ ...prev, content: data }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...post, status: 'published' }),
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            router.push('/');
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePreview = () => {
        setIsPreviewMode(!isPreviewMode);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
                        <div className="space-x-2">
                            <button 
                                className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 ${
                                    isPreviewMode ? 'bg-gray-100' : ''
                                }`}
                                onClick={togglePreview}
                            >
                                {isPreviewMode ? 'Edit' : 'Preview'}
                            </button>
                            <button 
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish'}
                            </button>
                        </div>
                    </div>

                    {isPreviewMode ? (
                        <PostPreview post={post} />
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={post.title}
                                    onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Enter post title"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                                    Slug
                                </label>
                                <input
                                    id="slug"
                                    type="text"
                                    value={post.slug}
                                    onChange={(e) => setPost(prev => ({ ...prev, slug: e.target.value }))}
                                    placeholder="url-friendly-slug"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>

                            <div className="min-h-[500px] border rounded-lg bg-white">
                                <CustomEditor
                                    onChange={handleEditorChange}
                                    post={post}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatePost;