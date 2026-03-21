import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import CardPreview from "@/components/CardPreview";
import Recommend from "@/components/Recommend";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import KakaoChannel from "@/components/KakaoChannel";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <CardPreview />
        <Recommend />
        <Reviews />
        <FAQ />
        <KakaoChannel />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
