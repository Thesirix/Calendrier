import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import Menu from '../Menu/menu.jsx';  // Importation du nouveau composant

const localizer = momentLocalizer(moment);

const CalendarScheduler = () => {
    const [events, setEvents] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/events');
            const eventsData = response.data.map(event => ({
                title: event.title,
                start: new Date(event.start_time),
                end: new Date(event.end_time),
                color: event.color || '#000000', // Couleur par défaut si non définie
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
            alert('Veuillez sélectionner un utilisateur');
            return;
        }

        const title = prompt('Entrer une horaire :');
        if (title) {
            const start_time = moment(start).format('YYYY-MM-DD HH:mm:ss');
            const end_time = moment(end).format('YYYY-MM-DD HH:mm:ss');

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
                console.error('Erreur lors de l\'ajout de l\'événement:', error);
            }
        }
    };

    return (
        <div className="calendar-container" style={{ height: '80vh', padding: '1rem' }}>
            <h2>Scheduler and Calendar</h2>
            <Menu selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
            <Calendar
                localizer={localizer}
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
                style={{ height: '100%' }}
            />
        </div>
    );
};

export default CalendarScheduler;