import { Action } from '@/types/action'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
interface SectionHeaderProps {
  title: string
  headerActions?: Action[]
}
export default function SectionHeader({ title, headerActions }: SectionHeaderProps) {
  return (

        <div className='bg-header  rounded-t-md py-4 px-6  flex items-center justify-between'>
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        {headerActions && (
          <div>
            {headerActions.map((action, index) => (
                      <Tooltip key={index} >
      <TooltipTrigger asChild>
              <button
                
                onClick={action.actionPerformed}
                data-tooltip={action.tooltip}
                className="ml-2 hover:text-white text-gray-200 border rounded-full p-2 hover:border-transparent hover:scale-110 transition-all duration-300" 
              >
                <action.icon />
              </button>
                    </TooltipTrigger>
      <TooltipContent side="bottom" className='bg-gray-300 text-black'>
        <p>{action.tooltip}</p>
      </TooltipContent>
    </Tooltip>
            ))}
          </div>
        )}
      </div>

  )
}
