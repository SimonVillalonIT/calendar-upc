"use client"

import { getUserRole, logOut } from '@/lib/utils'
import { UserWithRole } from '@/types/globals'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

function useUser() {
    const [userData, setUserData] = useState<UserWithRole | null>(null)
    const router = useRouter()

    const fetchUserData = async () => {
        const data = await getUserRole()
        setUserData(data)
    }

    useEffect(() => {
        fetchUserData()
    }, [userData])

    const signOut = async () => {
        logOut();
        router.refresh()
    }

    return { user: userData, signOut }
}

export default useUser