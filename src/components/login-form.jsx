import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/api/axios"
import logo from "@/assets/img/sales-login.png";

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    // Llamada al backend - login API
    try {
      const res = await api.post("/auth/login", { email, password })

      // Guardar token
      localStorage.setItem("token", res.data.token)

      // Redirigir
      window.location.href = "/dashboard"
    } catch (err) {
      setError("Credenciales incorrectas")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center gap-3">
        {/* Logo del Login */}
        <img 
          src={logo} 
          alt="Logo de acceso" 
          className="h-20 w-auto object-contain" 
        />
        <CardTitle className="text-center text-xl font-semibold">Iniciar sesión</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input 
            type="email" 
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            Entrar
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
