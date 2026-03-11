import { motion } from "framer-motion";
import { ShieldCheck, Eye, Share2, Lock, UserCircle, Mail } from "lucide-react";

const Privacy = () => {
    const sections = [
        { id: "collection", title: "Data Collection", icon: Eye },
        { id: "usage", title: "How We Use Data", icon: UserCircle },
        { id: "sharing", title: "Third-Party Sharing", icon: Share2 },
        { id: "security", title: "Data Security", icon: Lock },
        { id: "rights", title: "Your Rights", icon: ShieldCheck },
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
                        Privacy Policy
                    </motion.h1>
                    <p className="mt-4 text-steel opacity-80">Effective Date: March 2026</p>
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

                            <section id="commitment">
                                <h2 className="font-heading text-2xl font-bold text-navy mb-4">1. Commitment to Privacy</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Tools Dynamic & Hardware is committed to protecting the privacy and personal information of our customers. This policy explains how we collect, use, and safeguard your data in compliance with the <strong>Protection of Personal Information Act (POPIA)</strong> of South Africa.
                                </p>
                            </section>

                            <section id="collection">
                                <div className="flex items-center gap-3 mb-4">
                                    <Eye className="h-6 w-6 text-accent" />
                                    <h2 className="font-heading text-2xl font-bold text-navy">2. Information We Collect</h2>
                                </div>
                                <p className="text-muted-foreground mb-4 font-medium">To provide our services, we collect the following personal information:</p>
                                <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
                                    <li><strong>Identity Information:</strong> Full name and account login details.</li>
                                    <li><strong>Contact Information:</strong> Email address and phone number.</li>
                                    <li><strong>Delivery Information:</strong> Physical address for tool shipments.</li>
                                    <li><strong>Financial Information:</strong> Records of your <strong>Digital Wallet balance</strong> and top-up history. (Note: We do not store credit card numbers).</li>
                                </ul>
                            </section>

                            <section id="usage">
                                <div className="flex items-center gap-3 mb-4">
                                    <UserCircle className="h-6 w-6 text-accent" />
                                    <h2 className="font-heading text-2xl font-bold text-navy">3. How We Use Data</h2>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    Your data is used strictly to fulfill orders, manage your Digital Wallet balance, and provide customer support. We may also use your contact details to send important updates regarding your shipments.
                                </p>
                            </section>

                            <section id="sharing">
                                <div className="flex items-center gap-3 mb-4">
                                    <Share2 className="h-6 w-6 text-accent" />
                                    <h2 className="font-heading text-2xl font-bold text-navy">4. Third-Party Sharing</h2>
                                </div>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    We only share your information with essential service providers to complete your purchase:
                                </p>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-border">
                                        <p className="font-bold text-navy text-sm">The Courier Guy</p>
                                        <p className="text-xs text-muted-foreground">For delivery logistics and tracking.</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-border">
                                        <p className="font-bold text-navy text-sm">Yoco</p>
                                        <p className="text-xs text-muted-foreground">Secure payment processing (POPI compliant).</p>
                                    </div>
                                </div>
                            </section>

                            <section id="security">
                                <div className="flex items-center gap-3 mb-4">
                                    <Lock className="h-6 w-6 text-accent" />
                                    <h2 className="font-heading text-2xl font-bold text-navy">5. Data Security</h2>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    We implement high-level encryption and security measures via **Supabase** to ensure your personal data and wallet balance are protected from unauthorized access.
                                </p>
                            </section>

                            <section id="contact">
                                <div className="flex items-center gap-3 mb-4">
                                    <Mail className="h-6 w-6 text-accent" />
                                    <h2 className="font-heading text-2xl font-bold text-navy">6. Contact Us</h2>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    If you have any questions regarding your data, please reach out to our information officer at <span className="font-bold text-navy">support@toolsdynamic.co.za</span>.
                                </p>
                            </section>

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Privacy;