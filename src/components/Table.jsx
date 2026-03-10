import React from 'react';

export default function Table({ columns = [], data = [] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>{c.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((c) => (
              <td key={c.key} style={{ padding: 8, borderBottom: '1px solid #f4f4f4' }}>{c.render ? c.render(row) : row[c.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
