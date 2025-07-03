const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  customerName: { type: String, required: true },
  goldPurity: { type: Number },
  silverPurity: { type: Number },
  weight: { type: Number },
  remarks: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
