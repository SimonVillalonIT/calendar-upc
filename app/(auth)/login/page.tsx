"use client"

import { useRouter } from "next/navigation"
import { useTransition, useState } from "react"
import { login } from "./actions" 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"

export default function LoginPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const {refreshUser} = useUser()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      setError("")
      const result = await login(formData)

      if (result?.error) {
        setError(result.error)
        return
      }
      await refreshUser?.()
      router.push("/")
    })
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Card className="w-[350px] mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}> {/* The form action calls the handleSubmit function directly */}
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="email@ejemplo.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isPending}> {/* The button must be inside the form */}
              {isPending ? "Entrando..." : "Iniciar Sesión"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}