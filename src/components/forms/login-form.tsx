"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useLoginForm } from "@/hooks/useLoginForm"

export function LoginForm() {
  const { form, handleSubmit, isSubmitting, submitError } = useLoginForm()
  const {
    formState: { errors },
    register,
    reset,
  } = form

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Accesso dispositivo</CardTitle>
        <CardDescription>Inserisci le tue credenziali per procedere.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.username)}>
              <FieldLabel htmlFor="login-username">Nome utente</FieldLabel>
              <Input
                id="login-username"
                autoComplete="username"
                placeholder="es. mario.rossi"
                aria-invalid={Boolean(errors.username)}
                {...register("username")}
              />
              <FieldDescription>Utilizza il nome utente assegnato.</FieldDescription>
              {errors.username && <FieldError errors={[errors.username]} />}
            </Field>
            <Field data-invalid={Boolean(errors.password)}>
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              <FieldDescription>La password distingue maiuscole e minuscole.</FieldDescription>
              {errors.password && <FieldError errors={[errors.password]} />}
            </Field>
          </FieldGroup>
          {submitError && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {submitError}
            </p>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit" form="login-form" disabled={isSubmitting}>
            {isSubmitting ? "Accesso..." : "Accedi"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
