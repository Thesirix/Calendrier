import express from 'express';
import pool from './database/db.js'; // Assure-toi que le chemin vers db.js est correct

const app = express();

// Route de test pour vérifier la connexion à la base de données
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.send('Connexion à la base de données réussie');
  } catch (err) {
    res.status(500).send('Erreur de connexion à la base de données : ' + err.message);
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
