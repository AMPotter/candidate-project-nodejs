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
    const comment = comments.get(commentId, false);

    if(!comment || (Array.isArray(comment) && comment.length === 0)) {
        res.status(404).send('Comment not found');
    } else {
        res.send(comment);
    }
});

router.put('/:commentId', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }
    
    const commentId = Number(req.params.commentId);
    const comment = comments.findOne({ id: commentId });
    console.log(comment);

    if(!comment) {
        res.status(404).send('Comment not found');
    }
    const { body } = req.body;
    comment.body = body;
    const updated = comments.update(comment);

    if(updated) {
        res.json(comment);
    } else {
        res.status(500).send('Comment could not be edited');
    }
});

router.delete('/:commentId', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }

    const commentId = Number(req.params.commentId);
    const comment = comments.find({ id: commentId });
    comments.remove(comment);

    if(!comment || (Array.isArray(comment) && comment.length > 0)) {
        res.send('Comment deleted successfully');
    } else {
        res.status(500).send('Error occurred during comment deletion');
    }
});