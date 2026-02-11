"use client";

import { motion } from "framer-motion";
import NewsletterForm from "./NewsletterForm";

export default function Newsletter() {
  return (
    <section id="newsletter" className="py-20 px-6 md:px-12 bg-[#1A1A2E]">
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

          <NewsletterForm variant="full" />

          <p className="text-gray-500 text-xs mt-6">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
