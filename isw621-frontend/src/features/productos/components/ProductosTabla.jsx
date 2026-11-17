import { Link, useLocation } from "react-router"
import { Eye, ImageOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, resolveImageUrl } from "@/utils/format"

// Componente de presentación: recibe datos por props y los dibuja.
// No sabe de dónde vienen los productos ni hace peticiones.
// Los nombres de las propiedades son los del DTO de la API (ProductListDto).
export default function ProductosTabla({ productos, loading, filas = 5 }) {
  const location = useLocation()

  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-14" />
            <TableHead>Producto</TableHead>
            <TableHead className="hidden md:table-cell">Categoría</TableHead>
            <TableHead className="hidden lg:table-cell">Bodega</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="hidden text-right sm:table-cell">Stock</TableHead>
            <TableHead className="hidden text-right lg:table-cell">Valor inventario</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: filas }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : productos.map((producto) => (
                <TableRow key={producto.idProduct}>
                  <TableCell>
                    {producto.imageUrl ? (
                      <img
                        src={resolveImageUrl(producto.imageUrl)}
                        alt={producto.productName}
                        className="size-10 rounded-md border object-cover"
                      />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-md border bg-muted">
                        <ImageOff className="size-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{producto.productName}</TableCell>
                  <TableCell className="hidden md:table-cell">{producto.categoryName}</TableCell>
                  <TableCell className="hidden lg:table-cell">{producto.warehouseName}</TableCell>
                  <TableCell className="text-right">{formatCurrency(producto.price)}</TableCell>
                  <TableCell className="hidden text-right sm:table-cell">
                    {producto.stockQuantity}
                  </TableCell>
                  <TableCell className="hidden text-right lg:table-cell">
                    {formatCurrency(producto.inventoryValue)}
                  </TableCell>
                  <TableCell>
                    {/* state: se envían los filtros actuales para poder regresar a ellos */}
                    <Button asChild variant="ghost" size="icon-sm">
                      <Link
                        to={`/productos/${producto.idProduct}`}
                        state={{ from: location.search }}
                        aria-label={`Ver ${producto.productName}`}
                      >
                        <Eye />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  )
}
