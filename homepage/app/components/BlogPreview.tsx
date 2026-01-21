import Link from "next/link";
import BlogCard from "./BlogCard";

interface WPPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
}

async function getPosts(): Promise<WPPost[]> {
  try {
    const res = await fetch(
      "https://blog.manofwisdom.co/wp-json/wp/v2/posts?per_page=3&_embed",
      { next: { revalidate: 3600 } } // Revalidate every hour
    );

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch {
    return [];
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&hellip;/g, "...").trim();
}

export default async function BlogPreview() {
  const posts = await getPosts();

  return (
    <section className="py-20 px-6 md:px-12 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Latest from the Blog
          </h2>
          <p className="text-gray-400">
            Deep dives into philosophy, productivity, and intentional living
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post, index) => (
            <BlogCard
              key={post.id}
              title={stripHtml(post.title.rendered)}
              excerpt={stripHtml(post.excerpt.rendered)}
              link={post.link}
              image={post._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
              index={index}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="https://blog.manofwisdom.co"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] font-semibold rounded-lg transition-colors"
          >
            Visit the Blog
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
