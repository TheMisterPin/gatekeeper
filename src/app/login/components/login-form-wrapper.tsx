import React from 'react'

export default function LoginWrapper({ children }: { children: React.ReactNode }) {
  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/resources/images/backgrounds/login-background.png')] bg-cover bg-center opacity-50 pointer-events-none" />
        <div className="relative z-10">
         {children}
        </div>
      </div>
  )
}
