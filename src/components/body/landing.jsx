import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import fr from 'date-fns/locale/fr';
import './landing.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import Menu from '../Menu/menu.jsx'; 

// Configuration du localizer pour date-fns
const locales = {
  fr: fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarScheduler = () => {
  const [events, setEvents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('selectedUserId');
    const storedUserColor = localStorage.getItem('selectedUserColor');

    if (storedUserId && storedUserColor) {
      setSelectedUser({
        id: parseInt(storedUserId),
        color: storedUserColor,
      });
    }
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/events');
      const usersResponse = await axios.get('http://localhost:5000/users');

      const usersMap = usersResponse.data.reduce((acc, user) => {
        acc[user.id] = user.color;
        return acc;
      }, {});

      const eventsData = response.data.map(event => ({
        title: event.title,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
        color: usersMap[event.user_id] || '#000000',
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedUser]);

  const [arrivalMessage, setArrivalMessage] = useState('');

  const handleSelectSlot = async ({ start, end }) => {
    if (!selectedUser) {
      alert('Veuillez sélectionner un utilisateur');
      return;
    }
  
    const title = prompt('Entrer une horaire :');
    if (title) {
      const formattedTime = format(start, 'HH:mm');
  
      // Sauvegarder l'heure d'arrivée spécifique à cet utilisateur
      localStorage.setItem(`arrivalMessage_${selectedUser.id}`, formattedTime);
  
      const start_time = format(start, 'yyyy-MM-dd HH:mm:ss');
      const end_time = format(end, 'yyyy-MM-dd HH:mm:ss');
  
      const newEvent = {
        title,
        start_time,
        end_time,
        description: 'Nouvel événement',
        user_id: selectedUser.id,
      };
  
      try {
        const response = await axios.post('http://localhost:5000/events', newEvent);
        setEvents(prevEvents => [
          ...prevEvents,
          {
            title,
            start: new Date(response.data.start_time),
            end: new Date(response.data.end_time),
            color: selectedUser.color,
          }
        ]);
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'événement:", error);
      }
    }
  };
  

  // SECTION RETURN

  return (
    <div className="calendar-container" style={{ padding: '1rem' }}>
      <div className="img"><img src="https://www.francestagepermis.fr/uploads/logo-fsp-vectorise.svg" alt="" /></div>
      <h2>Planning</h2>
      <Menu 
  selectedUser={selectedUser} 
  setSelectedUser={setSelectedUser} 
  arrivalMessage={arrivalMessage} 
/>

      <Calendar
        localizer={localizer}
        culture="fr"
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        eventPropGetter={event => ({
          style: { backgroundColor: event.color, color: '#fff' },
        })}
        defaultView="week"
        views={['month', 'week', 'day']}
        style={{ height: '60vh', width: '100%' }}
        messages={{
          next: 'Suivant',
          previous: 'Précédent',
          today: "Aujourd'hui",
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
          agenda: 'Agenda',
          date: 'Date',
          time: 'Heure',
          event: 'Événement',
        }}
       // Plage horaire 7H/20H
       min={new Date(2024, 0, 1, 7)} 
       max={new Date(2024, 0, 1, 20)} 
       
     />
    </div>
  );
};

export default CalendarScheduler;
