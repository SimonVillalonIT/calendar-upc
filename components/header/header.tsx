import Image from 'next/image';
import { HeaderThemeToggle } from './header-theme-toggle';
import LoginButton from './login-button';

export default function Header() {
  return (
    <div className='flex w-full items-center justify-between border-b p-2'>
      <div>
        <Image
          fetchPriority='high'
          src={'/logo.png'}
          alt='Logo'
          width={200}
          height={80}
        />
      </div>
      <div className='flex items-center gap-2'>
        <LoginButton />
        <HeaderThemeToggle />
      </div>
    </div>
  );
}
