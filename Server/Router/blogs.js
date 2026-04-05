const express = require('express');
const router = express.Router();
const Blog = require('../Modules/blogmodule');

// Get all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch blogs', error: err.message });
    }
});

// Get a single blog by ID
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch blog', error: err.message });
    }
});

// Create a new blog (Admin)
router.post('/save', async (req, res) => {
    const { title, description, content, author, category, image, tags } = req.body;
    try {
        const newBlog = new Blog({ title, description, content, author, category, image, tags });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(400).json({ message: 'Failed to save blog', error: err.message });
    }
});

// Update a blog
router.put('/update/:id', async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBlog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json(updatedBlog);
    } catch (err) {
        res.status(400).json({ message: 'Failed to update blog', error: err.message });
    }
});

// Delete a blog
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete blog', error: err.message });
    }
});

module.exports = router;
