import { motion } from "framer-motion";

interface Booking {
  id: number;
  chamber: string;
  timeSlot: string;
}

interface BookingsListProps {
  date: string;
  bookings: Booking[];
}

const BookingsList = ({ date, bookings }: BookingsListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-8 w-full max-w-2xl"
    >
      <h2 className="text-2xl font-semibold mb-6">Bookings for {date}</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-4 text-white/80 font-medium">Chamber</th>
              <th className="text-left py-4 px-4 text-white/80 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <motion.tr
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-4 text-white">{booking.chamber}</td>
                <td className="py-4 px-4 text-white">{booking.timeSlot}</td>
              </motion.tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={2} className="py-8 text-center text-white/50">
                  No bookings for this date
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default BookingsList;
