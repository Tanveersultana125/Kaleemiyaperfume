import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminRequest from "./pages/AdminRequest.tsx";
import NotFound from "./pages/NotFound.tsx";
import AIChatbot from "./components/AIChatbot.tsx";
import WhatsAppButton from "./components/WhatsAppButton.tsx";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "./components/SplashScreen.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import RefundPolicy from "./pages/RefundPolicy.tsx";
import FAQ from "./pages/FAQ.tsx";
import TrackOrder from "./pages/TrackOrder.tsx";
import ShippingInfo from "./pages/ShippingInfo.tsx";
import Returns from "./pages/Returns.tsx";
import PWAInstallPrompt from "./components/PWAInstallPrompt.tsx";
import OfflineMessage from "./components/OfflineMessage.tsx";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, role, loading, isSuperAdmin } = useAuth();

  if (loading) return null; // Or a loader

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  // Grant access if the user is a whitelisted super admin OR has an admin role in the DB
  if (!isSuperAdmin && role !== "admin") {
    return <Navigate to="/admin-request" replace />;
  }

  return <>{children}</>;
};

const SupportWidgets = () => {
  // Use current URL to hide widgets on Admin pages
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <WhatsAppButton />
      <AIChatbot />
    </>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const entries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
      if (entries.length > 0 && entries[0].type === "reload") {
        const path = window.location.pathname;
        // Strictly enforcing refresh redirect to Home except for administrative domains
        if (path !== "/" && !path.startsWith("/admin")) {
          window.location.replace("/");
        }
      }
    } catch (error) {
      // Fallback ignore if navigation API is unsupported
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <AnimatePresence mode="wait">
              {loading && <SplashScreen onComplete={() => setLoading(false)} />}
            </AnimatePresence>
            
            {!loading && (
              <>
                <Toaster />
                <Sonner />
                <PWAInstallPrompt />
                <OfflineMessage />
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
                    
                    {/* Policy & Support Routes */}
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route path="/shipping-info" element={<ShippingInfo />} />
                    <Route path="/returns" element={<Returns />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin-request" element={<AdminRequest />} />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedAdminRoute>
                          <AdminDashboard />
                        </ProtectedAdminRoute>
                      } 
                    />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  
                  <SupportWidgets />
                </BrowserRouter>
              </>
            )}
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
