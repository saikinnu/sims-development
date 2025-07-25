import React, { useState, useEffect } from 'react';
import Table from './AttendanceTable';
import axios from 'axios';
import { Search, CalendarDays, Users, GraduationCap } from 'lucide-react';

const TABS = [
  { label: 'Students', value: 'students', icon: Users },
  { label: 'Teachers', value: 'teachers', icon: GraduationCap },
];

const getToday = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

const AttendanceModule = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [search, setSearch] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch students and teachers on mount
  useEffect(() => {
    const fetchRoster = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = JSON.parse(localStorage.getItem('authToken'));
        const headers = { Authorization: `Bearer ${token}` };
        const [studentsRes, teachersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/students/', { headers }),
          axios.get('http://localhost:5000/api/teachers/', { headers }),
        ]);
        setStudents(studentsRes.data.map(student => ({
          id: student._id,
          studentId: student.user_id,
          name: student.full_name,
          class: student.class_id,
          photo: student.profile_image?.url || '',
        })));
        setTeachers(teachersRes.data.map(teacher => ({
          id: teacher._id,
          teacherId: teacher.user_id,
          name: teacher.full_name,
          subjects: teacher.subjects_taught || [],
          photo: teacher.profile_image?.url || '',
        })));
      } catch (err) {
        setError('Failed to fetch roster.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoster();
  }, []);

  // Fetch attendance for selected date and tab
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = JSON.parse(localStorage.getItem('authToken'));
        const headers = { Authorization: `Bearer ${token}` };
        let url = '';
        if (activeTab === 'students') {
          url = `http://localhost:5000/api/student-attendance/bulk/date?date=${selectedDate}`;
        } else {
          url = `http://localhost:5000/api/teacher-attendance/bulk/date?date=${selectedDate}`;
        }
        const res = await axios.get(url, { headers });
        // Map attendance by id
        const att = {};
        if (activeTab === 'students') {
          res.data.forEach(a => {
            att[a.student_id?._id || a.student_id] = a.status;
          });
        } else {
          res.data.forEach(a => {
            att[a.teacher_id?._id || a.teacher_id] = a.status;
          });
        }
        setAttendance(att);
      } catch (err) {
        setError('Failed to fetch attendance.');
        setAttendance({});
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [selectedDate, activeTab]);

  const handleStatusChange = (type, id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const handleSaveAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = JSON.parse(localStorage.getItem('authToken'));
      const headers = { Authorization: `Bearer ${token}` };
      let url = '', records = [];
      if (activeTab === 'students') {
        url = 'http://localhost:5000/api/student-attendance/bulk';
        records = students.map(s => ({ student_id: s.id, status: attendance[s.id] || 'Present' }));
      } else {
        url = 'http://localhost:5000/api/teacher-attendance/bulk';
        records = teachers.map(t => ({ teacher_id: t.id, status: attendance[t.id] || 'Present' }));
      }
      await axios.post(url, { date: selectedDate, records }, { headers });
      alert('Attendance saved!');
    } catch (err) {
      setError('Failed to save attendance.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.class || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.studentId || '').toLowerCase().includes(search.toLowerCase())
  );
  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.subjects.join(', ') || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.teacherId || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <CalendarDays size={32} className="text-indigo-600" />
          Attendance Management
        </h1>
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Toggle Search"
        >
          <Search size={24} />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 border-b border-gray-200 pb-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-t-lg font-medium text-lg transition-colors duration-200
                ${activeTab === tab.value
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <Icon size={20} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Date Selector and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <label htmlFor="attendance-date" className="font-semibold text-gray-700">Date:</label>
          <input
            id="attendance-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          />
        </div>

        {/* Search Input - Desktop */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder={`Search by name, ${activeTab === 'students' ? 'class or ID' : 'subjects or ID'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 w-72"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Search Input - Mobile (toggleable) */}
        {showMobileSearch && (
          <div className="relative w-full md:hidden mt-4">
            <input
              type="text"
              placeholder={`Search by name, ${activeTab === 'students' ? 'class or ID' : 'subjects or ID'}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 w-full"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        )}
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-inner border border-gray-200">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : activeTab === 'students' ? (
          <Table
            columns={[
              { header: 'Date', accessor: 'date', className: 'w-24 px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
              { header: 'Photo', accessor: 'photo', className: 'w-16 px-4 py-3' },
              { header: 'Name', accessor: 'name', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
              { header: 'Student ID', accessor: 'studentId', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
              { header: 'Class', accessor: 'class', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
              { header: 'Status', accessor: 'status', className: 'w-36 px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
            ]}
            data={filteredStudents}
            renderRow={(student) => (
              <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150">
                <td className="py-3 px-4 text-sm text-gray-800">{selectedDate}</td>
                <td className="py-3 px-4"><img src={student.photo} alt={student.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" /></td>
                <td className="py-3 px-4 text-sm text-gray-800 font-medium">{student.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{student.studentId}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{student.class}</td>
                <td className="py-3 px-4">
                  <select
                    value={attendance[student.id] || 'Present'}
                    onChange={(e) => handleStatusChange('students', student.id, e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Leave">Leave</option>
                  </select>
                </td>
              </tr>
            )}
          />
        ) : (
          <Table
            columns={[
              { header: 'Date', accessor: 'date', className: 'w-24 px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
              { header: 'Photo', accessor: 'photo', className: 'w-16 px-4 py-3' },
              { header: 'Name', accessor: 'name', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
              { header: 'Emp ID', accessor: 'teacherId', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
              { header: 'Subjects', accessor: 'subjects', className: 'px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
              { header: 'Status', accessor: 'status', className: 'w-36 px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider' },
            ]}
            data={filteredTeachers}
            renderRow={(teacher) => (
              <tr key={teacher.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150">
                <td className="py-3 px-4 text-sm text-gray-800">{selectedDate}</td>
                <td className="py-3 px-4"><img src={teacher.photo} alt={teacher.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" /></td>
                <td className="py-3 px-4 text-sm text-gray-800 font-medium">{teacher.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{teacher.teacherId}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{teacher.subjects.join(', ')}</td>
                <td className="py-3 px-4">
                  <select
                    value={attendance[teacher.id] || 'Present'}
                    onChange={(e) => handleStatusChange('teachers', teacher.id, e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Leave">Leave</option>
                  </select>
                </td>
              </tr>
            )}
          />
        )}
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSaveAttendance}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
          disabled={loading}
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
};

export default AttendanceModule;