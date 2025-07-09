import React from 'react';

function UserCard ({ type }) {
  return (
    // Decrease vertical padding on small screens (mobile-first approach)
    // and potentially adjust min-width for very small screens if needed.
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-3 sm:p-4 flex-1 min-w-[130px] sm:min-w-[150px] lg:min-w-[180px]">
      <div className="flex justify-between items-center">
        {/* Adjusted font size for smaller screens */}
        <span className="text-[8px] sm:text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
      </div>
      {/* Decreased vertical margin for heading on mobile */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold my-2 sm:my-4">1,234</h1>
      {/* Adjusted font size for smaller screens */}
      <h2 className="capitalize text-xs sm:text-sm lg:text-base font-medium text-gray-500">{type}s</h2>
    </div>
  );
};

export default UserCard;