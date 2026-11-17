// Cliente HTTP centralizado basado en fetch (sin librerías externas).
// Todos los servicios (authService, productoService, ...) lo usan;
// ningún componente debe llamar a fetch directamente.
//
// Responsabilidades:
//   1. Armar la URL: VITE_API_URL + ruta + query string.
//   2. Enviar el JWT en el header Authorization (Bearer).
//   3. Serializar el cuerpo (JSON o FormData).
//   4. Deserializar la respuesta (JSON, texto o vacía).
//   5. Convertir cualquier error en un ApiError uniforme.

import { tokenStorage } from "@/utils/tokenStorage"
import { createApiError, createNetworkError } from "@/utils/apiError"

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "")

if (!API_URL) {
  throw new Error(
    "Falta la variable VITE_API_URL. Copie .env.example como .env y reinicie npm run dev."
  )
}

// { search: "camisa", page: 1, categoriaId: "" } -> "?search=camisa&page=1"
// Omite valores vacíos y repite la clave para arreglos (?ids=1&ids=2).
function buildQueryString(params) {
  if (!params) return ""
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, item))
    } else {
      search.append(key, value)
    }
  }

  const query = search.toString()
  return query ? `?${query}` : ""
}

async function parseBody(response) {
  if (response.status === 204) return null

  const text = await response.text()
  if (!text) return null

  const contentType = response.headers.get("Content-Type") ?? ""
  if (contentType.includes("json")) {
    return JSON.parse(text)
  }
  return text
}

async function request(method, path, { params, body, headers, signal } = {}) {
  const url = `${API_URL}/${path.replace(/^\/+/, "")}${buildQueryString(params)}`

  const finalHeaders = { Accept: "application/json", ...headers }

  const token = tokenStorage.get()
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`
  }

  let finalBody
  if (body instanceof FormData) {
    // El navegador agrega Content-Type multipart/form-data con su boundary.
    finalBody = body
  } else if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json"
    finalBody = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: finalBody,
      signal,
    })
  } catch (error) {
    // Una cancelación con AbortController no es un error de red.
    if (error?.name === "AbortError") throw error
    throw createNetworkError(error)
  }

  const data = await parseBody(response)

  // fetch NO lanza excepción con 4xx/5xx: hay que revisar response.ok.
  if (!response.ok) {
    throw createApiError(response.status, data)
  }

  return data
}

export const httpClient = {
  get: (path, options) => request("GET", path, options),
  post: (path, body, options) => request("POST", path, { ...options, body }),
  put: (path, body, options) => request("PUT", path, { ...options, body }),
  patch: (path, body, options) => request("PATCH", path, { ...options, body }),
  delete: (path, options) => request("DELETE", path, options),
}
