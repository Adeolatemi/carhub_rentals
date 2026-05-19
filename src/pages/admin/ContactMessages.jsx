// src/pages/admin/ContactMessages.jsx - Optimized version with pagination
import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../../hooks/useAuth';
import { FaEnvelope, FaTrash, FaEye, FaReply, FaUser, FaCalendar, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function ContactMessages() {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const itemsPerPage = 20;

  const fetchMessages = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Add pagination to API call
      const response = await fetch(
        `https://carhub-api.fly.dev/admin/contact-messages?page=${currentPage}&limit=${itemsPerPage}&status=${filter}&search=${searchTerm}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMessages(data.messages || []);
      setTotalPages(data.totalPages || 1);
      setTotalMessages(data.total || 0);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, currentPage, filter, searchTerm]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://carhub-api.fly.dev/admin/contact-messages/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchMessages();
      if (selectedMessage?.id === id) setSelectedMessage({ ...selectedMessage, status });
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">Contact Messages</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{totalMessages.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Messages</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {['all', 'pending', 'read', 'replied'].map(tab => (
            <button key={tab} onClick={() => { setFilter(tab); setCurrentPage(1); }} className={`px-4 py-2 rounded-lg capitalize transition ${filter === tab ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1 max-w-md">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name, email, or subject..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">Showing {messages.length} of {totalMessages.toLocaleString()} messages</p>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"><FaChevronLeft /></button>
          <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"><FaChevronRight /></button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No messages found</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} onClick={() => setSelectedMessage(msg)} className={`p-4 cursor-pointer hover:bg-gray-50 transition ${selectedMessage?.id === msg.id ? 'bg-blue-50' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{msg.name}</p>
                      <p className="text-sm text-gray-500">{msg.email}</p>
                    </div>
                    {getStatusBadge(msg.status)}
                  </div>
                  <p className="text-sm text-gray-600 font-medium mb-1 truncate">{msg.subject}</p>
                  <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
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
                <div className="flex gap-3">
                  <button onClick={() => updateStatus(selectedMessage.id, 'pending')} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">⏳ Pending</button>
                  <button onClick={() => updateStatus(selectedMessage.id, 'read')} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">👁️ Read</button>
                  <button onClick={() => updateStatus(selectedMessage.id, 'replied')} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">✅ Replied</button>
                  <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`} className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-900">📧 Reply</a>
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