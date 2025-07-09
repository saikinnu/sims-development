import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react'; // Icon for attendance

const dataa = [
    {
      name: 'Week 1',
      present: 4000,
      absent: 2400,
    },
    {
      name: 'Week 2',
      present: 3000,
      absent: 1398,
    },
    {
      name: 'Week 3',
      present: 2000,
      absent: 9800,
    },
    {
      name: 'Week 4',
      present: 2780,
      absent: 3908,
    }
  ];

function TeacherAttendanceChart() {
    const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleString('default', { month: 'long' });

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp size={24} className="text-green-600" /> Teacher Attendance
                </h2>
                <span className="text-lg font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">95%</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">Last Month ({currentMonth})</p>
            <div className="flex-grow w-full h-full"> {/* Ensure responsive container fills parent */}
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={dataa}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs text-gray-600" />
                        <YAxis axisLine={false} tickLine={false} className="text-xs text-gray-600" />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                            labelStyle={{ fontWeight: 'bold', color: '#333' }}
                            itemStyle={{ color: '#555' }}
                        />
                        <Area type="monotone" dataKey="present" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPresent)" name="Present" />
                        <Area type="monotone" dataKey="absent" stroke="#ff7300" fillOpacity={1} fill="url(#colorAbsent)" name="Absent" />
                        <defs>
                            <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#ff7300" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default TeacherAttendanceChart;
