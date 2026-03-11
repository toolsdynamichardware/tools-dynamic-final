import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet as WalletIcon, PlusCircle, Loader2, CreditCard } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

declare global {
    interface Window {
        YocoSDK: any;
    }
}

const Wallet = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [balance, setBalance] = useState<number>(0);
    const [topupAmount, setTopupAmount] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchWallet = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/login");
                return;
            }
            setUser(session.user);

            // Fetch current balance
            const { data } = await supabase
                .from("wallets")
                .select("balance")
                .eq("user_id", session.user.id)
                .maybeSingle();

            if (data) {
                setBalance(data.balance);
            }
            setLoading(false);
        };

        fetchWallet();
    }, [navigate]);

    const handleTopUp = async (e: React.FormEvent) => {
        e.preventDefault();

        const amount = parseFloat(topupAmount);
        if (isNaN(amount) || amount < 10) {
            toast.error("Minimum top-up amount is R10.");
            return;
        }

        setIsProcessing(true);

        try {
            if (!window.YocoSDK) {
                toast.error("Payment gateway is loading. Please refresh and try again.");
                setIsProcessing(false);
                return;
            }

            const yoco = new window.YocoSDK({
                publicKey: "pk_test_84401d9eP41gR3b4e4c4",
            });

            yoco.showPopup({
                amountInCents: Math.round(amount * 100),
                currency: 'ZAR',
                name: 'Tools Dynamic Wallet',
                description: 'Wallet Top-Up',
                callback: async (result: any) => {
                    if (result.error) {
                        toast.error(`Payment failed: ${result.error.message}`);
                        setIsProcessing(false);
                    } else {
                        try {
                            toast.loading("Securing funds...");

                            // 1. Process payment via Edge Function
                            const { data: chargeData, error: chargeError } = await supabase.functions.invoke('yoco-charge', {
                                body: { token: result.id, amountInCents: Math.round(amount * 100) }
                            });

                            if (chargeError || (chargeData && chargeData.status !== "successful")) {
                                throw new Error(chargeData?.error || "Payment declined by the bank.");
                            }

                            // 2. Success! Add funds to the database
                            const newBalance = balance + amount;
                            const { error: dbError } = await supabase
                                .from('wallets')
                                .update({ balance: newBalance, updated_at: new Date() })
                                .eq('user_id', user.id);

                            if (dbError) throw dbError;

                            // 3. Update UI
                            setBalance(newBalance);
                            setTopupAmount("");
                            toast.dismiss();
                            toast.success(`Successfully added R${amount.toFixed(2)} to your wallet!`);

                        } catch (err: any) {
                            console.error("Wallet top-up error:", err);
                            toast.dismiss();
                            toast.error(err.message || "Something went wrong updating your wallet.");
                        }
                    }
                    setIsProcessing(false);
                }
            });

        } catch (error: any) {
            console.error("Popup crash:", error);
            toast.error("Could not open the payment gateway.");
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
            </main>
        );
    }

    return (
        <main className="bg-slate-50 min-h-screen py-12">
            <div className="container max-w-md mx-auto">
                <Link to="/account" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Account
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">

                    {/* Header Section */}
                    <div className="bg-navy p-8 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-white/10 h-24 w-24 rounded-full blur-xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 bg-accent/20 h-24 w-24 rounded-full blur-xl"></div>

                        <WalletIcon className="h-10 w-10 mx-auto text-accent mb-4 relative z-10" />
                        <h1 className="text-sm font-bold uppercase tracking-widest text-white/80 relative z-10">Available Balance</h1>
                        <p className="mt-2 text-4xl font-black relative z-10">R{balance.toFixed(2)}</p>
                    </div>

                    {/* Top-up Form Section */}
                    <div className="p-8">
                        <h2 className="font-heading text-lg font-bold uppercase text-navy mb-4 flex items-center gap-2">
                            <PlusCircle className="h-5 w-5 text-accent" /> Fund Wallet
                        </h2>

                        <form onSubmit={handleTopUp} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                                    Amount to Add (ZAR)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">R</span>
                                    <input
                                        type="number"
                                        min="10"
                                        step="0.01"
                                        required
                                        value={topupAmount}
                                        onChange={(e) => setTopupAmount(e.target.value)}
                                        className="w-full rounded-lg border border-input bg-slate-50 py-3 pl-8 pr-4 font-bold text-navy focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Quick Select Buttons */}
                            <div className="grid grid-cols-3 gap-2">
                                {[50, 200, 500].map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setTopupAmount(preset.toString())}
                                        className="rounded border border-border bg-white py-2 text-sm font-bold text-muted-foreground hover:border-accent hover:text-accent transition-colors"
                                    >
                                        +R{preset}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing || !topupAmount}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-4 font-heading text-sm font-bold uppercase tracking-wider text-navy transition-all hover:bg-accent/90 disabled:opacity-50 hover:shadow-lg"
                            >
                                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CreditCard className="h-5 w-5" /> Proceed to Pay</>}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </main>
    );
};

export default Wallet;