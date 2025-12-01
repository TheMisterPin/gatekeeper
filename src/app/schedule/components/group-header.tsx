import React from 'react'
interface GroupHeaderProps {
  group: {
    hostName: string
  department?: string
  location?: string
}}
export default function GroupHeader(props: GroupHeaderProps) {
    const { hostName, department, location } = props.group
  return (
                   <div className="border-b border-gray-200 pb-2">
                  <h2 className="text-lg font-semibold text-gray-900">{hostName}</h2>
                  {(department || location) && (
                    <p className="text-sm text-gray-600">
                      {[department, location].filter(Boolean).join(" • ")}
                    </p>
                  )}
                  </div>
  )
}
