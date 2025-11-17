import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuroraBackground from "@/components/AuroraBackground";
import BookingForm from "@/components/BookingForm";
import BookingsList from "@/components/BookingsList";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const Index = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentDate] = useState(new Date());

  const handleBookingSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AuroraBackground />
      <Toaster />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold"
          >
            NSI Chamber<br />Booking
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              onClick={() => navigate("/admin")}
              className="glass px-8 py-6 text-lg font-medium rounded-2xl hover:bg-white/20 transition-all"
            >
              Admin
            </Button>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 max-w-7xl mx-auto">
          <div className="w-full lg:w-auto lg:flex-1 max-w-2xl">
            <BookingForm onBookingSuccess={handleBookingSuccess} />
          </div>
          <div className="w-full lg:w-auto lg:flex-1 max-w-2xl">
            <BookingsList date={format(currentDate, "dd/MM/yyyy")} refreshKey={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
