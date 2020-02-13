const router = require('express').Router();
const db = require('../config/loki').getDatabase();
module.exports = router;

const posts = db.getCollection('posts');
const comments = db.getCollection('comments');

router.post('/', (req, res) => {
    const { postId, name, email, body } = req.body;

    if(!postId || !name || !email || !body) {
        res.status(422).send({ error: 'Invalid comment ' });
    } else {
        res.json(req.body);
    }
});

router.get('/', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    } else {
        res.send(posts);
    }
});

router.get('/:postId', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }

    
    const postId = Number(req.params.postId);
    const post = posts.get(postId, false);
    const postComments = comments.find({ postId: postId });

    if(!post || (Array.isArray(post) && post.length === 0)) {
        res.status(404).send('Post not found');
    } else {
        res.json({ post, postComments });
    }
});

router.put('/:postId', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }

    const postId = Number(req.params.postId);
    const post = posts.findOne({ id: postId });

    if(!post) {
        res.status(404).send('Post not found');
    }

    const { title, body } = req.body;
    post.title = title;
    post.body = body;
    const updated = posts.update(post);

    if(updated) {
        res.json(post);
    } else {
        res.status(500).send('Post could not be edited');
    }
});

router.delete('/:postId', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }

    const postId = Number(req.params.postId);
    const post = posts.find({ id: postId });
    posts.remove(post);

    if(!post || (Array.isArray(post) && post.length > 0)) {
        res.send('Post deleted successfully');
    } else {
        res.status(500).send('Error occurred during post deletion');
    }
});