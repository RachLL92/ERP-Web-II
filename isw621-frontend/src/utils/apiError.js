// Normaliza cualquier error de la API a un mismo objeto: ApiError.
// El backend responde los errores con ProblemDetails (RFC 9457):
//   { type, title, status, detail, errors? }
// En errores de validación (400) el campo "errors" es un diccionario:
//   { "Nombre": ["El nombre es requerido."], "Precio": ["..."] }

const DEFAULT_MESSAGES = {
  0: "No se pudo conectar con el servidor. Verifique que la API esté en ejecución.",
  400: "La solicitud contiene datos inválidos.",
  401: "Su sesión no es válida o expiró. Inicie sesión nuevamente.",
  403: "No tiene permisos para realizar esta acción.",
  404: "El recurso solicitado no existe.",
  409: "La operación entra en conflicto con el estado actual de los datos.",
  500: "Ocurrió un error inesperado en el servidor.",
}

export class ApiError extends Error {
  constructor(status, message, { title, detail, errors, data } = {}) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.title = title ?? null
    this.detail = detail ?? null
    this.errors = errors ?? {}
    this.data = data ?? null
  }

  get isNetworkError() {
    return this.status === 0
  }

  get isValidationError() {
    return this.status === 400 && Object.keys(this.errors).length > 0
  }

  get isUnauthorized() {
    return this.status === 401
  }

  get isForbidden() {
    return this.status === 403
  }
}

// Construye un ApiError a partir del status y el cuerpo de la respuesta.
export function createApiError(status, data) {
  const problem = data && typeof data === "object" ? data : {}

  // ValidationProblemDetails: errors es un objeto { campo: [mensajes] }.
  // Si el backend devolviera errors como arreglo, se agrupa en "general".
  let errors = {}
  if (Array.isArray(problem.errors)) {
    errors = { general: problem.errors.map(String) }
  } else if (problem.errors && typeof problem.errors === "object") {
    errors = problem.errors
  } else if (
    status === 400 &&
    problem.data &&
    typeof problem.data === "object" &&
    !Array.isArray(problem.data)
  ) {
    // La API del ERP responde con Result<T>: los errores por campo vienen en "data"
    errors = problem.data
  }

  const message =
    problem.detail ||
    problem.title ||
    problem.message ||
    (typeof data === "string" && data.trim()) ||
    DEFAULT_MESSAGES[status] ||
    `Error HTTP ${status}`

  return new ApiError(status, message, {
    title: problem.title,
    detail: problem.detail,
    errors,
    data,
  })
}

// Error cuando fetch ni siquiera obtuvo respuesta (API apagada, CORS,
// certificado HTTPS no confiable, URL incorrecta).
export function createNetworkError(cause) {
  const error = new ApiError(0, DEFAULT_MESSAGES[0])
  error.cause = cause
  return error
}

// Mensaje listo para mostrar en un toast o alerta.
export function getErrorMessage(error) {
  if (error instanceof ApiError) return error.message
  return error?.message || "Ocurrió un error inesperado."
}
// Copia los errores de validación del servidor (400) a un formulario de
// React Hook Form, usando su función setError. ASP.NET Core envía los
// nombres en PascalCase ("Email"); se comparan sin distinguir mayúsculas
// con los campos del formulario ("email").
// Devuelve true si asignó al menos un error a un campo.
export function applyServerErrors(error, setError, fields) {
  if (!(error instanceof ApiError) || !error.isValidationError) return false

  let applied = false
  for (const [key, messages] of Object.entries(error.errors)) {
    const field = fields.find((f) => f.toLowerCase() === key.toLowerCase())
    if (field && messages?.length) {
      setError(field, { type: "server", message: messages[0] })
      applied = true
    }
  }
  return applied
}
// Primer mensaje de validación de un campo, para mostrarlo bajo el input.
// Busca el nombre tal cual y sin distinguir mayúsculas ("Nombre" / "nombre").
export function getFieldError(error, field) {
  if (!(error instanceof ApiError)) return null
  const key = Object.keys(error.errors).find(
    (k) => k.toLowerCase() === field.toLowerCase()
  )
  return key ? error.errors[key]?.[0] ?? null : null
}
