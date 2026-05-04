// src/components/TwoFactorModal.jsx
import React, { useState } from 'react';
import api from '../api';

export default function TwoFactorModal({ userId, onSuccess, onCancel }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/verify-2fa', { userId, token: code });
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Two-Factor Authentication</h2>
        <p className="text-gray-600 mb-4">Please enter the 6-digit code from your authenticator app.</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
        
        <input
          type="text"
          placeholder="Enter 6-digit code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4 text-center text-2xl tracking-widest"
          autoFocus
        />
        
        <div className="flex gap-3">
          <button
            onClick={handleVerify}
            disabled={loading}
            className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-blue-900 transition"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}