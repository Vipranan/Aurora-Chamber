import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { bookingsAPI } from "@/lib/api";

interface TimeSlot {
  time: string;
  isBooked: boolean;
}

interface TimeSlotGridProps {
  selectedChamber: string;
  selectedDate: Date;
  onSlotSelect: (time: string) => void;
}

const TimeSlotGrid = ({ selectedChamber, selectedDate, onSlotSelect }: TimeSlotGridProps) => {
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate time slots from 9:00 to 17:00 in 45-minute intervals
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    let hour = 9;
    let minute = 0;

    while (hour < 17 || (hour === 17 && minute === 0)) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Check if this slot is in the booked slots array
      const isBooked = bookedSlots.includes(time);
      
      slots.push({ time, isBooked });

      // Add 45 minutes
      minute += 45;
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
    }

    return slots;
  };

  // Fetch booked slots when chamber or date changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      setLoading(true);
      try {
        const formattedDate = format(selectedDate, "dd/MM/yyyy");
        const response = await bookingsAPI.getBookedSlots(selectedChamber, formattedDate);
        setBookedSlots(response.bookedSlots || []);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
        setBookedSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSlots();
  }, [selectedChamber, selectedDate]);

  const timeSlots = generateTimeSlots();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white/90">Select Time Slot</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500/50" />
            <span className="text-white/70">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="text-white/70">Booked</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {timeSlots.map((slot, index) => (
          <motion.button
            key={slot.time}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
            onClick={() => !slot.isBooked && onSlotSelect(slot.time)}
            disabled={slot.isBooked}
            className={`
              relative px-4 py-3 rounded-xl font-medium text-sm transition-all
              ${slot.isBooked 
                ? 'glass bg-red-500/10 border border-red-500/30 text-red-300/70 cursor-not-allowed blur-[0.5px]' 
                : 'glass bg-green-500/10 border border-green-500/30 text-green-100 hover:bg-green-500/20 hover:scale-105 cursor-pointer'
              }
            `}
            whileHover={!slot.isBooked ? { scale: 1.05 } : {}}
            whileTap={!slot.isBooked ? { scale: 0.95 } : {}}
          >
            {slot.time}
            {slot.isBooked && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-normal">Booked</span>
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotGrid;
