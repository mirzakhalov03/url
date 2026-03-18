const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../models/user');

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    const existingUser = user.findByEmail(email);
    if (!existingUser) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    req.session.user = existingUser;
    console.log(req.session.user);
    res.json({ message: 'Login successful' });
});
module.exports = router;