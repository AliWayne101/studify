"use client"
import { isAuthorized } from '@/utils';
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/app/sections/Navbar';
import Logo from '@/app/sections/Logo';
import Body from '@/app/sections/Body';
import Footer from '@/app/sections/footer';
import Loading from '@/app/components/Loading';

const UpdateAttendance = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [addBlur, setAddBlur] = useState(false);

  useEffect(() => {
    if (session) {
      if (!isAuthorized(session.user.role, ["SU", "HU"])) {
        router.push('/login');
      }
    }
  }, [session, router])

  return (
    <>
      <Navbar updateParentState={setAddBlur} />
      <main className={`${addBlur && "blur"}`}>
        <Logo />
        <Body>
          {session ? <>
            This is done
          </> : <Loading Size={48} />}
        </Body>
      </main>

      <div className={`${addBlur && 'blur'}`}>
        <Footer />
      </div>
    </>
  )
}

export default UpdateAttendance