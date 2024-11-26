import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';  // Assure-toi d'importer Axios

const localizer = momentLocalizer(moment);

const CalendarScheduler = () => {
  const [events, setEvents] = useState([
    {
      title: 'Meeting',
      start: new Date(2024, 10, 25, 10, 0),
      end: new Date(2024, 10, 25, 12, 0),
    },
    {
      title: 'Lunch Break',
      start: new Date(2024, 10, 26, 13, 0),
      end: new Date(2024, 10, 26, 14, 0),
    },
  ]);

  const handleSelectSlot = async ({ start, end }) => {
    const title = prompt('Enter Event Title:');
    if (title) {
      // Convertir les dates en format MySQL (YYYY-MM-DD HH:MM:SS)
      const start_time = moment(start).format('YYYY-MM-DD HH:mm:ss');
      const end_time = moment(end).format('YYYY-MM-DD HH:mm:ss');

      // Crée un objet événement avec les dates converties
      const eventData = {
        title,
        start_time,
        end_time,
        description: 'New Event Description',  // Tu peux personnaliser cela
        user_id: 1, // Remplace par l'ID de l'utilisateur connecté
      };

      try {
        // Envoie l'événement à l'API pour l'ajouter dans la base de données
        const response = await axios.post('http://localhost:5000/events', eventData);

        // Si l'ajout est réussi, mets à jour l'état des événements
        console.log('Événement ajouté:', response.data);
        setEvents([...events, response.data]);
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'événement:', error);
      }
    }
  };

  return (
    <div className="calendar-container" style={{ height: '80vh', padding: '1rem' }}>
      <h2>Scheduler and Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default CalendarScheduler;
