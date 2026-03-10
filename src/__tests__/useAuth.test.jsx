import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderHook, act } from '@testing-library/react'
import useAuth from '../hooks/useAuth'
import { AuthContext } from '../AuthContext'

describe('useAuth hook', () => {
  it('returns helpers and roles', () => {
    const wrapper = ({ children }) => (
      <AuthContext.Provider value={{ user: { id: '1', role: 'PARTNER' }, setUser: () => {}, logout: () => {} }}>{children}</AuthContext.Provider>
    )
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.isPartner).toBeTruthy()
    expect(result.current.isAdmin).toBeFalsy()
  })
})
