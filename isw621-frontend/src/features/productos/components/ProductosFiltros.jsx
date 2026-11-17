import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Barra de búsqueda, filtro y orden. No hace peticiones:
// solo avisa a la página qué cambió mediante onChange.
export default function ProductosFiltros({ filtros, onChange, onClear }) {
  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onChange({ search: formData.get("search").trim() })
  }

  // La API devuelve los activos por defecto (status = true).
  // Si la URL no trae status, el filtro muestra "Activos".
  const estado = filtros.status || "true"
  const orden = `${filtros.sortBy}-${filtros.sortDirection}`

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      {/* key: si la URL cambia (botón Atrás), el input se reinicia con el valor nuevo */}
      <form key={filtros.search} onSubmit={handleSubmit} className="flex flex-1 gap-2">
        <Input name="search" placeholder="Buscar por nombre..." defaultValue={filtros.search} />
        <Button type="submit" variant="secondary">
          <Search />
          Buscar
        </Button>
      </form>

      <Select
        value={estado}
        onValueChange={(valor) => onChange({ status: valor === "true" ? "" : valor })}
      >
        <SelectTrigger className="md:w-40">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Activos</SelectItem>
          <SelectItem value="false">Inactivos</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={orden}
        onValueChange={(valor) => {
          const [sortBy, sortDirection] = valor.split("-")
          onChange({ sortBy, sortDirection })
        }}
      >
        <SelectTrigger className="md:w-52">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Nombre (A-Z)</SelectItem>
          <SelectItem value="name-desc">Nombre (Z-A)</SelectItem>
          <SelectItem value="price-asc">Precio (menor a mayor)</SelectItem>
          <SelectItem value="price-desc">Precio (mayor a menor)</SelectItem>
          <SelectItem value="stock-asc">Stock (menor a mayor)</SelectItem>
          <SelectItem value="stock-desc">Stock (mayor a menor)</SelectItem>
          <SelectItem value="date-desc">Más recientes</SelectItem>
          <SelectItem value="date-asc">Más antiguos</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" onClick={onClear}>
        <X />
        Limpiar
      </Button>
    </div>
  )
}
