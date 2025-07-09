import React, { useState, useEffect } from 'react';
import { PlusCircle, Calendar as CalendarIcon, Edit, Trash2, Info } from 'lucide-react';
import Calendar from './Calendar';
import AddEvent from './AddEvent';
import EventDetails from './EventDetails';

const EventModule = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [allEvents, setAllEvents] = useState([
        { 
            id: 1, 
            title: 'Project Deadline', 
            eventName: 'History Project Submission',
            description: 'Final submission for History project', 
            startDate: '2025-06-25', 
            endDate: '2025-06-25', 
            eventType: ['Academic'], 
            targetAudience: ['Students'], 
            status: 'upcoming',
            color: '#3B82F6' 
        },
        { 
            id: 2, 
            title: 'Team Meeting', 
            eventName: 'Q3 Planning Session',
            description: 'Discussion on Q3 planning', 
            startDate: '2025-06-28', 
            endDate: '2025-06-28', 
            eventType: ['Meeting'], 
            targetAudience: ['Teachers'], 
            status: 'upcoming',
            color: '#3B82F6' 
        }
    ]);

    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedEventDetails, setSelectedEventDetails] = useState(null);

    const monthlyEvents = allEvents.filter(event => {
        const eventStartDate = new Date(event.startDate);
        const eventEndDate = new Date(event.endDate);
        const calendarMonth = currentMonth.getMonth();
        const calendarYear = currentMonth.getFullYear();

        return (
            (eventStartDate.getMonth() === calendarMonth && eventStartDate.getFullYear() === calendarYear) ||
            (eventEndDate.getMonth() === calendarMonth && eventEndDate.getFullYear() === calendarYear) ||
            (eventStartDate < new Date(calendarYear, calendarMonth, 1) && eventEndDate > new Date(calendarYear, calendarMonth + 1, 0))
        );
    });

    const handleSaveEvent = (newEvent) => {
        if (editingEvent) {
            setAllEvents(prevEvents => prevEvents.map(evt =>
                evt.id === newEvent.id ? { 
                    ...newEvent,
                    color: evt.color
                } : evt
            ));
        } else {
            const newId = Math.max(...allEvents.map(e => e.id), 0) + 1;
            setAllEvents(prevEvents => [...prevEvents, { 
                ...newEvent, 
                id: newId,
                color: '#3B82F6'
            }]);
        }
        setEditingEvent(null);
        setShowAddEditModal(false);
    };

    const handleDeleteEvent = (id) => {
        setAllEvents(prevEvents => prevEvents.filter(evt => evt.id !== id));
        setSelectedEventDetails(null);
        setShowDetailsModal(false);
    };

    const openAddEventModal = () => {
        setEditingEvent(null);
        setShowAddEditModal(true);
    };

    const openEditEventModal = (event) => {
        setEditingEvent(event);
        setShowDetailsModal(false);
        setShowAddEditModal(true);
    };

    useEffect(() => {
        if (selectedDate && selectedDate.events && selectedDate.events.length > 0) {
            setSelectedEventDetails(selectedDate.events[0]);
            setShowDetailsModal(true);
        }
    }, [selectedDate]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
            <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <CalendarIcon size={32} className="text-indigo-600" />
                        Event Calendar
                    </h1>
                <button
                    onClick={openAddEventModal}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <PlusCircle size={20} className="mr-2" /> Add Event
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Calendar
                        currentMonth={currentMonth}
                        setCurrentMonth={setCurrentMonth}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        events={monthlyEvents}
                        monthlyAttendanceData={null}
                    />
                </div>

                <div className="lg:col-span-1 bg-white rounded-lg shadow border border-gray-200 p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {selectedDate && selectedDate.date ? `Events on ${selectedDate.date.toLocaleDateString()}` : 'Upcoming Events'}
                    </h2>

                    {selectedDate && selectedDate.events && selectedDate.events.length > 0 ? (
                        <div className="space-y-3">
                            {selectedDate.events.map(event => (
                                <div key={event.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-blue-800">{event.title}</p>
                                        <p className="text-xs text-blue-600">
                                            {formatDate(event.startDate)}
                                            {event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setSelectedEventDetails(event); setShowDetailsModal(true); }}
                                            className="p-1 rounded-full text-blue-600 hover:bg-blue-200"
                                            title="View details"
                                        >
                                            <Info size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : selectedDate && selectedDate.date ? (
                        <div className="text-center text-gray-500 py-4">
                            <CalendarIcon className="mx-auto mb-2 text-gray-400" size={24} />
                            <p>No events for this date.</p>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-4">
                            <CalendarIcon className="mx-auto mb-2 text-gray-400" size={24} />
                            <p>Select a date or see list below.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">All Events</h2>
                {allEvents.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {allEvents.sort((a,b) => new Date(a.startDate) - new Date(b.startDate)).map(event => (
                            <li key={event.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-900">{event.title}</p>
                                    <p className="text-sm text-gray-600">
                                        {formatDate(event.startDate)}
                                        {event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}
                                        {event.eventType && event.eventType.length > 0 && (
                                            <span className="ml-2 text-gray-500">({event.eventType.join(', ')})</span>
                                        )}
                                    </p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <button
                                        onClick={() => { setSelectedEventDetails(event); setShowDetailsModal(true); }}
                                        className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                                        title="View details"
                                    >
                                        <Info size={18} />
                                    </button>
                                    <button
                                        onClick={() => openEditEventModal(event)}
                                        className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                                        title="Edit event"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteEvent(event.id)}
                                        className="p-1 rounded-full text-red-600 hover:bg-red-100"
                                        title="Delete event"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-gray-500 py-4">
                        <p>No events added yet. Click "Add Event" to get started!</p>
                    </div>
                )}
            </div>

            <AddEvent
                show={showAddEditModal}
                onClose={() => setShowAddEditModal(false)}
                onSave={handleSaveEvent}
                eventToEdit={editingEvent}
            />

            <EventDetails
                show={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                event={selectedEventDetails}
                onEdit={openEditEventModal}
                onDelete={handleDeleteEvent}
                editable={true}
            />
        </div>
    );
};

export default EventModule;