import Link from "next/link";

const footerLinks = {
  products: [
    { label: "Goal Setter", href: "https://goals.manofwisdom.co" },
    { label: "Journal", href: "#", comingSoon: true },
    { label: "Time Views", href: "#", comingSoon: true },
    { label: "Wallpapers", href: "#", comingSoon: true },
    { label: "Books", href: "#", comingSoon: true },
  ],
  content: [
    { label: "Music", href: "/music" },
    { label: "Blog", href: "https://blog.manofwisdom.co" },
    { label: "Newsletter", href: "#newsletter" },
  ],
  connect: [
    { label: "Facebook", href: "https://facebook.com/ManofWisdoms" },
    { label: "Instagram", href: "https://www.instagram.com/ManofWisdoms/" },
    { label: "Twitter", href: "https://twitter.com/ManofWisdoms/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/manofwisdom" },
  ],
  music: [
    { label: "Spotify", href: "https://open.spotify.com/artist/59S9iaGBrrWXl242r9hLpm" },
    { label: "Apple Music", href: "https://music.apple.com/us/artist/man-of-wisdom/1523099981" },
    { label: "Amazon Music", href: "https://www.amazon.com/music/player/artists/B08CS9MHB8/man-of-wisdom" },
    { label: "YouTube", href: "https://www.youtube.com/user/ManofWisdom17" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer id="about" className="py-16 px-6 md:px-12 bg-[#0a0a0a] border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-sm ${
                      link.comingSoon
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-400 hover:text-[#D4AF37]"
                    } transition-colors`}
                  >
                    {link.label}
                    {link.comingSoon && (
                      <span className="text-xs ml-1">(Soon)</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-white font-semibold mb-4">Content</h3>
            <ul className="space-y-2">
              {footerLinks.content.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              {footerLinks.connect.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Music */}
          <div>
            <h3 className="text-white font-semibold mb-4">Music</h3>
            <ul className="space-y-2">
              {footerLinks.music.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold text-white">
            Man of Wisdom
          </Link>

          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} Man of Wisdom. Ancient wisdom for modern life.
          </p>
        </div>
      </div>
    </footer>
  );
}
