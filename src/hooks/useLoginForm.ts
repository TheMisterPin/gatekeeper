/* eslint-disable react-hooks/exhaustive-deps */
 
"use client"

import { useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { useAuth } from "@/hooks/auth-context"
import { LoginFormValues } from "@/types/login/login-form-values"

const loginFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Inserisci il nome utente"),
  password: z.string().min(1, "Inserisci la password"),
})

export function useLoginForm() {
  const { login, loginLoading, loginError, isAuthenticated, currentUserName } =
    useAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onSubmit",
  })

  const handleSubmit = useCallback(
    form.handleSubmit(async (values) => {
      const result = await login(values)

      if (result.error) {
        toast.error(result.message)
        return
      }

      toast.success(result.message ?? "Login eseguito")
    }),
    [form, login]
  )

  return {
    form,
    handleSubmit,
    isSubmitting: loginLoading,
    submitError: loginError,
    isAuthenticated,
    currentUserName,
  }
}
