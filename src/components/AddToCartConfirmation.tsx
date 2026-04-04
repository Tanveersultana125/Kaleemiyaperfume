import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddToCartConfirmation = () => {
  const { showConfirmation, setShowConfirmation, lastAdded, cart } = useCart();
  const navigate = useNavigate();

  if (!lastAdded) return null;

  const subtotal = cart.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[^\d]/g, ""));
    return sum + (price * item.quantity);
  }, 0);

  return (
    <AnimatePresence>
      {showConfirmation && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-[450px] rounded-[35px] shadow-2xl overflow-hidden relative"
          >
            <button 
              onClick={() => setShowConfirmation(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-black/20 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-serif font-black italic text-[#310101]">Added to Cart</h3>
              </div>

              <div className="flex gap-6 p-4 bg-[#F9F6F2] rounded-2xl mb-8">
                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm border border-black/5 shrink-0 bg-white">
                  <img src={lastAdded.image} alt={lastAdded.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-serif text-lg font-bold text-[#310101] leading-tight mb-1">{lastAdded.name}</p>
                  <p className="text-[14px] font-sans font-black text-[#B0843D]">{lastAdded.price}</p>
                </div>
              </div>

              <div className="flex justify-between items-center px-4 mb-8">
                <div className="flex flex-col">
                   <p className="text-[12px] font-black uppercase tracking-widest text-[#310101]/40">Cart Subtotal</p>
                   <p className="text-2xl font-sans font-black text-[#310101]">{"\u20B9"}{subtotal.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end">
                   <p className="text-[12px] font-black uppercase tracking-widest text-[#310101]/40">Items</p>
                   <p className="text-lg font-black text-[#310101]">{cart.reduce((s, i) => s + i.quantity, 0)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    setShowConfirmation(false);
                    navigate("/checkout");
                  }}
                  className="w-full h-14 bg-[#DEB87A] hover:bg-[#D0A96B] text-black rounded-full font-black uppercase tracking-widest text-[12px] shadow-lg shadow-[#DEB87A]/20 transition-all flex items-center justify-center gap-2"
                >
                  Proceed to Buy
                  <ArrowRight className="w-4 h-4" />
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  className="w-full h-14 border-[#310101]/10 rounded-full font-black uppercase tracking-widest text-[12px] hover:bg-[#310101] hover:text-[#E5D5C5] transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Go to Bag
                </Button>
              </div>
            </div>

            <div className="bg-[#1A1A1A] p-4 text-center">
               <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-black flex items-center justify-center gap-2">
                 <CheckCircle2 className="w-2.5 h-2.5" />
                 Genuine Artisan Authenticity Guaranteed
               </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddToCartConfirmation;
