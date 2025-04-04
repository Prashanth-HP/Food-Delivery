import express, { Request, Response } from 'express';
import db from '../config/db';

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
    const { restaurant_id, items, total_price, delivery_address } = req.body;
    if (!restaurant_id || !items || total_price <= 0 || !delivery_address) {
        res.status(400).json({ error: 'Invalid order data' });
        return;
    }

    try {
        const [result]: any = await db.query(
            'INSERT INTO orders (restaurant_id, items, total_price, delivery_address) VALUES (?, ?, ?, ?)',
            [restaurant_id, JSON.stringify(items), total_price, delivery_address]
        );
        res.json({ orderId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const [order]: any = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    const { status } = req.body;
    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        await db.query('DELETE FROM orders WHERE id = ? AND status != "Out for Delivery"', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
