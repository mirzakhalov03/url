const bcrypt = require('bcrypt')
const user = require('../models/user')
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    const existingUser = user.findByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, password: hashedPassword };
    user.createUser(newUser);
    res.status(201).json({ message: 'User created successfully' });
});
module.exports = router;