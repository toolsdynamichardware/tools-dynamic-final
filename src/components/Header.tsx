import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Phone, Heart, User, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // -- Auth & Wishlist State --
  const [user, setUser] = useState<any>(null);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Fetch the total number of items in the user's wishlist
  const fetchWishlistCount = async (userId: string) => {
    const { count, error } = await supabase
      .from('wishlists')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (!error && count !== null) {
      setWishlistCount(count);
    }
  };

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>;

    const initData = async () => {
      // 1. Get initial session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        fetchWishlistCount(session.user.id);

        // 2. Turn on Real-time listening for THIS user's wishlist changes
        channel = supabase.channel('realtime-wishlist')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'wishlists', filter: `user_id=eq.${session.user.id}` },
            () => {
              // Whenever a heart is clicked (added or removed), re-fetch the count instantly!
              fetchWishlistCount(session.user.id);
            }
          ).subscribe();
      }
    };

    initData();

    // 3. Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchWishlistCount(session.user.id);
      } else {
        setWishlistCount(0); // Reset if they log out
      }
    });

    // Clean up the listener when the navbar unmounts
    return () => {
      subscription.unsubscribe();
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // Send them back to home page after logging out
  };

  return (
    <header className="sticky top-0 z-50 bg-navy text-navy-foreground shadow-lg">
      {/* Top bar */}
      <div className="bg-charcoal text-charcoal-foreground">
        <div className="container flex items-center justify-between py-1.5 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-accent" />
            <span>Call us: +27 (0) 11 000 0000</span>
          </div>
          <span className="hidden sm:block">Free delivery on orders over R1,500</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="container flex items-center justify-between py-4">

        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-2">
          {/* This image tag points to the logo.png file in your public folder */}
          <img
            src={logo}
            alt="Tools Dynamic Logo"
            className="h-12 w-auto object-contain"
          />

          {/* If your logo image already has the text "Tools Dynamic" inside it, 
              you can safely delete this entire div below! */}
          <div className="leading-tight hidden sm:block">
            <span className="font-heading text-lg font-bold tracking-wide">TOOLS DYNAMIC</span>
            <span className="block text-xs text-steel opacity-80">& HARDWARE</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-heading text-sm font-semibold uppercase tracking-wider transition-colors hover:text-accent ${location.pathname === link.to ? "text-accent" : ""
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Icons & Actions */}
        <div className="flex items-center gap-5">

          <Link to="/shop" className="text-steel transition-colors hover:text-accent" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>

          {/* WISHLIST BUTTON */}
          <Link to="/wishlist" className="relative text-steel transition-colors hover:text-accent" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-navy transition-all duration-300 scale-in">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* CART BUTTON */}
          <Link to="/cart" className="relative text-steel transition-colors hover:text-accent" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground transition-all duration-300">
                {totalItems}
              </span>
            )}
          </Link>

          {/* DESKTOP AUTH BUTTONS */}
          <div className="hidden items-center gap-4 border-l border-steel/30 pl-5 md:flex">
            {user ? (
              // If Logged In: Show Account & Logout
              <>
                <Link to="/account" className="flex items-center gap-2 text-sm font-semibold text-steel hover:text-accent transition-colors">
                  <User className="h-4 w-4" /> Account
                </Link>
                <button onClick={handleLogout} className="text-steel hover:text-red-400 transition-colors" title="Log Out">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              // If Not Logged In: Show Login & Register
              <>
                <Link to="/login" className="font-heading text-sm font-bold uppercase tracking-wider text-steel transition-colors hover:text-accent">
                  Login
                </Link>
                <Link to="/register" className="rounded bg-accent px-4 py-2 font-heading text-xs font-bold uppercase tracking-wider text-navy transition-all hover:bg-accent/90 hover:shadow-md">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="text-steel md:hidden ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav (Slide down) */}
      {mobileOpen && (
        <nav className="border-t border-charcoal bg-navy px-4 pb-6 md:hidden">
          <div className="space-y-1 pt-4">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-4 py-3 font-heading text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-charcoal hover:text-accent ${location.pathname === link.to ? "bg-charcoal text-accent" : ""
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 border-t border-charcoal pt-6">
            {user ? (
              <div className="flex items-center justify-between px-4">
                <Link to="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-sm font-semibold hover:text-accent">
                  <User className="h-4 w-4" /> My Account
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 px-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex justify-center rounded-lg border border-steel/30 py-3 font-heading text-sm font-bold uppercase tracking-wider transition-colors hover:border-accent hover:text-accent">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex justify-center rounded-lg bg-accent py-3 font-heading text-sm font-bold uppercase tracking-wider text-navy transition-colors hover:bg-accent/90">
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;