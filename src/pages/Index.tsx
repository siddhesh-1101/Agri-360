import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { MandiRatesSection } from "@/components/MandiRatesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { RolesSection } from "@/components/RolesSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <MandiRatesSection />
      <HowItWorksSection />
      <RolesSection />
      <Footer />
    </div>
  );
};

export default Index;
