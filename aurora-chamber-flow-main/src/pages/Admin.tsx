import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuroraBackground from "@/components/AuroraBackground";
import { toast } from "react-hot-toast";

interface Booking {
  id: number;
  chamber: string;
  date: string;
  timeSlot: string;
  name: string;
  email: string;
  company: string;
  antenna: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("23/04/2024");
  
  // Mock bookings data
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      chamber: "Chamber 1",
      date: "23/04/2024",
      timeSlot: "08:00 - 10:00",
      name: "John Doe",
      email: "john@example.com",
      company: "Tech Corp",
      antenna: "ANT-001",
    },
    {
      id: 2,
      chamber: "Chamber 2",
      date: "23/04/2024",
      timeSlot: "11:00 - 14:00",
      name: "Jane Smith",
      email: "jane@example.com",
      company: "Innovation Labs",
      antenna: "ANT-002",
    },
  ]);

  const handleCancelBooking = (id: number) => {
    setBookings(bookings.filter(booking => booking.id !== id));
    toast.success("Booking cancelled successfully", {
      duration: 3000,
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
  };

  const filteredBookings = bookings.filter(booking => booking.date === selectedDate);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AuroraBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/")}
            className="glass px-6 py-3 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </motion.button>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold"
          >
            Admin Dashboard
          </motion.h1>
          
          <div className="w-32" /> {/* Spacer for centering */}
        </div>

        {/* Date Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8 max-w-md"
        >
          <label className="block text-sm font-medium mb-3 text-white/80">
            Filter by Date
          </label>
          <div className="relative">
            <input
              type="text"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full glass px-6 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="DD/MM/YYYY"
            />
            <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
          </div>
        </motion.div>

        {/* Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8"
        >
          <h2 className="text-2xl font-semibold mb-6">
            All Bookings {selectedDate && `for ${selectedDate}`}
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/80 font-medium">Chamber</th>
                  <th className="text-left py-4 px-4 text-white/80 font-medium">Date</th>
                  <th className="text-left py-4 px-4 text-white/80 font-medium">Time</th>
                  <th className="text-left py-4 px-4 text-white/80 font-medium">Name</th>
                  <th className="text-left py-4 px-4 text-white/80 font-medium">Company</th>
                  <th className="text-left py-4 px-4 text-white/80 font-medium">Antenna</th>
                  <th className="text-left py-4 px-4 text-white/80 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4 text-white">{booking.chamber}</td>
                    <td className="py-4 px-4 text-white">{booking.date}</td>
                    <td className="py-4 px-4 text-white">{booking.timeSlot}</td>
                    <td className="py-4 px-4 text-white">{booking.name}</td>
                    <td className="py-4 px-4 text-white">{booking.company}</td>
                    <td className="py-4 px-4 text-white">{booking.antenna}</td>
                    <td className="py-4 px-4">
                      <Button
                        onClick={() => handleCancelBooking(booking.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-white/50">
                      No bookings found for this date
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
