import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import logo from "@/assets/hearseek-logo-mark.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/app", label: "App" },
  { to: "/enterprise", label: "Enterprise" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label="HearSeek home">
          <span
            className="relative flex h-11 w-11 items-center justify-center rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, hsl(258 90% 35% / 0.55) 0%, hsl(230 25% 11%) 70%)",
            }}
          >
            <img src={logo} alt="HearSeek" className="relative h-9 w-9 object-contain" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold tracking-tight text-white">
              HearSeek
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:inline">
              The World's First AI Search Engine for Audio
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-foreground",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm" className="bg-gradient-waveform text-primary-foreground hover:opacity-90">
            <Link to="/enterprise#demo">Book a Demo</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="mt-8 flex flex-col gap-6">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn("text-base font-medium", isActive ? "text-foreground" : "text-muted-foreground")
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <Button asChild className="bg-gradient-waveform text-primary-foreground">
                <Link to="/enterprise#demo" onClick={() => setOpen(false)}>Book a Demo</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};