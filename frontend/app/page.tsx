import { Hero } from "../components/home/Hero";
import { ResturantSection } from "@/components/user/resturant";
import {Footer} from "@/components/common/footer";

export default function Home() {
  return (
    <div className="lg:mr-20 lg:ml-20" >
      <Hero />
      <ResturantSection />
      <Footer />
    </div>
  );
}