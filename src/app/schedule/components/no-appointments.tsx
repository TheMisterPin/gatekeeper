import React from 'react'

export default function NoAppointments() {
  return (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Nessun appuntamento per oggi</h3>
                <p className="text-gray-600">Controlla più tardi o verifica i filtri applicati.</p>
              </div>
  )
}
