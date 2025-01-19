"use client"
import { AttStatus, getDate, isAuthorized, sendRequest } from '@/utils';
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Loading from '@/app/components/Loading';
import { ProperUserInterface, SlugProps } from '@/interfaces';
import { IUserInfo } from '@/schema/userinfo';
import "../../../../css/actions/update/attendance.scss"
import Struct from '@/app/Struct';
import Button from '@/app/components/Button';
import { IAttendanceInfo } from '@/schema/attendanceinfo';

const UpdateAttendance = ({ params }: SlugProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [addBlur, setAddBlur] = useState(false);
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userProfiles, setUserProfiles] = useState<ProperUserInterface[]>([]);
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
      uID: session?.user.uid,
      Case: slug,
      CasterRole: session!.user.role,
      SchoolName: session!.user.schoolName
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

  const attButton = async (uid: string, status: string) => {
    const _date = getDate();
    const reqBody = {
      Request: "fillAttendance",
      uID: uid,
      Status: status,
      Day: _date.Day,
      Month: _date.Month,
      Year: _date.Year
    };
    const response = await sendRequest('/api/posts', reqBody);
    if (response.message !== "OK") {
      setIsError(response.error!);
      return;
    }

    const attendanceMonth: IAttendanceInfo = response.results.doc;
    const newData: ProperUserInterface[] = [];
    userProfiles.map((profile) => {
      if (profile.User.UID !== attendanceMonth.UID) {
        newData.push(profile);
      } else {
        newData.push({
          User: profile.User,
          Parent: profile.Parent,
          Attendance: attendanceMonth
        })
      }
    });
    setUserProfiles(newData);
  }

  return (
    <Struct>
      {isLoading ? <Loading Size={48} /> :
        <div className="upattendance">
          <h2>List of all {slug}</h2>
          <div className="upattendance-cards">

            {userProfiles.map((profile, index) => (
              <div className="upattendance-cards-card" key={index}>
                <div className="upattendance-cards-mock"></div>
                <div className="upattendance-cards-card">
                  <div className="upattendance-cards-card-inside">
                    <ul>
                      <li>Name: <span>{profile.User.Name}</span></li>
                      {profile.Parent && <li>Guardian Name: <span>{profile.Parent.Name}</span></li>}
                      <li>Role: <span>{profile.User.Role}</span></li>
                      <li>Class: <span> {profile.Class?.Name ? profile.Class.Name : "unassigned"}</span></li>
                      {AttStatus(profile.Attendance?.Attendance).IsPresent && <li>Attendance: <span className='success'>{AttStatus(profile.Attendance?.Attendance).Status.toUpperCase()}</span></li>}
                    </ul>
                    <div className="upattendance-cards-card-inside-actions">
                      {
                        session?.user.role !== "Owner" ?
                          <>
                            <Button onClick={() => attButton(profile.User.UID, "present")} Disabled={AttStatus(profile.Attendance?.Attendance).IsPresent}>Present</Button>
                            <Button onClick={() => attButton(profile.User.UID, "absent")} Disabled={AttStatus(profile.Attendance?.Attendance).IsPresent}>Absent</Button>
                            <Button onClick={() => attButton(profile.User.UID, "leave")} Disabled={AttStatus(profile.Attendance?.Attendance).IsPresent}>Leave</Button>
                          </> :
                          <>
                            <Button onClick={() => attButton(profile.User.UID, "present")}>Present</Button>
                            <Button onClick={() => attButton(profile.User.UID, "absent")}>Absent</Button>
                            <Button onClick={() => attButton(profile.User.UID, "leave")}>Leave</Button>
                          </>
                      }
                    </div>
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