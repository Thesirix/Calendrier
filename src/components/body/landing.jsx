import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import fr from 'date-fns/locale/fr';
import './landing.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import Menu from '../Menu/menu.jsx'; 

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
      const response = await axios.get('http://planning.francestagepermis.fr:5000/events');
      const usersResponse = await axios.get('http://planning.francestagepermis.fr:5000/users');
  
      const usersMap = usersResponse.data.reduce((acc, user) => {
        acc[user.id] = user.color;
        return acc;
      }, {});
  
      const eventsData = response.data.map(event => ({
        id: event.id,  
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
  }, []);

  const handleSelectSlot = async ({ start, end }) => {
    if (!selectedUser) {
      alert('Veuillez sélectionner un utilisateur dans le menu.');
      return;
    }

    const newEvent = {
      title: selectedUser.name, 
      start: new Date(start),
      end: new Date(end),
      color: selectedUser.color, 
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);

    try {
      await axios.post('http://planning.francestagepermis.fr:5000/events', {
        title: selectedUser.name,
        start_time: format(start, 'yyyy-MM-dd HH:mm:ss'),
        end_time: format(end, 'yyyy-MM-dd HH:mm:ss'),
        user_id: selectedUser.id,
      });
    } catch (error) {
      console.error('Erreur lors de l’ajout de l’événement :', error);
    }
  };

  const handleDeleteEvent = async (event) => {
    const eventId = event.id;

    if (eventId === undefined) {
      console.error("L'ID de l'événement n'est pas défini");
      return;
    }

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet horaire ?")) {
      try {
        await axios.delete(`http://planning.francestagepermis.fr:5000/events/${eventId}`);
        setEvents(events.filter(evt => evt.id !== eventId));
        alert('Horaire supprimé');
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'événement :', error);
        alert('Erreur lors de la suppression de l\'événement');
      }
    }
  };

  return (
    <div className="calendar-container" style={{ padding: '1rem' }}>
      <div className="img"><img src="https://www.francestagepermis.fr/uploads/logo-fsp-vectorise.svg" alt="" /></div>
      <h2>Planning</h2>
      <Menu 
        selectedUser={selectedUser} 
        setSelectedUser={setSelectedUser} 
      />

      <Calendar
        localizer={localizer}
        culture="fr"
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleDeleteEvent}  
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
        min={new Date(2024, 0, 1, 7)}
        max={new Date(2024, 0, 1, 20)}
        formats={{
          eventTimeRangeFormat: ({ start }) => format(start, 'H:mm'),
        }}
      />
    </div>
  );
};

export default CalendarScheduler;
