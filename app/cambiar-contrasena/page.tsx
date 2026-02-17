'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition, useEffect } from 'react';
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
import { createClient } from '@/lib/supabase/client';

export default function CambiarContrasenaPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(true); // Estado para la carga inicial
  const supabase = createClient();

  // 1. Comprobar si el usuario está logueado al cargar la página
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Si no hay sesión, mandarlo al login
        router.push('/login');
      } else {
        setIsChecking(false);
      }
    };

    checkUser();
  }, [supabase, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!password || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    startTransition(async () => {
      try {
        const { error: supabaseError } = await supabase.auth.updateUser({
          password: password,
        });

        if (supabaseError) {
          setError(supabaseError.message);
          return;
        }

        router.push('/');
        router.refresh();
      } catch (err) {
        console.error(err);
        setError('Ocurrió un error inesperado.');
      }
    });
  };

  // 2. Mientras comprueba la sesión, mostramos un estado de carga
  if (isChecking) {
    return (
      <div className='flex min-h-[calc(100vh-64px)] w-full items-center justify-center'>
        <p className='animate-pulse text-sm text-muted-foreground'>
          Verificando sesión...
        </p>
      </div>
    );
  }

  return (
    <div className='flex min-h-[calc(100vh-64px)] w-full items-center justify-center'>
      <Card className='mx-auto w-[350px] shadow-lg'>
        <CardHeader className='space-y-1 text-center'>
          <div className='mb-2 flex justify-center'>
            <div className='rounded-full bg-primary/10 p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='text-primary'
              >
                <path d='M19 11v6' />
                <path d='M19 13h2' />
                <path d='M2 21a8 8 0 0 1 12.868-6.349' />
                <circle cx='10' cy='8' r='5' />
                <circle cx='19' cy='19' r='2' />
              </svg>
            </div>
          </div>
          <CardTitle className='text-2xl'>Nueva Contraseña</CardTitle>
          <CardDescription>
            Actualiza tus credenciales de acceso.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Nueva Contraseña</Label>
              <Input
                id='password'
                name='password'
                type='password'
                placeholder='••••••••'
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='confirmPassword'>Confirmar Contraseña</Label>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                placeholder='••••••••'
                required
              />
            </div>

            {error && (
              <p className='rounded bg-destructive/10 p-2 text-xs font-medium text-destructive'>
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button className='w-full' type='submit' disabled={isPending}>
              {isPending ? 'Actualizando...' : 'Cambiar Contraseña'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
