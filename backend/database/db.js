import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();  // Charge les variables d'environnement


// Crée une connexion à la base de données avec mysql2
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Exportation de l'objet pool avec une promesse
export default pool.promise();
