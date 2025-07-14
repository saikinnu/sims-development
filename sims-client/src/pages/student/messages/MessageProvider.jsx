// src/contexts/MessageProvider.jsx or src/pages/messages/MessageProvider.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const MessageContext = createContext(null);

// Hardcoded API base to avoid process.env ReferenceError in browser
const API_BASE = 'http://localhost:5000/api/messages';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = JSON.parse(localStorage.getItem('authToken'));
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('inbox');
  const [filters, setFilters] = useState({ search: '', status: '', dateRange: '' });

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
  const fetchMessages = useCallback(async (tab = activeTab, filterOverrides = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('tab', tab);
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.dateRange) params.append('dateRange', filters.dateRange);
      Object.entries(filterOverrides).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const res = await axios.get(`${API_BASE}?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      // Robustly handle both array and object API responses
      const data = res.data;
      setMessages(Array.isArray(data) ? data : (Array.isArray(data.messages) ? data.messages : []));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [activeTab, filters]);

  // Calculate unread count for inbox
  const unreadMessageCount = messages.filter(m =>
    !m.read &&
    m.status === 'sent' &&
    m.status !== 'trash'
  ).length;

  // Send or save message (sent or draft)
  const handleSendMessage = async (newMessage, isDraft = false) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('subject', newMessage.subject);
      formData.append('content', newMessage.content);
      formData.append('status', isDraft ? 'draft' : 'sent');
      newMessage.recipients.forEach(r => formData.append('recipients[]', r));
      if (newMessage.attachments && newMessage.attachments.length > 0) {
        newMessage.attachments.forEach(file => formData.append('attachments', file));
      }
      await axios.post(`${API_BASE}`, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = (draftMessage) => handleSendMessage(draftMessage, true);

  // Move to trash
  const handleDeleteMessage = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.patch(`${API_BASE}/${id}/delete`, {}, { headers: getAuthHeaders() });
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Undo delete
  const handleUndoDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.patch(`${API_BASE}/${id}/undo`, {}, { headers: getAuthHeaders() });
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Permanent delete
  const handlePermanentDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE}/${id}`, { headers: getAuthHeaders() });
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mark as read
  const handleMarkAsRead = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`${API_BASE}/${id}/read`, {}, { headers: getAuthHeaders() });
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle star
  const handleToggleStar = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.patch(`${API_BASE}/${id}/star`, {}, { headers: getAuthHeaders() });
      await fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    messages,
    loading,
    error,
    unreadMessageCount,
    handleSendMessage,
    handleSaveDraft,
    handleDeleteMessage,
    handleUndoDelete,
    handlePermanentDelete,
    handleMarkAsRead,
    handleToggleStar,
    getDaysSinceDeletion,
    TRASH_RETENTION_DAYS,
    setActiveTab,
    setFilters,
    activeTab,
    filters,
    fetchMessages,
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