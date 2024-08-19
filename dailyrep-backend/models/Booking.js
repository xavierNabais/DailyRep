const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: Number, required: true },
  comment: { type: String, default: '' } 
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
