# ISW-621 · Frontend (React + Vite)

Proyecto base del frontend administrativo del curso **ISW-621 Programación en Ambiente Web II**.
Consume la API REST desarrollada en ASP.NET Core.

Ya viene configurado:

- React 19 + Vite (JavaScript)
- Tailwind CSS v4 con el tema del curso
- shadcn/ui (componentes en `src/components/ui`)
- Alias `@/` → `src/`
- React Router
- Cliente HTTP con **fetch** (`src/api/httpClient.js`), sin Axios
- Variables de entorno (`.env`)

## Requisitos

- Node.js **20.19 o superior** (recomendado 22 LTS). Verificar con `node -v`
- Git
- La API del curso en ejecución
- VS Code con las extensiones recomendadas (Tailwind CSS IntelliSense y Oxc)

## Puesta en marcha (al inicio de cada clase)

```bash
git clone https://git.isw.utn.ac.cr/npaniagua/isw621-frontend
cd isw621-frontend
npm install
```

Crear el archivo `.env` a partir de la plantilla:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux / Git Bash
cp .env.example .env
```

Editar `.env` con la URL **https** de la API (el puerto está en `Properties/launchSettings.json` del backend):

```
VITE_API_URL=https://localhost:7001/api
```

Ejecutar:

```bash
npm run dev
```

Abrir http://localhost:5173. Si aparece la pantalla **"Proyecto base listo"** con estilos, todo quedó bien.

> Cada vez que se modifica `.env`, hay que detener el servidor (`Ctrl + C`) y volver a ejecutar `npm run dev`.

## Scripts

| Comando           | Descripción                               |
|-------------------|-------------------------------------------|
| `npm run dev`     | Servidor de desarrollo (puerto 5173)      |
| `npm run build`   | Compilación para producción en `dist/`    |
| `npm run preview` | Sirve localmente la versión compilada     |
| `npm run lint`    | Revisa el código con oxlint               |

## Estructura

```
src/
  api/          httpClient.js        Cliente HTTP con fetch (JWT, JSON, errores)
  services/     authService.js, productoService.js, usuarioService.js
  hooks/        useProductos.js, useUsuarios.js
  context/      AuthContext.jsx
  routes/       AppRouter.jsx, ProtectedRoute.jsx, RoleRoute.jsx
  components/
    ui/         Componentes de shadcn (no editar a mano)
    layout/     AppLayout.jsx
    shared/     Componentes reutilizables (NotFound, PagePlaceholder, ...)
  features/
    auth/       pages/, components/
    home/       pages/
    productos/  pages/, components/
    usuarios/   pages/, components/
  lib/          utils.js             Función cn() de shadcn
  utils/        apiError.js, tokenStorage.js
```

## Reglas de la arquitectura

1. **Página → hook → servicio → httpClient → API.**
2. Los componentes **nunca** llaman a `fetch` directamente: usan un hook o un servicio.
3. Los servicios **solo** usan `httpClient`.
4. Solo `tokenStorage.js` sabe dónde se guarda el JWT.
5. Los errores de la API siempre llegan como `ApiError` (`status`, `message`, `errors`).
6. Para los colores se usan las clases del tema (`bg-primary`, `text-muted-foreground`, `text-destructive`), no colores fijos como `text-blue-600`.

## Uso del cliente HTTP

```js
import { httpClient } from "@/api/httpClient"

httpClient.get("productos", { params: { search: "camisa", page: 1 } }) // GET    /productos?search=camisa&page=1
httpClient.get(`productos/${id}`)                                    // GET    /productos/5
httpClient.post("productos", producto)                               // POST   JSON
httpClient.put(`productos/${id}`, producto)                          // PUT    JSON
httpClient.patch(`productos/${id}/estado`, { activo: false })        // PATCH  JSON
httpClient.delete(`productos/${id}`)                                 // DELETE
httpClient.put(`productos/${id}/imagen`, formData)                   // multipart/form-data
```

Manejo de errores:

```js
import { getErrorMessage, getFieldError } from "@/utils/apiError"

try {
  await productoService.create(producto)
} catch (error) {
  toast.error(getErrorMessage(error))                 // mensaje general
  const errorNombre = getFieldError(error, "nombre")  // error de validación de un campo
}
```

## Tema

Los colores y el radio de las esquinas se definen en `src/index.css`, en los bloques `:root` (modo claro) y `.dark` (modo oscuro). Para cambiar el tema solo se editan esos dos bloques; los componentes se actualizan solos.

## Agregar más componentes de shadcn

```bash
npx shadcn@latest add tabs textarea
```

## Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| Error al ejecutar `npm install` o `npm run dev` | Node.js menor a 20.19 | Instalar Node 22 LTS |
| "Falta la variable VITE_API_URL" o "No configurada" en Inicio | No existe `.env` | Copiar `.env.example` como `.env` y reiniciar `npm run dev` |
| "No se pudo conectar con el servidor" | API apagada, puerto incorrecto o certificado HTTPS no confiable | Ejecutar la API, revisar el puerto y ejecutar `dotnet dev-certs https --trust` |
| Error de **CORS** en la consola | La API no permite el origen `http://localhost:5173` | Agregar ese origen a la política CORS del backend |
| "Port 5173 is already in use" | Hay otro `npm run dev` abierto | Cerrar la otra terminal |
| Pantalla sin estilos | Se modificó `src/index.css` | Restaurar el archivo original del repositorio |
| `@/` aparece en rojo en VS Code | Falta `jsconfig.json` o hay que recargar VS Code | Verificar el archivo y recargar la ventana |

---

ISW-621 · Programación en Ambiente Web II · UTN