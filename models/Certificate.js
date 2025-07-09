const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  serialNo: { type: String, required: true },
  name: { type: String, required: true },
  item: { type: String, required: true },
  fineness: { type: String, required: true },
  grossWeight: { type: String, required: true },
  date: { type: String, required: true },
  notes: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  // Add new fields for PDF generation
  metalType: { type: String, required: true, default: 'Silver' },
  leftImage: { type: String, required: true },
  rightImage: { type: String, required: true },
  headerTitle: { type: String, required: true, default: 'SWARANJALE' },
  headerSubtitle: { type: String, required: true, default: 'Melting & Testing' },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  certificateTitle: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);