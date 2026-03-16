import { Bell, User, Moon, Sun, Menu } from "lucide-react"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 dark:border-slate-800 dark:bg-slate-950 shrink-0">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-slate-500" 
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50 truncate">
          Workspace
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsDark(!isDark)}
          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
