import { createBrowserRouter } from "react-router"
import AppLayout from "@/components/layout/AppLayout"
import NotFound from "@/components/shared/NotFound"
import HomePage from "@/features/home/pages/HomePage"
import LoginPage from "@/features/auth/pages/LoginPage"
import ProductosPage from "@/features/productos/pages/ProductosPage"
import ProductoDetallePage from "@/features/productos/pages/ProductoDetallePage"
import UsuariosPage from "@/features/usuarios/pages/UsuariosPage"

// Definición central de rutas.
// - /login queda FUERA del layout (pantalla completa, sin menú).
// - El resto vive dentro de AppLayout (menú + contenido).
export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "productos", element: <ProductosPage /> },
      { path: "productos/:id", element: <ProductoDetallePage /> },
      { path: "usuarios", element: <UsuariosPage /> },
    ],
  },
  { path: "*", element: <NotFound /> },
])
