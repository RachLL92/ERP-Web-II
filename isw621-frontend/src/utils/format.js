// Formatos de presentación reutilizables.
const moneda = new Intl.NumberFormat("es-CR", {
  style: "currency",
  currency: "CRC",
})

const fecha = new Intl.DateTimeFormat("es-CR", {
  dateStyle: "medium",
  timeStyle: "short",
})

export function formatCurrency(valor) {
  return moneda.format(Number(valor ?? 0))
}

// La API envía las fechas como texto ISO ("2026-10-17T18:13:58.633Z").
// Hay que convertirlas a Date antes de darles formato.
export function formatDate(valor) {
  if (!valor) return "—"
  return fecha.format(new Date(valor))
}

// La API puede devolver la ruta de la imagen relativa al servidor
// ("/images/products/camisa.png"). El navegador la buscaría en el
// puerto del frontend (5173), así que se completa con el origen de la API.
const API_ORIGIN = new URL(import.meta.env.VITE_API_URL ?? "http://localhost").origin

export function resolveImageUrl(ruta) {
  if (!ruta) return null
  if (/^https?:\/\//i.test(ruta)) return ruta
  return `${API_ORIGIN}/${ruta.replace(/^\/+/, "")}`
}
