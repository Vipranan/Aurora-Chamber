import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import BookingModal from "./BookingModal";
import TimeSlotGrid from "./TimeSlotGrid";
import { motion } from "framer-motion";

interface BookingFormProps {
  onBookingSuccess: () => void;
}

const BookingForm = ({ onBookingSuccess }: BookingFormProps) => {
  const [selectedChamber, setSelectedChamber] = useState("Chamber 1");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const chambers = ["Chamber 1", "Chamber 2"];

  const handleSlotSelect = (time: string) => {
    setSelectedTimeSlot(time);
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 w-full max-w-2xl"
      >
        <h2 className="text-3xl font-semibold mb-8">Book a Chamber</h2>
        
        <div className="space-y-6">
          {/* Chamber Selection */}
          <div>
            <label className="block text-sm font-medium mb-3 text-white/80">
              Chamber
            </label>
            <div className="relative">
              <select
                value={selectedChamber}
                onChange={(e) => setSelectedChamber(e.target.value)}
                className="w-full glass px-6 py-4 rounded-xl appearance-none cursor-pointer text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                {chambers.map((chamber) => (
                  <option key={chamber} value={chamber} className="bg-[#0d153f] text-white">
                    {chamber}
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-medium mb-3 text-white/80">
              Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full glass justify-start text-left font-normal px-6 py-6 rounded-xl border-white/10 hover:bg-white/10 text-white",
                    !selectedDate && "text-white/50"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5 text-white/70" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass border-white/20 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Slot Selection */}
          <TimeSlotGrid
            selectedChamber={selectedChamber}
            selectedDate={selectedDate}
            onSlotSelect={handleSlotSelect}
          />
        </div>
      </motion.div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chamber={selectedChamber}
        date={format(selectedDate, "dd/MM/yyyy")}
        timeSlot={selectedTimeSlot}
        onSuccess={onBookingSuccess}
      />
    </>
  );
};

export default BookingForm;
