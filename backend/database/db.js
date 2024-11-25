import mysql from 'mysql2';
import dotenv from 'dotenv';

// Spécifie le chemin vers le fichier .env à la racine du projet
dotenv.config({ path: '../.env' });  // Remonte d'un niveau depuis /back

console.log('DB_USER:', process.env.DB_USER);  // Vérifie que la variable est bien lue
console.log('DB_PASSWORD:', process.env.DB_PASSWORD); 

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connexion à la base de données réussie');
  connection.release();
});

export default pool.promise();
