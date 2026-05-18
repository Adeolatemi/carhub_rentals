// src/pages/admin/ContactMessages.jsx - Updated with better error handling
import React, { useState, useEffect } from 'react';
import  useAuth  from '../../hooks/useAuth';
import { FaEnvelope, FaCheckCircle, FaSpinner, FaTrash, FaEye, FaReply, FaPhone, FaUser, FaCalendar } from 'react-icons/fa';

export default function ContactMessages() {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, pending: 0, read: 0, replied: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
    }
  }, [isAdmin]);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://carhub-api.fly.dev/admin/contact-messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        setError('Unauthorized. Please log in again.');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
      calculateStats(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (msgs) => {
    const newStats = {
      total: msgs.length,
      pending: msgs.filter(m => m.status === 'pending').length,
      read: msgs.filter(m => m.status === 'read').length,
      replied: msgs.filter(m => m.status === 'replied').length
    };
    setStats(newStats);
  };

  const updateMessageStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://carhub-api.fly.dev/admin/contact-messages/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        await fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, status });
        }
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://carhub-api.fly.dev/admin/contact-messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        await fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      read: 'bg-blue-100 text-blue-800',
      replied: 'bg-green-100 text-green-800'
    };
    const labels = {
      pending: '📧 Pending',
      read: '👁️ Read',
      replied: '✅ Replied'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const filteredMessages = Array.isArray(messages) ? messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.status === filter;
  }) : [];

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600 mt-2">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button 
            onClick={fetchMessages}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Contact Messages</h1>
          <p className="text-gray-600 mt-2">Manage and respond to customer inquiries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Messages</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <FaEnvelope className="text-3xl text-primary opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <FaSpinner className="text-3xl text-yellow-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Read</p>
                <p className="text-2xl font-bold text-blue-600">{stats.read}</p>
              </div>
              <FaEye className="text-3xl text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Replied</p>
                <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
              </div>
              <FaCheckCircle className="text-3xl text-green-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'read', 'replied'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap transition ${
                filter === tab
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab} ({filter === 'all' ? stats.total : stats[tab]})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold text-gray-700">Messages</h2>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No messages found</div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                      selectedMessage?.id === msg.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{msg.name}</p>
                        <p className="text-sm text-gray-500 truncate">{msg.email}</p>
                      </div>
                      {getStatusBadge(msg.status)}
                    </div>
                    <p className="text-sm text-gray-600 font-medium mb-1 truncate">{msg.subject}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(msg.created_at || msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            {selectedMessage ? (
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 break-words">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <FaUser className="text-gray-400" />
                      <span className="text-gray-600">{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <FaEnvelope className="text-gray-400" />
                      <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-2 mt-1">
                        <FaPhone className="text-gray-400" />
                        <a href={`tel:${selectedMessage.phone}`} className="text-primary hover:underline">
                          {selectedMessage.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <FaCalendar className="text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {new Date(selectedMessage.created_at || selectedMessage.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="text-red-500 hover:text-red-700 transition p-2"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-gray-700 whitespace-pre-wrap break-words">{selectedMessage.message}</p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-700 mb-4">Update Status</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'pending')}
                      className={`px-4 py-2 rounded-lg transition ${
                        selectedMessage.status === 'pending'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      📧 Mark Pending
                    </button>
                    <button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                      className={`px-4 py-2 rounded-lg transition ${
                        selectedMessage.status === 'read'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      👁️ Mark Read
                    </button>
                    <button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                      className={`px-4 py-2 rounded-lg transition ${
                        selectedMessage.status === 'replied'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      ✅ Mark Replied
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h3 className="font-semibold text-gray-700 mb-4">Quick Reply</h3>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition"
                  >
                    <FaReply />
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center text-gray-400">
                  <FaEnvelope className="text-5xl mx-auto mb-3 opacity-50" />
                  <p>Select a message to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}