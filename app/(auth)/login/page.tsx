'use client';

import { useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { login } from './actions';
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
import { useUser } from '@/context/user-context';

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const { refreshUser } = useUser();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      setError('');
      const result = await login(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }
      await refreshUser?.();
      router.push('/');
    });
  };

  return (
    <div className='flex min-h-screen w-full items-center justify-center'>
      <Card className='mx-auto w-[350px]'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl'>Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>DNI</Label>
              <Input
                id='email'
                name='email'
                type='text'
                placeholder='12345678'
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Contraseña</Label>
              <Input id='password' name='password' type='password' required />
            </div>
            {error && <p className='text-sm text-red-500'>{error}</p>}
          </CardContent>
          <CardFooter>
            <Button className='w-full' type='submit' disabled={isPending}>
              {isPending ? 'Entrando...' : 'Iniciar Sesión'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
