"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Streaming platform icons as SVG components
const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const AppleMusicIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M9.5 18.5c0 1.38-1.12 2.5-2.5 2.5S4.5 19.88 4.5 18.5 5.62 16 7 16s2.5 1.12 2.5 2.5zm10-3c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5zM9 18.5V7l10-2.25v11.25"/>
  </svg>
);

const AmazonMusicIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M20.265 20.794c-2.42 1.784-5.93 2.734-8.953 2.734-4.236 0-8.05-1.566-10.936-4.17-.227-.205-.024-.485.248-.326 3.113 1.812 6.965 2.9 10.943 2.9 2.683 0 5.634-.557 8.347-1.708.41-.174.754.27.35.57zM21.425 19.453c-.309-.396-2.046-.188-2.826-.095-.238.027-.274-.178-.06-.327 1.384-.975 3.656-.693 3.92-.367.266.33-.07 2.6-1.37 3.683-.2.166-.39.078-.301-.142.292-.73.947-2.356.637-2.752z"/>
    <path d="M12 5.5c-3.314 0-6 2.686-6 6 0 2.21 1.193 4.14 2.969 5.18.178.104.38-.07.328-.263A5.974 5.974 0 019 14.5c0-2.21 1.343-4.107 3.258-4.922.198-.084.346-.268.346-.483v-3.1c0-.273-.27-.483-.537-.467-.02.002-.046.004-.067-.028z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// Track data
const tracks = [
  {
    title: "Invictus Poem",
    year: 2020,
    duration: "1:08",
    composer: "William Ernest Henley",
    description: "The timeless poem of unconquerable spirit, brought to life through spoken word.",
    links: {
      spotify: "https://open.spotify.com/track/0t2HPrwLeaYKLIEcBUNJrB",
      appleMusic: "https://music.apple.com/us/album/invictus-poem/1523099982",
      amazonMusic: "https://www.amazon.com/music/player/albums/B08CS9T46D",
      youtube: "https://www.youtube.com/user/ManofWisdom17",
    },
  },
  {
    title: "Man in the Arena",
    year: 2023,
    duration: "1:09",
    composer: "Theodore Roosevelt & Alok Sharma",
    description: "Roosevelt's powerful words on courage and daring greatly, reimagined for the modern warrior.",
    links: {
      spotify: "https://open.spotify.com/track/11Z2FFaJ8hmC8LqwIysnwv",
      appleMusic: "https://music.apple.com/us/album/man-in-the-arena/1712345678",
      amazonMusic: "https://www.amazon.com/music/player/artists/B08CS9MHB8/man-of-wisdom",
      youtube: "https://www.youtube.com/user/ManofWisdom17",
    },
  },
  {
    title: "Go All the Way Poem",
    year: 2023,
    duration: "1:19",
    composer: "Charles Bukowski & Alok Sharma",
    description: "Bukowski's raw and uncompromising call to pursue your dreams with everything you have.",
    links: {
      spotify: "https://open.spotify.com/artist/59S9iaGBrrWXl242r9hLpm",
      appleMusic: "https://music.apple.com/us/artist/man-of-wisdom/1523099981",
      amazonMusic: "https://www.amazon.com/music/player/artists/B08CS9MHB8/man-of-wisdom",
      youtube: "https://www.youtube.com/user/ManofWisdom17",
    },
  },
  {
    title: "Kings, Warriors & Bards",
    year: 2023,
    duration: "1:39",
    composer: "Alok Sharma",
    featuring: "Wisqral",
    description: "An original composition celebrating the archetypes of leadership, courage, and creativity.",
    links: {
      spotify: "https://open.spotify.com/artist/59S9iaGBrrWXl242r9hLpm",
      appleMusic: "https://music.apple.com/us/artist/man-of-wisdom/1523099981",
      amazonMusic: "https://www.amazon.com/music/player/artists/B08CS9MHB8/man-of-wisdom",
      youtube: "https://www.youtube.com/user/ManofWisdom17",
    },
  },
];

// Coming soon tracks
const comingSoon = [
  {
    title: "If—",
    composer: "Rudyard Kipling",
    description: "The ultimate guide to stoic manhood, rendered in powerful spoken word.",
  },
  {
    title: "Desiderata",
    composer: "Max Ehrmann",
    description: "Words of wisdom for finding peace in a chaotic world.",
  },
  {
    title: "The Road Not Taken",
    composer: "Robert Frost",
    description: "A meditation on choice, individuality, and the paths we choose.",
  },
];

// Artist profile links
const artistLinks = {
  spotify: "https://open.spotify.com/artist/59S9iaGBrrWXl242r9hLpm",
  appleMusic: "https://music.apple.com/us/artist/man-of-wisdom/1523099981",
  amazonMusic: "https://www.amazon.com/music/player/artists/B08CS9MHB8/man-of-wisdom",
  youtube: "https://www.youtube.com/user/ManofWisdom17",
};

function TrackCard({ track, index }: { track: typeof tracks[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-[#1A1A2E] rounded-xl p-6 hover:bg-[#252542] transition-colors"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-white">{track.title}</h3>
            <span className="text-sm text-gray-500">({track.year})</span>
            <span className="text-sm text-[#D4AF37]">{track.duration}</span>
          </div>
          <p className="text-sm text-gray-400 mb-2">
            Composed by {track.composer}
            {track.featuring && <span> feat. {track.featuring}</span>}
          </p>
          <p className="text-gray-300">{track.description}</p>
        </div>

        {/* Streaming Links */}
        <div className="flex items-center gap-3">
          <Link
            href={track.links.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-[#1DB954]/20 text-[#1DB954] hover:bg-[#1DB954]/30 transition-colors"
            aria-label={`Listen to ${track.title} on Spotify`}
          >
            <SpotifyIcon />
          </Link>
          <Link
            href={track.links.appleMusic}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-[#FA243C]/20 text-[#FA243C] hover:bg-[#FA243C]/30 transition-colors"
            aria-label={`Listen to ${track.title} on Apple Music`}
          >
            <AppleMusicIcon />
          </Link>
          <Link
            href={track.links.amazonMusic}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-[#FF9900]/20 text-[#FF9900] hover:bg-[#FF9900]/30 transition-colors"
            aria-label={`Listen to ${track.title} on Amazon Music`}
          >
            <AmazonMusicIcon />
          </Link>
          <Link
            href={track.links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-[#FF0000]/20 text-[#FF0000] hover:bg-[#FF0000]/30 transition-colors"
            aria-label={`Watch ${track.title} on YouTube`}
          >
            <YouTubeIcon />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function ComingSoonCard({ track, index }: { track: typeof comingSoon[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{track.title}</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-2">By {track.composer}</p>
          <p className="text-gray-400 text-sm">{track.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function MusicPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="w-full py-4 px-6 md:px-12 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold text-white">
            Man of Wisdom
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#products"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Products
            </Link>
            <Link
              href="/music"
              className="text-[#D4AF37] transition-colors"
            >
              Music
            </Link>
            <Link
              href="https://blog.manofwisdom.co"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/#about"
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Wisdom Through <span className="gold-gradient">Sound</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Spoken word poetry and philosophical compositions that inspire, motivate, and transform.
          </motion.p>

          {/* Artist Profile Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <span className="text-gray-400 text-sm">Follow on:</span>
            <Link
              href={artistLinks.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954]/20 transition-colors"
              aria-label="Follow Man of Wisdom on Spotify"
            >
              <SpotifyIcon />
            </Link>
            <Link
              href={artistLinks.appleMusic}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[#FA243C]/10 text-[#FA243C] hover:bg-[#FA243C]/20 transition-colors"
              aria-label="Follow Man of Wisdom on Apple Music"
            >
              <AppleMusicIcon />
            </Link>
            <Link
              href={artistLinks.amazonMusic}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[#FF9900]/10 text-[#FF9900] hover:bg-[#FF9900]/20 transition-colors"
              aria-label="Follow Man of Wisdom on Amazon Music"
            >
              <AmazonMusicIcon />
            </Link>
            <Link
              href={artistLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[#FF0000]/10 text-[#FF0000] hover:bg-[#FF0000]/20 transition-colors"
              aria-label="Subscribe to Man of Wisdom on YouTube"
            >
              <YouTubeIcon />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Released Tracks */}
      <section className="py-12 px-6 md:px-12 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-white mb-8"
          >
            Released Tracks
          </motion.h2>
          <div className="space-y-4">
            {tracks.map((track, index) => (
              <TrackCard key={track.title} track={track} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-12 px-6 md:px-12 bg-[#1A1A2E]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Coming Soon
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-gray-400 mb-8"
          >
            More wisdom, more poetry, more inspiration on the way.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-4">
            {comingSoon.map((track, index) => (
              <ComingSoonCard key={track.title} track={track} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 md:px-12 bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-white mb-4"
          >
            Let Wisdom Guide Your Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 mb-8"
          >
            Follow Man of Wisdom on your favorite streaming platform and never miss a new release.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={artistLinks.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <SpotifyIcon />
              Listen on Spotify
            </Link>
            <Link
              href="/#products"
              className="px-8 py-3 border border-white/30 hover:border-white text-white font-semibold rounded-lg transition-colors"
            >
              Explore Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-lg font-bold text-white">
            Man of Wisdom
          </Link>
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Man of Wisdom. Ancient wisdom for modern life.
          </p>
        </div>
      </footer>
    </main>
  );
}
