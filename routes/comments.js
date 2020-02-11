const router = require('express').Router();
const db = require('../config/loki').getDatabase();
module.exports = router;

const comments = db.getCollection('comments');

router.post('/', (req, res) => {
    const { postId, name, email, body } = req.body;
    
    if(!postId || !name || !email || !body) {
        res.status(422).send({ error: 'Invalid comment' });
    }
    res.json(req.body);
});

router.get('/', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }
    res.send(comments);
});

router.get('/:id', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }
    res.send(comments.get(req.params.id));
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

router.delete('/:id', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }

    const comment = comments.findOne({ id: req.params.id });
    comments.remove(comment);

    if(comment) {
        res.send('Comment deleted successfully');
    } else {
        res.status(500).send('Error occurred during comment deletion');
    }
});