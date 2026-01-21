"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Static blog posts for MVP - update manually when new posts are published
const posts = [
  {
    title: "Why Weekly Reflection Matters",
    excerpt:
      "The ancient Stoics practiced daily reflection. Here's why a weekly review might be even more powerful for modern life.",
    link: "https://blog.manofwisdom.co/weekly-reflection-matters",
    image: null,
  },
  {
    title: "The Stoic Art of Journaling",
    excerpt:
      "Marcus Aurelius wrote Meditations for himself, not for publication. Learn how to journal like an emperor.",
    link: "https://blog.manofwisdom.co/stoic-journaling",
    image: null,
  },
  {
    title: "Setting Intentions for 2026",
    excerpt:
      "Goals without intention are just wishes. Here's how to set meaningful goals that align with your values.",
    link: "https://blog.manofwisdom.co/intentions-2026",
    image: null,
  },
];

export default function BlogPreview() {
  return (
    <section className="py-20 px-6 md:px-12 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Latest from the Blog
          </h2>
          <p className="text-gray-400">
            Deep dives into philosophy, productivity, and intentional living
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={post.link} className="block">
                {/* Placeholder image area */}
                <div className="aspect-video mb-4 rounded-lg bg-gradient-to-br from-[#1A1A2E] to-[#0a0a0a] border border-gray-800 overflow-hidden group-hover:border-[#D4AF37]/50 transition-colors">
                  <div className="w-full h-full flex items-center justify-center text-4xl opacity-50">
                    📖
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {post.excerpt}
                </p>

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
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="https://blog.manofwisdom.co"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] font-semibold rounded-lg transition-colors"
          >
            Visit the Blog
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
