import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './menu.css';

const Menu = ({ selectedUser, setSelectedUser }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users');
                console.log("Utilisateurs récupérés:", response.data); // Log pour vérifier
                setUsers(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs :', error);
            }
        };
        fetchUsers();
    }, []);

    const handleUserChange = (e) => {
        const selectedUserId = e.target.value;
        const selectedUser = users.find(user => user.id === parseInt(selectedUserId));
        setSelectedUser(selectedUser);
    };

    return (
        <div>
            <select
                value={selectedUser?.id || ''}
                onChange={handleUserChange}
            >
                <option value="">Sélectionnez un utilisateur</option>
                {users.map(user => (
                    <option key={user.id} value={user.id}>
                        {user.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Menu;
