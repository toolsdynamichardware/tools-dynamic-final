import { motion } from "framer-motion";
import { FileText, ShieldCheck, Scale, Truck, RotateCcw, Wallet } from "lucide-react";

const Terms = () => {
    const sections = [
        { id: "delivery", title: "Nationwide Delivery", icon: Truck },
        { id: "refunds", title: "Refund Policy", icon: RotateCcw },
        { id: "wallet", title: "Digital Wallet", icon: Wallet },
        { id: "liability", title: "Limitation of Liability", icon: Scale },
        { id: "privacy", title: "Privacy & Data", icon: ShieldCheck },
    ];

    return (
        <main className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-navy py-16 text-white text-center">
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-heading text-4xl font-bold uppercase tracking-tight"
                    >
                        Terms & Conditions
                    </motion.h1>
                    <p className="mt-4 text-steel opacity-80">Last Updated: March 2026</p>
                </div>
            </div>

            <div className="container mt-12">
                <div className="grid gap-12 lg:grid-cols-4">

                    {/* Sidebar Navigation */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-1">
                            {sections.map((sec) => (
                                <a
                                    key={sec.id}
                                    href={`#${sec.id}`}
                                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-muted-foreground transition-all hover:bg-white hover:text-accent hover:shadow-sm"
                                >
                                    <sec.icon className="h-4 w-4" />
                                    {sec.title}
                                </a>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm space-y-12">

                            <section id="introduction">
                                <h2 className="font-heading text-2xl font-bold text-navy mb-4">1. Introduction</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Welcome to Tools Dynamic & Hardware. By using our website and purchasing our products, you agree to be bound by the following terms and conditions. These terms apply to all users of the site, including browsers, customers, and merchants.
                                </p>
                            </section>

                            <section id="delivery">
                                <div className="flex items-center gap-3 mb-4">
                                    <Truck className="h-6 w-6 text-accent" />
                                    <h2 className="font-heading text-2xl font-bold text-navy">2. Nationwide Delivery Policy</h2>
                                </div>
                                <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
                                    <li><strong>Flat Rate:</strong> We charge a standard flat rate of <strong>R150.00</strong> for door-to-door delivery across South Africa via <em>The Courier Guy</em>.</li>
                                    <li><strong>Free Delivery:</strong> Orders exceeding <strong>R1,500.00</strong> qualify for free delivery.</li>
                                    <li><strong>Lead Times:</strong> We aim to deliver all tools within <strong>7 working days</strong>. The 7-day window allows for Economy Road transport to main centers like Cape Town and Durban.</li>
                                </ul>
                            </section>

                            <section id="refunds">
                                <div className="flex items-center gap-3 mb-4">
                                    <RotateCcw className="h-6 w-6 text-accent" />
                                    <h2 className="font-heading text-2xl font-bold text-navy">3. Refund & Return Policy</h2>
                                </div>
                                <div className="rounded-xl bg-orange-50 border border-orange-100 p-6">
                                    <p className="font-bold text-orange-800 mb-2">Digital Wallet System Notice:</p>
                                    <p className="text-orange-900/80 leading-relaxed">
                                        By purchasing from Tools Dynamic & Hardware, you acknowledge our <strong>Store Credit Refund Policy</strong>. We do not offer cash, card, or EFT refunds for "change of mind" returns. All approved refunds are issued as <strong>Digital Wallet Credits</strong>.
                                    </p>
                                </div>
                            </section>

                            <section id="wallet">
                                <div className="flex items-center gap-3 mb-4">
                                    <Wallet className="h-6 w-6 text-accent" />
                                    <h2 className="font-heading text-2xl font-bold text-navy">4. Digital Wallet Terms</h2>
                                </div>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Wallet credits never expire and can be used for any future purchase. Note that wallet balances are <strong>non-transferable</strong> and cannot be withdrawn as cash.
                                </p>
                            </section>

                            <section id="liability">
                                <div className="flex items-center gap-3 mb-4">
                                    <Scale className="h-6 w-6 text-accent" />
                                    <h2 className="font-heading text-2xl font-bold text-navy">5. Limitation of Liability</h2>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    Tools Dynamic & Hardware shall not be liable for any injury, loss, or damage resulting from the misuse of professional tools. It is the customer's responsibility to ensure they have the necessary safety equipment and training.
                                </p>
                            </section>

                            <section id="privacy">
                                <div className="flex items-center gap-3 mb-4">
                                    <ShieldCheck className="h-6 w-6 text-accent" />
                                    <h2 className="font-heading text-2xl font-bold text-navy">6. Privacy & Data</h2>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    We value your privacy. All data collected during checkout is handled in accordance with the <strong>South African POPI Act</strong>. For full details, please refer to our <a href="/privacy" className="text-accent hover:underline font-bold">Privacy Policy</a>.
                                </p>
                            </section>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Terms;