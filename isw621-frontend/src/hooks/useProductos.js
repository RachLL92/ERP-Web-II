import { useEffect, useState } from "react"
import { productoService } from "@/services/productoService"

// Hook personalizado: maneja los estados de la petición del listado.
// La página solo recibe { data, loading, error, reload } y se dedica a mostrar.
export function useProductos(filtros) {
  const [reloadCount, setReloadCount] = useState(0)

  // Guarda la última respuesta junto con la "llave" de la petición que la produjo.
  const [resultado, setResultado] = useState({ key: null, data: null, error: null })

  // Los filtros son un objeto nuevo en cada render. Se convierten a texto
  // para que el efecto solo se ejecute cuando su contenido cambia.
  const filtrosKey = JSON.stringify(filtros)
  const requestKey = `${filtrosKey}#${reloadCount}`

  useEffect(() => {
    // AbortController cancela la petición anterior si los filtros cambian
    // antes de que llegue la respuesta (o si el componente se desmonta).
    const controller = new AbortController()

    productoService
      .getAll(JSON.parse(filtrosKey), { signal: controller.signal })
      .then((data) => setResultado({ key: requestKey, data, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setResultado({ key: requestKey, data: null, error })
        }
      })

    return () => controller.abort()
  }, [filtrosKey, requestKey])

  // "Cargando" no se guarda: se calcula. Si la respuesta guardada no
  // corresponde a la petición actual, todavía se está esperando.
  const loading = resultado.key !== requestKey

  return {
    data: loading ? null : resultado.data,
    error: loading ? null : resultado.error,
    loading,
    reload: () => setReloadCount((n) => n + 1),
  }
}
