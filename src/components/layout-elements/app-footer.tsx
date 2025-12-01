import React from 'react'
interface AppFooterProps {
  currentUserName?: string
  onLogout?: () => void
  footerHeight: number
}

export default function AppFooter(
props:  AppFooterProps) {
    const { currentUserName, onLogout, footerHeight } = props;
  return (
         <footer
        className="fixed bottom-0 left-0 right-0 bg-bottombanner border-t border-gray-200 flex items-center justify-between px-6"
        style={{ height: `${footerHeight}px` }}
      >

      <div className="flex items-center gap-4">
        {currentUserName && (
          <span className="text-sm text-gray-200">{currentUserName}</span>
        )}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-200 hover:bg-gray-200 hover:text-gray-800"
          >
            Logout
          </button>
        )}
      </div>
      </footer>
  )
}
