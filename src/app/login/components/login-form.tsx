/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useLoginForm } from "@/hooks/useLoginForm"
import LoginFooterComponent from "./login-footer-component"
import LoginHeaderComponent from "./login-header-component"

export function LoginForm() {
  const { form, handleSubmit, isSubmitting, submitError } = useLoginForm()
  const {
    formState: { errors },
    register,
    reset,
  } = form

  // Avoid hydratation mismatch by not rendering a server-generated time string.
  // Start with null on both server and client, then set the current time in an effect.
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    // Set initial time and tick every second on the client only
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const timeString = now ? now.toLocaleTimeString() : ""

  return (
    <Card className="w-full sm:max-w-md bg-white rounded-lg shadow-md z-10 p-0"> 
<LoginHeaderComponent timeString={timeString} />
      <CardContent>
        <form id="login-form" className="px-4" onSubmit={handleSubmit} noValidate>
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
              {errors.password && <FieldError errors={[errors.password]} />}
            </Field>
          </FieldGroup>
          {submitError && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {submitError}
            </p>
          )}       
          
            <div className="w-1/2 mx-auto space-x-2 flex justify-between mt-4">
          <Button type="button" variant="destructive" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit" form="login-form" className="bg-green-600" disabled={isSubmitting}>
            {isSubmitting ? "Accesso..." : "Accedi"}
          </Button>
          </div>
        </form>
      </CardContent>
    
        <LoginFooterComponent />

    </Card>
  )
}
