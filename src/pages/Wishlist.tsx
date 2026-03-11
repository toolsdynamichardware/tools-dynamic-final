import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

// Helper to normalize the category
const normalizeCategory = (cat: string) => cat ? cat.toLowerCase().trim() : "uncategorized";

const Wishlist = () => {
  const [user, setUser] = useState<any>(null);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        // 1. Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }
        setUser(session.user);

        // 2. Fetch the user's saved Product IDs from Supabase
        const { data: wishlistData, error: supabaseError } = await supabase
          .from("wishlists")
          .select("product_id")
          .eq("user_id", session.user.id);

        if (supabaseError) throw supabaseError;

        // If wishlist is empty, stop here
        if (!wishlistData || wishlistData.length === 0) {
          setWishlistProducts([]);
          setLoading(false);
          return;
        }

        const savedProductIds = wishlistData.map((item) => item.product_id);

        // 3. Fetch all products from your NEW SheetDB API link
        const response = await fetch("https://sheetdb.io/api/v1/jr4ok798nv2ph");
        if (!response.ok) throw new Error("Failed to fetch products");
        const allProducts = await response.json();

        // Normalize SheetDB data to match our Product type
        const formattedData: Product[] = allProducts.map((item: any) => ({
          id: item.ID,
          name: item.Name,
          category: normalizeCategory(item.Category),
          price: parseFloat(item.Price) || 0,
          image: item["Image URL"],
          description: item.Description,
          inStock: true,
        }));

        // 4. Filter products to only show the ones in the user's wishlist
        const finalWishlist = formattedData.filter((product) => 
          savedProductIds.includes(product.id)
        );

        setWishlistProducts(finalWishlist);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string) => {
    if (!user) return;

    // Remove from UI immediately for a snappy feel
    setWishlistProducts((prev) => prev.filter((p) => p.id !== productId));

    // Remove from Supabase database
    await supabase
      .from("wishlists")
      .delete()
      .match({ user_id: user.id, product_id: productId });
  };

  // --- NOT LOGGED IN STATE ---
  if (!loading && !user) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-4 text-center">
        <Heart className="mb-4 h-16 w-16 text-muted-foreground opacity-50" />
        <h1 className="font-heading text-2xl font-bold text-foreground">Sign in to view your Wishlist</h1>
        <p className="mt-2 text-muted-foreground">Save your favorite tools and access them on any device.</p>
        <Link to="/login" className="mt-6 rounded bg-accent px-8 py-3 font-heading text-sm font-bold uppercase tracking-wider text-navy transition-colors hover:bg-accent/90">
          Sign In
        </Link>
      </main>
    );
  }

  // --- LOADING STATE ---
  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </main>
    );
  }

  // --- EMPTY WISHLIST STATE ---
  if (wishlistProducts.length === 0) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-4 text-center">
        <Heart className="mb-4 h-16 w-16 text-muted-foreground opacity-20" />
        <h1 className="font-heading text-2xl font-bold text-foreground">Your Wishlist is Empty</h1>
        <p className="mt-2 text-muted-foreground">You haven't saved any items yet.</p>
        <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded bg-accent px-6 py-3 font-heading text-sm font-bold uppercase text-navy transition-colors hover:bg-accent/90">
          <ArrowLeft className="h-4 w-4" /> Discover Tools
        </Link>
      </main>
    );
  }

  // --- POPULATED WISHLIST STATE ---
  return (
    <main className="bg-background pb-20">
      <div className="bg-navy py-8">
        <div className="container">
          <h1 className="font-heading text-3xl font-bold uppercase text-white">My Wishlist</h1>
        </div>
      </div>

      <div className="container mt-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
              
              {/* Image */}
              <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-white">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover p-4 transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              {/* Remove Button (Top Right) */}
              <button
                onClick={() => handleRemove(product.id)}
                className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-red-500 shadow-sm backdrop-blur-sm transition-all hover:bg-red-50 hover:scale-110"
                title="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {/* Product Info */}
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
                    onClick={() => addItem(product, 1)}
                    className="flex h-10 w-10 items-center justify-center rounded bg-navy text-white transition-colors hover:bg-accent hover:text-navy"
                    title="Move to Cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Wishlist;