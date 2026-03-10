import React from 'react';

export default function Button({ children, onClick, variant = 'primary', ...rest }) {
  const styles = {
    primary: { background: '#0366d6', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 4 },
    secondary: { background: '#eee', color: '#111', border: 'none', padding: '8px 12px', borderRadius: 4 }
  };
  return (
    <button style={styles[variant] || styles.primary} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
