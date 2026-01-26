"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

interface UserProduct {
  accessType: string;
  grantedAt: string;
  expiresAt: string | null;
}

interface DashboardProps {
  user: AuthUser;
}

const allProducts = [
  {
    id: "goal_setter",
    icon: "🎯",
    title: "Goal Setter",
    description: "Set your 2026 goals with clarity and purpose",
    price: "FREE",
    link: "https://goals.manofwisdom.co",
    isFree: true,
    comingSoon: false,
  },
  {
    id: "time_views",
    icon: "⏰",
    title: "Time Views",
    description: "Track your life in weeks, months & years",
    price: "FREE",
    link: "/week",
    isFree: true,
    comingSoon: false,
  },
  {
    id: "journal",
    icon: "📓",
    title: "Journal",
    description: "Daily reflection, habits & wisdom prompts",
    price: "From $5/mo",
    link: "#",
    isFree: false,
    comingSoon: true,
  },
  {
    id: "wallpapers",
    icon: "🖼️",
    title: "Wallpapers",
    description: "Beautiful wisdom for your screens",
    price: "From $9",
    link: "#",
    isFree: false,
    comingSoon: true,
  },
  {
    id: "books",
    icon: "📚",
    title: "Books",
    description: "Ebooks & wisdom stories",
    price: "From $5",
    link: "#",
    isFree: false,
    comingSoon: true,
  },
];

export default function Dashboard({ user }: DashboardProps) {
  const [userProducts, setUserProducts] = useState<Record<string, UserProduct>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/user/products");
        if (res.ok) {
          const data = await res.json();
          setUserProducts(data.products || {});
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const hasAccess = (productId: string) => {
    const product = userProducts[productId];
    if (!product) return false;
    if (product.expiresAt && new Date(product.expiresAt) < new Date()) {
      return false;
    }
    return true;
  };

  const getAccessBadge = (productId: string) => {
    const product = userProducts[productId];
    if (!product) return null;
    if (product.accessType === "free") return "FREE";
    if (product.accessType === "purchased") return "OWNED";
    if (product.accessType === "subscription") return "SUBSCRIBED";
    if (product.accessType === "trial") return "TRIAL";
    return "ACCESS";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome{user.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-gray-400">
            Choose a product to get started with your intentional living journey.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {allProducts.map((product, index) => {
            const accessible = product.isFree || hasAccess(product.id);
            const badge = product.isFree ? "FREE" : getAccessBadge(product.id);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative p-6 rounded-xl border ${
                  accessible && !product.comingSoon
                    ? "border-[#D4AF37]/50 bg-[#D4AF37]/5"
                    : "border-gray-800 bg-gray-900/50"
                } hover:border-[#D4AF37]/70 transition-all group`}
              >
                {badge && !product.comingSoon && (
                  <div className="absolute -top-3 -right-3 px-3 py-1 bg-[#D4AF37] text-black text-xs font-bold rounded-full">
                    {badge}
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
                      accessible && !product.comingSoon
                        ? "text-[#D4AF37]"
                        : "text-gray-500"
                    }`}
                  >
                    {product.price}
                  </span>

                  {product.comingSoon ? (
                    <span className="px-4 py-2 bg-gray-800 text-gray-400 text-sm font-semibold rounded-lg">
                      Coming Soon
                    </span>
                  ) : accessible ? (
                    <Link
                      href={product.link}
                      className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E8C547] text-black text-sm font-semibold rounded-lg transition-colors"
                    >
                      Open
                    </Link>
                  ) : (
                    <span className="px-4 py-2 bg-gray-800 text-gray-400 text-sm font-semibold rounded-lg">
                      Purchase
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Loading state overlay */}
        {loading && (
          <div className="fixed inset-0 bg-[#0a0a0a]/50 flex items-center justify-center">
            <div className="text-[#D4AF37]">Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
}
