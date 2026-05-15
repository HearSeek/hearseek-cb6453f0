import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ConsentBanner } from "./ConsentBanner";
import { useRouteTracking } from "@/hooks/use-route-tracking";

export const Layout = () => {
  useRouteTracking();
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ConsentBanner />
    </div>
  );
};