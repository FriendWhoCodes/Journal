import Hero from "./components/Hero";
import Products from "./components/Products";
import TodaysWisdom from "./components/TodaysWisdom";
import BlogPreview from "./components/BlogPreview";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Hero />
      <Products />
      <TodaysWisdom />
      <BlogPreview />
      <Newsletter />
      <Footer />
    </main>
  );
}
