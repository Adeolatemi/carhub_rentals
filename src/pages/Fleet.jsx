import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { vehicles as vehiclesApi } from '../api'

export default function Fleet() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    vehiclesApi.list()
      .then(data => {
        if (mounted && Array.isArray(data)) {
          const found = data.find(v => String(v.id) === id)
          setVehicle(found || null)
        }
      })
      .catch(() => { /* fallback */ })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  if (loading) return <div>Loading vehicle…</div>
  if (!vehicle) return <div>Vehicle not found. <button onClick={() => navigate('/')}>Back to Home</button></div>

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1>{vehicle.name || `Car Model ${id}`}</h1>
      <img src={vehicle.image || `/images/car_${id}.jpg`} alt={vehicle.name} style={{ width: '100%', height: 300, objectFit: 'cover' }} />
      <p>Price per day: ₦{Number(vehicle.pricePerDay || 30000).toLocaleString()}</p>
      <button style={{ padding: '10px 20px', cursor: 'pointer', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4 }}>
        Book Now
      </button>
    </div>
  )
}