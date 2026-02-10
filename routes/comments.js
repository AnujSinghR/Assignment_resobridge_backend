const router = require('express').Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const verify = require('../middleware/auth');

// Get comments for a post
router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username').sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add comment
router.post('/', verify, async (req, res) => {
    try {
        const comment = new Comment({
            content: req.body.content,
            post: req.body.postId,
            author: req.user._id
        });
        const savedComment = await comment.save();
        res.status(201).json(savedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete comment
router.delete('/:id', verify, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Admin delete any, Author delete on their post, User delete own comment?
        // Rules: "Admin can delete any comment - Author can delete comments on their posts"
        // Also assuming user can delete their own comment is a sane default, but let's stick to spec.

        // Check if admin
        if (req.user.role === 'admin') {
            await Comment.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Comment deleted by Admin' });
        }

        const post = await Post.findById(comment.post);

        // Check if author of the post
        if (post.author.toString() === req.user._id) {
            await Comment.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Comment deleted by Post Author' });
        }

        return res.status(403).json({ message: 'Access Denied' });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
