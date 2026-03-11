import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ChevronDown, Check, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { categories, type Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

// --- HELPER: Map Sheet Names to App IDs ---
const normalizeCategory = (sheetCategory: string): string => {
  const map: Record<string, string> = {
    "Drilling & Boring Tools": "drilling",
    "Specialized Drills": "specialized",
    "Holesaw Sets & Kits": "holesaws",
    "Screwdriving & Fastening": "fastening",
    "Fasteners": "fasteners",
    "Abrasives, Cutting & Grinding": "abrasives",
    "Diamond Blades": "diamond",
    "Sanding & Finishing": "sanding",
    "Wire Brushes": "wire-brushes",
    "Door Hardware": "door-hardware",
    "Safety & PPE": "safety",
    "Tool Storage": "storage"
  };

  return map[sheetCategory.trim()] || sheetCategory.toLowerCase().trim();
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");

  // -- Data State --
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // -- Fetch Data from SheetDB --
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://sheetdb.io/api/v1/jr4ok798nv2ph");
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        // Normalize the data and Auto-Generate IDs!
        const formattedData: Product[] = data.map((item: any) => {
          // Creates a clean URL ID from the Name (e.g. "Javelin Drill" -> "javelin-drill")
          const generatedId = item.Name ? item.Name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : Math.random().toString(36).substr(2, 9);

          return {
            id: generatedId,
            name: item.Name,
            category: item.Category ? normalizeCategory(item.Category) : "uncategorized",
            subcategory: "", // Section column was removed by client
            price: parseFloat(item.Price) || 0,
            image: item["Image URL"],
            description: item.Description,
            inStock: true,
          };
        });

        setProducts(formattedData);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // -- Filtering Logic --
  const filtered = useMemo(() => {
    let result = products;

    if (activeCategory) {
      result = result.filter(p => p.category === activeCategory);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (sort === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [activeCategory, search, sort, products]);

  const setCategory = (id: string) => {
    if (id) setSearchParams({ category: id });
    else setSearchParams({});
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearch("");
    setSort("name");
  };

  return (
    <main className="min-h-screen bg-muted/30">

      {/* --- PAGE HEADER --- */}
      <div className="relative overflow-hidden bg-navy pb-16 pt-12 text-white shadow-lg">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="font-heading text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              {activeCategory
                ? categories.find(c => c.id === activeCategory)?.name || "Category"
                : "All Products"}
            </h1>
            <p className="mt-4 text-lg text-steel">
              {activeCategory
                ? `Browse our premium selection of ${categories.find(c => c.id === activeCategory)?.name.toLowerCase() || "tools"}.`
                : "Explore our complete inventory of professional-grade tools."}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container relative z-20 -mt-8 pb-20">
        <div className="flex flex-col gap-8 lg:flex-row">

          {/* --- SIDEBAR --- */}
          <aside className="w-full shrink-0 lg:w-64">

            {/* Mobile View (Horizontal Scroll) */}
            <div className="block lg:hidden">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <SlidersHorizontal className="h-4 w-4" /> Choose Category
                </span>
                {(activeCategory || search) && (
                  <button onClick={clearFilters} className="text-xs font-bold text-accent">
                    Reset
                  </button>
                )}
              </div>
              <div className="scrollbar-hide -mx-4 flex overflow-x-auto px-4 pb-4 pt-1 snap-x">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCategory("")}
                    className={`snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-all ${!activeCategory
                        ? "bg-accent text-navy shadow-lg shadow-accent/25 ring-2 ring-accent"
                        : "bg-white border border-border text-muted-foreground hover:bg-gray-50"
                      }`}
                  >
                    All Tools
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`snap-start flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-all ${activeCategory === cat.id
                          ? "bg-accent text-navy shadow-lg shadow-accent/25 ring-2 ring-accent"
                          : "bg-white border border-border text-muted-foreground hover:bg-gray-50"
                        }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DESKTOP SIDEBAR */}
            <div className="hidden lg:sticky lg:top-24 lg:block">
              <div className="flex max-h-[calc(100vh-150px)] flex-col rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border p-5">
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground">Categories</h3>
                  {(activeCategory || search) && (
                    <button onClick={clearFilters} className="text-xs text-accent hover:underline">
                      Clear
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto p-4 custom-scrollbar">
                  <div className="space-y-1">
                    <CategoryButton
                      active={!activeCategory}
                      onClick={() => setCategory("")}
                      label="View All"
                    />
                    {categories.map(cat => (
                      <CategoryButton
                        key={cat.id}
                        active={activeCategory === cat.id}
                        onClick={() => setCategory(cat.id)}
                        label={cat.name}
                        icon={cat.icon}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* --- MAIN GRID AREA --- */}
          <div className="flex-1">

            {/* Toolbar */}
            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name or keyword..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-md border-none bg-muted/50 py-2 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:bg-background focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="flex items-center gap-3 border-t border-border pt-4 sm:border-0 sm:pt-0">
                <span className="hidden whitespace-nowrap text-sm text-muted-foreground sm:inline-block">
                  Sort by:
                </span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="w-full appearance-none rounded-md border-none bg-muted/50 py-2 pl-4 pr-10 text-sm font-bold outline-none transition-all hover:bg-muted focus:ring-2 focus:ring-accent/20 sm:w-auto"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Content Area */}
            {loading ? (
              <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-accent" />
                <p>Loading products from catalog...</p>
              </div>
            ) : error ? (
              <div className="flex h-64 flex-col items-center justify-center text-red-500">
                <AlertCircle className="mb-4 h-10 w-10" />
                <p>Unable to load products. Please check your connection.</p>
              </div>
            ) : (
              <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filtered.length > 0 ? (
                    filtered.map(p => (
                      <ProductCard key={p.id} product={p} />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Search className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <h3 className="mt-4 text-lg font-bold">No products found</h3>
                      <button onClick={clearFilters} className="mt-4 text-sm font-bold text-accent hover:underline">
                        Reset Filters
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
};

// Helper Component
const CategoryButton = ({ active, onClick, label, icon }: any) => (
  <button
    onClick={onClick}
    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${active
        ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
  >
    <div className="flex items-center gap-3 text-left">
      {icon && <span className="text-lg opacity-70 group-hover:opacity-100">{icon}</span>}
      <span>{label}</span>
    </div>
    {active && <Check className="h-3.5 w-3.5 shrink-0" />}
  </button>
);

export default Shop;