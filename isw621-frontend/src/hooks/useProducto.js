import { useEffect, useState } from "react"
import { productoService } from "@/services/productoService"

// Hook para el detalle de un Producto (GET /Product/{id}).
// Sigue el mismo patrón que useProductos.
export function useProducto(id) {
  const [resultado, setResultado] = useState({ id: null, producto: null, error: null })

  useEffect(() => {
    const controller = new AbortController()

    productoService
      .getById(id, { signal: controller.signal })
      .then((producto) => setResultado({ id, producto, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setResultado({ id, producto: null, error })
        }
      })

    return () => controller.abort()
  }, [id])

  const loading = resultado.id !== id

  return {
    producto: loading ? null : resultado.producto,
    error: loading ? null : resultado.error,
    loading,
  }
}
