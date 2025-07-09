// src/contexts/MessageProvider.jsx or src/pages/messages/MessageProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    // Your initial messages array from MessageModule.jsx
    // Ensure you keep this data consistent with MessageModule's initial state
    {
      id: 'msg-001',
      subject: 'Parent-Teacher Meeting Reminder',
      content: 'This is a reminder about the upcoming parent-teacher meeting scheduled for Friday, June 10th at 3:00 PM in the school auditorium.',
      sender: 'teacher@school.edu',
      recipients: ['parent1@email.com', 'parent2@email.com'],
      status: 'sent',
      date: '2023-06-05T14:30:00Z',
      read: true,
      attachments: ['meeting_schedule.pdf'],
      starred: true,
      deletedAt: null
    },
    {
      id: 'msg-002',
      subject: 'Urgent: School Closure Tomorrow',
      content: 'Due to severe weather warnings, the school will be closed tomorrow. All classes will resume on Monday.',
      sender: 'principal@school.edu',
      recipients: ['all'],
      status: 'sent',
      date: '2023-06-08T18:15:00Z',
      read: false, // This message is unread and in inbox
      attachments: [],
      starred: false,
      deletedAt: null
    },
    {
      id: 'msg-003',
      subject: 'Draft Message Example',
      content: 'This is a message I started writing but haven\'t sent yet.',
      sender: 'teacher@school.edu',
      recipients: ['teacher1@school.edu'],
      status: 'draft',
      date: '2023-06-09T09:00:00Z',
      read: false,
      attachments: [],
      starred: false,
      deletedAt: null
    },
    {
        id: 'msg-005',
        subject: 'Important Project Update',
        content: 'The deadline for the project submission has been extended to end of day Friday. Please review the new requirements.',
        sender: 'project_manager@company.com',
        recipients: ['user@school.edu'],
        status: 'sent',
        date: '2023-06-15T10:00:00Z',
        read: false, // This message is unread and in inbox
        attachments: [],
        starred: true,
        deletedAt: null
    },
  ]);

  const TRASH_RETENTION_DAYS = 30;

  // Helper function to calculate days since deletion (copied from MessageModule)
  const getDaysSinceDeletion = (deletedAt) => {
    if (!deletedAt) return null;
    const now = new Date();
    const deletedDate = new Date(deletedAt);
    const diffTime = Math.abs(now - deletedDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days
  };

  // Effect to "purge" old trash messages (copied from MessageModule)
  useEffect(() => {
    setMessages(prevMessages =>
      prevMessages.filter(msg => {
        if (msg.status === 'trash' && msg.deletedAt) {
          const days = getDaysSinceDeletion(msg.deletedAt);
          return days <= TRASH_RETENTION_DAYS;
        }
        return true;
      })
    );
  }, []);

  // Calculate unread count specifically for the inbox (excluding sent by current user, drafts, and trash)
  const unreadMessageCount = messages.filter(m =>
    !m.read &&
    m.status === 'sent' && // It must be a sent message
    m.sender !== 'teacher@school.edu' && // Not sent by the current user (teacher)
    m.status !== 'trash' // Not in trash
  ).length;

  // Functions that modify messages (you would move these from MessageModule.jsx)
  const handleSendMessage = (newMessage) => {
    setMessages(prev => [...prev, {
      ...newMessage,
      id: `msg-${Date.now()}`,
      status: 'sent',
      date: new Date().toISOString(),
      sender: 'teacher@school.edu',
      read: true,
      starred: false,
      deletedAt: null
    }]);
  };

  const handleSaveDraft = (draftMessage) => {
    setMessages(prev => [...prev, {
      ...draftMessage,
      id: `msg-${Date.now()}`,
      status: 'draft',
      date: new Date().toISOString(),
      sender: 'teacher@school.edu',
      read: false,
      starred: false,
      deletedAt: null
    }]);
  };

  const handleDeleteMessage = (id) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, status: 'trash', deletedAt: new Date().toISOString(), originalStatus: msg.status } : msg
    ));
  };

  const handleUndoDelete = (id) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, status: msg.originalStatus || 'inbox', deletedAt: null, originalStatus: undefined } : msg
    ));
  };

  const handlePermanentDelete = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleMarkAsRead = (id) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  const handleToggleStar = (id) => {
    setMessages(prev => prev.map(msg =>
        msg.id === id ? { ...msg, starred: !msg.starred } : msg
    ));
  };


  const value = {
    messages,
    unreadMessageCount,
    handleSendMessage,
    handleSaveDraft,
    handleDeleteMessage,
    handleUndoDelete,
    handlePermanentDelete,
    handleMarkAsRead,
    handleToggleStar,
    getDaysSinceDeletion, // Provide if MessageModule still needs it directly
    TRASH_RETENTION_DAYS // Provide if MessageModule still needs it directly
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};