

export interface NavItem {
  id: string
  label: string
  icon?: React.ReactNode
  isActive?: boolean
  onClick?: () => void
}