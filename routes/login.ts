import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();
const bcrypt = require('bcrypt');
import user from '../models/user';


router.post('/', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await user.findByEmail(email);
    if (!existingUser) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password_hash);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    req.session.user = existingUser;
    console.log(req.session.user);
    res.json({ 
        message: 'Login successful',
        username: existingUser.full_name || existingUser.email 
    });
});
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: { email: req.session.user.email, username: req.session.user.full_name } });
  } else {
    res.json({ loggedIn: false });
  }
});
export default router;