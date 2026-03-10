import React, { useEffect, useState } from "react";
import { request, admin } from "../../api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  async function load() {
    try {
      const data = await request(`/users`);
      setUsers(data);
    } catch (err) { console.error(err); }
  }

  useEffect(() => { load(); }, []);

  async function toggle(u) {
    await admin.toggleUserActive(u.id, !u.isActive);
    load();
  }

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead><tr><th>Email</th><th>Role</th><th>Active</th><th>Action</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.isActive ? "Yes" : "No"}</td>
              <td><button onClick={() => toggle(u)}>{u.isActive ? "Disable" : "Enable"}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
