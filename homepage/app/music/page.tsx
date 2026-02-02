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
    <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.801.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.106 1.596-.35 2.296-.81a5.046 5.046 0 001.88-2.207c.186-.42.293-.87.37-1.324.113-.675.138-1.358.137-2.04-.002-3.8 0-7.595-.003-11.393zm-6.423 3.99v5.712c0 .417-.058.827-.244 1.206-.29.59-.76.962-1.388 1.14-.35.1-.706.157-1.07.173-.95.042-1.8-.335-2.22-1.1-.37-.682-.35-1.59.287-2.255.484-.505 1.107-.795 1.8-.937.39-.08.784-.123 1.17-.207.3-.065.514-.263.6-.544.033-.12.05-.25.05-.38v-5.9a.503.503 0 00-.41-.49c-.28-.06-.56-.1-.84-.15l-4.4-.78c-.35-.06-.67-.12-.98-.18a.438.438 0 00-.51.35c-.02.08-.03.16-.03.24v7.67c0 .5-.05.99-.27 1.45-.34.72-.9 1.17-1.65 1.38-.36.1-.73.15-1.1.17-.99.05-1.87-.31-2.33-1.11-.37-.65-.36-1.57.26-2.24.47-.5 1.08-.79 1.76-.93.48-.1.97-.16 1.45-.26.35-.07.58-.29.66-.62.03-.1.04-.21.04-.32V6.17c0-.27.05-.52.26-.72.2-.19.45-.29.73-.26.28.04.56.08.83.13l6.7 1.2c.32.06.64.11.95.18.44.09.72.39.76.82.01.1.01.2.01.3z"/>
  </svg>
);

const AmazonMusicIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705a.659.659 0 01-.75.072c-1.053-.875-1.245-1.281-1.822-2.116-1.742 1.778-2.976 2.31-5.236 2.31-2.674 0-4.754-1.65-4.754-4.95 0-2.578 1.396-4.333 3.387-5.19 1.727-.756 4.139-.892 5.983-1.1v-.41c0-.753.058-1.643-.385-2.293-.383-.58-1.118-.82-1.767-.82-1.199 0-2.269.615-2.529 1.89-.054.285-.261.566-.547.58l-3.063-.33c-.257-.057-.543-.266-.47-.662C5.828 1.639 8.76.5 11.402.5c1.35 0 3.112.358 4.175 1.378 1.35 1.267 1.221 2.96 1.221 4.8v4.353c0 1.31.544 1.883 1.055 2.59.18.248.22.548-.01.735-.576.48-1.602 1.371-2.168 1.871l-.53-.433zM21.779 21.2C19.477 23.06 16.088 24 13.177 24c-4.016 0-7.631-1.484-10.366-3.953-.215-.194-.023-.46.235-.308 2.952 1.716 6.601 2.748 10.37 2.748 2.541 0 5.337-.527 7.906-1.617.388-.166.714.255.457.63z"/>
    <path d="M22.78 19.96c-.31-.398-2.048-.19-2.828-.095-.237.028-.274-.178-.06-.328 1.385-.972 3.656-.691 3.921-.366.266.328-.07 2.594-1.368 3.675-.2.166-.39.077-.301-.143.293-.725.948-2.344.637-2.743z"/>
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
