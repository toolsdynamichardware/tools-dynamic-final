import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, ArrowLeft, Loader2, MapPin, CreditCard, Wallet, CheckCircle, Building2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { toast } from "sonner";

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [useWallet, setUseWallet] = useState(false);

  const [isCompany, setIsCompany] = useState(false);
  const [shipping, setShipping] = useState({
    fullName: "", phone: "", address: "", city: "", province: "", postalCode: "",
    companyName: "", companyRegistration: "", vatNumber: ""
  });

  const finalTotal = totalPrice + (totalPrice >= 1500 ? 0 : 150);
  const progressPercentage = Math.min((totalPrice / 1500) * 100, 100);
  const amountAway = (1500 - totalPrice).toFixed(2);
  const walletDeduction = useWallet ? Math.min(walletBalance, finalTotal) : 0;
  const amountToPay = finalTotal - walletDeduction;

  const handleProceedToShipping = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please log in to complete your purchase.");
      navigate("/login");
      return;
    }

    const { data } = await supabase.from('wallets').select('balance').eq('user_id', session.user.id).maybeSingle();
    if (data) setWalletBalance(data.balance);

    setCheckoutStep(2);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const finalShippingData = { ...shipping };
      if (!isCompany) {
        delete finalShippingData.companyName;
        delete finalShippingData.companyRegistration;
        delete finalShippingData.vatNumber;
      }

      // 1. IF WALLET COVERS ENTIRE PRICE
      if (amountToPay <= 0) {
        toast.loading("Processing payment via Wallet...");

        if (walletDeduction > 0) {
          const newBalance = walletBalance - walletDeduction;
          await supabase.from('wallets').update({ balance: newBalance, updated_at: new Date() }).eq('user_id', session.user.id);
        }

        const { error: dbError } = await supabase.from('orders').insert([{
          user_id: session.user.id,
          total_amount: finalTotal,
          status: 'Paid & Processing',
          items: items,
          shipping_details: finalShippingData,
          yoco_charge_id: null
        }]);

        if (dbError) throw dbError;

        toast.dismiss();
        toast.success("Payment successful using your Wallet Balance!");
        clearCart();
        navigate("/account");
        return;
      }

      // 2. YOCO V2 SECURE REDIRECT
      toast.loading("Preparing secure checkout...");

      // Save order as PENDING before redirecting
      const { data: orderData, error: dbError } = await supabase.from('orders').insert([{
        user_id: session.user.id,
        total_amount: finalTotal,
        status: 'Pending Payment',
        items: items,
        shipping_details: finalShippingData,
        yoco_charge_id: null
      }]).select().single();

      if (dbError) throw dbError;

      // Ask Edge Function for the Yoco URL
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('yoco-charge', {
        body: {
          amountInCents: Math.round(amountToPay * 100),
          currency: 'ZAR'
        }
      });

      if (checkoutError || !checkoutData?.redirectUrl) {
        // If Yoco fails, delete the pending order so they can try again cleanly
        if (orderData?.id) {
          await supabase.from('orders').delete().eq('id', orderData.id);
        }
        throw new Error(checkoutData?.error || "Failed to initialize secure checkout.");
      }

      // Success! Clear the cart and redirect to Yoco
      clearCart();
      window.location.href = checkoutData.redirectUrl;

    } catch (error: any) {
      console.error("Checkout crash:", error);
      toast.dismiss();
      toast.error(`Crash: ${error.message || "Could not open checkout."}`);
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="bg-background">
        <div className="container flex flex-col items-center py-24 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Your Cart is Empty</h1>
          <p className="mt-2 text-muted-foreground">Browse our products and add items to your cart.</p>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded bg-accent px-6 py-3 font-heading text-sm font-bold uppercase text-accent-foreground hover:bg-accent/90">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background pb-20">
      <div className="bg-navy py-8">
        <div className="container">
          <h1 className="font-heading text-3xl font-bold uppercase text-navy-foreground">
            {checkoutStep === 1 ? "Your Cart" : "Checkout"}
          </h1>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2">
            {checkoutStep === 1 && (
              <div className="mb-6 rounded-lg border border-accent/20 bg-accent/5 p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between text-sm font-bold">
                  <span className="text-navy uppercase tracking-wider text-xs">Free Delivery Goal</span>
                  <span className={totalPrice >= 1500 ? "text-green-600" : "text-navy"}>
                    {totalPrice >= 1500 ? (
                      <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Unlocked!</span>
                    ) : (
                      `R${amountAway} away from FREE shipping!`
                    )}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${totalPrice >= 1500 ? "bg-green-500" : "bg-accent"}`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            {checkoutStep === 1 && (
              <>
                <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                  {items.map((item, i) => (
                    <div key={item.product.id + (item.selectedSize || "")} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 ${i > 0 ? "border-t border-border" : ""}`}>
                      <img src={item.product.image} alt={item.product.name} className="h-20 w-20 rounded object-cover" />
                      <div className="flex-1">
                        <Link to={`/product/${item.product.id}`} className="font-heading text-sm font-bold text-card-foreground hover:text-accent">
                          {item.product.name}
                        </Link>
                        {item.selectedSize && <p className="text-xs text-muted-foreground mt-1">Size: {item.selectedSize}</p>}
                        <p className="mt-1 font-heading text-sm font-bold text-foreground">R{item.product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-4 self-start sm:self-auto mt-4 sm:mt-0">
                        <div className="flex items-center rounded border border-input">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2.5 py-1.5 text-sm text-foreground hover:bg-muted">−</button>
                          <span className="w-8 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2.5 py-1.5 text-sm text-foreground hover:bg-muted">+</button>
                        </div>
                        <span className="w-20 text-right font-heading text-sm font-bold text-foreground">
                          R{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-red-500 transition-colors" aria-label="Remove">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between">
                  <Link to="/shop" className="text-sm font-medium text-muted-foreground hover:text-navy flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Shop
                  </Link>
                  <button onClick={clearCart} className="text-sm font-medium text-muted-foreground hover:text-red-500">
                    Clear Cart
                  </button>
                </div>
              </>
            )}

            {checkoutStep === 2 && (
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10">
                    <MapPin className="h-5 w-5 text-navy" />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-bold uppercase text-foreground">Delivery Details</h2>
                    <p className="text-sm text-muted-foreground">Where should we send your tools?</p>
                  </div>
                </div>

                <form id="shipping-form" onSubmit={handlePayment} className="space-y-5">
                  <div className="rounded-lg border border-border bg-slate-50 p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCompany}
                        onChange={(e) => setIsCompany(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                      />
                      <div className="flex items-center gap-2 font-bold text-sm text-navy">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        I am buying for a registered company
                      </div>
                    </label>

                    {isCompany && (
                      <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Name *</label>
                          <input
                            required={isCompany}
                            type="text"
                            value={shipping.companyName || ""}
                            onChange={e => setShipping({ ...shipping, companyName: e.target.value })}
                            className="w-full rounded border border-input px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent bg-white"
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Reg Number *</label>
                            <input
                              required={isCompany}
                              type="text"
                              value={shipping.companyRegistration || ""}
                              onChange={e => setShipping({ ...shipping, companyRegistration: e.target.value })}
                              className="w-full rounded border border-input px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">VAT Number</label>
                            <input
                              type="text"
                              value={shipping.vatNumber || ""}
                              onChange={e => setShipping({ ...shipping, vatNumber: e.target.value })}
                              className="w-full rounded border border-input px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name *</label>
                      <input required type="text" value={shipping.fullName} onChange={e => setShipping({ ...shipping, fullName: e.target.value })} className="w-full rounded border border-input px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number *</label>
                      <input required type="tel" value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })} className="w-full rounded border border-input px-3 py-2 text-sm" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Street Address *</label>
                    <input required type="text" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} className="w-full rounded border border-input px-3 py-2 text-sm" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City *</label>
                      <input required type="text" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} className="w-full rounded border border-input px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Province *</label>
                      <select required value={shipping.province} onChange={e => setShipping({ ...shipping, province: e.target.value })} className="w-full rounded border border-input px-3 py-2 text-sm">
                        <option value="">Select</option>
                        <option value="Gauteng">Gauteng</option>
                        <option value="Western Cape">Western Cape</option>
                        <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                        <option value="Eastern Cape">Eastern Cape</option>
                        <option value="Free State">Free State</option>
                        <option value="Limpopo">Limpopo</option>
                        <option value="Mpumalanga">Mpumalanga</option>
                        <option value="North West">North West</option>
                        <option value="Northern Cape">Northern Cape</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Postal Code *</label>
                      <input required type="text" value={shipping.postalCode} onChange={e => setShipping({ ...shipping, postalCode: e.target.value })} className="w-full rounded border border-input px-3 py-2 text-sm" />
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-border bg-card p-6 h-fit shadow-sm sticky top-24">
            <h2 className="font-heading text-lg font-bold uppercase text-card-foreground">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Items ({items.reduce((acc, item) => acc + item.quantity, 0)})</span>
                <span>R{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{totalPrice >= 1500 ? <span className="text-green-600 font-bold">Free</span> : "R150.00"}</span>
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-heading text-lg font-bold text-foreground">
                  <span>Subtotal</span>
                  <span>R{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {checkoutStep === 2 && walletBalance > 0 && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-600"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-navy flex items-center gap-1">
                        <Wallet className="h-4 w-4" /> Use Wallet Balance
                      </span>
                      <span className="text-xs text-muted-foreground">Available: R{walletBalance.toFixed(2)}</span>
                    </div>
                  </label>
                </div>
              )}

              {checkoutStep === 2 && (
                <div className="mt-4 bg-slate-50 p-4 rounded-lg border border-border">
                  {useWallet && walletDeduction > 0 && (
                    <div className="flex justify-between text-green-600 font-medium text-sm mb-2">
                      <span>Wallet Applied</span>
                      <span>- R{walletDeduction.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-heading text-xl font-black text-navy border-t border-border pt-2 mt-2">
                    <span>Due Today</span>
                    <span>R{amountToPay.toFixed(2)}</span>
                  </div>
                </div>
              )}

            </div>

            {checkoutStep === 1 ? (
              <button
                onClick={handleProceedToShipping}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-navy py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-navy/90 hover:shadow-md"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="mt-6 space-y-4">
                <label className="flex items-start gap-2 cursor-pointer bg-slate-50 p-3 rounded border border-border">
                  <input
                    type="checkbox"
                    required
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <span className="text-xs text-muted-foreground">
                    I agree to the <Link to="/terms" target="_blank" className="text-accent hover:underline">Terms & Conditions</Link> and <Link to="/privacy" target="_blank" className="text-accent hover:underline">Privacy Policy</Link>.
                  </span>
                </label>

                <button
                  type="submit"
                  form="shipping-form"
                  disabled={isCheckingOut || !agreedToTerms}
                  className="flex w-full items-center justify-center gap-2 rounded bg-accent py-3.5 font-heading text-sm font-bold uppercase tracking-wider text-navy transition-all hover:bg-accent/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : amountToPay <= 0 ? (
                    <><Wallet className="h-4 w-4" /> Pay with Wallet</>
                  ) : (
                    <><CreditCard className="h-4 w-4" /> Pay R{amountToPay.toFixed(2)}</>
                  )}
                </button>
                <button
                  onClick={() => setCheckoutStep(1)}
                  disabled={isCheckingOut}
                  className="w-full text-center text-sm font-medium text-muted-foreground hover:text-navy transition-colors"
                >
                  ← Back to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;