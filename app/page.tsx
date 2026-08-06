import Navbar from "@/app/components/Navbar";
import HeroFuturistic from "@/app/components/HeroFuturistic";
import VisionMorph from "@/app/components/VisionMorph";
import TechStack from "@/app/components/TechStack";
import LogoCloud from "@/app/components/LogoCloud";
import Features from "@/app/components/Features";
import FAQ from "@/app/components/FAQ";
import CTA from "@/app/components/CTA";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroFuturistic />
      <VisionMorph />
      <TechStack />
      <Features />
      <LogoCloud />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
