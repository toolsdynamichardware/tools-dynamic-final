import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthPopup = ({ isOpen, onClose }: AuthPopupProps) => {
  const navigate = useNavigate();

  // Prevent clicks inside the white modal box from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/80 p-4 backdrop-blur-sm" 
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={handleModalClick}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-8 text-center shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-navy"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Content */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <Heart className="h-8 w-8 text-accent fill-accent" />
            </div>
            <h3 className="font-heading text-2xl font-bold uppercase text-navy">Save Your Favorites</h3>
            <p className="mt-2 text-sm text-slate-500">
              Create a free account or log in to save tools to your wishlist and access them on any device.
            </p>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full rounded-lg bg-navy px-4 py-3 font-heading text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-navy/90"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="w-full rounded-lg bg-accent px-4 py-3 font-heading text-sm font-bold uppercase tracking-wider text-navy transition-colors hover:bg-accent/90"
              >
                Create Account
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthPopup;