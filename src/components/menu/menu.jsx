import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './menu.css';

const Menu = ({ selectedUser, setSelectedUser }) => {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://planning.francestagepermis.fr:5000/users');
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
  {selectedUser ? selectedUser.name : 'Sélectionnez un utilisateur'}
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
  </div>
))}

        </div>
      )}
    </div>
  );
};

export default Menu;