
import { getUserByUserName } from "@/utils/db/users/get-user"

interface LoginRequest {
  username: string
  password: string
}

export const POST = async (req: Request) => {
  try {
    const body: LoginRequest = await req.json()
    const username = body?.username?.trim()
    const password = body?.password

    if (!username || !password) {
      return Response.json({
        message: "Credenziali mancanti",
        status: {
          status: 400,
          message: "Credenziali mancanti",
        },
      }, { status: 400 })
    }

    const user = await getUserByUserName(username)

    if (!user) {
      return Response.json({
        message: "Utente non trovato",
        status: {
          status: 404,
          message: "Utente non trovato",
        },
        error: {
          status: 404,
          message: "Utente non trovato",
        },
      }, { status: 404 })
    }

    const storedPassword = user.USPassword ?? ""

    if (!storedPassword) {
      return Response.json({
        message: "La risorsa non ha una password assegnata",
        status: {
          status: 401,
          message: "Password mancante",
        },
        error: {
          status: 401,
          message: "La risorsa non ha una password assegnata",
        },
      }, { status: 401 })
    }

    if (storedPassword === password) {
      return Response.json({
        message: "Login Riuscito",
        resourceFullName: user.FirstName + " " + user.LastName,
        status: {
          status: 200,
          message: "OK",
        },
      })
    }

    return Response.json({
      message: "Password Errata",
      status: {
        status: 401,
        message: "Password Errata",
      },
      error: {
        status: 401,
        message: "Password Errata",
      },
    }, { status: 401 })
  } catch (error) {
    console.error("[login] Errore nella richiesta", error)
    return Response.json({
      message: "Errore durante il login",
      status: {
        status: 500,
        message: "Errore durante il login",
      },
      error: {
        status: 500,
        message: "Errore durante il login",
      },
    }, { status: 500 })
  }
}