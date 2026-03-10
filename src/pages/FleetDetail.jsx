import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { vehicles as vehiclesApi } from '../api'

export default function FleetDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    if (!id) {
      setError('Missing vehicle id')
      setLoading(false)
      return
    }
    vehiclesApi.get(id)
      .then(data => { if (mounted) setVehicle(data) })
      .catch(err => { if (mounted) setError(err?.message || 'Could not load vehicle') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  const img = vehicle?.image || vehicle?.imageUrl || `/images/car_${id}.jpg`
  const name = vehicle?.name || vehicle?.model || `Car Model ${id}`
  const price = vehicle?.pricePerDay || vehicle?.price || (30000 + ((parseInt(id,10) - 1) * 2000))

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>← Back</button>

      {loading ? (
        <div>Loading vehicle…</div>
      ) : error ? (
        <div style={{ color: 'crimson' }}>{String(error)}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
          <div>
            <img src={img} alt={name} style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 8 }} />
          </div>
          <aside style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 6px 18px rgba(16,24,40,0.06)' }}>
            <h2>{name}</h2>
            <p style={{ color: '#666' }}>{vehicle?.description || 'Comfortable and reliable. Seats 5. Air conditioning. Automatic transmission.'}</p>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>₦{Number(price).toLocaleString()} / day</div>
              <button style={{ marginTop: 12, padding: '10px 14px', background: '#0aa', color: '#fff', border: 'none', borderRadius: 6 }}>Request Booking</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
