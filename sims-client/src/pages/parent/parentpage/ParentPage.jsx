import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaBell,
  FaCalendarAlt,
  FaBook,
  FaAward,
  FaChartLine,
  FaChartPie,
  FaClipboardList,
  FaClock,
  FaBookmark,
  FaComments,
  FaRupeeSign,
  FaUsers,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaArrowRight,
  FaCheck,
  FaTimes,
  FaMinusCircle,
  FaDownload,
  FaSyncAlt,
  FaInfoCircle,
  FaGraduationCap, // Added for examination results icon
  FaExclamationTriangle, // For social science (warning icon)
  FaClipboardCheck // For general subjects
} from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Container, Row, Col, Card, Badge, Button, ProgressBar, ListGroup, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const ParentPage = () => {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState(null);
  const [error, setError] = useState(null);
  const [totalPendingFees, setTotalPendingFees] = useState(0);

  // Mock data for the parent dashboard
  const parentInfo = {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 987-6543",
    children: [
      {
        id: 1,
        name: "Alex Johnson",
        grade: "Grade 10",
        rollNumber: "A1001",
        profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
        attendance: [
          { name: 'Present', value: 45, color: '#1cc88a' },
          { name: 'Absent', value: 3, color: '#e74a3b' },
          { name: 'Late', value: 2, color: '#f6c23e' }
        ],
        performance: [
          { subject: 'Math', score: 88, average: 75 },
          { subject: 'Science', score: 92, average: 78 },
          { subject: 'English', score: 75, average: 70 } // Added a third subject
        ],
        events: [
          { id: 1, title: "Parent-Teacher Meeting", date: "July 15, 2023", time: "4:00 PM" },
          { id: 3, title: "Sports Day", date: "July 25, 2023", time: "9:00 AM" }
        ],
        payments: [
          { id: 1, date: "July 1, 2023", amount: "₹150.00", status: "Paid", isPaid: true },
          { id: 2, date: "June 1, 2023", amount: "₹120.00", status: "Paid", isPaid: true },
          { id: 4, date: "Aug 1, 2023", amount: "₹200.00", status: "Pending", isPaid: false }
        ],
        examResults: [
          { id: 1, subject: "Biology", type: "Formative Assessment - 1", score: 79, maxScore: 100, date: "May 1, 2025", icon: <FaClipboardCheck /> },
          { id: 2, subject: "Social", type: "Formative Assessment - 1", score: 70, maxScore: 100, date: "April 28, 2025", icon: <FaExclamationTriangle className="text-warning" /> },
          { id: 3, subject: "Maths", type: "Formative Assessment - 1", score: 88, maxScore: 100, date: "April 15, 2025", icon: <FaClipboardCheck /> },
          { id: 4, subject: "English", type: "Formative Assessment - 1", score: 75, maxScore: 100, date: "March 20, 2025", icon: <FaClipboardCheck /> },
          { id: 5, subject: "Physics", type: "Formative Assessment - 1", score: 91, maxScore: 100, date: "Jan 10, 2025", icon: <FaAward className="text-info" /> },
          { id: 6, subject: "Chemistry", type: "Formative Assessment - 1", score: 82, maxScore: 100, date: "Dec 5, 2024", icon: <FaClipboardCheck /> }
        ]
      },
      {
        id: 2,
        name: "Emily Johnson",
        grade: "Grade 8",
        rollNumber: "E8002",
        profilePic: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
        attendance: [
          { name: 'Present', value: 40, color: '#1cc88a' },
          { name: 'Absent', value: 2, color: '#e74a3b' },
          { name: 'Late', value: 8, color: '#f6c23e' }
        ],
        performance: [
          { subject: 'English', score: 85, average: 80 },
          { subject: 'History', score: 78, average: 72 },
          { subject: 'Geography', score: 90, average: 85 } // Added a third subject
        ],
        events: [
          { id: 2, title: "Science Fair", date: "July 20, 2023", time: "10:00 AM" },
          { id: 3, title: "Sports Day", date: "July 25, 2023", time: "9:00 AM" }
        ],
        payments: [
          { id: 3, date: "May 1, 2023", amount: "₹270.00", status: "Paid", isPaid: true },
          { id: 5, date: "Sept 1, 2023", amount: "₹180.00", status: "Pending", isPaid: false }
        ],
        examResults: [
          { id: 1, subject: "Maths", type: "Mid-Term", score: 72, maxScore: 100, date: "April 10, 2025", icon: <FaClipboardCheck /> },
          { id: 2, subject: "Science", type: "Mid-Term", score: 80, maxScore: 100, date: "April 5, 2025", icon: <FaClipboardCheck /> },
          { id: 3, subject: "Art", type: "Project Grade", score: 95, maxScore: 100, date: "March 28, 2025", icon: <FaAward className="text-info" /> }
        ]
      }
    ]
  };

  // Effect to set the initial selected child when the component mounts
  useEffect(() => {
    try {
      if (parentInfo.children && parentInfo.children.length > 0) {
        setSelectedChild(parentInfo.children[0]);
      }
    } catch (err) {
      setError(err);
    }
  }, []);

  // Effect to calculate total pending fees whenever children data changes
  useEffect(() => {
    const calculateTotalPendingFees = () => {
      let total = 0;
      parentInfo.children.forEach(child => {
        child.payments.forEach(payment => {
          if (!payment.isPaid) {
            total += parseFloat(payment.amount.replace(/[₹$]/g, ''));
          }
        });
      });
      setTotalPendingFees(total);
    };

    calculateTotalPendingFees();
  }, [parentInfo.children]);

  // Helper function to get data for the currently selected child
  const getChildData = () => {
    if (!selectedChild) {
      return {
        attendanceData: [],
        performanceData: [],
        events: [],
        payments: [],
        examResults: []
      };
    }

    return {
      attendanceData: selectedChild.attendance || [],
      performanceData: selectedChild.performance || [],
      events: selectedChild.events || [],
      payments: selectedChild.payments || [],
      examResults: selectedChild.examResults || []
    };
  };

  const { attendanceData, performanceData, events, payments, examResults } = getChildData();

  // Dashboard statistics based on selected child's data
  const stats = [
    { icon: <FaChartLine size={24} />, title: "Performance", value: selectedChild ? "B+" : "--", color: "#4e73df", trend: "up" },
    { icon: <FaBook size={24} />, title: "Pending Approvals", value: 2, color: "#f6c23e", trend: "steady" },
    { icon: <FaCalendarAlt size={24} />, title: "Upcoming Events", value: events?.length || 0, color: "#1cc88a" },
    {
      icon: <FaRupeeSign size={24} />,
      title: "Fee Status",
      value: totalPendingFees > 0 ? `₹${totalPendingFees.toFixed(2)} Due` : "Paid",
      color: totalPendingFees > 0 ? "#e74a3b" : "#36b9cc",
    }
  ];

  // Handler for selecting a different child
  const handleViewChild = (child) => {
    setSelectedChild(child);
  };

  // Handler for navigating to the Events Calendar
  const handleViewCalendar = () => {
    navigate('events'); // Changed from /parent/calendar to /events
  };

  // Handler for navigating to the Full Report (Exams page)
  const handleViewFullReport = () => {
    if (selectedChild) {
      navigate('exams'); // Navigate to exams page
    }
  };

  // Handler for navigating to the Messages page
  const handleMessageTeacher = () => {
    navigate('messages'); // Navigate to messages page
  };

  // Handler for navigating to the Fees page
  const handlePayFees = () => {
    navigate('fee'); // Navigate to fees page
  };

  // Helper function to determine score color for exam results
  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-success';
    if (percentage >= 75) return 'text-primary';
    if (percentage >= 60) return 'text-warning';
    return 'text-danger';
  };

  // --- Error and Empty State Handling ---
  if (error) {
    return (
      <Container fluid className="py-5 bg-light min-vh-100 d-flex justify-content-center align-items-center">
        <Alert variant="danger" className="text-center shadow-lg p-4 rounded-3">
          <h4 className="alert-heading mb-3">
            <FaTimes className="me-2" />Error Loading Dashboard
          </h4>
          <p className="lead">{error.message}</p>
          <hr />
          <Button variant="primary" onClick={() => window.location.reload()} className="mt-2">
            <FaSyncAlt className="me-2" />Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!parentInfo.children || parentInfo.children.length === 0) {
    return (
      <Container fluid className="py-5 bg-light min-vh-100 d-flex justify-content-center align-items-center">
        <Alert variant="info" className="text-center shadow-lg p-4 rounded-3">
          <h4 className="alert-heading mb-3">
            <FaInfoCircle className="me-2" />No Children Registered
          </h4>
          <p className="lead">Please contact school administration to register your children.</p>
        </Alert>
      </Container>
    );
  }

  // --- Main Render ---
  return (
    <Container fluid className="px-0 sm:px-2 md:px-4 lg:p-6 flex flex-col gap-2 sm:gap-4 lg:gap-8">

      {/* Children Selector */}
      <Card className="mb-4 border-0 shadow-sm rounded-4">
        <Card.Body className="p-4">
          {/* <h5 className="mb-4 fw-bold d-flex align-items-center text-dark">
            <FaUsers className="me-2 text-secondary" size={22} />
            My Children
          </h5> */}
          <Row className="g-3">
            {parentInfo.children.map(child => (
              <Col key={child.id} xs={12} md={6}>
                <Card
                  className={`h-100 border-2 rounded-3 transition-all cursor-pointer ${selectedChild?.id === child.id ? 'border-primary shadow-sm' : 'border-light-subtle'}`}
                  onClick={() => handleViewChild(child)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="d-flex align-items-center p-3">
                    <img
                      src={child.profilePic}
                      alt={child.name}
                      className="rounded-circle me-3 border border-2 border-light"
                      style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-0 fw-bold text-dark">{child.name}</h6>
                      <small className="text-muted d-block">{child.grade} {child.rollNumber && `• Roll No: ${child.rollNumber}`}</small>
                      {child.school && <small className="text-muted">{child.school}</small>}
                    </div>
                    {selectedChild?.id === child.id && (
                      <div className="ms-auto text-primary">
                        <FaCheckCircle size={22} />
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Selected Child Info - Modernized and integrated */}
      {selectedChild && (
        <Card className="mb-4 border-0 shadow-sm rounded-4 bg-primary-subtle text-primary-emphasis">
          <Card.Body className="p-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <img
                src={selectedChild.profilePic}
                alt={selectedChild.name}
                className="rounded-circle me-3 border border-primary"
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
              />
              <div>
                <h5 className="mb-0 fw-bold">{selectedChild.name}</h5>
                <p className="mb-0 text-dark-emphasis">
                  {selectedChild.grade}
                  {selectedChild.rollNumber && ` • Roll No: ${selectedChild.rollNumber}`}
                  {selectedChild.school && ` • ${selectedChild.school}`}
                </p>
              </div>
            </div>
            <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
              View Profile <FaArrowRight className="ms-2" />
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        {stats.map((stat, index) => (
          <Col key={index} xs={12} sm={6} md={3}>
            <Card className="h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all">
              <Card.Body className="p-4">
                <div className="d-flex align-items-start">
                  <div className={`p-3 rounded-circle me-3 flex-shrink-0 shadow-sm`}
                    style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div>
                    <h6 className="text-muted text-uppercase fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>
                      {stat.title}
                    </h6>
                    <div className="d-flex align-items-center">
                      <h4 className="mb-0 fw-bold text-dark me-2">{stat.value}</h4>
                      {stat.trend === 'up' && <FaChartLine size={18} className="text-success" />}
                      {stat.trend === 'down' && <FaChartLine size={18} className="text-danger" style={{ transform: 'rotate(180deg)' }} />}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content */}
      <Row className="g-4 mb-4">
        {/* Attendance Pie Chart & Performance */}
        <Col md={12} lg={7}>
          <Card className="h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all">
            <Card.Body className="p-4 d-flex flex-column"> {/* Added flex-column here */}
              <h5 className="mb-4 fw-bold d-flex align-items-center text-dark">
                <FaChartPie className="me-2 text-info" size={22} />
                {selectedChild?.name}'s Attendance & Performance
              </h5>
              <Row className="flex-grow-1"> {/* flex-grow-1 ensures content pushes button down */}
                {/* Attendance Pie Chart */}
                <Col lg={7} className="d-flex flex-column align-items-center justify-content-center">
                  {selectedChild && attendanceData && attendanceData.length > 0 ? (
                    <div style={{ width: '80%', height: '200px', flexShrink: 0 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={attendanceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                            cornerRadius={5}
                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {attendanceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value} days`} />
                        </PieChart>
                      </ResponsiveContainer>
                      <p className="text-center text-muted mt-2 fw-semibold">Attendance Overview</p>
                    </div>
                  ) : (
                    <Alert variant="info" className="text-center w-100 mt-3">
                      {selectedChild ? `No attendance data available for ${selectedChild.name}.` : "Select a child to view attendance data."}
                    </Alert>
                  )}
                </Col>
                {/* Performance by Subject */}
                <Col lg={5} className="mt-4 mt-lg-0 d-flex flex-column"> {/* Added flex-column here */}
                  <h6 className="fw-bold mb-3 text-dark">Performance by Subject</h6>
                  {selectedChild && performanceData && performanceData.length > 0 ? (
                    <>
                      {performanceData.map((subject, index) => (
                        <div key={index} className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fw-semibold text-dark">{subject.subject}</span>
                            <span className="fw-bold text-primary">{subject.score}%</span>
                          </div>
                          <ProgressBar
                            now={subject.score}
                            max={100}
                            variant={subject.score >= subject.average ? "success" : "warning"}
                            className="rounded-pill"
                            style={{ height: '12px' }}
                          />
                          <small className="text-muted">Class average: {subject.average}%</small>
                        </div>
                      ))}
                      {/* View Full Report Button */}
                      <Button
                        onClick={handleViewFullReport} // Updated to navigate to /exams
                        variant="link"
                        className="w-100 mt-auto text-decoration-none fw-semibold d-flex align-items-center justify-content-center text-primary pt-3 border-top border-light-subtle"
                      >
                        View Full Report <FaArrowRight size={14} className="ms-2" />
                      </Button>
                    </>
                  ) : (
                    <Alert variant="info" className="text-center mt-3">
                      {selectedChild ? `No performance data available for ${selectedChild.name}.` : "Select a child to view performance data."}
                    </Alert>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        {/* Upcoming Events */}
        <Col md={12} lg={5}>
          <Card className="h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all">
            <Card.Body className="d-flex flex-column p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 fw-bold d-flex align-items-center text-dark">
                  <FaCalendarAlt className="me-2 text-primary" size={22} />
                  Upcoming Events
                </h5>
                <Badge bg="primary" pill className="fs-6">{events.length}</Badge>
              </div>

              {selectedChild && events && events.length > 0 ? (
                <>
                  <ListGroup variant="flush" className="flex-grow-1 border-0">
                    {events.map(event => (
                      <ListGroup.Item key={event.id} className="border-0 px-0 py-3 d-flex align-items-start event-item">
                        <div className={`me-3 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 event-icon`}
                          style={{
                            width: '45px',
                            height: '45px',
                            backgroundColor: '#4e73df20',
                            color: '#4e73df'
                          }}>
                          <FaCalendarAlt size={18} />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold text-dark">{event.title}</h6>
                          <small className="text-muted d-flex align-items-center">
                            <FaClock className="me-1" size={14} /> {event.date} at {event.time}
                          </small>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  <Button
                    onClick={handleViewCalendar} // Updated to navigate to /events
                    variant="link"
                    className="w-100 mt-auto text-decoration-none fw-semibold d-flex align-items-center justify-content-center text-primary pt-3 border-top border-light-subtle"
                  >
                    View Full Calendar <FaArrowRight size={14} className="ms-2" />
                  </Button>
                </>
              ) : (
                <Alert variant="info" className="text-center mt-3">
                  {selectedChild ? `No upcoming events for ${selectedChild.name}.` : "Select a child to view upcoming events."}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bottom Row (Fee Payment History and Quick Actions) */}
      <Row className="g-4">

        {/* Fee Payment History */}
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all">
            <Card.Body className="p-4 d-flex flex-column">
              <h5 className="mb-4 fw-bold d-flex align-items-center text-dark">
                <FaRupeeSign className="me-2 text-success" size={22} />
                Fee Payment History
              </h5>

              {selectedChild && payments && payments.length > 0 ? (
                <>
                  <div className="table-responsive flex-grow-1">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.8rem' }}>Date</th>
                          <th scope="col" className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.8rem' }}>Amount</th>
                          <th scope="col" className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.8rem' }}>Status</th>
                          <th scope="col" className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.8rem' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map(payment => (
                          <tr key={payment.id} className="align-middle">
                            <td>{payment.date}</td>
                            <td><span className="fw-bold">{payment.amount}</span></td>
                            <td>
                              <Badge pill bg={payment.isPaid ? "success" : "warning"} className="py-2 px-3 fw-normal">
                                {payment.status}
                              </Badge>
                            </td>
                            <td>
                              {payment.isPaid ? (
                                <Button variant="outline-primary" size="sm" className="d-flex align-items-center rounded-pill py-1 px-3">
                                  <FaDownload className="me-1" size={12} /> Download
                                </Button>
                              ) : (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="d-flex align-items-center rounded-pill py-1 px-3"
                                  onClick={handlePayFees} // Updated to navigate to /fees
                                >
                                  <FaRupeeSign className="me-1" size={12} /> Pay Now
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Button
                    onClick={handlePayFees} // Updated to navigate to /fees
                    variant="primary"
                    className="mt-4 w-100 rounded-pill fw-bold shadow-sm py-3 d-flex align-items-center justify-content-center"
                    style={{
                      transition: 'transform 0.2s ease-in-out',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <FaRupeeSign className="me-2" size={20} />
                    Make New Payment
                  </Button>
                </>
              ) : (
                <Alert variant="info" className="text-center mt-3">
                  {selectedChild ? `No payment history available for ${selectedChild.name}.` : "Select a child to view payment history."}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm rounded-4 hover-shadow transition-all">
            <Card.Body className="d-flex flex-column p-4">
              <h5 className="mb-4 fw-bold d-flex align-items-center text-dark">
                <FaBookmark className="me-2 text-warning" size={22} />
                Quick Actions
              </h5>

              <div className="d-grid gap-3">
                <Button
                  variant="outline-primary"
                  className="text-start d-flex align-items-center rounded-pill px-4 py-3 fw-semibold"
                  onClick={handleMessageTeacher} // Updated to navigate to /messages
                >
                  <FaComments className="me-3" size={20} /> Message Teacher
                </Button>
                <Button
                  variant="outline-success"
                  className="text-start d-flex align-items-center rounded-pill px-4 py-3 fw-semibold"
                  onClick={handlePayFees} // Updated to navigate to /fees
                >
                  <FaRupeeSign className="me-3" size={20} /> Pay Fees
                </Button>
                <Button
                  variant="outline-info"
                  className="text-start d-flex align-items-center rounded-pill px-4 py-3 fw-semibold"
                  onClick={handleViewFullReport} // Updated to navigate to /exams (for report cards)
                >
                  <FaBook className="me-3" size={20} /> View Report Cards
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ParentPage;
