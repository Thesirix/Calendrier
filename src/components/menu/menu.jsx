import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './menu.css';

const Menu = ({ selectedUser, setSelectedUser, arrivalMessage }) => {
    const [users, setUsers] = useState([]);
    const [isOpen, setIsOpen] = useState(false); // État pour gérer l'ouverture/fermeture du menu

    // Chargement des utilisateurs depuis l'API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs :', error);
            }
        };
        fetchUsers();

        // Vérifier si un utilisateur est sélectionné lors du rafraîchissement de la page
        const storedUserId = localStorage.getItem('selectedUserId');
        if (storedUserId) {
            const selectedUserFromStorage = users.find(user => user.id === parseInt(storedUserId));
            setSelectedUser(selectedUserFromStorage);
        }
    }, []);

    // Gérer la sélection d'un utilisateur
    const handleUserChange = (user) => {
        setSelectedUser(user);
        localStorage.setItem('selectedUserId', user ? user.id : ''); // Sauvegarde l'utilisateur sélectionné
        setIsOpen(false); // Ferme le menu après sélection
    };

    // Gérer l'ouverture/fermeture du menu
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="custom-select-container">
          <div className="custom-select" onClick={toggleMenu}>
            {selectedUser
              ? `${selectedUser.name} ${arrivalMessage ? `- est arrivé à ${arrivalMessage}` : ''}`
              : 'Sélectionnez un utilisateur'}
          </div>
          {isOpen && (
            <div className="custom-options">
              <div
                className="custom-option default-option"
                onClick={() => handleUserChange(null)}
              >
                Sélectionnez un utilisateur
              </div>
              {users.map(user => (
                <div
                  key={user.id}
                  className="custom-option"
                  onClick={() => handleUserChange(user)}
                >
                  {user.name}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

export default Menu;
