'use client';

import { useUser } from '@/context/user-context';
import { TARGETS } from '@/lib/constants';
import Link from 'next/link';

import { User2Icon, LogOutIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LoginSkeleton from './login-skeleton';

export default function LoginButton() {
  const { user, signOut, isLoading } = useUser();

  if (isLoading) {
    return <LoginSkeleton />;
  }

  if (!user) {
    return (
      <Link
        href='/login'
        className='inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
      >
        Iniciar Sesión
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='hidden flex-col text-left text-sm leading-tight md:flex'>
            <span className='truncate font-medium'>
              {user.name || user.email}
            </span>
            <span className='text-xs text-muted-foreground'>
              {TARGETS[user.role as keyof typeof TARGETS]}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='min-w-56 rounded-lg'
        align='end'
        sideOffset={8}
      >
        <DropdownMenuLabel className='p-0 font-normal'>
          <div className='flex items-center gap-2 px-3 py-2 text-left text-sm'>
            <Avatar className='h-8 w-8'>
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-medium'>
                {user.name || user.email}
              </span>
              <span className='truncate text-xs text-muted-foreground'>
                {TARGETS[user.role as keyof typeof TARGETS]}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User2Icon className='mr-2 h-4 w-4' />
            Perfil
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={signOut}
          className='text-red-600 focus:text-red-600'
        >
          <LogOutIcon className='mr-2 h-4 w-4' />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
