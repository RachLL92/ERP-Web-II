import { useSearchParams } from "react-router"
import { Button } from "@/components/ui/button"
import EstadoError from "@/components/shared/EstadoError"
import EstadoVacio from "@/components/shared/EstadoVacio"
import Paginacion from "@/components/shared/Paginacion"
import { useProductos } from "@/hooks/useProductos"
import ProductosFiltros from "@/features/productos/components/ProductosFiltros"
import ProductosTabla from "@/features/productos/components/ProductosTabla"

const PAGE_SIZE = 10

// Componente contenedor: lee los filtros de la URL, pide los datos
// con el hook y decide qué estado de la UI mostrar.
export default function ProductosPage() {
  // La URL es la "fuente de verdad" de los filtros:
  // /productos?search=camisa&status=false&sortBy=price&sortDirection=desc&page=2
  const [searchParams, setSearchParams] = useSearchParams()

  const filtros = {
    search: searchParams.get("search") ?? "",
    status: searchParams.get("status") ?? "",
    sortBy: searchParams.get("sortBy") ?? "name",
    sortDirection: searchParams.get("sortDirection") ?? "asc",
    page: Number(searchParams.get("page") ?? 1),
    pageSize: PAGE_SIZE,
  }

  const { data, loading, error, reload } = useProductos(filtros)

  // Actualiza solo los parámetros que cambiaron y conserva los demás.
  function actualizarFiltros(cambios) {
    const siguiente = new URLSearchParams(searchParams)
    for (const [clave, valor] of Object.entries(cambios)) {
      if (valor === "" || valor === null || valor === undefined) {
        siguiente.delete(clave)
      } else {
        siguiente.set(clave, String(valor))
      }
    }
    // Si cambió un filtro (y no la página), se vuelve a la página 1.
    if (!("page" in cambios)) siguiente.delete("page")
    setSearchParams(siguiente)
  }

  const limpiarFiltros = () => setSearchParams({})

  const productos = data?.items ?? []

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Productos</h1>
        <p className="text-muted-foreground">Consulta del catálogo de productos.</p>
      </div>

      <ProductosFiltros filtros={filtros} onChange={actualizarFiltros} onClear={limpiarFiltros} />

      {/* Los cuatro estados de la UI: cargando, error, vacío y con datos */}
      {error ? (
        <EstadoError error={error} onRetry={reload} />
      ) : !loading && productos.length === 0 ? (
        <EstadoVacio mensaje="No se encontraron productos con los filtros aplicados.">
          <Button variant="outline" size="sm" onClick={limpiarFiltros}>
            Limpiar filtros
          </Button>
        </EstadoVacio>
      ) : (
        <>
          <ProductosTabla productos={productos} loading={loading} />
          {!loading && (
            <Paginacion
              page={data.page}
              totalPages={data.totalPages}
              totalCount={data.totalCount}
              onPageChange={(page) => actualizarFiltros({ page })}
            />
          )}
        </>
      )}
    </div>
  )
}
