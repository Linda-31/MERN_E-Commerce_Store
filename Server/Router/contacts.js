const express = require('express');
const router = express.Router();
const Contact = require('../Modules/contactmodule');

// POST: Save a new contact message
router.post('/save', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();
        res.status(201).json({ message: "Inquiry delivered successfully" });
    } catch (error) {
        console.error("Error saving contact message:", error);
        res.status(500).json({ error: "Failed to deliver inquiry" });
    }
});

// GET: Fetch all contact messages (for admin)
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ date: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        console.error("Error fetching contact messages:", error);
        res.status(500).json({ error: "Failed to fetch inquiries" });
    }
});

// DELETE: Remove a contact message (for admin)
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Contact.findByIdAndDelete(id);
        res.status(200).json({ message: "Inquiry archived successfully" });
    } catch (error) {
        console.error("Error deleting contact message:", error);
        res.status(500).json({ error: "Failed to archive inquiry" });
    }
});

module.exports = router;
