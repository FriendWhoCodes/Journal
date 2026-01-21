"use client";

import { motion } from "framer-motion";

// Rotate quotes weekly - one for each day
const quotes = [
  {
    text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
  },
  {
    text: "The obstacle is the way.",
    author: "Marcus Aurelius",
  },
  {
    text: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
  },
  {
    text: "Time is the most valuable thing a man can spend.",
    author: "Theophrastus",
  },
  {
    text: "Knowing yourself is the beginning of all wisdom.",
    author: "Aristotle",
  },
  {
    text: "It is not that we have a short time to live, but that we waste a lot of it.",
    author: "Seneca",
  },
];

export default function TodaysWisdom() {
  // Get quote based on day of year for consistency
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const quote = quotes[dayOfYear % quotes.length];

  return (
    <section className="py-20 px-6 md:px-12 bg-[#1A1A2E]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Today&apos;s Wisdom
          </h2>
          <p className="text-gray-400 text-sm">
            A daily reminder to live with intention
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative p-8 md:p-12 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/10 to-transparent"
        >
          {/* Decorative quote marks */}
          <div className="absolute top-4 left-6 text-6xl text-[#D4AF37]/20 font-serif">
            &ldquo;
          </div>

          <blockquote className="relative z-10">
            <p className="text-xl md:text-2xl lg:text-3xl text-white font-light leading-relaxed mb-6 text-center">
              &ldquo;{quote.text}&rdquo;
            </p>
            <footer className="text-center">
              <cite className="text-[#D4AF37] font-semibold not-italic">
                &mdash; {quote.author}
              </cite>
            </footer>
          </blockquote>

          <div className="absolute bottom-4 right-6 text-6xl text-[#D4AF37]/20 font-serif rotate-180">
            &ldquo;
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-gray-400 text-sm mt-8"
        >
          2,500+ wisdom quotes available through our wallpaper packs and Journal
          subscription.
        </motion.p>
      </div>
    </section>
  );
}
