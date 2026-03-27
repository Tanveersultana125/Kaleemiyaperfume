import React from "react";
import { useCart } from "@/context/CartContext";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter,
  SheetTrigger
} from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, X, ArrowRight } from "lucide-react";
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
          <ShoppingBag className="w-5.5 h-5.5" />
          {totalCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-[#310101] text-[9px] flex items-center justify-center text-white font-bold animate-in fade-in zoom-in border border-white/20">
              {totalCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[320px] flex flex-col p-0 border-l border-white/5 bg-[#310101] text-[#F9F6F0]">
        <SheetHeader className="px-5 py-4 border-b border-white/5">
          <SheetTitle className="font-serif text-base text-center text-[#F9F6F0] flex items-center justify-center gap-3">
             ({totalCount} items)
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-[#F9F6F0]/40" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-base text-[#F9F6F0]">Your cart is empty</h3>
              <p className="text-[10px] text-[#F9F6F0]/60 max-w-[160px]">
                Explore our collections and find your signature scent.
              </p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4">
              <div className="py-4 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 group relative">
                    <div className="w-16 h-20 bg-white/5 overflow-hidden shrink-0 border border-white/5">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-[13px] text-[#F9F6F0]/90 leading-tight">
                            {item.name}
                          </h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#F9F6F0]/40 hover:text-white transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs font-sans font-medium text-[#C5A02E]">{item.price}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex items-center border border-white/10 rounded-none overflow-hidden h-6">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-1.5 hover:bg-white/10 transition-colors border-r border-white/10"
                          >
                            <Minus className="w-2 h-2" />
                          </button>
                          <span className="px-2 text-[10px] font-medium w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-1.5 hover:bg-white/10 transition-colors border-l border-white/10"
                          >
                            <Plus className="w-2 h-2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-5 bg-white/[0.02] space-y-3 border-t border-white/10">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#F9F6F0] font-bold uppercase tracking-[0.15em]">SUBTOTAL</span>
                  <span className="text-xs font-medium text-[#F9F6F0]">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#F9F6F0] font-bold uppercase tracking-[0.15em]">SHIPPING</span>
                  <span className="text-[9px] text-[#F9F6F0]/50 italic">Calculated at checkout</span>
                </div>
                <Separator className="my-1 bg-white/5" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-serif text-[#F9F6F0] uppercase tracking-widest">TOTAL</span>
                  <span className="text-base font-serif text-[#F5C518]">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="grid pt-2">
                <Button 
                  onClick={handleCheckout}
                  className="w-full h-12 bg-transparent border border-[#F9F6F0]/20 hover:bg-white/5 text-[#F9F6F0] rounded-none font-sans uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2"
                >
                  PLACE ORDER
                  <ArrowRight className="w-3 h-3" />
                </Button>
                <p className="text-[8px] mt-3 text-center text-[#F9F6F0]/30 uppercase tracking-widest">
                  Secure checkout powered by Razorpay
                </p>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
