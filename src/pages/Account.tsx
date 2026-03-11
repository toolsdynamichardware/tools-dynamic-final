import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, LogOut, Package, Heart, MapPin, Calendar, ChevronDown, ChevronUp, Wallet, PlusCircle, Building2, Save, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

// Define the shape of our order data
interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  items: any[];
  shipping_details: any;
}

const Account = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // -- UI States --
  const [activeTab, setActiveTab] = useState<'orders' | 'company'>('orders');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // -- Data States --
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [companyData, setCompanyData] = useState({
    company_name: '',
    registration_number: '',
    vat_number: '',
    address: '',
    contact_number: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      // 1. Get the logged-in user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);

      // 2. Fetch Wallet Balance
      const { data: walletData } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (walletData) {
        setWalletBalance(walletData.balance);
      } else {
        await supabase.from("wallets").insert([{ user_id: session.user.id, balance: 0 }]);
        setWalletBalance(0);
      }

      // 3. Fetch Company Details
      const { data: companyRes } = await supabase
        .from("company_details")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (companyRes) {
        setCompanyData(companyRes);
      }

      // 4. Fetch Order History
      const { data: orderData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error && orderData) {
        setOrders(orderData);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-ZA', options);
  };

  // Save company details back to Supabase
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase.from('company_details').upsert({
        user_id: user.id,
        ...companyData,
        updated_at: new Date()
      });

      if (error) throw error;
      toast.success("Company details saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save company details.");
    } finally {
      setIsSaving(false);
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
      <div className="container max-w-6xl">
        <h1 className="font-heading text-3xl font-bold uppercase text-navy mb-8">My Dashboard</h1>

        <div className="grid gap-8 md:grid-cols-4">

          {/* LEFT SIDEBAR */}
          <div className="md:col-span-1 space-y-6">

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-4">
                <User className="h-8 w-8 text-accent" />
              </div>
              <h2 className="font-bold text-sm text-foreground truncate">{user?.email}</h2>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">
                {companyData.company_name ? 'Trade Account' : 'Customer'}
              </p>

              <button
                onClick={handleLogout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>

            {/* Wallet Card */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-100 mb-3">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">Wallet Balance</h3>
              <p className="mt-1 font-heading text-2xl font-black text-navy">
                R{walletBalance.toFixed(2)}
              </p>

              <Link
                to="/wallet"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-navy/90"
              >
                <PlusCircle className="h-3 w-3" /> Fund Wallet
              </Link>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden flex flex-col">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-3 p-4 transition-colors border-b border-border text-sm ${activeTab === 'orders' ? 'bg-slate-50 text-accent font-bold border-l-4 border-l-accent' : 'hover:bg-slate-50 text-muted-foreground font-medium'}`}
              >
                <Package className="h-5 w-5" /> My Orders
              </button>

              <button
                onClick={() => setActiveTab('company')}
                className={`flex items-center gap-3 p-4 transition-colors border-b border-border text-sm ${activeTab === 'company' ? 'bg-slate-50 text-accent font-bold border-l-4 border-l-accent' : 'hover:bg-slate-50 text-muted-foreground font-medium'}`}
              >
                <Building2 className="h-5 w-5" /> Company Details
              </button>

              <Link to="/wishlist" className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-border text-sm font-medium text-muted-foreground">
                <Heart className="h-5 w-5 text-navy" /> My Wishlist
              </Link>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-border p-6 h-full min-h-[500px]">

              {/* --- TAB: ORDER HISTORY --- */}
              {activeTab === 'orders' && (
                <>
                  <h2 className="font-heading text-xl font-bold uppercase text-navy mb-6">Order History</h2>

                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-lg">
                      <Package className="h-12 w-12 text-slate-300 mb-4" />
                      <h3 className="text-lg font-bold text-slate-700">No orders yet</h3>
                      <p className="text-sm text-slate-500 mt-2 max-w-sm">When you complete a purchase, your order history and tracking information will appear here.</p>
                      <Link to="/shop" className="mt-6 rounded bg-navy px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-accent hover:text-navy">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-border rounded-lg overflow-hidden transition-all">
                          <button
                            onClick={() => toggleOrder(order.id)}
                            className="w-full flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-4 text-left hover:bg-slate-100 transition-colors"
                          >
                            <div>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                Order #{order.id.split('-')[0]}
                              </p>
                              <div className="flex items-center gap-2 text-sm font-medium text-navy">
                                <Calendar className="h-4 w-4" /> {formatDate(order.created_at)}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                              <span className="font-heading text-lg font-bold text-foreground">
                                R{order.total_amount.toFixed(2)}
                              </span>
                              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                {order.status}
                              </span>
                              {expandedOrder === order.id ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                            </div>
                          </button>

                          {expandedOrder === order.id && (
                            <div className="p-4 bg-white border-t border-border">
                              <div className="mb-6 space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-3">Items</h4>
                                {order.items.map((item: any, idx: number) => (
                                  <div key={idx} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                      <span className="font-medium text-foreground">{item.quantity}x</span>
                                      <span className="text-muted-foreground">{item.product.name} {item.selectedSize ? `(${item.selectedSize})` : ''}</span>
                                    </div>
                                    <span className="font-medium">R{(item.product.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>

                              {order.shipping_details && (
                                <div>
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2 mb-3">Delivery Address</h4>
                                  <div className="flex items-start gap-2 text-sm text-muted-foreground bg-slate-50 p-3 rounded-md">
                                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
                                    <div>
                                      <p className="font-bold text-foreground">{order.shipping_details.fullName}</p>
                                      <p>{order.shipping_details.phone}</p>
                                      <p>{order.shipping_details.address}</p>
                                      <p>{order.shipping_details.city}, {order.shipping_details.province}</p>
                                      <p>{order.shipping_details.postalCode}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* --- TAB: COMPANY DETAILS --- */}
              {activeTab === 'company' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="mb-6 border-b border-border pb-4">
                    <h2 className="font-heading text-xl font-bold uppercase text-navy flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-accent" /> Trade Account Details
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Register your company details here. Verified trade accounts may be eligible for bulk hardware discounts.</p>
                  </div>

                  <form onSubmit={handleSaveCompany} className="space-y-5 max-w-2xl">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Registered Company Name</label>
                        <input
                          type="text"
                          value={companyData.company_name}
                          onChange={e => setCompanyData({ ...companyData, company_name: e.target.value })}
                          placeholder="e.g. Dynamic Build PTY LTD"
                          className="w-full rounded border border-input px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Reg Number (CIPC)</label>
                        <input
                          type="text"
                          value={companyData.registration_number}
                          onChange={e => setCompanyData({ ...companyData, registration_number: e.target.value })}
                          placeholder="e.g. 2020/123456/07"
                          className="w-full rounded border border-input px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">VAT Number (Optional)</label>
                        <input
                          type="text"
                          value={companyData.vat_number}
                          onChange={e => setCompanyData({ ...companyData, vat_number: e.target.value })}
                          placeholder="e.g. 4123456789"
                          className="w-full rounded border border-input px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business Contact Number</label>
                        <input
                          type="tel"
                          value={companyData.contact_number}
                          onChange={e => setCompanyData({ ...companyData, contact_number: e.target.value })}
                          placeholder="011 000 0000"
                          className="w-full rounded border border-input px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business Address</label>
                      <textarea
                        rows={3}
                        value={companyData.address}
                        onChange={e => setCompanyData({ ...companyData, address: e.target.value })}
                        placeholder="Full registered street address..."
                        className="w-full rounded border border-input px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 rounded bg-navy px-6 py-3 font-heading text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-navy/90 hover:shadow-md disabled:opacity-70"
                      >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Company Details
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Account;