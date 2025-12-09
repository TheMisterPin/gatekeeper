import { Action } from '@/types/action'

interface SectionHeaderProps {
  title: string
  headerActions?: Action[]
}
/**
 * Titolo di sezione con eventuali azioni icona a destra.
 */
export default function SectionHeader({ title, headerActions }: SectionHeaderProps) {
  return (
        <div className='bg-header  rounded-t-md py-4 px-6'>
        <h1 className="text-3xl font-semibold text-gray-100">{title}</h1>
        {headerActions && (
          <div>
            {headerActions.map((action, index) => (
              <button
                key={index}
                onClick={action.actionPerformed}
                data-tooltip={action.tooltip}
                className="ml-2"
              >
                <action.icon />
              </button>
            ))}
          </div>
        )}
      </div>
  )
}
