const express = require('express');
const router = express.Router();
const multer = require('multer');
const { loginVendor } = require('../controllers/vendorController');
const {
  createVendor,
  getAllVendors,
  updateVendor,
  deleteVendor,
  approveVendor,
  rejectVendor,
  setVendorPassword
} = require('../controllers/vendorController');

const { protectVendor } = require('../middleware/authMiddleware'); 
const Vendor = require('../models/Vendor'); 
router.post('/login', loginVendor);


// Setup multer for file uploads
const upload = multer({
  limits: { fileSize: 200 * 1024 }, // Limit file size to 200KB
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload an image file'));
    }
  }
});

// ✅ Admin CRUD Routes
router.post('/', createVendor);
router.get('/', getAllVendors);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);
router.put('/:id/approve', approveVendor);
router.put('/:id/reject', rejectVendor);
router.put('/:id/set-password', setVendorPassword);

module.exports = router;
