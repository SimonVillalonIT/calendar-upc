import Image from 'next/image';
import { HeaderThemeToggle } from './header-theme-toggle';
import LoginButton from './login-button';
import Link from 'next/link';

export default function Header() {
  return (
    <div className='flex w-full items-center justify-between border-b p-2'>
      <Link href='/'>
        <Image
          fetchPriority='high'
          src={'/logo.png'}
          alt='Logo'
          width={200}
          height={80}
        />
      </Link>
      <div className='flex items-center gap-2'>
        <LoginButton />
        <HeaderThemeToggle />
      </div>
    </div>
  );
}
