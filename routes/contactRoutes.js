const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact.js'); 

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

//contact - Get all contact messages
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});
// DELETE /contact/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Contact.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

module.exports = router;
