const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  serialNo: { type: String, required: true },
  name: { type: String, required: true },
  item: { type: String, required: true },
  fineness: { type: String, required: true },
  grossWeight: { type: String, required: true },
  date: { type: String, required: true },
  notes: { type: String },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
