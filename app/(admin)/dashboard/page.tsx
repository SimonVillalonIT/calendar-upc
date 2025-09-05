"use client"

import useUser from '@/hooks/user-hook'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function Page() {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
    }
  }, [user, router])

  if (!user || user.role !== 'admin') {
    return null 
  }

  return (
    <div>ADMIN</div>
  )
}

export default Page