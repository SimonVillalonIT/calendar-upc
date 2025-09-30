"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Role = 'student' | 'teacher' | 'admin';

export default function RegisterPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const [role, setRole] = useState<Role>('student') // Estado para el campo 'role'

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previene el envío por defecto de la etiqueta <form>
    setError("");

    // Obtener datos del formulario
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    // 'role' ya lo tenemos en el estado

    if (!email || !password || !name) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/create-user', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, role, name }),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || 'Error desconocido al registrar el usuario.');
          return;
        }

        router.push("/login"); // Redirige al inicio de sesión
        
      } catch (err) {
        console.error(err);
        setError("Error de red. Inténtalo de nuevo más tarde.");
      }
    });
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Card className="w-[350px] mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Ingresa tus datos y selecciona tu rol.
          </CardDescription>
        </CardHeader>
        {/* Cambiamos a onSubmit y usamos fetch ya que tu API es una ruta */}
        <form onSubmit={handleSubmit}> 
          <CardContent className="grid gap-4">
            {/* Campo Nombre */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" name="name" type="text" placeholder="Juan Pérez" required />
            </div>
            {/* Campo Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="email@ejemplo.com" required />
            </div>
            {/* Campo Contraseña */}
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {/* Campo Rol (Select) */}
            <div className="grid gap-2">
              <Label htmlFor="role">Rol</Label>
              <Select name="role" value={role} onValueChange={(value: Role) => setRole(value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Profesor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem> 
                </SelectContent>
              </Select>
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? "Creando..." : "Registrarme"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}