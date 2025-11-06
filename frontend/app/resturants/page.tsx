"use client";

import { ResturantSection } from "@/components/user/resturant";
import { Nav } from "@/components/common/nav";
import { Footer } from "@/components/common/footer";
export default function Resturants() {
  return (
    <div>
      <Nav />

      <ResturantSection />
      <Footer />
    </div>
  );
}
