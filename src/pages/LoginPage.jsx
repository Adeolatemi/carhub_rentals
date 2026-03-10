import React from 'react'
import LoginForm from '../components/LoginForm'

export default function LoginPage(){
  return (
    <main className="pageContent" style={{ maxWidth: 420, margin: '20px auto' }}>
      <div style={{ background: '#fff', padding: 18, borderRadius: 8, boxShadow: '0 6px 18px rgba(16,24,40,0.06)' }}>
        <LoginForm />
      </div>
    </main>
  )
}
