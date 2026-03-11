import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you shortly.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="bg-slate-50 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="bg-slate-900 py-16 text-center">
        <div className="container">
          <h1 className="font-heading text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Have a question about a product or need a quote? Our team is ready to help.
          </p>
        </div>
      </div>

      <div className="container py-12 -mt-8 relative z-10">
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* LEFT COLUMN: Contact Info & Map */}
          <div className="space-y-8 lg:col-span-1">
            
            {/* Contact Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase text-muted-foreground">Call Us</p>
                    <p className="font-medium text-foreground">+27 (0) 11 000 0000</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase text-muted-foreground">Email Us</p>
                    <p className="font-medium text-foreground">sales@toolsdynamic.co.za</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase text-muted-foreground">Visit Us</p>
                    <p className="font-medium text-foreground">123 Industrial Rd, Germiston</p>
                    <p className="text-sm text-muted-foreground">Johannesburg, Gauteng</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="rounded-xl bg-slate-800 p-6 text-white shadow-lg">
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold uppercase tracking-wider">
                <Clock className="h-5 w-5 text-blue-400" /> Business Hours
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Monday – Friday</span>
                  <span className="font-bold text-white">07:30 – 17:00</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Saturday</span>
                  <span className="font-bold text-white">08:00 – 13:00</span>
                </div>
                <div className="flex justify-between text-red-300">
                  <span>Sunday & Holidays</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Map & Form */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* GOOGLE MAP IFRAME */}
            <div className="h-64 w-full overflow-hidden rounded-xl border border-border shadow-sm lg:h-80">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114584.72366838048!2d28.04002454641974!3d-26.17152158223652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950c68f0406a51%3A0x238ac9d9b1d34041!2sJohannesburg%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1689600000000!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>

            {/* CONTACT FORM */}
            <div className="rounded-xl border border-border bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <h2 className="font-heading text-xl font-bold uppercase text-foreground">Send a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Product Enquiry / Quote Request"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Message <span className="text-red-500">*</span></label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    placeholder="How can we help you today?"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 font-heading text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;