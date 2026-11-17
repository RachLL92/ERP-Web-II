import * as z from "zod"

// Esquema de validación del formulario de Login.
// Describe la FORMA que deben tener los datos y el mensaje de cada error.
// Las mismas reglas existen en el backend: la validación del cliente
// mejora la experiencia del usuario, pero NO reemplaza la del servidor.
export const loginSchema = z.object({
  login: z.string().trim().min(1, "El usuario es requerido."),
  password: z.string().min(1, "La contraseña es requerida."),
})
