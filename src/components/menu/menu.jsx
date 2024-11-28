import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './menu.css';

const Menu = ({ selectedUser, setSelectedUser }) => {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

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
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem('selectedUserId');
    if (storedUserId) {
      const selectedUserFromStorage = users.find(user => user.id === parseInt(storedUserId));
      setSelectedUser(selectedUserFromStorage);
    }
  }, [users]);

  const handleUserChange = (user) => {
    setSelectedUser(user);
    localStorage.setItem('selectedUserId', user ? user.id : '');
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

// SECTION RETURN

  return (
    <div className="custom-select-container">
      <div className="custom-select" onClick={toggleMenu}>
        {selectedUser
          ? `${selectedUser.name} - est arrivé à ${
              selectedUser.arrivalMessage ? selectedUser.arrivalMessage : ''
            }`
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
              {/* Pastille de couleur avant le nom de l'utilisateur */}
              <span
                style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: user.color, 
                  marginRight: '10px'
                }}
              ></span>
              {user.name}
              {localStorage.getItem(`arrivalMessage_${user.id}`) && (
                <span className="arrival-time">
                  - est arrivé à {localStorage.getItem(`arrivalMessage_${user.id}`)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
