import Image from 'next/image'
import { HeaderThemeToggle } from './header-theme-toggle'
import LoginButton from './login-button'

export default function Header() {
  return (
    <div className="flex items-center justify-between p-2 w-full border-b">
      <div>
        <Image src={'/logo.png'} alt="Logo" width={200} height={80} />
      </div>
      <div className="flex items-center gap-2">
        <LoginButton />
        <HeaderThemeToggle />
      </div>
    </div>
  )
}
