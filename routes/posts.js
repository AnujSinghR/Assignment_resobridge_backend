const router = require('express').Router();
const Post = require('../models/Post');
const verify = require('../middleware/auth');

// Get all posts (Public + Published)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, tag } = req.query;
        let query = { status: 'published' };

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        if (tag) {
            query.tags = { $in: [tag] };
        }

        const posts = await Post.find(query)
            .populate('author', 'username')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Post.countDocuments(query);

        res.json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single post by slug
router.get('/:slug', async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'username');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single post by ID
router.get('/id/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Post (Authenticated User)
router.post('/', verify, async (req, res) => {
    try {
        // Allow any authenticated user to create a post
        const post = new Post({
            ...req.body,
            author: req.user._id
        });
        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update Post
router.put('/:id', verify, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.author.toString() !== req.user._id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied' });
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Post
router.delete('/:id', verify, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.author.toString() !== req.user._id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get Drafts (Authenticated User)
router.get('/user/drafts', verify, async (req, res) => {
    try {
        let query = { status: 'draft' };
        if (req.user.role !== 'admin') {
            query.author = req.user._id;
        }

        const posts = await Post.find(query).populate('author', 'username').sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
