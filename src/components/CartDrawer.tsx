import React from "react";
import { useCart } from "@/context/CartContext";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { ShoppingCart, ShoppingBag, Minus, Plus, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, totalCount, clearCart } = useCart();

  const handleCheckout = () => {
    toast.success("Placing your order...");
    setTimeout(() => {
      clearCart();
      toast.success("Thank you for your order! (Demo Only)");
    }, 1500);
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
      <SheetContent className="w-full sm:max-w-[400px] flex flex-col p-0 border-l border-[#310101]/5 bg-[#FDFCFB] text-[#310101] shadow-2xl">
        <SheetHeader className="px-8 py-10 border-b border-[#310101]/5 bg-[#F9F6F2]">
          <SheetTitle className="font-serif text-2xl text-center text-[#310101] tracking-tight">
             My Boutique Bag
          </SheetTitle>
          <p className="text-[11px] uppercase tracking-[0.3em] font-black text-center text-[#B0843D]/60 mt-1">
            {totalCount} ARTISAN SELECTIONS
          </p>
        </SheetHeader>

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
                Continue Exploration
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-8">
              <div className="py-10 space-y-10">
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
            </ScrollArea>

            <div className="p-8 bg-[#F9F6F2] border-t border-[#310101]/5 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-[13px] text-[#310101]/60 font-black uppercase tracking-[0.2em] mb-0.5">SUBTOTAL</span>
                  <span className="text-lg font-sans font-black text-[#310101]">{"\u20B9"}{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-[13px] text-[#310101]/60 font-black uppercase tracking-[0.2em]">SHIPPING</span>
                  <span className="text-[11px] text-green-600 font-bold uppercase tracking-widest">Complimentary</span>
                </div>
                <div className="h-[1px] w-full bg-[#310101]/5" />
                <div className="flex justify-between items-center px-2">
                  <span className="text-[15px] font-serif text-[#310101] uppercase tracking-[0.2em] font-black">TOTAL</span>
                  <span className="text-2xl font-sans font-black text-[#B0843D]">{"\u20B9"}{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleCheckout}
                  className="w-full h-16 bg-[#310101] text-[#E5D5C5] rounded-full font-black uppercase tracking-[0.3em] text-[13px] flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  COMPLETE EXPLORATION
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <div className="flex flex-col items-center gap-1.5 opacity-40">
                   <p className="text-[10px] text-center text-[#310101] uppercase tracking-[0.3em] font-black">
                     Secure Gateway Protected
                   </p>
                   <div className="flex items-center gap-2 grayscale brightness-50">
                      <span className="text-[9px] font-sans font-bold">RAZORPAY</span>
                      <span className="w-1 h-1 bg-black rounded-full" />
                      <span className="text-[9px] font-sans font-bold">VISA</span>
                      <span className="w-1 h-1 bg-black rounded-full" />
                      <span className="text-[9px] font-sans font-bold">MASTERCARD</span>
                   </div>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
