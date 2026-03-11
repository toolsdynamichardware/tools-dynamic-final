import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-navy text-navy-foreground">
    <div className="container grid gap-10 py-16 md:grid-cols-4">

      {/* Brand Column */}
      <div>
        <Link to="/" className="mb-4 flex items-center gap-2">
          <img
            src={logo}
            alt="Tools Dynamic Logo"
            className="h-10 w-auto object-contain"
          />
          <span className="font-heading text-lg font-bold tracking-wide">TOOLS DYNAMIC</span>
        </Link>
        <p className="text-sm leading-relaxed text-steel">
          Your trusted supplier for professional tools, hardware, and safety equipment. Quality products at competitive prices.
        </p>
      </div>

      {/* Quick Links Column */}
      <div>
        <h4 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-accent">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          {[
            { to: "/shop", label: "Shop All" },
            { to: "/about", label: "About Us" },
            { to: "/contact", label: "Contact" },
            { to: "/terms", label: "Terms & Conditions" },
            { to: "/privacy", label: "Privacy Policy" }
          ].map(l => (
            <li key={l.to}>
              <Link to={l.to} className="text-steel transition-colors hover:text-accent">{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories Column */}
      <div>
        <h4 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-accent">Categories</h4>
        <ul className="space-y-2 text-sm">
          {["Drilling Tools", "Safety & PPE", "Abrasives", "Fasteners"].map(c => (
            <li key={c}>
              <Link to="/shop" className="text-steel transition-colors hover:text-accent">{c}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Column */}
      <div>
        <h4 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-accent">Contact</h4>
        <ul className="space-y-3 text-sm text-steel">
          <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +27 (0) 11 000 0000</li>
          <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> info@toolsdynamic.co.za</li>
          <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-accent" /> Johannesburg, South Africa</li>
        </ul>
      </div>
    </div>

    {/* Bottom Copyright & Agency Credit Bar */}
    <div className="border-t border-charcoal bg-navy/50">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 text-xs text-steel md:flex-row md:text-left">
        <p>© {new Date().getFullYear()} Tools Dynamic & Hardware. All rights reserved.</p>
        <p>
          Designed by{" "}
          <a
            href="https://aiprecision.agency/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-accent transition-colors hover:text-white hover:underline tracking-wide uppercase"
          >
            AI Precision Agency
          </a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;