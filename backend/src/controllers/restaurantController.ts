import { Request, Response } from 'express';
import db from '../config/db';

export const getRestaurants = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query('SELECT * FROM restaurants');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database query failed' });
    }
};
