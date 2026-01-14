import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Swords, Users, Shield } from "lucide-react";
import heroBg from "@/assets/hero-background.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20 animate-grid-scroll" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8 rift-border">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-sm font-body text-primary tracking-wide">Built on Mantle Network</span>
        </div>
        
        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6 text-glow">
          <span className="text-foreground">RIFT</span>
          <br />
          <span className="text-primary">COMMANDERS</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl font-body text-muted-foreground max-w-2xl mx-auto mb-8">
          Strategic 2-player turn-based combat on a 5×5 battlefield. 
          Command your forces, execute simultaneously, achieve victory.
        </p>
        
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="flex items-center gap-2 text-foreground">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-display text-lg">1v1 PvP</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <Shield className="w-5 h-5 text-accent" />
            <span className="font-display text-lg">3 Unit Types</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <Swords className="w-5 h-5 text-primary" />
            <span className="font-display text-lg">5-15 Min Matches</span>
          </div>
        </div>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/lobby">
            <Button variant="default" size="lg" className="text-lg px-8 py-6">
              Play Now
            </Button>
          </Link>
          <a href="#mechanics">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </a>
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;