import { Link } from "react-router-dom";
import { ArrowRight, Shield, Truck, DollarSign, CheckCircle, Star, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { categories, type Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import heroImage from "@/assets/hero-tools.jpg";

// -- Animation Variants --
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // -- Fetch Data from SheetDB --
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Updated to use the provided API link
        const response = await fetch("https://sheetdb.io/api/v1/7a6boecujvo0i");
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        // Normalize Data
        const formattedData: Product[] = data.map((item: any) => ({
          id: item.ID || Math.random().toString(36).substr(2, 9),
          name: item.Name,
          category: item.Category ? item.Category.toLowerCase().trim() : "uncategorized",
          subcategory: item.Subcategory ?? "",
          price: parseFloat(item.Price) || 0,
          image: item["Image URL"],
          description: item.Description,
          inStock: true,
          featured: String(item.Featured).trim().toUpperCase() === "TRUE",
          bestSeller: String(item.BestSeller).trim().toUpperCase() === "TRUE",
          newArrival: String(item.NewArrival).trim().toUpperCase() === "TRUE",
        }));

        setProducts(formattedData);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // -- Derived State (Filters based on the flags in the sheet) --
  const featuredProducts = products.filter(p => p.featured);
  const bestSellers = products.filter(p => p.bestSeller);
  const newArrivals = products.filter(p => p.newArrival);
  const topCategories = categories.slice(0, 8);

  return (
    <main className="overflow-x-hidden">

      {/* --- HERO SECTION --- */}
      <section className="relative flex min-h-[600px] items-center overflow-hidden bg-navy text-white">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={heroImage}
            alt="Professional tools background"
            className="h-full w-full object-cover opacity-30"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-transparent" />

        <div className="container relative z-10 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent ring-1 ring-inset ring-accent/20">
              <Star className="h-4 w-4 fill-current" />
              <span>The #1 Choice for Contractors</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="font-heading text-5xl font-extrabold uppercase leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Professional Tools.{" "}
              <span className="bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                Built to Last.
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-6 max-w-xl text-lg text-gray-300 sm:text-xl">
              Equip yourself with industrial-grade drilling, cutting, and fastening tools.
              Engineered for precision, safety, and durability.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center gap-2 rounded bg-accent px-8 py-4 font-heading text-sm font-bold uppercase tracking-wider text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90"
                >
                  Shop Tools <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>

              <Link to="/shop?category=safety">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 rounded border border-white/20 bg-white/5 px-8 py-4 font-heading text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:border-accent hover:bg-accent/10 hover:text-accent"
                >
                  Shop Safety Gear
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- CATEGORIES SECTION --- */}
      <section className="bg-background py-20">
        <div className="container">
          <SectionHeader title="Shop by Category" subtitle="Find exactly what you need for the job" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
          >
            {topCategories.map(cat => (
              <motion.div key={cat.id} variants={fadeInUp}>
                <Link
                  to={`/shop?category=${cat.id}`}
                  className="group relative flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-accent/10"
                >
                  <span className="text-4xl transition-transform duration-300 group-hover:scale-110">{cat.icon}</span>
                  <span className="font-heading text-sm font-bold uppercase tracking-wide text-card-foreground group-hover:text-accent">
                    {cat.name}
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-accent/5 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10 text-center">
            <Link to="/shop" className="group inline-flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wider text-accent hover:text-accent/80">
              View All Categories
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURED PRODUCTS --- */}
      <section className="bg-muted/50 py-20">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <h2 className="font-heading text-3xl font-bold uppercase text-foreground">Featured Products</h2>
            <Link to="/shop" className="text-sm font-bold text-accent hover:underline">View All</Link>
          </div>

          {loading ? (
            <LoadingGrid />
          ) : error ? (
            <ErrorState />
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section className="relative overflow-hidden bg-navy py-24 text-white">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="container relative z-10">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              Why Professionals Choose Us
            </h2>
            <div className="mt-4 mx-auto h-1 w-20 bg-accent rounded-full" />
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { icon: CheckCircle, title: "Quality Assured", desc: "Trusted brands, rigorously tested for industrial use." },
              { icon: DollarSign, title: "Trade Pricing", desc: "Get competitive rates on bulk and trade orders." },
              { icon: Truck, title: "Fast Delivery", desc: "Same-day dispatch and real-time tracking." },
              { icon: Shield, title: "Secure Warranty", desc: "Full manufacturer warranty on all power tools." },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="group relative rounded-2xl bg-white/5 p-8 text-center backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-navy shadow-lg shadow-accent/25 transition-transform duration-300 group-hover:scale-110">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 font-heading text-lg font-bold uppercase tracking-wide">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- BEST SELLERS & NEW ARRIVALS --- */}
      <section className="bg-background py-20">
        <div className="container space-y-20">

          {/* Best Sellers */}
          <div>
            <SectionHeader title="Best Sellers" subtitle="Top rated tools by our community" />
            {loading ? (
              <LoadingGrid />
            ) : (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {bestSellers.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>

          <div className="h-px w-full bg-border" />

          {/* New Arrivals */}
          <div>
            <SectionHeader title="New Arrivals" subtitle="The latest technology in the industry" />
            {loading ? (
              <LoadingGrid />
            ) : (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {newArrivals.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {/* --- VIEW ALL BUTTON --- */}
            <div className="mt-12 text-center">
              <Link to="/shop">
                <button className="group inline-flex items-center gap-2 rounded bg-accent px-8 py-3 font-heading text-sm font-bold uppercase tracking-wider text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:-translate-y-1">
                  View All Products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* --- BRANDS MARQUEE --- */}
      <section className="bg-muted py-12 border-t border-border">
        <div className="container">
          <p className="mb-8 text-center font-heading text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Trusted Partners
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-70 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
            {["JAVELIN", "MAJESTA", "HARDMAN", "STEELGRIP", "SAFEPRO"].map(brand => (
              <span key={brand} className="font-heading text-2xl font-black italic tracking-tighter text-foreground/80">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};

// -- Helper Components --
const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center">
    <h2 className="font-heading text-3xl font-bold uppercase text-foreground">{title}</h2>
    {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
  </div>
);

const LoadingGrid = () => (
  <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
    ))}
  </div>
);

const ErrorState = () => (
  <div className="mt-10 flex h-40 flex-col items-center justify-center rounded-xl border border-dashed border-red-300 bg-red-50 text-red-500">
    <AlertCircle className="mb-2 h-8 w-8" />
    <p>Unable to load products.</p>
  </div>
);

export default Index;