import { Link } from 'react-router-dom';
import React from 'react';
import { FaBullhorn, FaArrowRight, FaCalendarAlt } from 'react-icons/fa'; // Import icons

function Announcements () {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBullhorn className="text-purple-600" /> Announcements
          </h1>
          <Link to="/announcements" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors duration-200">
            View All <FaArrowRight className="text-xs" />
          </Link>
        </div>
        <div className="flex flex-col gap-4 mt-2 overflow-y-auto custom-scrollbar flex-1">
          <div className="bg-blue-50 bg-opacity-70 rounded-lg p-4 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-2">
              <h2 className="font-semibold text-gray-800 text-base leading-snug">Important Exam Schedule Update</h2>
              <span className="text-xs text-gray-600 bg-white bg-opacity-70 rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                <FaCalendarAlt className="text-gray-400 text-xs" /> 2025-01-01
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1 leading-snug">
              Please note the revised schedule for the mid-term examinations. Check the portal for details.
            </p>
          </div>
          <div className="bg-purple-50 bg-opacity-70 rounded-lg p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-2">
              <h2 className="font-semibold text-gray-800 text-base leading-snug">Annual Sports Day Approaching!</h2>
              <span className="text-xs text-gray-600 bg-white bg-opacity-70 rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                <FaCalendarAlt className="text-gray-400 text-xs" /> 2025-01-01
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1 leading-snug">
              Get ready for a day of fun and competition! Sign-ups for events start next week.
            </p>
          </div>
          <div className="bg-yellow-50 bg-opacity-70 rounded-lg p-4 border border-yellow-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-2">
              <h2 className="font-semibold text-gray-800 text-base leading-snug">Reminder: School Holiday</h2>
              <span className="text-xs text-gray-600 bg-white bg-opacity-70 rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                <FaCalendarAlt className="text-gray-400 text-xs" /> 2025-01-01
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1 leading-snug">
              The school will be closed on January 26th for Republic Day. Classes will resume on January 27th.
            </p>
          </div>
        </div>
      </div>
    );
  };

  export default Announcements;