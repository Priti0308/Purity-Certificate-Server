const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); 

// POST /api/contact - Create new contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const contactMessage = new Contact({
      name,
      email,
      subject,
      message,
    });

    await contactMessage.save();
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// GET /api/contact - Get all contact messages
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

module.exports = router;
