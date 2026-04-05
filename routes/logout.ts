import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    req.session.destroy(err => {
        if (err) { 
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});
export default router;