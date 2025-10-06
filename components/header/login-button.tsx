'use client';

import { useUser } from '@/context/user-context';
import { UserIcon } from 'lucide-react';
import Link from 'next/link';
import LoginSkeleton from './login-skeleton';
import { TARGETS } from '@/lib/constants';

export default function LoginButton() {
  const { user, signOut, isLoading } = useUser();
  if (isLoading) {
    return <LoginSkeleton />;
  }
  return user ? (
    <div className='flex items-center gap-4'>
      <div className='flex w-fit gap-2'>
        <UserIcon className='size-7' />
        <p className='w-fit text-nowrap text-center text-lg'>
          {user.name || user.email} (
          {TARGETS[user.role as unknown as keyof typeof TARGETS]})
        </p>
      </div>
      <div onClick={signOut} className='flex w-fit'>
        <p className='cursor-pointer select-none text-lg'>Cerrar Sesión</p>
      </div>
    </div>
  ) : (
    <Link href='/login' className='select-none'>
      Iniciar Sesión
    </Link>
  );
}
