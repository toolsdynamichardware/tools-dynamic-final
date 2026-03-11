import { 
  Shield, 
  Users, 
  Award, 
  Target, 
  Truck, 
  Clock, 
  Wrench, 
  Phone, 
  ArrowRight,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Replaced "Fake Stats" with Real Service Promises
const trustHighlights = [
  { icon: Truck, label: "Nationwide Delivery", sub: "Reliable Shipping" },
  { icon: Shield, label: "Quality Guaranteed", sub: "Industry Standards" },
  { icon: Lock, label: "Secure Payment", sub: "100% Safe Checkout" },
  { icon: Users, label: "Expert Support", sub: "Real Human Help" },
];

const values = [
  { 
    icon: Shield, 
    title: "Uncompromising Quality", 
    desc: "We refuse to stock inferior goods. Every drill bit, safety goggle, and fastener is vetted to meet professional industry standards." 
  },
  { 
    icon: Users, 
    title: "Expert Technical Support", 
    desc: "Our team aren't just salespeople; they are tool experts. We help you choose the right equipment for the specific job." 
  },
  { 
    icon: Award, 
    title: "Verified Brands", 
    desc: "We partner directly with global leaders in hardware manufacturing to ensure authenticity and warranty support." 
  },
  { 
    icon: Target, 
    title: "Trade-Focused Pricing", 
    desc: "We understand margins matter. Our pricing structure is designed to support contractors, resellers, and bulk buyers." 
  },
];

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const About = () => {
  return (
    <main className="bg-background overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative flex min-h-[500px] items-center justify-center bg-navy py-24 text-center lg:py-32">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1600&h=900&fit=crop" 
            alt="Workshop background" 
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/90 to-navy" />
        </div>

        <div className="container relative z-10">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer}
            className="mx-auto max-w-3xl"
          >
            <motion.span variants={fadeIn} className="mb-6 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-accent ring-1 ring-inset ring-accent/20">
              Professional Hardware Suppliers
            </motion.span>
            
            <motion.h1 variants={fadeIn} className="font-heading text-4xl font-extrabold uppercase tracking-tight text-white sm:text-6xl">
              Building South Africa's <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">Future</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="mx-auto mt-6 text-lg text-steel sm:text-xl leading-relaxed">
              More than just a store. We are the backbone for contractors, engineers, and serious DIYers who demand reliability.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* --- TRUST HIGHLIGHTS (Replaces Fake Numbers) --- */}
      <div className="border-y border-border bg-card">
        <div className="container">
          <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
            {trustHighlights.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-8 text-center transition-colors hover:bg-accent/5">
                <item.icon className="mb-3 h-8 w-8 text-accent" />
                <div className="font-bold text-foreground">{item.label}</div>
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- OUR STORY --- */}
      <section className="container py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.h2 variants={fadeIn} className="font-heading text-3xl font-bold uppercase text-foreground">
              Who We Are
            </motion.h2>
            <motion.div variants={fadeIn} className="h-1 w-20 bg-accent rounded-full" />
            
            <motion.div variants={fadeIn} className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                Tools Dynamic & Hardware started with a simple mission: to bridge the gap between industrial-grade manufacturing and the local South African market.
              </p>
              <p>
                We recognized that professionals were often forced to choose between overpriced imported tools or cheap, unreliable alternatives. We stepped in to offer a third option: <strong className="text-foreground">Professional reliability at fair market prices.</strong>
              </p>
              <p>
                Today, we serve a diverse clientele ranging from large-scale construction firms to the weekend warrior renovating their home.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="pt-4">
               <ul className="space-y-3">
                 {[
                   "SABS Approved Safety Gear", 
                   "Authorized Distributors", 
                   "Bulk Trade Accounts Available"
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                     <CheckCircle2 className="h-5 w-5 text-accent" /> {item}
                   </li>
                 ))}
               </ul>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-xl bg-accent/20 blur-2xl -z-10" />
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop" 
              alt="Tools collection" 
              className="relative rounded-xl shadow-2xl ring-1 ring-white/10"
            />
             {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 rounded-lg bg-navy p-6 shadow-xl border border-white/10 max-w-xs hidden sm:block">
              <p className="font-heading text-lg font-bold text-white uppercase">Ready to work?</p>
              <p className="text-sm text-steel">Get your equipment delivered straight to site.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- CORE VALUES --- */}
      <section className="bg-muted/30 py-24">
        <div className="container">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-3xl font-bold uppercase text-foreground">Our Core Values</h2>
            <p className="mt-4 text-muted-foreground">The principles that drive our business every single day.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((item, index) => (
              <motion.div 
                key={item.title} 
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-background p-8 shadow-sm transition-all hover:border-accent/50 hover:shadow-lg"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-navy transition-colors duration-300">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 font-heading text-lg font-bold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- WHY CHOOSE US (Dark Section) --- */}
      <section className="py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-navy px-6 py-16 text-white sm:px-12 lg:px-20 shadow-2xl">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"></div>

            <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="font-heading text-3xl font-bold uppercase tracking-tight">Why Pros Choose Us</h2>
                <p className="mt-6 text-lg text-steel">
                  In the construction and hardware industry, downtime costs money. We have optimized our logistics to ensure you get what you need, when you need it.
                </p>
                
                <div className="mt-8 space-y-6">
                  {[
                    { icon: Truck, text: "Fast shipping to all 9 provinces" },
                    { icon: Clock, text: "Same-day dispatch for orders before 12pm" },
                    { icon: Wrench, text: "Warranty support on all power tools" },
                    { icon: Phone, text: "Direct line to human support agents" },
                  ].map((feature, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-accent ring-1 ring-white/10">
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-gray-200">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                <h3 className="font-heading text-xl font-bold uppercase text-white">Need a custom quote?</h3>
                <p className="mt-2 text-sm text-steel">
                  For large construction projects or bulk retail stocking, we offer specialized pricing tiers.
                </p>
                <Link 
                  to="/contact" 
                  className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded bg-accent px-6 py-3 font-bold text-navy transition-all hover:bg-accent/90"
                >
                  Contact Sales Team <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default About;