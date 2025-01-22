"use client"
import Button from '@/app/components/Button'
import Struct from '@/app/Struct'
import React, { useEffect, useState } from 'react'
import "../../../css/actions/create/class.scss"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { sendRequest } from '@/utils'
import { ISubjectsInfo } from '@/schema/subjectsinfo'
import Loading from '@/app/components/Loading'
import { FaArrowLeft } from 'react-icons/fa'
import { SubjectDetail } from '@/interfaces'
import { IUserInfo } from '@/schema/userinfo'
const Subjects = () => {
  const [newSubjectName, setNewSubjectName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");
  const [schoolSubjects, setSchoolSubjects] = useState<ISubjectsInfo>();
  const [targetSubjectInfo, setTargetSubjectInfo] = useState<SubjectDetail>();
  const [teachersList, setTeachersList] = useState<IUserInfo[]>([]);
  const [curWindow, setCurWindow] = useState("");
  const [targetSubject, setTargetSubject] = useState("");
  const [assignSelectTeacher, setAssignSelectTeacher] = useState("");
  const { data: session } = useSession();

  const router = useRouter();
  const createSubject = async () => {
    setIsLoading(true);
    if (newSubjectName === "") return;
    if (schoolSubjects) {
      if (schoolSubjects.SubjectList.find(x => x.SubjectName.toLocaleLowerCase() === newSubjectName.toLocaleLowerCase())) {
        setIsError("A subject with same name already exists!");
        return;
      }
    }
    const response = await sendRequest('/api/posts', {
      Request: "createsubject",
      SchoolName: session?.user.schoolName,
      SubjectName: newSubjectName
    });
    if (response.message === "OK") {
      LoadData();
    }
  }

  const LoadUsers = async () => {
    const response = await sendRequest('/api/posts', {
      Request: "getusersbyrole",
      Role: "Teacher",
      All: false,
      SchoolName: session?.user.schoolName
    });
    if (response.message === "OK") {
      setTeachersList(response.results.docs);
    } else {
      setIsError(response.error);
    }
  }

  useEffect(() => {
    if (session === undefined)
      router.push('/login');
    else {
      if (session?.user.role !== "Owner" && session?.user.role !== "Admin")
        router.push('/dashboard');

      LoadUsers();
      LoadData();
    }
  }, [session])

  const LoadData = async () => {
    setNewSubjectName("");
    setIsLoading(true);
    const response = await sendRequest('/api/posts', {
      Request: "getclasses",
      SchoolName: session?.user.schoolName
    });
    if (response.message !== "OK") {
      setIsError(response.error);
      setIsLoading(false);
      return;
    }
    setSchoolSubjects(response.results.doc);
    setIsLoading(false);
  }

  const DeleteSubject = async (subName: string) => {
    console.log(subName);
    setIsLoading(true);
    const response = await sendRequest('/api/posts', {
      Request: "deletesubject",
      SubjectName: subName,
      SchoolName: session?.user.schoolName
    });
    if (response.message === "OK") {
      LoadData();
    } else {
      setIsError(response.error);
    }
  }

  useEffect(() => {
    if (schoolSubjects)
      for (const sub of schoolSubjects.SubjectList) {
        if (sub.SubjectName === targetSubject)
          setTargetSubjectInfo(sub);
      }
  }, [targetSubject])

  const AssignTeacher = async (assign: boolean) => {
    const response = await sendRequest('/api/posts', {
      Request: "assignsubject",
      SubjectTeacherUID: assign === true ? assignSelectTeacher : "unassigned",
      SubjectName: targetSubject,
      SchoolName: session?.user.schoolName,
      Caster: session?.user.name
    });
    if (response.message === "OK") {
      setAssignSelectTeacher("");
      setTargetSubject("");
      LoadData();
    } else {
      setIsError(response.error);
    }
  }

  const UnassignedTeachers = () => {
    const unassignedTeachers: IUserInfo[] = [];
    if (teachersList)
      for (const teacher of teachersList) {
        const exists = schoolSubjects?.SubjectList.find(x => x.SubjectTeacherUID === teacher.UID);
        if (!exists)
          unassignedTeachers.push(teacher);
      }
    return unassignedTeachers;
  }

  return (
    <Struct>
      {isError && <div className="error">{isError}</div>}
      {isLoading ? <Loading Size={48} /> :
        curWindow === "create" ?
          <div className="class">
            <div className="navback">
              <span className='link' onClick={() => setCurWindow("")}><FaArrowLeft className='navback-icon' />Go Back</span>
            </div>
            <h2>Create a Subject</h2>
            <p>Create a subject to be assigned to teachers</p>
            <div className="class-create">
              <h3>Create a Subject</h3>
              <div className="class-create-input">
                <div className="class-create-input-inside">
                  <label htmlFor="SubName">Subject Name: </label>
                  <input type="text" name='SubName' id='SubName' value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} />
                </div>
                <div className="class-create-input-inside">
                  <Button onClick={() => createSubject()}>Create</Button>
                </div>
              </div>
            </div>
            <div className="class-create">
              <h3>List of Subjects</h3>
              <ul>
                {schoolSubjects?.SubjectList.map((item, index) => (
                  <li key={index}>
                    <div>Subject</div>
                    <h2>{item.SubjectName}</h2>
                    <div className='class-create-icon'><span className='pointer' onClick={() => DeleteSubject(item.SubjectName)}>Delete</span></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          : curWindow === "assign" ?
            <div className="class">
              <div className="navback">
                <span className='link' onClick={() => setCurWindow("")}><FaArrowLeft className='navback-icon' />Go Back</span>
              </div>
              <h2>Assign Subject</h2>
              <p>Assign teachers to specific subject</p>
              <div className="class-assign">
                <div className="class-assign-list">
                  <h3>Subject list</h3>
                  <ul>
                    {schoolSubjects?.SubjectList.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => setTargetSubject(item.SubjectName)}
                        className={`${targetSubject === item.SubjectName ? "border" : ""}`}
                      >{item.SubjectName}</li>
                    ))}
                  </ul>
                </div>
                <div className="class-assign-info">
                  {targetSubject !== "" &&
                    <div className="class-assign-info-in">
                      <h3>Assignment Details</h3>
                      {targetSubjectInfo && targetSubjectInfo.SubjectTeacherUID !== "unassigned" ?
                        <div className="class-assign-info-in-detail">
                          <div className="class-assign-info-in-detail-basic">
                            <h2>Assigned Teacher</h2>
                            Name: <b>{teachersList.find(x => x.UID === targetSubjectInfo.SubjectTeacherUID)?.Name}</b>
                            <div>
                              <Button onClick={() => AssignTeacher(false)}>Unassign</Button>
                            </div>
                          </div>
                        </div>
                        : <div className="class-assign-info-in-detail">
                          <h2>List of Unassigned Teachers</h2>
                          <select name="Teacer" id="Teacer" onChange={(e) => setAssignSelectTeacher(e.target.value)}>
                            <option className='bg' value="">Select Teacher</option>
                            {UnassignedTeachers().map((teacher, index) => (
                              <option className='bg' value={teacher.UID} key={index}>{teacher.Name}</option>
                            ))}
                          </select>
                          <Button onClick={() => AssignTeacher(true)}>Assign</Button>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
            :
            <div className='options'>
              <div className="options-option" onClick={() => setCurWindow("create")}>
                <div className="options-option-mock"></div>
                <div className="options-option-main">
                  <h1>Create</h1>
                  <p>Create a new subject of your class, to assign teachers</p>
                </div>
              </div>

              <div className="options-option" onClick={() => setCurWindow("assign")}>
                <div className="options-option-mock"></div>
                <div className="options-option-main">
                  <h1>Assign</h1>
                  <p>Assign a teacher to any specific subject</p>
                </div>
              </div>
            </div>
      }
    </Struct>
  )
}

export default Subjects