import { NavLink, Outlet } from "react-router"
import { House, LogIn, Package, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menu = [
  { to: "/", label: "Inicio", icon: House, end: true },
  { to: "/productos", label: "Productos", icon: Package },
  { to: "/usuarios", label: "Usuarios", icon: Users },
]

export default function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-muted/40">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
          <span className="font-semibold">ERP</span>

          <nav className="flex flex-1 items-center gap-1">
            {menu.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent font-medium text-accent-foreground"
                  )
                }
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>

          <Button asChild variant="outline" size="sm">
            <NavLink to="/login">
              <LogIn />
              Iniciar sesión
            </NavLink>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}
