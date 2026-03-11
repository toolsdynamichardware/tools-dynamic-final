import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { type Product } from "@/data/products";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AuthPopup from "@/components/AuthPopup"; // IMPORT THE NEW POPUP

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  
  // -- Wishlist State --
  const [isFavorited, setIsFavorited] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // -- Popup State --
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  // Check if this product is already in the user's wishlist when the card loads
  useEffect(() => {
    const checkWishlist = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        const { data } = await supabase
          .from("wishlists")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("product_id", product.id)
          .maybeSingle(); 
          
        if (data) {
          setIsFavorited(true);
        }
      }
    };
    checkWishlist();
  }, [product.id]);

  // Handle clicking the heart button
  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (!user) {
      // Trigger the beautiful popup instead of an alert!
      setShowAuthPopup(true);
      return;
    }

    if (isFavorited) {
      // Remove from wishlist
      setIsFavorited(false); // Update UI instantly for a snappy feel
      await supabase
        .from("wishlists")
        .delete()
        .match({ user_id: user.id, product_id: product.id });
    } else {
      // Add to wishlist
      setIsFavorited(true); // Update UI instantly
      await supabase
        .from("wishlists")
        .insert([{ user_id: user.id, product_id: product.id }]);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10"
    >
      {/* Product Image Link */}
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover p-4 transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* --- WISHLIST HEART BUTTON --- */}
      <button
        onClick={toggleWishlist}
        className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-muted-foreground shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:text-red-500"
        title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart 
          className={`h-5 w-5 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : ""}`} 
        />
      </button>

      {/* Badges */}
      <div className="absolute left-3 top-3 flex flex-col gap-2">
        {product.newArrival && (
          <span className="rounded bg-navy px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            New
          </span>
        )}
        {product.bestSeller && (
          <span className="rounded bg-accent px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-navy shadow-sm">
            Best Seller
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">
          {product.category}
        </span>
        <Link to={`/product/${product.id}`} className="font-heading text-sm font-bold text-card-foreground hover:text-accent">
          {product.name}
        </Link>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="font-heading text-lg font-black text-foreground">
            R{product.price.toFixed(2)}
          </span>
          
          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product, 1);
            }}
            className="flex h-10 w-10 items-center justify-center rounded bg-navy text-white transition-all hover:bg-accent hover:text-navy hover:shadow-md active:scale-95"
            title="Add to Cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ADD THE POPUP COMPONENT HERE */}
      <AuthPopup isOpen={showAuthPopup} onClose={() => setShowAuthPopup(false)} />
    </motion.div>
  );
};

export default ProductCard;