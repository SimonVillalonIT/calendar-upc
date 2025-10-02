"use client"

import { useUser } from "@/context/user-context";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import LoginSkeleton from "./login-skeleton";
import { TARGETS } from "@/lib/constants";

export default function LoginButton() {
    const { user, signOut, isLoading } = useUser()
     if (isLoading) {
        return <LoginSkeleton />
    }
    return user ? (
        <div className="flex gap-4 items-center">
            <div className="w-fit flex gap-2">
                <UserIcon className="size-7" />
                <p className="w-fit text-center text-nowrap text-lg">
                    {user.name || user.email} ({TARGETS[user.role as unknown as keyof typeof TARGETS]})
                    </p>
            </div>
            <div onClick={signOut} className="w-fit flex">
                <p className="select-none cursor-pointer text-lg">Cerrar Sesión</p>
            </div>
        </div>
    ) : (
        <Link href="/login" className="select-none">
            Iniciar Sesión
        </Link>
    )
}
