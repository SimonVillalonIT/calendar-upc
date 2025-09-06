"use client"

import useUser from "@/hooks/use-user";
import { UserIcon } from "lucide-react";
import Link from "next/link";

export default function LoginButton() {
    const { user, signOut } = useUser()

        return user ? (
            <div className="flex gap-4 items-center">
                <div className="w-fit flex gap-2 text-gray-600">
                    <UserIcon className="size-7" />
                    <p className="w-fit text-center text-nowrap text-lg">{user?.name || user.email} ({user.role})</p>
                </div>
                <div onClick={signOut} className="w-fit flex  text-gray-600">
                    <p className="text-gray-600 hover:text-gray-800 select-none cursor-pointer">Cerrar Sesión</p>
                </div>
            </div>
        ) : (
            <Link href="/login" className="text-gray-600 hover:text-gray-800">
                Iniciar Sesión
            </Link>
        )
}
