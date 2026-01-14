import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import UnitsSection from "../components/UnitsSection";
import MechanicsSection from "../components/MechanicsSection";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <div id="units">
          <UnitsSection />
        </div>
        <div id="mechanics">
          <MechanicsSection />
        </div>
        <div id="features">
          <FeaturesSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;