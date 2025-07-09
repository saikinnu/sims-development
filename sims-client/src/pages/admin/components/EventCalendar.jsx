import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaRegCalendarAlt, FaClock, FaInfoCircle } from 'react-icons/fa'; // Import icons

// TEMPORARY
const events = [
  {
    id: 1,
    title: "Project Submission Deadline",
    time: "10:00 AM - 11:00 AM",
    description: "Final submission for the Science Fair project.",
  },
  {
    id: 2,
    title: "Parent-Teacher Meeting",
    time: "02:00 PM - 05:00 PM",
    description: "Annual parent-teacher conference for grades 5-8.",
  },
  {
    id: 3,
    title: "School Play Rehearsal",
    time: "03:30 PM - 06:00 PM",
    description: "Dress rehearsal for the 'Annual Gala' play.",
  },
];

function EventCalendar () {
  const [value, onChange] = useState(new Date());

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <FaRegCalendarAlt className="text-blue-600" /> Event Calendar
        </h1>
        <Calendar
          onChange={onChange}
          value={value}
          className="w-full border-none rounded-lg shadow-inner p-2 text-sm"
        />
      </div>

      <div className="flex items-center justify-between mt-4 mb-3">
        <h1 className="text-xl font-semibold text-gray-800">Upcoming Events</h1>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar flex-1">
        {events.map((event) => (
          <div
            className="p-4 rounded-lg border border-gray-200 border-t-4 odd:border-t-blue-500 even:border-t-purple-500 shadow-sm transition-all duration-200 hover:shadow-md"
            key={event.id}
          >
            <div className="flex items-start justify-between mb-1">
              <h1 className="font-semibold text-gray-700 text-base flex items-center gap-1">
                <FaInfoCircle className="text-gray-400 text-sm" /> {event.title}
              </h1>
              <span className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                <FaClock className="text-gray-400 text-xs" /> {event.time}
              </span>
            </div>
            <p className="mt-2 text-gray-600 text-sm leading-snug">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;