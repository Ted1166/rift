import { useState } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Swords, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">
              RIFT
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#units" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
              Units
            </a>
            <a href="#mechanics" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
              How to Play
            </a>
            <a href="#features" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <ConnectButton />
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-4">
              <a href="#units" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                Units
              </a>
              <a href="#mechanics" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                How to Play
              </a>
              <a href="#features" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <ConnectButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;