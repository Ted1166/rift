import { Link } from "react-router-dom";
import { Swords } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Swords className="w-8 h-8 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">
              RIFT COMMANDERS
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm font-body text-muted-foreground">
            <Link to="/leaderboard" className="hover:text-primary transition-colors">
              Leaderboard
            </Link>
            <a href="#" className="hover:text-primary transition-colors">Docs</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">Discord</a>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
            <span>Built on</span>
            <span className="text-primary font-semibold">Mantle Network</span>
            <span>⚡</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground font-body">
          <p>Built with ⚔️ for Mantle Global Hackathon 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;