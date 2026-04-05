const express = require('express');
const router = express.Router();
const Newsletter = require('../Modules/newslettermodule');

// POST: Add a new subscriber
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        const exists = await Newsletter.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "Email is already part of our curation" });
        }
        const newSubscriber = new Newsletter({ email });
        await newSubscriber.save();
        res.status(201).json({ message: "Subscription confirmed" });
    } catch (error) {
        console.error("Error subscribing:", error);
        res.status(500).json({ error: "Failed to confirm subscription" });
    }
});

// GET: Fetch all subscribers (for admin)
router.get('/', async (req, res) => {
    try {
        const subscribers = await Newsletter.find().sort({ date: -1 });
        res.status(200).json(subscribers);
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        res.status(500).json({ error: "Failed to fetch subscribers" });
    }
});

// DELETE: Remove a subscriber (for admin)
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Newsletter.findByIdAndDelete(id);
        res.status(200).json({ message: "Subscriber removed from collection" });
    } catch (error) {
        console.error("Error deleting subscriber:", error);
        res.status(500).json({ error: "Failed to remove subscriber" });
    }
});

module.exports = router;
