import { SearchX } from "lucide-react"

// Estado "vacío": la petición fue exitosa pero no hay resultados.
export default function EstadoVacio({ mensaje, children }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center">
      <SearchX className="size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{mensaje}</p>
      {children}
    </div>
  )
}
