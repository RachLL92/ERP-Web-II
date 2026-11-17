import { Link } from "react-router"
import { AlertCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

// Estado "error": muestra el mensaje del ApiError y una acción para recuperarse.
export default function EstadoError({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
      <AlertCircle className="size-8 text-destructive" />
      <div>
        <p className="font-medium text-destructive">
          {error.status ? `Error ${error.status}` : "Error de conexión"}
        </p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
      {error.isUnauthorized ? (
        <Button asChild size="sm">
          <Link to="/login">Iniciar sesión</Link>
        </Button>
      ) : (
        onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RotateCcw />
            Reintentar
          </Button>
        )
      )}
    </div>
  )
}
