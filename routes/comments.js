const router = require('express').Router();
const db = require('../config/loki').getDatabase();
module.exports = router;

const comments = db.getCollection('comments');

router.post('/', (req, res) => {
    const { postId, name, email, body } = req.body;
    
    if(!postId || !name || !email || !body) {
        res.status(422).send({ error: 'Invalid comment' });
    } else {
        res.json(req.body);
    }
});

router.get('/', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    } else {
        res.send(comments);
    }
});

router.get('/:commentId', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }
    const commentId = Number(req.params.commentId);
    const comment = comments.find({ id: commentId });
    console.log(comment);
    if(!comment || (Array.isArray(comment) && comment.length === 0)) {
        res.status(404).json({ error: 'Comment not found' });
    } else {
        res.send(comment);
    }
});

router.put('/:id', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }
    
    const comment = comments.findOne({ id: req.params.id });

    if(!req.body) {
        res.status(422).json({ error: 'Comment may not be blank' });
    } else {
        comment.body = req.body;
    }
});

router.delete('/:commentId', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }

    const commentId = Number(req.params.commentId);
    const removed = comments.find({ id: commentId });
    comments.remove(removed);

    console.log(removed);
    if(removed) {
        res.send('Comment deleted successfully');
    } else {
        res.status(500).send('Error occurred during comment deletion');
    }
});