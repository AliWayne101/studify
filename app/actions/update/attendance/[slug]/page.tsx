"use client"
import { AttStatus, getDate, sendRequest } from '@/utils';
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProperUserInterface, SlugProps } from '@/interfaces';
import "../../../../css/actions/update/attendance.scss"
import Struct from '@/app/Struct';
import Button from '@/app/components/Button';
import { IAttendanceInfo } from '@/schema/attendanceinfo';
import LoadingScreen from '@/app/components/LoadingScreen';
import ErrorContainer from '@/app/components/ErrorContainer';

const UpdateAttendance = ({ params }: SlugProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [userProfiles, setUserProfiles] = useState<ProperUserInterface[]>([]);
  const [isError, setIsError] = useState<string | null>(null);
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);

  useEffect(() => {
    const getSlug = async () => {
      const _slug = (await params).slug;
      if (_slug !== "staff" && _slug !== "students")
        router.push("/dashboard");
      else {
        setIsLoadingCompleted(true);
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
      CasterRole: session?.user.role,
      SchoolName: session?.user.schoolName
    }
    setIsLoadingCompleted(false);
    const requestFetch = async () => {
      try {
        const response = await sendRequest('/api/posts', reqBody);
        if (response.message === "OK") {
          setUserProfiles(response.results.docs);
          setIsError(null);
        } else {
          setIsError(response.error);
        }
        setIsLoadingCompleted(true);
      } catch (error) {
        setIsLoadingCompleted(true);
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
    setIsError(null);
  }

  return (
    <Struct LoadingCompleted={setIsLoadingCompleted}>
      <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
        <ErrorContainer error={isError} />
        <div className="upattendance">
          <h2>List of all {slug}</h2>
          <div className="upattendance-cards ov">


            {userProfiles.map((profile, index) => (
              <div className="upattendance-cards-card ov-body" key={index}>
                <div className="ov-mock"></div>
                <div className="ov-body-in">
                  <div className="upattendance-cards-card-inside">
                    <ul>
                      <li>Name: <span>{profile.User.Name}</span></li>
                      {profile.Parent && <li>Guardian Name: <span>{profile.Parent.Name}</span></li>}
                      <li>Role: <span>{profile.User.Role}</span></li>
                      <li>Class: <span> {profile.Class ? profile.Class.Name : "unassigned"}</span></li>
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
      </LoadingScreen>
    </Struct>
  )
}

export default UpdateAttendance