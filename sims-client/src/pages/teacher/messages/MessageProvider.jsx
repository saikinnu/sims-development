// src/contexts/MessageProvider.jsx or src/pages/messages/MessageProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const MessageContext = createContext(null);

const API_BASE = 'http://localhost:5000/api/messages';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]); // Start with empty array, no mock data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const TRASH_RETENTION_DAYS = 30;

  // Helper function to calculate days since deletion
  const getDaysSinceDeletion = (deletedAt) => {
    if (!deletedAt) return null;
    const now = new Date();
    const deletedDate = new Date(deletedAt);
    const diffTime = Math.abs(now - deletedDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days
  };

  // Fetch messages from backend
  const fetchMessages = async (tab = '', search = '', status = '', dateRange = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (tab) params.tab = tab;
      if (search) params.search = search;
      if (status) params.status = status;
      if (dateRange) params.dateRange = dateRange;
      const res = await axios.get(API_BASE, {
        headers: getAuthHeaders(),
        params,
      });
      setMessages(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, []);

  // Send or save message (with attachments)
  const handleSendMessage = async (newMessage) => {
    try {
      const formData = new FormData();
      formData.append('subject', newMessage.subject);
      formData.append('content', newMessage.content);
      formData.append('status', 'sent');
      newMessage.recipients.forEach(r => formData.append('recipients', r));
      if (newMessage.attachments && newMessage.attachments.length > 0) {
        newMessage.attachments.forEach(file => {
          if (file instanceof File) formData.append('attachments', file);
        });
      }
      await axios.post(API_BASE, formData, {
        headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' },
      });
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  const handleSaveDraft = async (draftMessage) => {
    try {
      const formData = new FormData();
      formData.append('subject', draftMessage.subject);
      formData.append('content', draftMessage.content);
      formData.append('status', 'draft');
      draftMessage.recipients.forEach(r => formData.append('recipients', r));
      if (draftMessage.attachments && draftMessage.attachments.length > 0) {
        draftMessage.attachments.forEach(file => {
          if (file instanceof File) formData.append('attachments', file);
        });
      }
      await axios.post(API_BASE, formData, {
        headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' },
      });
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save draft');
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await axios.patch(`${API_BASE}/${id}/delete`, {}, { headers: getAuthHeaders() });
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete message');
    }
  };

  const handleUndoDelete = async (id) => {
    try {
      await axios.patch(`${API_BASE}/${id}/undo`, {}, { headers: getAuthHeaders() });
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to restore message');
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`, { headers: getAuthHeaders() });
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to permanently delete message');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`${API_BASE}/${id}/read`, {}, { headers: getAuthHeaders() });
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark as read');
    }
  };

  const handleToggleStar = async (id) => {
    try {
      await axios.patch(`${API_BASE}/${id}/star`, {}, { headers: getAuthHeaders() });
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle star');
    }
  };

  const unreadMessageCount = messages.filter(m =>
    !m.read &&
    m.status === 'sent' &&
    m.status !== 'trash'
  ).length;

  const value = {
    messages,
    unreadMessageCount,
    loading,
    error,
    fetchMessages,
    handleSendMessage,
    handleSaveDraft,
    handleDeleteMessage,
    handleUndoDelete,
    handlePermanentDelete,
    handleMarkAsRead,
    handleToggleStar,
    getDaysSinceDeletion,
    TRASH_RETENTION_DAYS
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