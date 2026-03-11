import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Check, ExternalLink, Heart, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

// Helper to normalize the category
const normalizeCategory = (cat: string) => cat ? cat.toLowerCase().trim() : "uncategorized";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  // -- Data State --
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // -- UI State --
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [added, setAdded] = useState(false);

  // -- Auth & Wishlist State --
  const [user, setUser] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // 1. Fetch Product and Related Items from SheetDB
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://sheetdb.io/api/v1/jr4ok798nv2ph");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        // FIND PRODUCT: Match the URL ID against a slugified version of the Name!
        const foundProduct = data.find((p: any) => {
          if (!p.Name) return false;
          const slug = p.Name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return slug === id;
        });

        if (foundProduct) {
          const formattedProduct = {
            id: id, // Use the URL slug as the ID
            name: foundProduct.Name,
            category: normalizeCategory(foundProduct.Category),
            subcategory: "", // Section removed by client
            price: parseFloat(foundProduct.Price) || 0,
            image: foundProduct["Image URL"],
            description: foundProduct.Description,
            sizes: foundProduct.Sizes ? foundProduct.Sizes.split(",") : [],
            specs: foundProduct.Specs ? JSON.parse(foundProduct.Specs) : null,
          };

          setProduct(formattedProduct);

          // Find related products
          const relatedProducts = data
            .filter((p: any) => {
              const pSlug = p.Name ? p.Name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : "";
              return normalizeCategory(p.Category) === formattedProduct.category && pSlug !== id;
            })
            .slice(0, 4)
            .map((p: any) => ({
              id: p.Name ? p.Name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : Math.random().toString(36).substr(2, 9),
              name: p.Name,
              category: normalizeCategory(p.Category),
              subcategory: "",
              price: parseFloat(p.Price) || 0,
              image: p["Image URL"],
              description: p.Description,
              inStock: true,
            }));

          setRelated(relatedProducts);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // 2. Check Auth and Wishlist Status
  useEffect(() => {
    if (!product) return;

    const checkStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);

        const { data } = await supabase
          .from("wishlists")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("product_id", product.id)
          .maybeSingle();

        if (data) setIsFavorited(true);
      }
    };
    checkStatus();
  }, [product]);

  const handleAdd = () => {
    if (product) {
      addItem(product, qty, selectedSize);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      alert("Please log in to save items to your wishlist.");
      navigate("/login");
      return;
    }

    if (isFavorited) {
      setIsFavorited(false);
      await supabase.from("wishlists").delete().match({ user_id: user.id, product_id: product?.id });
    } else {
      setIsFavorited(true);
      await supabase.from("wishlists").insert([{ user_id: user.id, product_id: product?.id }]);
    }
  };

  if (loading) {
    return (
      <main className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-accent" />
        <p className="text-muted-foreground">Loading product details...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-accent hover:underline">← Back to shop</Link>
      </main>
    );
  }

  const googleImageSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(product.name + " tools")}`;

  return (
    <main className="bg-background">
      <div className="container py-8">
        <Link to="/shop" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* IMAGE SECTION */}
          <div className="overflow-hidden rounded-lg bg-muted relative group">
            <a
              href={googleImageSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full cursor-zoom-in relative"
              title="Click to search on Google Images"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 bg-white p-8"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-background/90 text-foreground px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                  <ExternalLink className="h-3 w-3" /> View on Google Images
                </div>
              </div>
            </a>
          </div>

          {/* PRODUCT DETAILS SECTION */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              {product.category}
            </span>
            <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">{product.name}</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>
            <p className="mt-6 font-heading text-3xl font-bold text-foreground">R{product.price.toFixed(2)}</p>

            {/* Optional Sizes/Variants Dropdown */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-6">
                <label className="mb-2 block text-sm font-bold text-foreground">Size / Variant</label>
                <select
                  value={selectedSize || ""}
                  onChange={e => setSelectedSize(e.target.value)}
                  className="w-full max-w-xs rounded border border-input bg-card px-3 py-2.5 text-sm text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select option</option>
                  {product.sizes.map((s: string) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            <div className="mt-6 flex items-center gap-4">
              <label className="text-sm font-bold text-foreground">Qty</label>
              <div className="flex items-center rounded border border-input bg-card">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-foreground hover:bg-muted transition-colors">−</button>
                <span className="w-12 text-center text-sm font-bold text-foreground">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-foreground hover:bg-muted transition-colors">+</button>
              </div>
            </div>

            {/* BUTTON ROW */}
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={handleAdd}
                className={`flex w-full max-w-sm items-center justify-center gap-2 rounded px-8 py-3 font-heading text-sm font-bold uppercase tracking-wider transition-all
                  ${added
                    ? "bg-green-600 text-white"
                    : "bg-navy text-white hover:bg-accent hover:text-navy hover:shadow-lg"
                  }`}
              >
                {added ? <><Check className="h-4 w-4" /> Added to Cart</> : <><ShoppingCart className="h-4 w-4" /> Add to Cart</>}
              </button>

              <button
                onClick={toggleWishlist}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded border-2 transition-all ${isFavorited
                    ? "border-red-500 bg-red-50 text-red-500 hover:bg-red-100"
                    : "border-border bg-card text-muted-foreground hover:border-accent hover:text-accent"
                  }`}
                title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Specifications Table (if any) */}
            {product.specs && (
              <div className="mt-10 rounded-lg border border-border bg-card/50 p-6">
                <h3 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-foreground">Specifications</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val]) => (
                      <tr key={key} className="border-b border-border last:border-0">
                        <td className="py-3 font-medium text-muted-foreground w-1/3">{key}</td>
                        <td className="py-3 text-foreground font-medium">{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-border pt-10">
            <h2 className="mb-8 font-heading text-2xl font-bold uppercase text-foreground">You might also like</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;