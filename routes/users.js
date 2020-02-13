const router = require('express').Router();
const db = require('../config/loki').getDatabase();
module.exports = router;

const users = db.getCollection('users');

router.post('/', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }

    const { name, username, email, address, phoneNumbers, website } = req.body;

    if(!username || !email) {
        res.status(422).send('Users must have username and email');
    }

    const user = users.insert({
        name,
        username,
        email,
        address,
        phoneNumbers,
        website
    });

    if(user) {
        res.json(user);
    } else {
        res.status(500).send('Error occurred during user creation');
    }
});

router.get('/', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }
    res.send(users);
});

router.get('/:id', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }
    res.json(users.get(req.params.id));
});

router.put('/:id', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }

    let user = users.findOne({ id: req.params.id });
    const { name, username, email, address, phoneNumbers, website } = req.body;

    if(!user) {
        res.status(404).send('User not found');
    }
    
    user = {
        name: name,
        username: username,
        email: email,
        address: address,
        phoneNumbers: phoneNumbers,
        website: website
    };

    const updated = users.update(user);

    if(updated) {
        res.json(user);
    } else {
        res.status(500).send('Error occurred during user update');
    }
});

router.delete('/:userId', (req, res) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Unauthorized request' });
    }

    const userId = Number(req.params.userId);
    const user = users.find({ id: userId });
    users.remove(user);

    if(!user || (Array.isArray(user) && user.length > 0)) {
        res.send('User deleted successfully');
    } else {
        res.status(500).send('Error occurred during user deletion');
    }
});