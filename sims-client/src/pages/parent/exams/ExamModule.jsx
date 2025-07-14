import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Award, Download, FileText, CheckCircle, XCircle, BarChart2, UserCheck, Star, CalendarDays, AlertCircle } from 'lucide-react';
import { FaUsers, FaCheckCircle } from "react-icons/fa";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';

const ExamModule = () => {
    const [parentInfo, setParentInfo] = useState({ children: [] });
    const [allStudentExamData, setAllStudentExamData] = useState({});
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const reportCardRef = useRef(null);

    // Fetch parent's children and their exam data
    useEffect(() => {
        const fetchParentData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get parent profile with linked students using axios
                const parentResponse = await axios.get('http://localhost:5000/api/parents/me', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || JSON.parse(localStorage.getItem('authToken'))}`,
                        'Content-Type': 'application/json'
                    }
                });
                const { linkedStudents } = parentResponse.data;

                // Format children data for the component
                const children = linkedStudents.map(student => ({
                    id: student.user_id,
                    name: student.full_name,
                    grade: student.class_id?.class_name || student.class_id || 'N/A',
                    rollNo: student.admission_number,
                    section: student.class_id?.section || 'N/A',
                    profilePic: student.profile_image?.url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
                }));

                setParentInfo({ children });

                // Fetch exam data for each child using axios
                const examDataPromises = children.map(async (child) => {
                    try {
                        const examResponse = await axios.get(`http://localhost:5000/api/students/exams/${child.id}`, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token') || JSON.parse(localStorage.getItem('authToken'))}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        return {
                            childId: child.id,
                            data: examResponse.data
                        };
                    } catch (err) {
                        console.error(`Error fetching exam data for child ${child.id}:`, err);
                        // Return empty data structure if exam data not found
                        return {
                            childId: child.id,
                            data: {
                                student: {
                                    id: child.id,
                                    rollNo: child.rollNo,
                                    name: child.name,
                                    class: child.grade,
                                    section: child.section,
                                    marks: {}
                                },
                                subjectsConfig: {}
                            }
                        };
                    }
                });

                const examDataResults = await Promise.all(examDataPromises);
                
                // Convert to the expected format
                const examDataMap = {};
                examDataResults.forEach(({ childId, data }) => {
                    examDataMap[childId] = {
                        marks: data.student?.marks || {},
                        subjectsConfig: data.subjectsConfig || {}
                    };
                });

                setAllStudentExamData(examDataMap);

                // Set initial selected child
                if (children.length > 0) {
                    setSelectedChildId(children[0].id);
                }

            } catch (err) {
                console.error('Error fetching parent data:', err);
                setError('Failed to load exam data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchParentData();
    }, []);

    // Derived state for the currently selected student and their exam config
    const loggedInStudent = useMemo(() => {
        return parentInfo.children.find(child => child.id === selectedChildId);
    }, [selectedChildId, parentInfo.children]);

    const currentExamData = useMemo(() => {
        return allStudentExamData[selectedChildId] || { marks: {}, subjectsConfig: {} };
    }, [selectedChildId, allStudentExamData]);

    const currentSubjectsConfig = currentExamData.subjectsConfig;

    // All useMemo hooks are now defined unconditionally at the top level
    const currentExams = useMemo(() => {
        if (!currentSubjectsConfig) {
            return [];
        }
        return Object.keys(currentSubjectsConfig).map((subject) => ({
            subject: subject,
            maxMarks: currentSubjectsConfig[subject].maxMarks,
            passingMarks: currentSubjectsConfig[subject].passingMarks,
        }));
    }, [currentSubjectsConfig]);

    const totalScoredMarks = useMemo(() => {
        let total = 0;
        if (currentExamData.marks && currentSubjectsConfig) {
            for (const subject in currentSubjectsConfig) {
                total += currentExamData.marks[subject] || 0;
            }
        }
        return total;
    }, [currentExamData.marks, currentSubjectsConfig]);

    const totalMaxMarks = useMemo(() => {
        let total = 0;
        if (currentSubjectsConfig) {
            for (const subject in currentSubjectsConfig) {
                total += currentSubjectsConfig[subject].maxMarks || 0;
            }
        }
        return total;
    }, [currentSubjectsConfig]);

    const overallPercentage = totalMaxMarks > 0 ? ((totalScoredMarks / totalMaxMarks) * 100).toFixed(2) : 0;

    const overallPerformanceCategory = useMemo(() => {
        if (overallPercentage >= 75) return { label: 'Excellent', color: 'text-green-700', icon: CheckCircle };
        if (overallPercentage >= 50) return { label: 'Good', color: 'text-yellow-700', icon: Award };
        return { label: 'Needs Improvement', color: 'text-red-700', icon: XCircle };
    }, [overallPercentage]);

    const passedAllSubjects = useMemo(() => {
        if (!currentSubjectsConfig || !currentExamData.marks) {
            return false;
        }
        for (const subject in currentSubjectsConfig) {
            const scored = currentExamData.marks[subject] || 0;
            const passing = currentSubjectsConfig[subject].passingMarks;
            if (scored < passing) {
                return false;
            }
        }
        return true;
    }, [currentExamData.marks, currentSubjectsConfig]);

    // getGrade is a regular function, not a hook, so its position is fine.
    const getGrade = (percentage) => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C+';
        if (percentage >= 40) return 'C';
        return 'F'; // Fail
    };

    const handleDownloadReportCard = async () => {
        const input = reportCardRef.current;
        if (input) {
            try {
                const canvas = await html2canvas(input, {
                    scale: 2,
                    useCORS: true,
                    logging: true,
                    scrollY: -window.scrollY,
                    windowWidth: document.documentElement.offsetWidth,
                    windowHeight: document.documentElement.offsetHeight
                });

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210;
                const pageHeight = 297;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                pdf.save(`ReportCard_${loggedInStudent.name.replace(/\s/g, '')}_${loggedInStudent.rollNo}.pdf`);
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Failed to generate report card. Please try again.');
            }
        } else {
            alert('Report card content not found for download.');
        }
    };

    // Handle child selection
    const handleChildSelect = (childId) => {
        setSelectedChildId(childId);
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading exam data...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // No children state
    if (parentInfo.children.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <FaUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No children found in your account.</p>
                    <p className="text-gray-500 text-sm">Please contact the school administration if this is incorrect.</p>
                </div>
            </div>
        );
    }

    return (
    <div className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
                {/* Header and Download Button */}
                 <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 sm:items-center mb-4 sm:mb-6">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <FileText size={36} className="text-blue-600" /> Academic Report
                    </h1>
                    <button
                        onClick={handleDownloadReportCard}
                        className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-teal-600 text-white hover:bg-teal-700 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        <Download size={18} /> 
                        <span>Download Report</span>
                    </button>
                </div>

                {/* Children Selector */}
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {parentInfo.children.map(child => (
                            <div
                                key={child.id}
                                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                                    ${selectedChildId === child.id ? 'border-blue-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                                onClick={() => handleChildSelect(child.id)}
                            >
                                <img
                                    src={child.profilePic}
                                    alt={child.name}
                                    className="rounded-full mr-3 border border-gray-200"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                                <div className="flex-grow">
                                    <h6 className="mb-0 font-semibold text-gray-800">{child.name}</h6>
                                    <small className="text-gray-500">
                                        {child.grade} {child.rollNo && `• Roll No: ${child.rollNo}`}
                                    </small>
                                </div>
                                {selectedChildId === child.id && (
                                    <FaCheckCircle className="text-blue-500 ml-auto" size={20} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Display message if no child is selected or no children exist */}
                {!selectedChildId && (
                    <div className="bg-blue-50 p-4 rounded-lg text-blue-800 flex items-center justify-center mb-6 shadow-sm">
                        <AlertCircle className="mr-2" size={20} />
                        Please select a child to view exam results.
                    </div>
                )}

                {selectedChildId && (
                    <div ref={reportCardRef} className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">
                        {/* Student Info */}
                        <div className="bg-blue-50 p-6 rounded-lg flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 border border-blue-200 ">
                            <UserCheck size={48} className="text-blue-700 shrink-0" />
                            <div>
                                <p className="text-2xl font-bold text-blue-900 mb-1">{loggedInStudent.name}</p>
                                <p className="text-md text-blue-700">
                                    Roll No: <span className="font-semibold">{loggedInStudent.rollNo}</span> |
                                    Class: <span className="font-semibold">{loggedInStudent.grade}</span> |
                                    Section: <span className="font-semibold">{loggedInStudent.section}</span>
                                </p>
                                <p className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                                    <CalendarDays size={16} /> Report Date: {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Overall Performance Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            {/* Total Marks Card */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-lg shadow-lg flex flex-col justify-between h-36">
                                <p className="text-sm font-medium opacity-90 mb-2">Total Marks Scored</p>
                                <p className="text-5xl font-bold">{totalScoredMarks} / {totalMaxMarks}</p>
                            </div>

                            {/* Overall Percentage Card */}
                            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col justify-between h-36">
                                <p className="text-sm font-medium text-gray-600 mb-2">Overall Percentage</p>
                                <div className={`flex items-center gap-3 ${overallPerformanceCategory.color}`}>
                                    <overallPerformanceCategory.icon size={40} />
                                    <span className="text-5xl font-bold">{overallPercentage}%</span>
                                </div>
                            </div>

                            {/* Overall Pass/Fail Status */}
                            <div className={`p-6 rounded-lg shadow-lg border ${passedAllSubjects ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} flex flex-col justify-between h-36`}>
                                <p className="text-sm font-medium text-gray-600 mb-2">Overall Status</p>
                                <div className={`flex items-center gap-3 ${passedAllSubjects ? 'text-green-800' : 'text-red-800'}`}>
                                    {passedAllSubjects ? <Star size={40} /> : <XCircle size={40} />}
                                    <span className="text-5xl font-bold">{passedAllSubjects ? 'Passed' : 'Failed'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Subject-wise Marks Table */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <BarChart2 size={28} className="text-blue-500" /> Subject-wise Performance
                        </h2>
                        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Marks</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passing Marks</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks Scored</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage (%)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Object.keys(currentSubjectsConfig).map((subject) => {
                                        const exam = {
                                            subject: subject,
                                            maxMarks: currentSubjectsConfig[subject].maxMarks,
                                            passingMarks: currentSubjectsConfig[subject].passingMarks,
                                        };
                                        const scored = currentExamData.marks[exam.subject] || 0;
                                        const percentage = exam.maxMarks > 0 ? ((scored / exam.maxMarks) * 100).toFixed(2) : 0;
                                        const grade = getGrade(percentage);
                                        const status = scored >= exam.passingMarks ? 'Pass' : 'Fail';
                                        const statusColor = status === 'Pass' ? 'text-green-600 font-bold' : 'text-red-600 font-bold';

                                        return (
                                            <tr key={exam.subject} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exam.subject}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exam.maxMarks}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{exam.passingMarks}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{scored}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{percentage}%</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-700">{grade}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${statusColor}`}>{status}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-8 p-5 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-200">
                            <h3 className="font-bold text-base mb-2">Grading Scale:</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>**90-100%**: A+ (Excellent)</li>
                                <li>**80-89%**: A (Very Good)</li>
                                <li>**70-79%**: B+ (Good)</li>
                                <li>**60-69%**: B (Above Average)</li>
                                <li>**50-59%**: C+ (Average)</li>
                                <li>**40-49%**: C (Below Average)</li>
                                <li>**Below 40%**: F (Fail)</li>
                            </ul>
                            <p className="mt-3 font-semibold text-blue-900">
                                <span className="font-bold">Important Note:</span> A student must score equal to or above the 'Passing Marks' in each individual subject to be considered passed in that subject.
                            </p>
                        </div>
                    </div>
                )}
            </div>
    );
};

export default ExamModule;
