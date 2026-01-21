"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Set Intentions",
    description: "Define your goals with our free Goal Setter tool",
    icon: "🎯",
  },
  {
    number: "02",
    title: "Practice Daily",
    description: "Journal, track habits, and reflect with wisdom prompts",
    icon: "📓",
  },
  {
    number: "03",
    title: "Track Your Time",
    description: "See weeks, months, and years at a glance",
    icon: "⏰",
  },
  {
    number: "04",
    title: "Gain Perspective",
    description: "Understand your life in the bigger picture",
    icon: "🌟",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 md:px-12 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A simple framework for living with more intention
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative text-center"
            >
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-[#D4AF37]/50 to-transparent" />
              )}

              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                  <span className="text-2xl">{step.icon}</span>
                </div>

                <span className="inline-block text-xs text-[#D4AF37] font-mono mb-2">
                  {step.number}
                </span>

                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>

                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
