import { Link } from "react-router-dom";
import { AudioLines } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-waveform">
              <AudioLines className="h-4 w-4 text-primary-foreground" />
            </span>
            <span>Hear<span className="text-gradient">Seek</span></span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            The World's First AI Search Engine for Audio. Making spoken knowledge as
            searchable as written text.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Product</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/app" className="hover:text-foreground">Consumer App</Link></li>
            <li><Link to="/enterprise" className="hover:text-foreground">Enterprise</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="mailto:hello@hearseek.ai" className="hover:text-foreground">Contact</a></li>
            <li><Link to="/enterprise#demo" className="hover:text-foreground">Book Demo</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="container py-6 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} HearSeek. All rights reserved.</p>
          <p>Built for the Audio Era.</p>
        </div>
      </div>
    </footer>
  );
};