import { isAuthorized } from '@/utils';
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

const UpdateAttendance = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      if (!isAuthorized(session.user.role, ["SU", "HU"])) {
        router.push('/login');
      }
    }
  }, [session, router])

  return (
    <div>UpdateAttendance</div>
  )
}

export default UpdateAttendance