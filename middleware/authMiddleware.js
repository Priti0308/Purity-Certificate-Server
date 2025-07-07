// middleware/authVendor.js
const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');

const protectVendor = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const vendor = await Vendor.findById(decoded.id).select('-password');
      if (!vendor) {
        return res.status(401).json({ message: 'Vendor not found' });
      }

      req.vendor = vendor; // Attach vendor object to request
      return next(); // ✅ Continue
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = protectVendor;
