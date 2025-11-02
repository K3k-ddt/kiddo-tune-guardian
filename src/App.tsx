import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ParentAuth from "./pages/ParentAuth";
import ChildAuth from "./pages/ChildAuth";
import ColorThemeSelection from "./pages/ColorThemeSelection";
import Player from "./pages/Player";
import ParentDashboard from "./pages/ParentDashboard";
import AddChild from "./pages/AddChild";
import EditChild from "./pages/EditChild";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/parent-auth" element={<ParentAuth />} />
          <Route path="/child-login" element={<ChildAuth />} />
          <Route path="/child-login/:parentCode" element={<ChildAuth />} />
          <Route path="/color-theme-selection" element={<ColorThemeSelection />} />
          <Route path="/player" element={<Player />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/history" element={<History />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/parent-dashboard/add-child" element={<AddChild />} />
          <Route path="/parent-dashboard/edit-child/:childId" element={<EditChild />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
