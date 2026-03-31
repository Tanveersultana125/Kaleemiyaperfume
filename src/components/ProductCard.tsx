import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useActiveAnnouncements } from "@/hooks/useActiveAnnouncements";

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
  const { getDiscountForProduct } = useActiveAnnouncements();

  const broadcastDiscountPercent = getDiscountForProduct(category || "", subCategory);
  
  // Rule: Manual discountPrice takes priority. If not present, check for broadcast discount.
  let activeDiscountPrice = discountPrice;
  let activeDiscountPercent = 0;

  if (discountPrice) {
    activeDiscountPercent = Math.round(((parseInt(price?.replace(/[^\d]/g, "") || "0") - parseInt(discountPrice)) / parseInt(price?.replace(/[^\d]/g, "") || "1")) * 100);
  } else if (broadcastDiscountPercent > 0) {
    const rawPrice = parseInt(price?.replace(/[^\d]/g, "") || "0");
    activeDiscountPrice = Math.round(rawPrice * (1 - broadcastDiscountPercent / 100)).toString();
    activeDiscountPercent = broadcastDiscountPercent;
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
      className="group flex-shrink-0 w-full sm:w-[280px] md:w-[300px] cursor-pointer bg-white border border-black/5 hover:border-primary/40 transition-all duration-500 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl"
      onClick={() => navigate(`/product/${id}`)}
    >
      <div className="relative aspect-square overflow-hidden m-3 rounded-xl bg-gray-50/50">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {isNew && (
          <span className="absolute top-3 left-3 z-10 bg-primary text-white text-[8px] font-sans font-bold tracking-[0.2em] uppercase px-2 py-1 rounded-full shadow-lg">
            New
          </span>
        )}
        {activeDiscountPercent > 0 && (
          <span className="absolute top-3 right-3 z-10 bg-red-600 text-white text-[8px] font-sans font-bold tracking-[0.2em] uppercase px-2 py-1 rounded-full shadow-lg animate-pulse">
            SALE {activeDiscountPercent}% OFF
          </span>
        )}
      </div>

      <div className="px-5 pb-5 pt-2 flex flex-col gap-1 text-left bg-white">
        {(category || subCategory) && (
          <span className="text-[9px] text-primary/80 font-sans tracking-widest uppercase mb-1">
            {category}{subCategory ? ` , ${subCategory}` : ""}
          </span>
        )}
        <h3 className="font-sans font-bold text-sm md:text-base text-[#310101] mb-1 leading-tight tracking-tight uppercase group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-[14px] lg:text-[16px] font-sans font-bold text-black flex items-center gap-3">
            {activeDiscountPrice ? (
              <>
                <span className="text-[#310101]">₹{parseInt(activeDiscountPrice.replace(/[^\d]/g, "")).toLocaleString()}</span>
                <span className="text-black/30 line-through text-[12px] font-normal font-sans">
                  {price}
                </span>
              </>
            ) : (
              <span className="text-primary">{price}</span>
            )}
          </p>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="w-full h-11 bg-[#310101] hover:bg-black text-white font-sans font-bold uppercase tracking-[0.1em] text-[11px] rounded-xl transition-all flex items-center justify-center gap-2"
        >
          ADD TO CART
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
