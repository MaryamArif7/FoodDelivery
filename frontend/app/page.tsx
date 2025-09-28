import { Hero } from "../components/home/Hero";
import { ResturantSection } from "@/components/user/resturant";
export default function Home() {
  return (
    <div className="mr-20 ml-20" >
      <Hero />
      <ResturantSection />
    </div>
  );
}
