import { parseDate } from '@/utils/date-utils';
import { Search } from 'lucide-react'
import React from 'react'
interface ScheduleToolbarProps {
    searchTerm: string;
    onSearchTermChange?: (value: string) => void;
    effectiveEmployeeFilter?: string | null;
    handleEmployeeFilterChange: (value: string | null) => void;
    selectedDateFilter?: string | null;
    setSelectedDateFilter: (value: string | null) => void;
    hostOptions: { id: string; fullName: string }[];
    dateOptions: string[];
}

export default function ScheduleToolbar(props : ScheduleToolbarProps) {
  const {
    searchTerm,
    onSearchTermChange,
    effectiveEmployeeFilter,
    handleEmployeeFilterChange,
    selectedDateFilter,
    setSelectedDateFilter,
    hostOptions,
    dateOptions,
  } = props;

  return (
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca per nome visitatore..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="w-64">
            <select
              value={effectiveEmployeeFilter ?? ""}
              onChange={(e) => handleEmployeeFilterChange(e.target.value || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tutti gli host</option>
              {hostOptions.map((host) => (
                <option key={host.id} value={host.id}>
                  {host.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="w-48">
            <select
              value={selectedDateFilter ?? ""}
              onChange={(e) => setSelectedDateFilter(e.target.value || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tutte le date</option>
              {dateOptions.map((d) => (
                <option key={d} value={d}>
                 {parseDate(new Date(d))}
                </option>
              ))}
            </select>
          </div>
        </div>
  )
}
