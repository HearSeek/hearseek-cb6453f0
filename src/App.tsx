import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AppPage from "./pages/AppPage.tsx";
import EnterprisePage from "./pages/EnterprisePage.tsx";
import DemoPage from "./pages/DemoPage.tsx";
import ResultsPage from "./pages/ResultsPage.tsx";
import CreatorsPage from "./pages/CreatorsPage.tsx";
import CollectionPage from "./pages/CollectionPage.tsx";
import CollectionResultsPage from "./pages/CollectionResultsPage.tsx";
import { Layout } from "./components/site/Layout";
import { ConsentBanner } from "./components/site/ConsentBanner";
import { useRouteTracking } from "./hooks/use-route-tracking";

const queryClient = new QueryClient();

const RouterShell = () => {
  useRouteTracking();
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/enterprise" element={<EnterprisePage />} />
          <Route path="/creators" element={<CreatorsPage />} />
        </Route>
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/collections/:slug" element={<CollectionPage />} />
        <Route path="/collections/:slug/results" element={<CollectionResultsPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ConsentBanner />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouterShell />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
