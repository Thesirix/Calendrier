import express from 'express';
import pool from './database/db.js'; 
import dotenv from 'dotenv';
import cors from 'cors';  


dotenv.config();
const app = express();

//  CORS
app.use(cors({
    origin: [
        "http://planning.francestagepermis.fr:2999", 
        "http://planning.francestagepermis.fr:5000", 
      ],   
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],  
}));


app.use(express.json());

// Route pour récupérer tous les événements
app.get('/events', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM events');
        res.json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des événements :', error);
        res.status(500).send('Erreur du serveur');
    }
});

// Route pour récupérer un événement spécifique
app.get('/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).send('Événement non trouvé');
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'événement :', error);
        res.status(500).send('Erreur du serveur');
    }
});

// Route pour créer un nouvel événement
app.post('/events', async (req, res) => {
    try {
        const { title, start_time, end_time, description, user_id } = req.body;
        const [result] = await pool.query(
            'INSERT INTO events (title, start_time, end_time, description, user_id) VALUES (?, ?, ?, ?, ?)',
            [title, start_time, end_time, description, user_id]
        );
        res.status(201).json({ id: result.insertId, title, start_time, end_time, description, user_id });
    } catch (error) {
        console.error('Erreur lors de la création de l\'événement :', error);
        res.status(500).send('Erreur du serveur');
    }
});

// Route pour mettre à jour un événement
app.put('/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, start_time, end_time, description, user_id } = req.body;
        const [result] = await pool.query(
            'UPDATE events SET title = ?, start_time = ?, end_time = ?, description = ?, user_id = ? WHERE id = ?',
            [title, start_time, end_time, description, user_id, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send('Événement non trouvé');
        }
        res.send('Événement mis à jour avec succès');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'événement :', error);
        res.status(500).send('Erreur du serveur');
    }
});

// Route pour supprimer un événement
app.delete('/events/:id', async (req, res) => {
    try {
        const { id } = req.params;  
        const [result] = await pool.query('DELETE FROM events WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Événement non trouvé');
        }
        res.send('Événement supprimé avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'événement :', error.message);
        res.status(500).send('Erreur du serveur');
    }
});

// Route pour récupérer tous les utilisateurs
app.get('/users', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, color FROM users');
        res.json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).send('Erreur du serveur');
    }
});

// Route pour récupérer la couleur d'un utilisateur spécifique
app.get('/users/:id/color', async (req, res) => {
    try {
        const { id } = req.params;
        const [user] = await pool.query('SELECT color FROM users WHERE id = ?', [id]);
        if (user.length === 0) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        res.json({ color: user[0].color });
    } catch (error) {
        console.error('Erreur lors de la récupération de la couleur de l\'utilisateur :', error);
        res.status(500).send('Erreur du serveur');
    }
});

// Route pour la connexion d'un utilisateur (ajoutée)
app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        // Vérifiez les informations d'identification de l'utilisateur dans la base de données
        const [rows] = await pool.query('SELECT * FROM users WHERE name = ? AND password = ?', [name, password]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        const user = rows[0];
        res.json({
            message: 'Connexion réussie',
            user: {
                id: user.id,
                name: user.name,
                color: user.color,
            },
            
        });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).send('Erreur du serveur');
    }
});

// Définir le port et lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
