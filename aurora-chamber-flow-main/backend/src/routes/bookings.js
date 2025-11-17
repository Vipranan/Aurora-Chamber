import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// In-memory storage for bookings (replace with database in production)
let bookings = [];
let bookingIdCounter = 1;

// Get all bookings
router.get('/', (req, res) => {
  try {
    const { date, chamber } = req.query;
    
    let filteredBookings = bookings;
    
    if (date) {
      filteredBookings = filteredBookings.filter(b => b.date === date);
    }
    
    if (chamber) {
      filteredBookings = filteredBookings.filter(b => b.chamber === chamber);
    }
    
    res.json(filteredBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get booked time slots for a specific chamber and date
router.get('/booked-slots', (req, res) => {
  try {
    const { chamber, date } = req.query;
    
    if (!chamber || !date) {
      return res.status(400).json({ error: 'Chamber and date are required' });
    }
    
    const bookedSlots = bookings
      .filter(b => b.chamber === chamber && b.date === date)
      .map(b => b.timeSlot);
    
    res.json({ bookedSlots });
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new booking
router.post('/', (req, res) => {
  try {
    const { chamber, date, timeSlot, name, email, company, antenna } = req.body;
    
    // Validate required fields
    if (!chamber || !date || !timeSlot || !name || !email) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }
    
    // Check if slot is already booked
    const existingBooking = bookings.find(
      b => b.chamber === chamber && b.date === date && b.timeSlot === timeSlot
    );
    
    if (existingBooking) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }
    
    // Create new booking
    const newBooking = {
      id: bookingIdCounter++,
      chamber,
      date,
      timeSlot,
      name,
      email,
      company: company || '',
      antenna: antenna || '',
      createdAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a booking (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const bookingIndex = bookings.findIndex(b => b.id === parseInt(id));
    
    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    bookings.splice(bookingIndex, 1);
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a booking (admin only)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const bookingIndex = bookings.findIndex(b => b.id === parseInt(id));
    
    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      ...req.body,
      id: parseInt(id), // Ensure id doesn't change
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      message: 'Booking updated successfully',
      booking: bookings[bookingIndex]
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
