"use client";

import { useState } from "react";

interface NewsletterFormProps {
  variant?: "full" | "compact";
}

export default function NewsletterForm({ variant = "full" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage(
        data.alreadySubscribed
          ? "You're already subscribed!"
          : "Welcome aboard! Check your inbox."
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "idle" && status !== "loading") setStatus("idle");
            }}
            placeholder="Your email"
            required
            className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E8C547] text-black text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </div>
        {status === "success" && (
          <p className="text-green-400 text-xs mt-2">{message}</p>
        )}
        {status === "error" && (
          <p className="text-red-400 text-xs mt-2">{message}</p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status !== "idle" && status !== "loading") setStatus("idle");
        }}
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
  );
}
