import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaChartLine } from 'react-icons/fa'; // Import icon

const data = [
  {
    name: "Jan",
    income: 4500, // Increased
    expense: 2400,
  },
  {
    name: "Feb",
    income: 3800, // Increased
    expense: 1398,
  },
  {
    name: "Mar",
    income: 7000, // Increased significantly
    expense: 4800, // Decreased
  },
  {
    name: "Apr",
    income: 3200, // Increased
    expense: 1908, // Decreased
  },
  {
    name: "May",
    income: 5000, // Increased significantly
    expense: 2800, // Decreased
  },
  {
    name: "Jun",
    income: 2800, // Increased
    expense: 1800, // Decreased
  },
  {
    name: "Jul",
    income: 4000, // Increased
    expense: 2300, // Decreased
  },
  {
    name: "Aug",
    income: 4800, // Increased
    expense: 2300, // Decreased
  },
  {
    name: "Sep",
    income: 5200, // Increased
    expense: 2300, // Decreased
  },
  {
    name: "Oct",
    income: 4900, // Increased
    expense: 2300, // Decreased
  },
  {
    name: "Nov",
    income: 5500, // Increased
    expense: 2300, // Decreased
  },
  {
    name: "Dec",
    income: 6000, // Increased
    expense: 2300, // Decreased
  },
];

function FinanceChart ()  {
  return (
    <div className="bg-white rounded-xl w-full h-full p-6 shadow-md flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaChartLine className="text-green-500" /> Financial Overview
        </h1>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> {/* Lighter grid lines */}
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={false}
            tickMargin={20}
          />
          <Tooltip
            contentStyle={{ borderRadius: "8px", borderColor: "#e0e0e0", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
            itemStyle={{ color: '#4b5563' }}
          />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "20px", fontSize: 13 }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981" // A pleasant green for income
            strokeWidth={3} // Slightly thinner line
            dot={{ r: 4 }} // Smaller dots
            activeDot={{ r: 8 }} // Larger active dots
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444" // Red for expense
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;