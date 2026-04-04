import React from "react";
import { useCart } from "@/context/CartContext";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { ShoppingCart, ShoppingBag, Minus, Plus, X, ArrowRight, Truck, ShieldCheck, Droplets, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, totalCount, clearCart, addToCart } = useCart();
  const { products } = useProducts();
  const [isSuccess, setIsSuccess] = React.useState(false);

  const recommendations = React.useMemo(() => {
    return products
      .filter(p => p.isLive !== false && !cart.find(c => c.id === p.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);
  }, [products, cart]);

  const scrollOffer = (dir: 'left' | 'right') => {
    const container = document.getElementById('offer-scroll-container');
    if (container) {
      const amount = dir === 'left' ? -320 : 320;
      container.scrollTo({
        left: container.scrollLeft + amount,
        behavior: 'smooth'
      });
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const totalPrice = cart.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[^\d]/g, ""));
    return sum + (price * item.quantity);
  }, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative text-black hover:opacity-70 transition-all flex items-center">
          <ShoppingCart className="w-5 h-5" strokeWidth={2.2} />
          {totalCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#310101] text-[10px] flex items-center justify-center text-white font-bold animate-in fade-in zoom-in border border-white/20">
              {totalCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[420px] flex flex-col p-0 border-l border-[#310101]/5 bg-[#FDFCFB] text-[#310101] shadow-2xl">
        <SheetHeader className="px-8 py-10 border-b border-[#310101]/5 bg-[#F9F6F2]">
          <SheetTitle className="font-serif text-2xl text-center text-[#310101] tracking-tight">
             My Boutique Bag
          </SheetTitle>
          <p className="text-[11px] uppercase tracking-[0.3em] font-black text-center text-[#B0843D]/60 mt-1">
            {totalCount} ARTISAN SELECTIONS
          </p>
        </SheetHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8">
              <div className="w-20 h-20 rounded-full bg-[#F9F6F2] flex items-center justify-center shadow-inner">
                <ShoppingBag className="w-8 h-8 text-[#B0843D]/40" />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-[#310101]">Your bag is whisper quiet</h3>
                <p className="text-sm font-sans italic text-[#310101]/60 max-w-[220px] mx-auto leading-relaxed">
                  Our master perfumers are waiting to fill your world with essence.
                </p>
              </div>
              <SheetClose asChild>
                <Button 
                  variant="outline" 
                  className="mt-4 rounded-full border-[#310101]/10 px-8 py-6 font-black uppercase tracking-widest text-[12px] hover:bg-[#310101] hover:text-white transition-all shadow-sm"
                >
                  Browse our collection
                </Button>
              </SheetClose>
            </div>
          ) : isSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in fade-in zoom-in duration-500">
               <div className="w-24 h-24 rounded-full bg-[#B0843D]/10 flex items-center justify-center border-4 border-[#B0843D]/20 animate-bounce">
                  <ShoppingBag className="w-10 h-10 text-[#B0843D]" />
               </div>
               <div className="space-y-4">
                  <h3 className="font-serif text-3xl text-[#310101]">Order Placed!</h3>
                  <p className="text-sm font-sans italic text-[#310101]/60 max-w-[260px] mx-auto leading-relaxed">
                     Your artisans selections are being prepared for their journey.
                  </p>
               </div>
               <SheetClose asChild>
                 <Button 
                   onClick={() => setIsSuccess(false)}
                   className="w-full bg-[#310101] text-[#E5D5C5] rounded-full h-16 font-black uppercase tracking-[0.3em] text-[13px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                 >
                   CONTINUE TO SHOP
                   <ArrowRight className="w-4 h-4" />
                 </Button>
               </SheetClose>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="py-10 space-y-10 px-8 pb-4">
                {/* Online Exclusive Offer Banner */}
                <div className="bg-[#FDF3E1] px-4 py-3 items-center justify-between flex rounded-xl border border-[#B0843D]/10 mb-2">
                   <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-[#B0843D]" strokeWidth={3} />
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#B0843D]">Online Experience</span>
                   </div>
                   <span className="text-[11px] font-black text-[#B0843D] uppercase tracking-widest">SAVE ₹300</span>
                </div>

                {cart.map((item) => (
                  <div key={item.id} className="flex gap-6 group relative">
                    <div className="w-24 h-32 bg-[#F9F6F2] overflow-hidden shrink-0 border border-[#310101]/5 shadow-sm rounded-xl">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-xl text-[#310101] leading-tight group-hover:text-black transition-colors">
                            {item.name}
                          </h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#310101]/20 hover:text-red-500 transition-all hover:rotate-90"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[15px] font-sans font-black text-[#B0843D] tracking-wide">{"\u20B9"}{parseInt(item.price.replace(/[^\d]/g, "")).toLocaleString()}</p>
                      </div>
                      
                      <div className="flex items-center mt-4">
                        <div className="flex items-center bg-[#F9F6F2] rounded-full px-4 py-2 border border-[#310101]/5 shadow-inner">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-[#310101]/40 hover:text-[#310101] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-4 text-[14px] font-black w-10 text-center text-[#310101]">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-[#310101]/40 hover:text-[#310101] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {recommendations.length > 0 && (
                <div className="bg-[#B0843D] rounded-[24px] m-4 p-4 overflow-hidden relative z-10 shadow-lg mb-8">
                  <h4 className="font-sans font-bold text-[14px] text-black mb-3 ml-1">You May Also Like</h4>
                  
                  <div 
                    id="offer-scroll-container"
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
                  >
                    {recommendations.map((item) => (
                      <div 
                        key={item.id} 
                        className="snap-center shrink-0 w-[230px] bg-white rounded-[16px] p-4 flex flex-col shadow-md border border-white/40"
                      >
                        <div className="flex gap-3 mb-3 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                           <div className="w-20 h-20 bg-[#F9F6F2] rounded-xl overflow-hidden shrink-0 border border-black/5">
                             <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex flex-col min-w-0 justify-center">
                              <h5 className="text-[11px] font-sans font-bold text-black line-clamp-2 leading-tight mb-1">{item.name}</h5>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-black/20 line-through">{"\u20B9"}{(parseInt(item.price.replace(/[^\d]/g, "")) * 1.5).toLocaleString()}</span>
                                <span className="text-[13px] font-bold text-black">{"\u20B9"}{parseInt(item.price.replace(/[^\d]/g, "")).toLocaleString()}</span>
                              </div>
                           </div>
                        </div>
                        
                        <div className="flex items-center justify-between gap-2 mt-auto">
                           <span className="bg-[#1ABC9C] text-white text-[9px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-tight">
                             33% off
                           </span>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               addToCart({ id: item.id, name: item.name, price: item.price, image: item.image });
                             }}
                             className="flex-1 h-9 border border-black bg-white text-black rounded-full text-[12px] font-bold hover:bg-black hover:text-white transition-all flex items-center justify-center"
                           >
                             + Add
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Compact White Scrollbar Track */}
                  <div className="bg-white rounded-lg h-10 mt-2 px-3 flex items-center gap-4 border border-black/5">
                     <button 
                       onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollOffer('left'); }}
                       className="text-gray-400 hover:text-black transition-colors"
                     >
                       <ChevronLeft className="w-5 h-5" />
                     </button>
                     <div className="flex-1 h-2.5 bg-gray-100 rounded-full relative overflow-hidden">
                        <div className="w-[40%] h-full bg-gray-400 rounded-full" />
                     </div>
                     <button 
                       onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollOffer('right'); }}
                       className="text-gray-400 hover:text-black transition-colors"
                     >
                       <ChevronRight className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {cart.length > 0 && !isSuccess && (
          <div className="p-8 bg-white border-t-2 border-[#310101]/5 space-y-8 pb-14">
            <div className="space-y-4">
               <div className="flex justify-between items-center text-[13px] font-black uppercase tracking-widest text-[#310101]/40">
                  <span>Artisan Selections Subtotal</span>
                  <span>{"\u20B9"}{totalPrice.toLocaleString()}</span>
               </div>
               <div className="h-[1px] bg-[#310101]/5 my-2" />
               <div className="flex items-end justify-between gap-4">
                  <div className="flex flex-col">
                     <span className="text-[11px] font-black text-[#B0843D] uppercase tracking-[0.3em] mb-1">Final Amount</span>
                     <span className="text-[34px] font-sans font-black text-[#310101] leading-none tracking-tighter">{"\u20B9"}{totalPrice.toLocaleString()}</span>
                  </div>
                  <Button 
                    onClick={handleCheckout}
                    className="flex-1 h-18 bg-[#310101] text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[14px] flex flex-col items-center justify-center gap-1 shadow-2xl hover:bg-black hover:scale-[1.02] active:scale-95 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#DEB87A]">CHECKOUT</span>
                      <ArrowRight className="w-5 h-5 text-[#DEB87A] group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                    </div>
                    <div className="flex items-center gap-2 opacity-50 scale-75 grayscale brightness-200">
                       <span className="text-[8px] font-black">PAYTM</span>
                       <span className="w-1.5 h-1.5 bg-white rounded-full mx-1" />
                       <span className="text-[8px] font-black">GPAY</span>
                    </div>
                  </Button>
               </div>
            </div>

            <div className="flex items-center justify-between px-4 pt-4 border-t border-black/5">
               <div className="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 cursor-help transition-opacity">
                  <Truck className="w-6 h-6 text-[#310101]" strokeWidth={2.5} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#310101] text-center leading-tight">FAST<br/>SHIPPING</span>
               </div>
               <div className="w-[2px] h-10 bg-[#310101]/5" />
               <div className="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 cursor-help transition-opacity">
                  <ShieldCheck className="w-6 h-6 text-[#310101]" strokeWidth={2.5} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#310101] text-center leading-tight">SECURE<br/>PORTAL</span>
               </div>
               <div className="w-[2px] h-10 bg-[#310101]/5" />
               <div className="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 cursor-help transition-opacity">
                  <Droplets className="w-6 h-6 text-[#310101]" strokeWidth={2.5} />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#310101] text-center leading-tight">PURE<br/>OILS</span>
               </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
