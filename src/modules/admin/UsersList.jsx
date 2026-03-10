import React, { useEffect, useState } from 'react';

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/users', { credentials: 'include' })
      .then((r) => r.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>Users</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>ID</th>
            <th style={{ textAlign: 'left' }}>Name</th>
            <th style={{ textAlign: 'left' }}>Email</th>
            <th style={{ textAlign: 'left' }}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
              <td style={{ padding: '8px 6px' }}>{u.id}</td>
              <td style={{ padding: '8px 6px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, background: '#f3f6f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{(u.name || '').charAt(0) || '?'}</div>
                <div>{u.name}</div>
              </td>
              <td style={{ padding: '8px 6px' }}>{u.email}</td>
              <td style={{ padding: '8px 6px' }}>
                {u.role}
                {(u.role === 'ADMIN' || u.role === 'SUPERADMIN') && (
                  <span style={{ marginLeft: 8, background: 'linear-gradient(90deg,#00b3b3,#00d1b3)', color: '#003', padding: '4px 8px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>ADMIN</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
