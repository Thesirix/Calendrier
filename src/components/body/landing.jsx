import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const CalendarScheduler = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]); // Liste des utilisateurs
  const [selectedUser, setSelectedUser] = useState(null); // Utilisateur sélectionné

  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs', error);
    }
  };

  // Fonction pour récupérer les événements
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/events');
      const eventsData = response.data.map(event => ({
        title: `${event.title} - ${event.user_name}`, // Affiche le nom de l'utilisateur dans le titre
        start: new Date(event.start_time),
        end: new Date(event.end_time),
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements', error);
    }
  };

  // Charger les utilisateurs et les événements au premier rendu
  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  // Fonction pour gérer la sélection d'un créneau
  const handleSelectSlot = async ({ start, end }) => {
    if (!selectedUser) {
      alert('Veuillez sélectionner un utilisateur');
      return;
    }

    const title = prompt('Entrez un titre pour l\'événement :');
    if (title) {
      const start_time = moment(start).format('YYYY-MM-DD HH:mm:ss');
      const end_time = moment(end).format('YYYY-MM-DD HH:mm:ss');

      const eventData = {
        title,
        start_time,
        end_time,
        description: 'Nouvel événement',
        user_id: selectedUser.id, // Utilisateur sélectionné
      };

      try {
        const response = await axios.post('http://localhost:5000/events', eventData);
        setEvents(prevEvents => [
          ...prevEvents,
          {
            title: `${title} - ${selectedUser.name}`,
            start: new Date(response.data.start_time),
            end: new Date(response.data.end_time),
          }
        ]);
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'événement', error);
      }
    }
  };

  return (
    <div className="calendar-container" style={{ height: '80vh', padding: '1rem' }}>
      <h2>Scheduler and Calendar</h2>

      {/* Menu déroulant pour sélectionner un utilisateur */}
      <select
        value={selectedUser?.id || ''}
        onChange={(e) => {
          const userId = e.target.value;
          const user = users.find(user => user.id === parseInt(userId));
          setSelectedUser(user);
        }}
      >
        <option value="">Sélectionnez un utilisateur</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        defaultView="week"
        views={['month', 'week', 'day']}
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default CalendarScheduler;
