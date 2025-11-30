import {LoginForm} from '../forms/login-form'
export function LoginPage() {
    return (
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Accesso dispositivo</h1>
<LoginForm/>
        </div>
      </div>
    )}