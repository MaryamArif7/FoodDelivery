import { Hero } from "../components/home/Hero";
import { ResturantSection } from "@/components/user/resturant";
import { Footer } from "@/components/common/footer";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Hero />
      <ResturantSection />
      <Footer />
    </div>
  );
}