import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import PlaceDetail from "./pages/PlaceDetail";
import TripPlanner from "./pages/TripPlanner";
import Food from "./pages/Food";
import Homestays from "./pages/Homestays";
import SavedTrips from "./pages/SavedTrips";
import SavedTripDetail from "./pages/SavedTripDetail";
import AboutProject from "./pages/AboutProject";
import NotFound from "./pages/NotFound";
import TravelChat from "./components/TravelChat";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/place/:id" element={<PlaceDetail />} />
        <Route path="/planner" element={<TripPlanner />} />
        <Route path="/food" element={<Food />} />
        <Route path="/homestays" element={<Homestays />} />
        <Route path="/saved" element={<SavedTrips />} />
        <Route path="/saved/:id" element={<SavedTripDetail />} />
        <Route path="/about" element={<AboutProject />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
        <TravelChat />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
