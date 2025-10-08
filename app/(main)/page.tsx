"use client";
import CTASection from "@/components/CTASection";
import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/HeroSection";
import MentorsShowcase from "@/components/MentorsShowcase";
// import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
// import { Button } from "@/components/ui/button";
import Webright from "@/components/Webright";
// import useBear from "@/store/counter";

export default function Home() {
  // const bears = useBear((state) => state.bears);
  // const updateBears = useBear((state) => state.increasePopulation);
  return (
    <main className="flex-grow">
      {/* <p>{bears}</p>
      <Button onClick={()=> { updateBears()}} >press</Button> */}
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
