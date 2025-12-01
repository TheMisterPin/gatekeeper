import { CardHeader, CardTitle } from '@/components/ui/card'

interface LoginHeaderProps {
  timeString: string;
}

export default function LoginHeaderComponent(props : LoginHeaderProps) {
    const { timeString } = props;
  return (
         <CardHeader className="p-0">
      <div className="w-full flex items-center justify-between bg-topbanner text-white px-4 py-3 rounded-t-md">
        <img src="/resources/images/logos/epresence-logo-1-mobile-white.png" alt="epresence" className="h-8" />
        <div className="text-sm font-mono">{timeString}</div>
      </div>
      <div className="flex justify-center mt-4">
        <img src="/resources/images/logos/bksolutions-logo.png" alt="BK Solutions" className="h-12" />
      </div>
   
        <CardTitle className="mx-auto py-2">Accesso dispositivo</CardTitle>
      </CardHeader>
  )
}
