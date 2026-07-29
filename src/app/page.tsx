import Hero from "@/components/Hero";
import FeaturedPerfumes from "@/components/FeaturedPerfumes";
import Brands from "@/components/Brands";
import Reviews from "@/components/Reviews";
import Newsletter from "@/components/Newsletter";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <FeaturedPerfumes />
      <Brands />
      <Reviews />
      <Newsletter />
    </>
  );
}
