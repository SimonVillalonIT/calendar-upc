'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DOMAIN, TARGETS } from '@/lib/constants';

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [role, setRole] = useState<number>(2);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!email || !password || !name) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/create-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: `${email}${DOMAIN}`,
            password,
            role,
            name,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(
            result.error || 'Error desconocido al registrar el usuario.'
          );
          return;
        }

        router.push('/login');
      } catch (err) {
        console.error(err);
        setError('Error de red. Inténtalo de nuevo más tarde.');
      }
    });
  };

  return (
    <div className='flex min-h-screen w-full items-center justify-center'>
      <Card className='mx-auto w-[350px]'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl'>Crear Cuenta</CardTitle>
          <CardDescription>
            Ingresa tus datos y selecciona tu rol.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='name'>Nombre Completo</Label>
              <Input
                id='name'
                name='name'
                type='text'
                placeholder='Juan Pérez'
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>DNI</Label>
              <Input
                id='email'
                name='email'
                type='text'
                placeholder='12345678X'
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Contraseña</Label>
              <Input id='password' name='password' type='password' required />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='role'>Rol</Label>
              <Select
                name='role'
                value={role.toString()}
                onValueChange={(value: string) => setRole(parseInt(value))}
              >
                <SelectTrigger id='role'>
                  <SelectValue placeholder='Selecciona un rol' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='1'>{TARGETS[1]}</SelectItem>
                  <SelectItem value='2'>{TARGETS[2]}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className='text-sm text-red-500'>{error}</p>}
          </CardContent>
          <CardFooter>
            <Button className='w-full' type='submit' disabled={isPending}>
              {isPending ? 'Creando...' : 'Registrarme'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
