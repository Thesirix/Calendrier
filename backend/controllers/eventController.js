const pool = require('../db/connection');

// Récupérer tous les événements
const getEvents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des événements.' });
  }
};

// Créer un nouvel événement
const createEvent = async (req, res) => {
  const { title, date, description } = req.body;

  if (!title || !date) {
    return res.status(400).json({ message: 'Titre et date sont obligatoires.' });
  }

  try {
    await pool.query('INSERT INTO events (title, date, description) VALUES (?, ?, ?)', [title, date, description]);
    res.status(201).json({ message: 'Événement créé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de l’événement.' });
  }
};

module.exports = {
  getEvents,
  createEvent,
};
