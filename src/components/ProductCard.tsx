import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Star, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  price: string;
  isNew?: boolean;
  category?: string;
  subCategory?: string;
  discountPrice?: string;
}

const ProductCard = ({ id, image, name, price, isNew, category, subCategory, discountPrice }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Simple Manual Discount Logic
  let activeDiscountPrice = discountPrice;
  let activeDiscountPercent = 0;

  if (discountPrice) {
    const rawPrice = parseInt(price?.replace(/[^\d]/g, "") || "0");
    const rawDiscount = parseInt(discountPrice?.replace(/[^\d]/g, "") || "0");
    if (rawPrice > 0 && rawDiscount > 0) {
      activeDiscountPercent = Math.round(((rawPrice - rawDiscount) / rawPrice) * 100);
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use the correctly discounted price for the cart
    const finalCartPrice = activeDiscountPrice 
      ? (activeDiscountPrice.startsWith('₹') ? activeDiscountPrice : `₹${parseInt(activeDiscountPrice).toLocaleString()}`) 
      : price;
    addToCart({ id, image, name, price: finalCartPrice });
  };

  return (
    <motion.div
      className="group flex-shrink-0 w-full sm:w-[280px] md:w-[320px] cursor-pointer bg-[#F8F9F9] border border-gray-100 hover:border-[#dda74f]/40 transition-all duration-300 rounded-xl overflow-hidden shadow-sm hover:shadow-xl flex flex-col"
      onClick={() => navigate(`/product/${id}`)}
    >
      <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden bg-white rounded-t-xl">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {isNew && (
          <span className="absolute top-3 left-3 z-10 bg-black text-white text-[14px] font-medium tracking-wider uppercase px-2 py-1 rounded-sm shadow-sm">
            New
          </span>
        )}
      </div>

      <div className="px-4 pb-4 flex flex-col flex-1 text-left bg-[#F8F9F9] relative">
        
        {/* Rating Right Below Image aligned to Right */}
        <div className="flex justify-end mb-1 mt-2">
          <div className="bg-[#f0f0f0] rounded-full px-2 py-1 flex items-center gap-1 z-10 relative">
             <Star size={11} className="text-[#BFA15F] fill-[#BFA15F]" />
             <span className="text-[15px] text-[#555] font-medium tracking-tight">4.2 | 10</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="font-sans text-[16px] md:text-[18px] text-[#C29D59] mb-2 leading-snug line-clamp-2">
          {name}
        </h3>

        {/* Price Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4 mt-auto">
          {activeDiscountPrice ? (
            <>
               <span className="text-[24px] font-bold text-[#111] leading-none">
                 ₹{parseInt(activeDiscountPrice.replace(/[^\d]/g, "")).toLocaleString()}
               </span>
               <span className="text-[#747e8e] line-through text-[15px] font-medium">
                 {price}
               </span>
               {activeDiscountPercent > 0 && (
                 <span className="bg-[#489b6f] text-white text-[15px] font-bold px-1.5 py-[2px] rounded tracking-wide ml-1">
                   {activeDiscountPercent}% off
                 </span>
               )}
            </>
          ) : (
             <span className="text-[24px] font-bold text-[#111] leading-none">{price}</span>
          )}
        </div>

        {/* ADD TO CART Button */}
        <button 
          onClick={handleAddToCart}
          className="w-full py-[10px] bg-[#DEB87A] hover:bg-[#D0A96B] text-black font-sans font-bold uppercase tracking-wider text-[15px] rounded-full transition-all flex items-center justify-center gap-2"
        >
          ADD TO CART
          <ShoppingCart size={16} className="text-black fill-black" />
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
