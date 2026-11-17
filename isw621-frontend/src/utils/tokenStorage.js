// Único lugar de la aplicación que sabe DÓNDE se guarda el JWT.
// Si más adelante se cambia localStorage por sessionStorage,
// solo se modifica este archivo.

const TOKEN_KEY = "isw621.token"

export const tokenStorage = {
  get() {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },

  set(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      // Almacenamiento no disponible (modo privado, bloqueado, etc.)
    }
  },

  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      // Sin acción
    }
  },
}
