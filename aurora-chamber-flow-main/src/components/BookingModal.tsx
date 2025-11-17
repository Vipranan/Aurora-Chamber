import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { bookingsAPI } from "@/lib/api";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  chamber: string;
  date: string;
  timeSlot: string | null;
  onSuccess: () => void;
}

const BookingModal = ({ isOpen, onClose, chamber, date, timeSlot, onSuccess }: BookingModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    antenna: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!timeSlot) {
      toast.error("Please select a time slot");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await bookingsAPI.create({
        chamber,
        date,
        timeSlot,
        name: formData.name,
        email: formData.email,
        company: formData.company,
        antenna: formData.antenna,
      });
      
      toast.success("Booking confirmed successfully!", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "rgba(20, 30, 50, 0.95)",
          backdropFilter: "blur(20px)",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "12px",
          padding: "16px",
        },
      });
      
      onSuccess();
      onClose();
      setFormData({ name: "", email: "", company: "", antenna: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "rgba(50, 20, 20, 0.95)",
          backdropFilter: "blur(20px)",
          color: "#fff",
          border: "1px solid rgba(255, 100, 100, 0.2)",
          borderRadius: "12px",
          padding: "16px",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-card p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">Complete Booking</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 p-4 glass rounded-xl">
                <p className="text-sm text-white/70">Chamber: <span className="text-white font-medium">{chamber}</span></p>
                <p className="text-sm text-white/70 mt-1">Date: <span className="text-white font-medium">{date}</span></p>
                {timeSlot && (
                  <p className="text-sm text-white/70 mt-1">Time: <span className="text-white font-medium">{timeSlot}</span></p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Name</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass border-white/20 focus:border-primary"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Email</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="glass border-white/20 focus:border-primary"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Company</label>
                  <Input
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="glass border-white/20 focus:border-primary"
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Antenna Name</label>
                  <Input
                    required
                    value={formData.antenna}
                    onChange={(e) => setFormData({ ...formData, antenna: e.target.value })}
                    className="glass border-white/20 focus:border-primary"
                    placeholder="Antenna identifier"
                  />
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-medium rounded-xl"
                  >
                    Confirm Booking
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
