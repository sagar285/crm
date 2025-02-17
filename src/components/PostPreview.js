// components/PostPreview.js
'use client'
import DOMPurify from "dompurify";

const PostPreview = ({ post }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
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
    </div>
  );
};

export default PostPreview;