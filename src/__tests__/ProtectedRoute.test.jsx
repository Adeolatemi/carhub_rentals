import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ProtectedRoute from '../ProtectedRoute'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../AuthContext'

describe('ProtectedRoute', () => {
  it('renders children for authorized user', () => {
    const wrapper = ({ children }) => (
      <AuthContext.Provider value={{ user: { id: '1', role: 'ADMIN' } }}>{children}</AuthContext.Provider>
    )
    const { getByText } = render(
      <MemoryRouter>
        <ProtectedRoute roles={["ADMIN"]}><div>Secret</div></ProtectedRoute>
      </MemoryRouter>,
      { wrapper }
    )
    expect(getByText('Secret')).toBeTruthy()
  })
})
