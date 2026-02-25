

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index"; // This file is likely importing Hero.tsx and Navbar.tsx
import Feed from "./pages/Feed"; // This file is likely importing IncidentCard.tsx
import Map from "./pages/Map";
import Report from "./pages/Report";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/ThemeProvider"; // This will import ThemeProvider.jsx

const queryClient = new QueryClient();

const App = () => (
  // Set default theme to dark
  <ThemeProvider defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/map" element={<Map />} />
            <Route path="/report" element={<Report />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
