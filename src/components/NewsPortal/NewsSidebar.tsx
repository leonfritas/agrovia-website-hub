"use client";

import Link from "next/link";
import { Clock, Tag } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

interface NewsSidebarProps {
  recentPosts?: Array<{
    idPost: number;
    nomePost: string;
    dataPost: string;
  }>;
  categories?: Array<{
    idCategoria: number;
    nomeCategoria: string;
  }>;
}

export default function NewsSidebar({
  recentPosts = [],
  categories = [],
}: NewsSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Categorias */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
          <Tag className="h-5 w-5 text-emerald-600" />
          Seções
        </h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="#agrovia-atual"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
            >
              <span>Agrovia Atual</span>
              <span className="text-xs text-gray-400">→</span>
            </Link>
          </li>
          <li>
            <Link
              href="#agrovia-ensina"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
            >
              <span>Agrovia Ensina</span>
              <span className="text-xs text-gray-400">→</span>
            </Link>
          </li>
          <li>
            <Link
              href="#agrovia-legal"
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
            >
              <span>Agrovia Legal</span>
              <span className="text-xs text-gray-400">→</span>
            </Link>
          </li>
          {categories
            .filter(
              (cat) =>
                !["Agrovia Atual", "Agrovia Ensina", "Agrovia Legal"].includes(
                  cat.nomeCategoria
                )
            )
            .map((category) => (
              <li key={category.idCategoria}>
                <Link
                  href={`/categoria/${category.idCategoria}`}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                >
                  <span>{category.nomeCategoria}</span>
                  <span className="text-xs text-gray-400">→</span>
                </Link>
              </li>
            ))}
        </ul>
      </div>

      {/* Posts Recentes */}
      {recentPosts.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
            <Clock className="h-5 w-5 text-emerald-600" />
            Mais Recentes
          </h3>
          <ul className="space-y-4">
            {recentPosts.map((post, index) => {
              const formattedDate = new Date(post.dataPost).toLocaleDateString(
                "pt-BR",
                {
                  day: "2-digit",
                  month: "short",
                }
              );

              return (
                <li key={post.idPost}>
                  <Link
                    href={`/post/${post.idPost}`}
                    className="group flex gap-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-emerald-600">
                        {post.nomePost}
                      </h4>
                      <span className="mt-1 text-xs text-gray-500">
                        {formattedDate}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Newsletter */}
      <NewsletterForm />
    </aside>
  );
}

