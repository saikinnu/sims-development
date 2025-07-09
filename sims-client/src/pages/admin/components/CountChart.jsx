import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";
import { FaGraduationCap } from 'react-icons/fa'; // Import icon

const data = [
  {
    name: "Total",
    count: 106,
    fill: "white", // This will be the background, can be adjusted
  },
  {
    name: "Girls",
    count: 53,
    fill: "#facc15", // Tailwind yellow-500
  },
  {
    name: "Boys",
    count: 53,
    fill: "#3b82f6", // Tailwind blue-500
  },
];

function CountChart() {
  return (
    // Base padding for mobile (p-4), then larger for medium screens and up (md:p-6)
    // Min height to ensure visibility on smaller screens, flexible height for larger.
    <div className="bg-white rounded-xl w-full h-full p-4 md:p-6 shadow-md flex flex-col min-h-[300px] md:min-h-0">
      {/* TITLE */}
      <div className="flex justify-between items-center mb-3 md:mb-4"> {/* Smaller margin-bottom for mobile */}
        {/* Adjust font size for title and icon on smaller screens */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
          <FaGraduationCap className="text-indigo-500 text-lg sm:text-xl" /> Total Students
        </h1>
      </div>
      {/* CHART */}
      {/* Ensure the chart area remains responsive and scales appropriately */}
      <div className="relative w-full h-[60%] sm:h-[70%] flex items-center justify-center"> {/* Adjusted height ratio */}
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            barSize={15} // Slightly smaller bar size for mobile
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            {/* Using cornerRadius for rounded bars */}
            <RadialBar background clockWise dataKey="count" cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Adjusted image size for responsiveness */}
        <img
          src="/maleFemale.png" // Ensure this image exists in your public folder
          alt="Male Female Icon"
          width={60} // Smaller size for mobile
          height={60} // Smaller size for mobile
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain sm:w-70 sm:h-70" // Revert to larger on sm
        />
      </div>
      {/* BOTTOM */}
      {/* Adjust gap and margin-top for bottom section on mobile */}
      <div className="flex justify-center gap-4 sm:gap-8 mt-4 sm:mt-6">
        <div className="flex flex-col items-center gap-0.5 sm:gap-1"> {/* Smaller gap for mobile */}
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full shadow-md" /> {/* Smaller dot for mobile */}
          <h1 className="font-bold text-base sm:text-lg text-gray-800">1,234</h1> {/* Adjusted font size */}
          <h2 className="text-xs sm:text-sm text-gray-600">Boys (55%)</h2> {/* Adjusted font size */}
        </div>
        <div className="flex flex-col items-center gap-0.5 sm:gap-1">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 rounded-full shadow-md" />
          <h1 className="font-bold text-base sm:text-lg text-gray-800">1,234</h1>
          <h2 className="text-xs sm:text-sm text-gray-600">Girls (45%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;