import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 
import { Lock, Loader2, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

  useEffect(() => {
    // Optional check: Make sure they actually clicked an email link and have a temporary session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If they just navigated here directly without clicking the email link, send them away
        navigate("/login");
      }
    };
    checkSession();
  }, [navigate]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Supabase knows WHICH user to update because clicking the email link logged them in
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      
      if (error) throw error;
      
      setMessage({ 
        text: "Password updated successfully! Redirecting you to the shop...", 
        type: "success" 
      });
      
      // Clear the input
      setPassword("");
      
      // Redirect them to the shop after a short delay so they can read the success message
      setTimeout(() => {
        navigate("/shop");
      }, 2000);
      
    } catch (error: any) {
      setMessage({ text: error.message || "Failed to update password", type: "error" });
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
            <KeyRound className="h-6 w-6 text-accent" />
          </div>
          <h2 className="mt-6 font-heading text-3xl font-bold uppercase tracking-tight text-navy">
            Set New Password
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please enter your new secure password below.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleUpdatePassword}>
          {message && (
            <div className={`p-4 rounded-md text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
              {message.text}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-10 py-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="New Password (min 6 characters)"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-8 py-3 font-heading text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-navy/90 hover:shadow-lg disabled:opacity-70"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
          </button>
        </form>

      </div>
    </main>
  );
};

export default UpdatePassword;