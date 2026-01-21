"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  title: string;
  excerpt: string;
  link: string;
  image?: string;
  index: number;
}

export default function BlogCard({
  title,
  excerpt,
  link,
  image,
  index,
}: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={link} className="block">
        {/* Image area */}
        <div className="aspect-video mb-4 rounded-lg bg-gradient-to-br from-[#1A1A2E] to-[#0a0a0a] border border-gray-800 overflow-hidden group-hover:border-[#D4AF37]/50 transition-colors relative">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-50">
              📖
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{excerpt}</p>

        <span className="text-[#D4AF37] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          Read more
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </Link>
    </motion.article>
  );
}
