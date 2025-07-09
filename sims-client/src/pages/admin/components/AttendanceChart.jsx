import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaChartBar } from 'react-icons/fa'; // Import icon

const data = [
  {
    name: "Mon",
    present: 60,
    absent: 40,
  },
  {
    name: "Tue",
    present: 70,
    absent: 60,
  },
  {
    name: "Wed",
    present: 90,
    absent: 75,
  },
  {
    name: "Thu",
    present: 90,
    absent: 75,
  },
  {
    name: "Fri",
    present: 65,
    absent: 55,
  },
];

const AttendanceChart = () => {
  return (
    // Base padding for mobile (p-4), then larger for medium screens and up (md:p-6)
    // min-h-[350px] ensures it doesn't collapse on smaller devices.
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-md h-full flex flex-col min-h-[350px]">
      {/* Title Section */}
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
          <FaChartBar className="text-teal-500 text-lg sm:text-xl" /> Attendance Overview
        </h1>
      </div>
      {/* Chart Section */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barSize={25} // RESTORED: Bar thickness is now 25, same as before
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 10 }}
            tickLine={false}
            padding={{ left: 5, right: 5 }}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 10 }}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            contentStyle={{ borderRadius: "8px", borderColor: "#e0e0e0", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", fontSize: 12 }}
            labelStyle={{ color: '#374151', fontWeight: 'bold', fontSize: 12 }}
            itemStyle={{ color: '#4b5563', fontSize: 12 }}
          />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "5px", paddingBottom: "10px", fontSize: 11 }}
            iconType="circle"
          />
          <Bar
            dataKey="present"
            fill="#82ca9d"
            legendType="circle"
            radius={[6, 6, 0, 0]} // Keep this radius unless you want to revert to 8
          />
          <Bar
            dataKey="absent"
            fill="#ef4444"
            legendType="circle"
            radius={[6, 6, 0, 0]} // Keep this radius unless you want to revert to 8
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;