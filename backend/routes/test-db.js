import express from 'express';
import pool from '../database/db.js';

const router = express.Router();

router.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.status(200).json({
      message: 'Connexion réussie !',
      users: rows,
    });
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données :', error);
    res.status(500).json({
      message: 'Erreur lors de la connexion à la base de données.',
      error: error.message,
    });
  }
});

export default router;
