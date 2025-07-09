import React from 'react';
import TeacherUserCard from '../components/TeacherUserCard';
import TeacherGradeChart from '../components/TeacherGradeChart';
import TeacherAttendanceChart from '../components/TeacherAttendanceChart';
import AssignmentsTable from '../components/AssignmentsTable';
import { LayoutDashboard } from 'lucide-react'; // Lucide icon for dashboard header
function TeacherPage() {
    const teacherCardData = [
        {
            type: 'Total Classes',
            value: 10,
        },
        {
            type: 'Total Students',
            value: 100,
        },
        {
            type: 'Average Grade',
            value: 85,
        }
    ]
    return (
        <>
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
                        {/* Dashboard Header */}
                {/* <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-blue-500">
                    <LayoutDashboard size={40} className="text-blue-600" />
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Teacher Dashboard</h1>
                </div> */}
                <div className='flex flex-wrap justify-between gap-4'>
                    {teacherCardData.map((item, index) => (
                        <TeacherUserCard key={index} type={item.type} value={item.value} />
                    ))}
                </div>
                <div className="flex gap-4 flex-col lg:flex-row">
                    <div className="w-full lg:w-1/3 h-[450px]">
                        <TeacherGradeChart />
                    </div>
                    <div className="w-full lg:w-2/3 h-[450px]">
                        <TeacherAttendanceChart />
                    </div>
                </div>
                <AssignmentsTable />
            </div>
        </>
    )
}

export default TeacherPage;