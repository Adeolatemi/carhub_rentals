import React, { useEffect, useState } from 'react'

export default function VehiclesList() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetch('/vehicles')
      .then(r => r.json())
      .then(data => { if (mounted) setVehicles(data || []) })
      .catch(() => { if (mounted) setVehicles([]) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  if (loading) return <div>Loading vehicles...</div>
  if (!vehicles.length) return <div>No vehicles available.</div>

  return (
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
      {vehicles.map(v => (
        <div key={v.id} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 24px rgba(9,30,66,0.08)', border: '1px solid rgba(2,6,23,0.06)' }}>
          <div style={{ height: 120, background: 'linear-gradient(90deg,#00b3b3,#00d1b3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
            {v.title || v.make || 'Vehicle'}
          </div>
          <div style={{ padding: 12 }}>
            <div style={{ fontSize: 13, color: '#333', minHeight: 40 }}>{v.description || 'Comfortable, reliable and well maintained.'}</div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0b3' }}>₦{v.dailyRate || v.price || '—'}</div>
              <div style={{ fontSize: 12, color: '#666' }}>/day</div>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
