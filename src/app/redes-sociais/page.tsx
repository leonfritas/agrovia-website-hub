"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function FacebookPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("/api/facebook");
      const data = await res.json();
      setPosts(data.data || []);
    }
    fetchPosts();
  }, []);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {posts.map((post, i) => (
        <div key={i} className="bg-white shadow rounded-lg p-4">
          {post.full_picture && (
            <Image
              src={post.full_picture}
              alt={post.message || "Post do Facebook"}
              width={400}
              height={300}
              className="rounded-lg object-cover w-full h-64"
            />
          )}
          <p className="mt-2 text-gray-700">{post.message}</p>
          <Link
            href={post.permalink_url}
            target="_blank"
            className="text-blue-600 mt-2 block"
          >
            Ver no Facebook
          </Link>
        </div>
      ))}
    </section>
  );
}
