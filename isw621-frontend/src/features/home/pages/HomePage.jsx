import { CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Pantalla de verificación: si se ve con estilos, el proyecto base
const checks = [
  "React + Vite (JavaScript)",
  "Tailwind CSS v4",
  "shadcn/ui (componentes en src/components/ui)",
  "Alias @/ → src/",
  "React Router",
  "React Hook Form + Zod (validación de formularios)",
  "Cliente HTTP con fetch (src/api/httpClient.js)",
]

export default function HomePage() {
  const apiUrl = import.meta.env.VITE_API_URL

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Proyecto base listo</h1>
        <p className="text-muted-foreground">
          Frontend administrativo de ISW-621 · Programación en Ambiente Web II
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
            <CardDescription>Todo esto ya viene resuelto en el repositorio.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 text-sm">
              {checks.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API configurada</CardTitle>
            <CardDescription>Valor de VITE_API_URL leído del archivo .env</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {apiUrl ? (
              <code className="rounded-md bg-muted px-3 py-2 text-sm break-all">{apiUrl}</code>
            ) : (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                No configurada. Copie <strong>.env.example</strong> como <strong>.env</strong> y
                reinicie <strong>npm run dev</strong>.
              </p>
            )}
            <Button
              variant="outline"
              className="w-fit"
              onClick={() => toast.success("Las notificaciones funcionan correctamente.")}
            >
              Probar notificación
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
