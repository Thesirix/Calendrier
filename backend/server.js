import express from 'express';
import pool from './database/db.js';

const app = express();

app.get('/events', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM events');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des événements');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
