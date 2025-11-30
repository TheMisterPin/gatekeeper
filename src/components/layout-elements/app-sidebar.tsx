import { NavItem } from "@/types/components/nav-item";

interface AppSidebarProps {
    navItems : NavItem[]
}

export function AppSideBar( props: AppSidebarProps) {
    const { navItems } = props;
    
    return (
                <aside className="w-60 bg-white border-l border-gray-200 overflow-y-auto">
          <nav className="p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-left transition-colors ${
                      item.isActive ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
    )
}