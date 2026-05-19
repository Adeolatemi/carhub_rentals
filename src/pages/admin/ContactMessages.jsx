// src/pages/admin/ContactMessages.jsx - Working version
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { FaEnvelope, FaTrash, FaEye, FaReply, FaUser, FaCalendar } from 'react-icons/fa';

export default function ContactMessages() {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
    }
  }, [isAdmin]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://carhub-api.fly.dev/admin/contact-messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://carhub-api.fly.dev/admin/contact-messages/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://carhub-api.fly.dev/admin/contact-messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      read: 'bg-blue-100 text-blue-800',
      replied: 'bg-green-100 text-green-800'
    };
    const labels = { pending: '⏳ Pending', read: '👁️ Read', replied: '✅ Replied' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>{labels[status] || status}</span>;
  };

  if (!isAdmin) return <div className="p-6 text-center text-red-600">Access Denied</div>;

  if (loading) return <div className="p-6 text-center">Loading messages...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">Contact Messages</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{messages.length.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Messages</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{messages.filter(m => m.status === 'pending').length}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{messages.filter(m => m.status === 'replied').length}</p>
          <p className="text-sm text-gray-500">Replied</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">No messages found</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y max-h-[500px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                    selectedMessage?.id === msg.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{msg.name}</p>
                      <p className="text-sm text-gray-500">{msg.email}</p>
                      <p className="text-sm font-medium text-gray-600 mt-1">{msg.subject}</p>
                    </div>
                    {getStatusBadge(msg.status)}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="bg-white rounded-lg shadow">
            {selectedMessage ? (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-2 mt-2"><FaUser className="text-gray-400" /><span>{selectedMessage.name}</span></div>
                    <div className="flex items-center gap-2 mt-1"><FaEnvelope className="text-gray-400" /><a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">{selectedMessage.email}</a></div>
                    <div className="flex items-center gap-2 mt-1"><FaCalendar className="text-gray-400" /><span className="text-sm">{new Date(selectedMessage.createdAt).toLocaleString()}</span></div>
                  </div>
                  <button onClick={() => deleteMessage(selectedMessage.id)} className="text-red-500 hover:text-red-700 p-2"><FaTrash /></button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 whitespace-pre-wrap">{selectedMessage.message}</div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => updateStatus(selectedMessage.id, 'pending')} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200">⏳ Pending</button>
                  <button onClick={() => updateStatus(selectedMessage.id, 'read')} className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">👁️ Read</button>
                  <button onClick={() => updateStatus(selectedMessage.id, 'replied')} className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">✅ Replied</button>
                  <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`} className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-900">📧 Reply</a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-400">Select a message to view details</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}