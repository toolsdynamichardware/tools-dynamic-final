import { useState } from "react";
import { supabase } from "@/lib/supabase"; 
import { Shield, Loader2, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Redirect to shop after successful login
      navigate("/shop");
    } catch (error: any) {
      setMessage({ text: error.message || "Invalid login credentials", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-border">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Shield className="h-6 w-6 text-accent" />
          </div>
          <h2 className="mt-6 font-heading text-3xl font-bold uppercase tracking-tight text-navy">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your orders and wishlist
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {message && (
            <div className={`p-4 rounded-md text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
              {message.text}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-10 py-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-10 py-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-8 py-3 font-heading text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-navy/90 hover:shadow-lg disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
          </button>
        </form>

        {/* Link to Register */}
        <div className="text-center mt-4">
          <Link
            to="/register"
            className="text-sm font-medium text-accent hover:underline"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
        
        <div className="mt-4 text-center">
             <Link to="/" className="text-xs text-muted-foreground hover:text-navy">← Return to Home</Link>
        </div>
      </div>
    </main>
  );
};

export default Login;