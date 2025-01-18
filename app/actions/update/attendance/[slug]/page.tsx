"use client"
import { isAuthorized } from '@/utils';
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Loading from '@/app/components/Loading';
import { SlugProps } from '@/interfaces';
import { IUserInfo } from '@/schema/userinfo';
import "../../../../css/actions/update/attendance.scss"
import Struct from '@/app/Struct';

const UpdateAttendance = ({ params }: SlugProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [addBlur, setAddBlur] = useState(false);
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userProfiles, setUserProfiles] = useState<IUserInfo[]>([]);
  const [isError, setIsError] = useState("");
  const [userDetail, setUserDetail] = useState<IUserInfo | undefined>(undefined);

  useEffect(() => {
    if (session) {
      if (!isAuthorized(session.user.role, ["SU", "HU"])) {
        router.push('/login');
      } else {
        const getUserInfo = async () => {
          const response = await fetch('/api/posts', {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              Request: "getuserbyid",
              uid: session.user.uid
            })
          });

          if (!response.ok) {
            setIsError("There was an error loading user data, please refresh the page..");
            return;
          }

          const data = await response.json();
          if (data.message === "OK")
            setUserDetail(data.doc);
          else
            setIsError('There was an error loading user data, please refresh the page..');
        }
        getUserInfo()
      }
    }
  }, [session, router])

  useEffect(() => {
    const getSlug = async () => {
      const _slug = (await params).slug;
      if (_slug !== "staff" && _slug !== "students")
        router.push("/dashboard");
      else {
        setIsLoading(false);
        setSlug(_slug);
      }
    }
    getSlug();
  }, [params])

  useEffect(() => {
    if (slug === "") return;
    var reqBody = {
      Request: "getusers",
      Case: slug,
      CasterRole: session!.user.role,
      SchoolName: session!.user.schoolName,
      Class: userDetail?.AssignedClass
    }
    const requestFetch = async () => {
      try {
        const response = await fetch('/api/posts', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reqBody)
        });

        if (!response.ok) {
          setIsError("Network response was not okay, please refresh the page..");
          return;
        }

        const data = await response.json();
        if (data.message === "OK") {
          setUserProfiles(data.docs);
        } else {
          setIsError(data.error);
        }
      } catch (error) {
        setIsError("Seems to be an error while loading the data, please refresh the page..");
      }
    }
    requestFetch();
  }, [slug])

  return (
    <Struct>
      {isLoading ? <Loading Size={48} /> :
        <div className="upattendance">
          <h2>List of all {slug}</h2>
          <div className="upattendance-cards">

            {userProfiles.map((profile, index) => (
              <div className="upattendance-cards-card" key={index}>
                <div className="upattendance-cards-mock"></div>
                <div className="upattendance-cards-card-inside">
                  <ul>
                    <li>Name: <span>{profile.Name}</span></li>
                    <li>Guardian Name: <span>working..</span></li>
                    <li>Role: <span>{profile.Role}</span></li>
                    <li>Class: <span> {profile.AssignedClass ? profile.AssignedClass : "unassigned"}</span></li>
                  </ul>
                  <div className="upattendance-cards-card-inside-actions">
                    This is actions
                    {
                      //What if the user is already marked?, get the marked data inside the userprofiles too
                      //Create a validator to valid the attendance and show the actions accordingly
                    }
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      }

    </Struct>
  )
}

export default UpdateAttendance