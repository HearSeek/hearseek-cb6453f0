import { Link } from "react-router-dom";
import { Linkedin, Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/hearseek-logo-mark.png";

export const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="HearSeek" className="h-9 w-9 object-contain" />
            <span className="font-display text-lg font-bold tracking-tight text-white">
              HearSeek
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            The World's First AI Search Engine for Audio. Making spoken knowledge as
            searchable as written text.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.linkedin.com/company/hearseekofficial"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:text-foreground hover:border-primary/60"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://www.facebook.com/HearSeekOfficial"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:text-foreground hover:border-primary/60"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/HearSeekOfficial"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:text-foreground hover:border-primary/60"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Product</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/app" className="hover:text-foreground">Consumer App</Link></li>
            <li><Link to="/enterprise" className="hover:text-foreground">Enterprise</Link></li>
            <li><Link to="/creators" className="hover:text-foreground">Content Creators</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <span>1111B S Governors Ave STE 34197<br />Dover, DE 19904, USA</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <span>
                <a href="tel:+15022306361" className="hover:text-foreground block">+1 (502) 230-6361</a>
                <a href="tel:+923245863336" className="hover:text-foreground block">+92 324 586 3336</a>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              <a href="mailto:info@hearseek.com" className="hover:text-foreground">info@hearseek.com</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="container py-6 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} HearSeek · hearseek.com — All rights reserved.</p>
          <p>Built for the Audio Era.</p>
        </div>
      </div>
    </footer>
  );
};