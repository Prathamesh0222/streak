import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { FeaturesSection } from "@/components/features-section";
import { FAQSection } from "@/components/faq-section";
import { AdvancedFeatures } from "@/components/advanced-features";

export default function Home() {
  return (
    <div>
      <div className="min-h-screen flex flex-col">
        <div className="border-b w-full">
          <Header />
        </div>
        <div className="flex-1">
          <Hero />
          <FeaturesSection />
          <AdvancedFeatures />
          <FAQSection />
        </div>
        <div className="border-t w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
}
