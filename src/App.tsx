import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Shop from "./pages/Shop.tsx";
import Attar from "./pages/Attar.tsx";
import GiftSets from "./pages/GiftSets.tsx";
import PrayerMats from "./pages/PrayerMats.tsx";
import IslamicBooks from "./pages/IslamicBooks.tsx";
import Contact from "./pages/Contact.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import NotFound from "./pages/NotFound.tsx";
import AIChatbot from "./components/AIChatbot.tsx";
import WhatsAppButton from "./components/WhatsAppButton.tsx";

import { useState } from "react";
import SplashScreen from "./components/SplashScreen.tsx";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "./context/CartContext.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <AnimatePresence mode="wait">
            {loading && <SplashScreen onComplete={() => setLoading(false)} />}
          </AnimatePresence>
          
          {!loading && (
            <>
              <Toaster />
              <Sonner />
              <BrowserRouter 
                future={{ 
                  v7_startTransition: true,
                  v7_relativeSplatPath: true, 
                }}
              >
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/attar" element={<Attar />} />
                  <Route path="/gift-sets" element={<GiftSets />} />
                  <Route path="/prayer-mats" element={<PrayerMats />} />
                  <Route path="/books" element={<IslamicBooks />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <WhatsAppButton />
                <AIChatbot />
              </BrowserRouter>
            </>
          )}
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
