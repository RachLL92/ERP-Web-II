import { httpClient } from "@/api/httpClient"

// Servicio de Producto: un método por endpoint de la API.
// Es la "traducción" entre la API y la aplicación: si la API cambia una
// ruta, un parámetro o el formato de la respuesta, solo se modifica aquí.
export const productoService = {
  // GET /api/Product/search?name=&status=&sortBy=&sortDirection=&pageNumber=&pageSize=
  // Query strings: búsqueda, filtro, orden y paginación (clase 6-2).
  // Todos los parámetros son opcionales; httpClient omite los vacíos.
  async getAll(filtros, options) {
    const result = await httpClient.get("Product/search", {
      params: {
        name: filtros.search,
        status: filtros.status,
        sortBy: filtros.sortBy,
        sortDirection: filtros.sortDirection,
        pageNumber: filtros.page,
        pageSize: filtros.pageSize,
      },
      ...options,
    })

    // La API responde con el Result Pattern:
    //   { isSuccess, data: [...], pageNumber, pageSize, totalRecords, totalPages }
    // Se convierte al formato que usan los componentes.
    return {
      items: result.data ?? [],
      page: result.pageNumber ?? filtros.page,
      pageSize: result.pageSize ?? filtros.pageSize,
      totalCount: result.totalRecords ?? 0,
      totalPages: result.totalPages ?? 0,
    }
  },

  // GET /api/Product/{id}
  // Route param: el id forma parte de la ruta. El producto viene en "data".
  async getById(id, options) {
    const result = await httpClient.get(`Product/${id}`, options)
    return result.data
  },
}
