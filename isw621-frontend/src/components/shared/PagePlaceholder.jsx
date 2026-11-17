import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PagePlaceholder({ title, description, clase }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          {clase && <Badge variant="secondary">Clase {clase}</Badge>}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
