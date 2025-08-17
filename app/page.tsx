import CTASection from "@/components/CTASection";
import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/HeroSection";
import MentorsShowcase from "@/components/MentorsShowcase";
// import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Webright from "@/components/Webright";

export default function Home() {
  return (
    <main className="flex-grow">
      <HeroSection />
      <div className="reveal-section transition-all duration-700">
        <FeaturesSection />
      </div>
      <div className="reveal-section transition-all duration-700">
        <MentorsShowcase />
      </div>
      <div className="reveal-section transition-all duration-700">
        <TestimonialsSection />
      </div>
      <div className="reveal-section transition-all duration-700">
        {/* <PricingSection /> */}
        <Webright />
      </div>
      <div className="reveal-section transition-all duration-700">
        <CTASection />
      </div>
    </main>
  );
}
