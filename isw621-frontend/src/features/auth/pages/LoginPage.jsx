import { Link, useNavigate } from "react-router"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { loginSchema } from "@/schemas/authSchemas"
import { authService } from "@/services/authService"
import { applyServerErrors, getErrorMessage } from "@/utils/apiError"

export default function LoginPage() {
  const navigate = useNavigate()

  // React Hook Form administra los valores, los errores y el envío.
  // zodResolver conecta el esquema de Zod: antes de llamar a onSubmit,
  // valida los datos y, si algo falla, NO se envía la petición.
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", password: "" },
  })

  // Solo se ejecuta si los datos pasaron la validación de Zod.
  async function onSubmit(values) {
    try {
      // POST /api/Auth/login con cuerpo JSON. authService guarda el JWT.
      await authService.login(values.login, values.password)
      toast.success("Sesión iniciada correctamente.")
      navigate("/productos")
    } catch (err) {
      // 400 con errores por campo -> se muestran debajo de cada input.
      // Cualquier otro error (401, red...) -> mensaje general del formulario.
      const asignados = applyServerErrors(err, setError, ["login", "password"])
      if (!asignados) {
        setError("root", { message: getErrorMessage(err) })
      }
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Iniciar sesión</CardTitle>
          <CardDescription>Ingrese sus credenciales para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* noValidate: la validación la hace Zod, no el navegador */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Controller
                name="login"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login">Usuario</FieldLabel>
                    <Input
                      {...field}
                      id="login"
                      placeholder="vendedor1"
                      autoComplete="username"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {errors.root && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="animate-spin" />}
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button asChild variant="link" className="px-0">
            <Link to="/">Volver al inicio</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
