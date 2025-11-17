import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuroraBackground from "@/components/AuroraBackground";
import { toast } from "react-hot-toast";
import { bookingsAPI, authAPI } from "@/lib/api";
import { format } from "date-fns";

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      authAPI.verifyToken(token)
        .then(res => {
          if (res.valid) setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem("adminToken");
        });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [selectedDate, isAuthenticated]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const formattedDate = format(selectedDate, "dd/MM/yyyy");
      const data = await bookingsAPI.getAll({ date: formattedDate });
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authAPI.login(email, password);
      localStorage.setItem("adminToken", res.token);
      setIsAuthenticated(true);
      toast.success("Login successful");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    }
  };

  const handleCancelBooking = async (id: number) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Authentication required");
      return;
    }
    try {
      await bookingsAPI.delete(id, token);
      setBookings(bookings.filter(booking => booking.id !== id));
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <AuroraBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 z-10 w-full max-w-sm"
        >
          <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@crescent.education"
              className="w-full glass px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full glass px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" className="w-full bg-primary py-3 rounded-lg">
              Login
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

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
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
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
            All Bookings {selectedDate && `for ${format(selectedDate, "dd/MM/yyyy")}`}
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-white/50">
                      Loading...
                    </td>
                  </tr>
                ) : bookings.map((booking, index) => (
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
                {bookings.length === 0 && !loading && (
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
