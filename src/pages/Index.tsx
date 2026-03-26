import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BestsellersSection from "@/components/BestsellersSection";
import CategoriesSection from "@/components/CategoriesSection";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ShopByOccasion from "@/components/ShopByOccasion";
import ShopByPrice from "@/components/ShopByPrice";
import BrandStory from "@/components/BrandStory";
import StoreGallery from "@/components/StoreGallery";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <HeroSection />
      <BestsellersSection />
      <CategoriesSection />
      <NewArrivalsSection />
      <WhyChooseUs />
      <ShopByOccasion />
      <ShopByPrice />
      <BrandStory />
      <StoreGallery />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
