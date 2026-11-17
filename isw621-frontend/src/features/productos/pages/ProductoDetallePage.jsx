import { Link, useLocation, useParams } from "react-router"
import { ArrowLeft, ImageOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import EstadoError from "@/components/shared/EstadoError"
import { useProducto } from "@/hooks/useProducto"
import { formatCurrency, formatDate, resolveImageUrl } from "@/utils/format"

export default function ProductoDetallePage() {
  // Route param: /productos/:id  ->  useParams() devuelve { id: "5" }
  const { id } = useParams()
  const location = useLocation()
  const { producto, loading, error } = useProducto(id)

  // Regresa al listado con los mismos filtros que tenía antes.
  const volverA = `/productos${location.state?.from ?? ""}`

  return (
    <div className="grid gap-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link to={volverA}>
          <ArrowLeft />
          Volver al listado
        </Link>
      </Button>

      {loading && <DetalleSkeleton />}

      {error && <EstadoError error={error} />}

      {producto && !loading && !error && (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-2xl">{producto.productName}</CardTitle>
              <Badge variant={producto.status ? "default" : "secondary"}>
                {producto.status ? "Activo" : "Inactivo"}
              </Badge>
              {producto.stockStatus && <Badge variant="outline">{producto.stockStatus}</Badge>}
            </div>
            <CardDescription>Registrado el {formatDate(producto.insertDate)}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-[240px_1fr]">
            {producto.imageUrl ? (
              <img
                src={resolveImageUrl(producto.imageUrl)}
                alt={producto.productName}
                className="aspect-square w-full rounded-lg border object-cover"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-lg border bg-muted">
                <ImageOff className="size-10 text-muted-foreground" />
              </div>
            )}
            <div className="grid content-start gap-4">
              <p className="text-muted-foreground">{producto.description}</p>
              <Separator />
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <Dato etiqueta="Categoría" valor={producto.category?.categoryName} />
                <Dato etiqueta="Bodega" valor={producto.warehouse?.warehouseName} />
                <Dato etiqueta="Precio" valor={formatCurrency(producto.price)} />
                <Dato etiqueta="Stock" valor={`${producto.stockQuantity} unidades`} />
              </dl>
              <Separator />
              <div className="grid gap-2 text-sm">
                <p className="text-muted-foreground">Proveedores ({producto.supplierCount ?? 0})</p>
                <div className="flex flex-wrap gap-2">
                  {producto.suppliers?.length ? (
                    producto.suppliers.map((proveedor) => (
                      <Badge key={proveedor.idSupplier} variant="secondary">
                        {proveedor.supplierName}
                      </Badge>
                    ))
                  ) : (
                    <span>Sin proveedores</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Dato({ etiqueta, valor }) {
  return (
    <div>
      <dt className="text-muted-foreground">{etiqueta}</dt>
      <dd className="font-medium">{valor ?? "—"}</dd>
    </div>
  )
}

// Estado "cargando": imita la forma de la tarjeta mientras llega la respuesta.
function DetalleSkeleton() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-[240px_1fr]">
        <Skeleton className="aspect-square w-full" />
        <div className="grid content-start gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-4 h-16 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
