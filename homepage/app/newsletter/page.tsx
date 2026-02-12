"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import NewsletterForm from "../components/NewsletterForm";

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="w-full py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold text-white">
            Man of Wisdom
          </Link>
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Home
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ideas, Insights &{" "}
              <span className="gold-gradient">Inspiration</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-4">
              A weekly letter from Man of Wisdom — delivered every Monday.
            </p>

            <p className="text-gray-400 mb-12">
              Join 2,000+ wisdom seekers building meaningful lives.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <NewsletterForm variant="full" />
          </motion.div>
        </div>
      </section>

      {/* What to expect */}
      <section className="py-20 px-6 md:px-12 bg-[#1A1A2E]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
              What to Expect
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-xl font-semibold text-white mb-2">Ideas</h3>
                <p className="text-gray-400">
                  Practical frameworks and approaches for goal-setting,
                  productivity, and living with purpose.
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">Insights</h3>
                <p className="text-gray-400">
                  Perspectives drawn from ancient philosophy, modern science,
                  and real-world experience.
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-white mb-2">Inspiration</h3>
                <p className="text-gray-400">
                  Stories, quotes, and reflections to fuel your week and
                  keep you moving forward.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plus */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              Plus
            </h2>

            <div className="space-y-4 text-gray-300 text-lg">
              <p>Early access to new products and features</p>
              <p>Exclusive offers for subscribers only</p>
              <p>Product updates from the Man of Wisdom ecosystem</p>
            </div>

            <div className="mt-12">
              <NewsletterForm variant="full" />
            </div>

            <p className="text-gray-500 text-sm mt-8">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold text-white">
            Man of Wisdom
          </Link>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Man of Wisdom. Ancient wisdom for modern life.
          </p>
        </div>
      </footer>
    </div>
  );
}
