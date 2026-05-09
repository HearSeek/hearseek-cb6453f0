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
import PilotPage from "./pages/PilotPage.tsx";
import PilotResultsPage from "./pages/PilotResultsPage.tsx";
import { Layout } from "./components/site/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/app" element={<AppPage />} />
            <Route path="/enterprise" element={<EnterprisePage />} />
            <Route path="/creators" element={<CreatorsPage />} />
          </Route>
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/pilots/:slug" element={<PilotPage />} />
          <Route path="/pilots/:slug/results" element={<PilotResultsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
