import { httpClient } from "@/api/httpClient"
import { tokenStorage } from "@/utils/tokenStorage"

// Servicio de autenticación: conoce el endpoint de login de la API.
// No usa React: solo recibe datos, llama a httpClient y devuelve datos.
export const authService = {
  // POST /api/Auth/login   cuerpo: { login, password }
  // Respuesta (Result Pattern): { isSuccess, title, detail, data: { token, tokenType,
  //   expiresAt, idUser, login, fullName, email, role }, ... }
  async login(login, password) {
    const result = await httpClient.post("Auth/login", { login, password })
    const auth = result?.data
    if (!auth?.token) {
      throw new Error(result?.detail || "La API no devolvió un token.")
    }
    tokenStorage.set(auth.token)
    return auth // token + datos del usuario (fullName, role...) para la clase 11-1
  },

  logout() {
    tokenStorage.clear()
  },

  isAuthenticated() {
    return Boolean(tokenStorage.get())
  },
}
