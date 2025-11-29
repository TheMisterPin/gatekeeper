
import { getUserByUserName } from "@/utils/db/users/get-user"

interface LoginRequest  {
  username : string
  password: string
}

export const POST = async (req: Request) => {
  try {
    const body: LoginRequest = await req.json()
    const username = body?.username?.trim()
    const password = body?.password

    if (!username || !password) {
      return new Response("Credenziali mancanti", { status: 400 })
    }

    const user = await getUserByUserName(username)

    if (!user) {
      return new Response("Utente non trovato", { status: 404 })
    }

    const storedPassword = user.USPassword ?? ""

    if (!storedPassword) {
      return new Response("La risorsa non ha una password assegnata", { status: 401 })
    }

    if (storedPassword === password) {
      return new Response("Login Riuscito", { status: 200 })
    }

    return new Response("Password Errata", { status: 401 })
  } catch (error) {
    console.error("[login] Errore nella richiesta", error)
    return new Response("Errore durante il login", { status: 500 })
  }
}