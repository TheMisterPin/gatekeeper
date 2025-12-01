"use client"

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react"
import type { ReactNode } from "react"

import { LoginFormValues } from "@/types/login/login-form-values"
import { LoginResponse } from "@/types/request/login"

interface AuthContextValue {
	isAuthenticated: boolean
	currentUserName?: string
	login: (values: LoginFormValues) => Promise<LoginResponse>
	logout: () => void
	loginLoading: boolean
	loginError?: string
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function performLoginRequest(
	values: LoginFormValues
): Promise<LoginResponse> {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(values),
	})

	const payload = (await response.json()) as LoginResponse

	if (!response.ok) {
		return {
			message: payload.message,
			status: payload.status,
			resourceFullName: payload.resourceFullName,
			error: payload.error ?? {
				status: response.status,
				message: payload.message,
			},
		}
	}

	return {
		message: payload.message,
		status: payload.status,
		resourceFullName: payload.resourceFullName,
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [currentUserName, setCurrentUserName] = useState<string | undefined>()
	const [loginLoading, setLoginLoading] = useState(false)
	const [loginError, setLoginError] = useState<string | undefined>()

	const login = useCallback(async (values: LoginFormValues) => {
		setLoginLoading(true)
		setLoginError(undefined)

		try {
			const result = await performLoginRequest(values)

			if (result.error) {
				setIsAuthenticated(false)
				setCurrentUserName(undefined)
				setLoginError(result.message)
			} else {
				setIsAuthenticated(true)
				setCurrentUserName(result.resourceFullName)
			}

			return result
		} catch (error) {
			setIsAuthenticated(false)
			setCurrentUserName(undefined)
			setLoginError("Impossibile completare il login.")

			return {
				message: "Impossibile completare il login.",
				error: {
					status: 500,
					message: error instanceof Error ? error.message : "Unknown error",
				},
			}
		} finally {
			setLoginLoading(false)
		}
	}, [])

	const logout = useCallback(() => {
		setIsAuthenticated(false)
		setCurrentUserName(undefined)
	}, [])

	const value = useMemo<AuthContextValue>(
		() => ({
			isAuthenticated,
			currentUserName,
			login,
			logout,
			loginLoading,
			loginError,
		}),
		[
			isAuthenticated,
			currentUserName,
			login,
			logout,
			loginLoading,
			loginError,
		]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}

	return context
}
