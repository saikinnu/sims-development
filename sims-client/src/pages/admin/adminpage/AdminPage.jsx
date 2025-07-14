import Announcements from "../components/Announcements";
import AttendanceChart from "../components/AttendanceChart";
import CountChart from "../components/CountChart";
import EventCalendar from "../components/EventCalendar";
import FinanceChart from "../components/FinanceChart";
import UserCard from "../components/UserCard";
import { useEffect, useState } from "react";
import api from "../../../utils/axiosConfig";
import { teacherAPI } from "../../../services/api";
import axios from "axios";

function AdminPage() {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [parentCount, setParentCount] = useState(0);

  useEffect(() => {
    // Fetch student count
    api.get("/students/count")
      .then(res => setStudentCount(res.data.count))
      .catch(() => setStudentCount(0));
    // Fetch teacher count
  }, []);
  const getTeacherCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teachers/count', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('authToken'))}`
        }
      });
      return response.data.count;
    } catch (error) {
      console.error('Error fetching teacher count:', error);
      return 0;
    }
  }
  useEffect(() => {
    getTeacherCount().then(count => setTeacherCount(count));
  }, []);

  const getParentCount = async () => {
    console.log('getParentCount called');
    try {
      const response = await axios.get('http://localhost:5000/api/parents/count', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('authToken'))}`
        }
      });
      return response.data.count;
    } catch (error) {
      console.log('Error fetching parent count:', error);
      // console.error('Error fetching parent count:', error);
      return 0;
    }
  }
  useEffect(() => {
    getParentCount().then(count => setParentCount(count));
  }, []);
  return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
      {/* USER CARDS - Now completely edge-to-edge */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3 lg:gap-6 w-full">
        <UserCard type="student" count={studentCount} />
        <UserCard type="teacher" count={teacherCount} />
        <UserCard type="parent" count={parentCount} />
        <UserCard type="staff" />
      </div>

      <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 lg:gap-8 w-full">
        {/* LEFT SECTION - Zero side margins */}
        <div className="w-full lg:w-2/3 flex flex-col gap-2 sm:gap-4 lg:gap-8">
          {/* MIDDLE CHARTS - No gaps between */}
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 lg:gap-8 lg:h-[480px] w-full">
            <div className="w-full lg:w-1/3 h-[300px] lg:h-auto">
              <CountChart />
            </div>
            <div className="w-full lg:w-2/3 h-[300px] lg:h-auto">
              <AttendanceChart />
            </div>
          </div>

          {/* BOTTOM CHART - Full bleed */}
          <div className="w-full h-[400px] lg:h-[500px]">
            <FinanceChart />
          </div>
        </div>

        {/* RIGHT SECTION - Edge-to-edge */}
        <div className="w-full lg:w-1/3 flex flex-col gap-2 sm:gap-4 lg:gap-8">
          <EventCalendar />
        </div>
      </div>

      {/* ANNOUNCEMENTS - Full width no padding */}
      <div className="w-full">
        <Announcements />
      </div>
    </div>
  );
};
export default AdminPage;