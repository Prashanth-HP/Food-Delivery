// src/routes/restaurantRoutes.ts
import { Router, Request, Response } from 'express';
import db from '../config/db';


const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { name, location } = req.body;
  if (!name || !location) {
    res.status(400).json({ error: 'Name and location required' });
    return;
  }

  try {
    await db.execute('INSERT INTO restaurants (name, location) VALUES (?, ?)', [name, location]);
    res.json({ message: 'Restaurant created' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.execute('SELECT * FROM restaurants');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
