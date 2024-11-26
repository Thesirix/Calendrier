import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const CalendarScheduler = () => {
  const [events, setEvents] = useState([]);

  // Fonction pour récupérer les événements depuis le serveur
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/events');
      const eventsData = response.data.map(event => ({
        title: event.title,
        start: new Date(event.start_time),  // Conversion du format MySQL en format Date
        end: new Date(event.end_time),      // Conversion du format MySQL en format Date
      }));
      setEvents(eventsData); // Mettre à jour l'état avec les événements récupérés
    } catch (error) {
      console.error('Erreur lors de la récupération des événements', error);
    }
  };

  // Charger les événements au premier rendu du composant
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fonction appelée lors de la sélection d'un créneau sur le calendrier
  const handleSelectSlot = async ({ start, end }) => {
    const title = prompt('Enter Event Title:');
    if (title) {
      const newEvent = { title, start, end };

      // Convertir les dates en format MySQL (YYYY-MM-DD HH:mm:ss)
      const start_time = moment(start).format('YYYY-MM-DD HH:mm:ss');
      const end_time = moment(end).format('YYYY-MM-DD HH:mm:ss');

      const eventData = {
        title,
        start_time,
        end_time,
        description: 'New Event Description',
        user_id: 1, // Remplace par l'ID de l'utilisateur connecté
      };

      try {
        // Envoie l'événement à l'API pour l'ajouter dans la base de données
        const response = await axios.post('http://localhost:5000/events', eventData);

        // Si l'ajout est réussi, mets à jour l'état des événements
        console.log('Événement ajouté:', response.data);
        setEvents(prevEvents => [
          ...prevEvents,
          {
            title,
            start: new Date(response.data.start_time),  // Conversion du format MySQL en format Date
            end: new Date(response.data.end_time),      // Conversion du format MySQL en format Date
          }
        ]);
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
        startAccessor="start" // Le nom doit correspondre à l'objet `start` dans les événements
        endAccessor="end"     // Le nom doit correspondre à l'objet `end` dans les événements
        selectable
        onSelectSlot={handleSelectSlot}
        defaultView="week" // Vue par défaut : semaine
        views={['month', 'week', 'day']} // Permet de voir mois, semaine, jour
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default CalendarScheduler;
