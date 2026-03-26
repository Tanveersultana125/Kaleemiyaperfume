import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductImageSlider from "@/components/ProductImageSlider";
import { allProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import productExtra1 from "@/assets/product-extra-1.png";
import productExtra2 from "@/assets/product-extra-2.png";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = allProducts.find((p) => p.id === id);

  // Scroll to top when this page loads or when navigating to another product perfectly
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-serif mb-4">Product not found</h2>
        <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <div className="h-24 md:h-32"></div>

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 mb-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate("/shop")}>Shop</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate(`/${product.category.replace(" ", "-")}`)}>{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Product Image Slider */}
          <div className="lg:col-span-7 relative">
            <ProductImageSlider 
              images={[
                product.image,
                // Using standard extra images to demonstrate the slider functionality
                productExtra1,
                productExtra2
              ]} 
            />
            {product.isNew && (
              <span className="absolute top-6 left-6 gold-gradient-bg text-primary-foreground text-[10px] font-sans font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-sm z-20">
                New Arrival
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:col-span-12 lg:col-start-1 xl:col-span-5 space-y-8">
            <header className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-primary font-sans font-bold tracking-[0.2em] uppercase px-2 py-0.5 border border-primary/30 rounded-full">
                  {product.gender}
                </span>
                <div className="flex items-center text-amber-500 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < 4 ? "fill-current" : ""}`} />
                  ))}
                  <span className="text-[10px] text-muted-foreground ml-2">(4.8/5 Rating)</span>
                </div>
              </div>
              
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-sans text-primary font-medium">{product.price}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Inclusive of all taxes</span>
              </div>
            </header>

            <div className="space-y-6">
              <p className="text-muted-foreground font-sans leading-relaxed tracking-wide">
                {product.description || "Indulge in the luxury of Kaleemiya Boutique. This exquisite product is meticulously crafted using the finest materials and traditional techniques, ensuring a premium experience that nourishes the soul."}
              </p>

              {product.highlights && (
                <div className="space-y-4">
                  <h4 className="text-[11px] font-sans font-bold tracking-[0.25em] h-px flex items-center gap-4 text-foreground uppercase">
                    <span>Highlights</span>
                    <span className="bg-border flex-grow h-[1px]"></span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                    {product.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-xs text-muted-foreground tracking-wide font-sans">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shadow-[0_0_8px_rgba(201,165,86,0.5)]" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col gap-4 pt-4">
                <Button 
                  variant="gold" 
                  className="w-full py-7 text-sm tracking-[0.2em] uppercase rounded-sm shadow-xl shadow-primary/10"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button variant="outline" className="w-full py-7 text-sm tracking-[0.2em] uppercase rounded-sm border-primary/20 hover:bg-primary/5">
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Product Specifications */}
            {product.specs && (
              <div className="space-y-4 pt-4">
                <h4 className="text-[11px] font-sans font-bold tracking-[0.25em] h-px flex items-center gap-4 text-foreground uppercase">
                  <span>Specifications</span>
                  <span className="bg-border flex-grow h-[1px]"></span>
                </h4>
                <div className="grid grid-cols-1 gap-1">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border/40 last:border-0 text-xs font-sans">
                      <span className="text-muted-foreground tracking-wide uppercase">{key}</span>
                      <span className="text-foreground font-medium tracking-wide">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reassurance Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-border/40">
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary/70" />
                <span className="text-[9px] font-sans font-bold tracking-[0.1em] text-muted-foreground uppercase leading-tight">Authentic Heritage</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-5 h-5 text-primary/70" />
                <span className="text-[9px] font-sans font-bold tracking-[0.1em] text-muted-foreground uppercase leading-tight">Global Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Star className="w-5 h-5 text-primary/70" />
                <span className="text-[9px] font-sans font-bold tracking-[0.1em] text-muted-foreground uppercase leading-tight">Premium Quality</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="w-5 h-5 text-primary/70" />
                <span className="text-[9px] font-sans font-bold tracking-[0.1em] text-muted-foreground uppercase leading-tight">Safe Returns</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
