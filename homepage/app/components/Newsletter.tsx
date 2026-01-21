"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus("loading");

    // For MVP: Open mailto link or link to newsletter signup page
    // Replace with actual newsletter API (ConvertKit, etc.) when ready
    try {
      // Placeholder - redirect to newsletter signup
      window.open(
        `https://blog.manofwisdom.co/newsletter?email=${encodeURIComponent(email)}`,
        "_blank"
      );
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-20 px-6 md:px-12 bg-[#1A1A2E]">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-4xl mb-4">📬</span>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Weekly Wisdom
          </h2>

          <p className="text-gray-300 mb-2">
            Philosophy, product updates, and exclusive offers.
          </p>

          <p className="text-gray-400 text-sm mb-8">
            Join 2,000+ subscribers building meaningful lives.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#E8C547] text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>

          {status === "success" && (
            <p className="text-green-400 text-sm mt-4">
              Thanks! Check the signup page that just opened.
            </p>
          )}

          {status === "error" && (
            <p className="text-red-400 text-sm mt-4">
              Something went wrong. Please try again.
            </p>
          )}

          <p className="text-gray-500 text-xs mt-6">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
