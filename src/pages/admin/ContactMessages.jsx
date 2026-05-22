
// src/pages/admin/ContactMessages.jsx
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { FaEnvelope, FaTrash, FaEye, FaReply, FaUser, FaCalendar, FaPaperPlane } from 'react-icons/fa';

export default function ContactMessages() {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyData, setReplyData] = useState({ to: '', subject: '', message: '' });
  const [sendingReply, setSendingReply] = useState(false);

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

  const openReplyModal = (msg) => {
    setReplyData({
      to: msg.email,
      subject: `Re: ${msg.subject}`,
      message: `\n\n\n--- Original Message ---\nFrom: ${msg.name}\nEmail: ${msg.email}\nSubject: ${msg.subject}\n\n${msg.message}`
    });
    setShowReplyModal(true);
  };

  const sendReply = async () => {
    setSendingReply(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://carhub-api.fly.dev/admin/reply-message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: replyData.to,
          subject: replyData.subject,
          message: replyData.message
        })
      });

      if (response.ok) {
        alert('✅ Reply sent successfully!');
        setShowReplyModal(false);
        if (selectedMessage) {
          await updateStatus(selectedMessage.id, 'replied');
        }
        setReplyData({ to: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      alert('❌ Failed to send reply. Please try again.');
    } finally {
      setSendingReply(false);
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{messages.length.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Messages</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{messages.filter(m => m.status === 'pending').length}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{messages.filter(m => m.status === 'read').length}</p>
          <p className="text-sm text-gray-500">Read</p>
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
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                    selectedMessage?.id === msg.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{msg.name}</p>
                      <p className="text-sm text-gray-500 truncate">{msg.email}</p>
                      <p className="text-sm font-medium text-gray-600 mt-1 truncate">{msg.subject}</p>
                    </div>
                    {getStatusBadge(msg.status)}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Unknown date'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="bg-white rounded-lg shadow">
            {selectedMessage ? (
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 break-words">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <FaUser className="text-gray-400" />
                      <span>{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <FaEnvelope className="text-gray-400" />
                      <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline break-all">
                        {selectedMessage.email}
                      </a>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-2 mt-1">
                        <FaEnvelope className="text-gray-400" />
                        <span>{selectedMessage.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <FaCalendar className="text-gray-400" />
                      <span className="text-sm">
                        {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => deleteMessage(selectedMessage.id)} className="text-red-500 hover:text-red-700 p-2">
                    <FaTrash />
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-64 overflow-y-auto whitespace-pre-wrap break-words">
                  {selectedMessage.message}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => updateStatus(selectedMessage.id, 'pending')}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm"
                  >
                    ⏳ Pending
                  </button>
                  <button
                    onClick={() => updateStatus(selectedMessage.id, 'read')}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                  >
                    👁️ Read
                  </button>
                  <button
                    onClick={() => updateStatus(selectedMessage.id, 'replied')}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                  >
                    ✅ Replied
                  </button>
                  <button
                    onClick={() => openReplyModal(selectedMessage)}
                    className="bg-primary text-white px-4 py-1 rounded hover:bg-blue-900 text-sm flex items-center gap-2"
                  >
                    <FaReply /> Reply via Email
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-400">
                Select a message to view details
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaReply /> Reply to Customer
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                  <input
                    type="email"
                    value={replyData.to}
                    onChange={(e) => setReplyData({ ...replyData, to: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                  <input
                    type="text"
                    value={replyData.subject}
                    onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                  <textarea
                    rows={10}
                    value={replyData.message}
                    onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowReplyModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendReply}
                    disabled={sendingReply}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-900 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    <FaPaperPlane /> {sendingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}