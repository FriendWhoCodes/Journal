"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const products = [
  {
    icon: "🎯",
    title: "Goal Setter",
    description: "Set your 2026 goals with clarity and purpose",
    price: "FREE",
    cta: "Start Now",
    link: "https://goals.manofwisdom.co",
    available: true,
  },
  {
    icon: "📓",
    title: "Journal",
    description: "Daily reflection, habits & wisdom prompts",
    price: "From $5/mo",
    cta: "Coming Feb 1",
    link: "#",
    available: false,
  },
  {
    icon: "⏰",
    title: "Time Views",
    description: "Track your life in weeks, months & years",
    price: "From $9",
    cta: "Coming Soon",
    link: "#",
    available: false,
  },
  {
    icon: "🖼️",
    title: "Wallpapers",
    description: "Beautiful wisdom for your screens",
    price: "From $9",
    cta: "Coming Soon",
    link: "#",
    available: false,
  },
  {
    icon: "📚",
    title: "Books",
    description: "Ebooks & wisdom stories",
    price: "From $5",
    cta: "Coming Soon",
    link: "#",
    available: false,
  },
];

export default function Products() {
  return (
    <section id="products" className="py-20 px-6 md:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tools for Intentional Living
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Every product we build helps you practice wisdom, not just read about it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-6 rounded-xl border ${
                product.available
                  ? "border-[#D4AF37]/50 bg-[#D4AF37]/5"
                  : "border-gray-800 bg-gray-900/50"
              } hover:border-[#D4AF37]/70 transition-all group`}
            >
              {product.available && (
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-[#D4AF37] text-black text-xs font-bold rounded-full">
                  LIVE
                </div>
              )}

              <div className="text-4xl mb-4">{product.icon}</div>

              <h3 className="text-xl font-bold text-white mb-2">
                {product.title}
              </h3>

              <p className="text-gray-400 text-sm mb-4 min-h-[40px]">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <span
                  className={`font-semibold ${
                    product.available ? "text-[#D4AF37]" : "text-gray-500"
                  }`}
                >
                  {product.price}
                </span>

                {product.available ? (
                  <Link
                    href={product.link}
                    className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E8C547] text-black text-sm font-semibold rounded-lg transition-colors"
                  >
                    {product.cta}
                  </Link>
                ) : (
                  <span className="px-4 py-2 bg-gray-800 text-gray-400 text-sm font-semibold rounded-lg">
                    {product.cta}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
