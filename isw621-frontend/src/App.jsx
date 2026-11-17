import { RouterProvider } from "react-router"
import { Toaster } from "@/components/ui/sonner"
import { router } from "@/routes/AppRouter"

// Raíz de la aplicación. En la clase 11-1 aquí se envuelve el router
// con <AuthProvider> para compartir el usuario autenticado.
export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  )
}
