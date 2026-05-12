import React, { useState, useEffect } from 'react';
import api from '../api/client';

export default function TwoFactorSetup() {
  const [status, setStatus] = useState({ enabled: false, isAdmin: false });
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await api.get('/2fa/status');
      setStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch 2FA status:', error);
    }
  };

  const handleSetup = async () => {
    setLoading(true);
    try {
      const response = await api.post('/2fa/setup');
      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
      setShowSetup(true);
      setMessage('Scan the QR code with Google Authenticator');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Setup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      setMessage('Please enter verification code');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/2fa/verify', { token: verificationCode });
      setMessage('2FA enabled successfully!');
      setShowSetup(false);
      setVerificationCode('');
      fetchStatus();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    const code = prompt('Enter your 2FA code to disable:');
    if (!code) return;
    
    setLoading(true);
    try {
      await api.post('/2fa/disable', { token: code });
      setMessage('2FA disabled successfully');
      fetchStatus();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Disable failed');
    } finally {
      setLoading(false);
    }
  };

  if (!status.isAdmin) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-700">2FA is only available for admin accounts.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Two-Factor Authentication (2FA)</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      {status.enabled ? (
        <div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-700 font-semibold">✅ 2FA is ENABLED</p>
            <p className="text-green-600 text-sm mt-1">Your account is protected with two-factor authentication.</p>
          </div>
          <button
            onClick={handleDisable}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Disable 2FA'}
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            Add an extra layer of security to your admin account. After enabling 2FA, you'll need to enter a verification code from your authenticator app when logging in.
          </p>
          
          {!showSetup ? (
            <button
              onClick={handleSetup}
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition disabled:opacity-50"
            >
              {loading ? 'Setting up...' : 'Enable 2FA'}
            </button>
          ) : (
            <div className="space-y-4">
              {qrCode && (
                <div className="text-center">
                  <img src={qrCode} alt="2FA QR Code" className="mx-auto border p-2 rounded-lg" />
                  <p className="text-sm text-gray-500 mt-2">Scan with Google Authenticator or Authy</p>
                  <p className="text-xs text-gray-400 mt-1">Secret: {secret}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">Verification Code</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  {loading ? 'Verifying...' : 'Verify & Enable'}
                </button>
                <button
                  onClick={() => setShowSetup(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
