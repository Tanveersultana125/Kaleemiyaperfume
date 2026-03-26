import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  price: string;
  isNew?: boolean;
}

const ProductCard = ({ id, image, name, price, isNew }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id, image, name, price });
  };

  return (
    <motion.div
      className="group flex-shrink-0 w-full sm:w-[280px] md:w-[300px] cursor-pointer bg-[#310101] border border-white/10 hover:border-primary/40 transition-all duration-500 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl"
      onClick={() => navigate(`/product/${id}`)}
    >
      <div className="relative aspect-square overflow-hidden m-3 rounded-xl bg-black/20">
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
      </div>

      <div className="px-5 pb-5 pt-2 flex flex-col gap-1 text-left bg-[#310101]">
        <span className="text-[9px] text-primary/60 font-sans tracking-widest uppercase mb-1">Perfumes</span>
        <h3 className="font-sans font-bold text-sm md:text-base text-[#F9F6F0] mb-1 leading-tight tracking-tight uppercase group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-primary font-sans text-sm font-bold tracking-tight">{price}</p>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="w-full h-11 bg-black hover:bg-gray-900 border border-white/10 text-white font-sans font-bold uppercase tracking-[0.1em] text-[11px] rounded-xl transition-all flex items-center justify-center gap-2"
        >
          ADD TO CART
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
