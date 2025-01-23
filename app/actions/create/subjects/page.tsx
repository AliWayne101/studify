"use client"
import Button from '@/app/components/Button'
import Struct from '@/app/Struct'
import React, { useEffect, useState } from 'react'
import "../../../css/actions/create/class.scss"
import { useSession } from 'next-auth/react'
import { sendRequest } from '@/utils'
import { ISubjectsInfo } from '@/schema/subjectsinfo'
import { FaArrowLeft } from 'react-icons/fa'
import { SubjectDetail } from '@/interfaces'
import { IUserInfo } from '@/schema/userinfo'
import LoadingScreen from '@/app/components/LoadingScreen'
import ErrorContainer from '@/app/components/ErrorContainer'

const Subjects = () => {
  const [newSubjectName, setNewSubjectName] = useState("");
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
  const [isError, setIsError] = useState("");
  const [schoolSubjects, setSchoolSubjects] = useState<ISubjectsInfo>();
  const [targetSubjectInfo, setTargetSubjectInfo] = useState<SubjectDetail>();
  const [teachersList, setTeachersList] = useState<IUserInfo[]>([]);
  const [curWindow, setCurWindow] = useState("");
  const [targetSubject, setTargetSubject] = useState("");
  const [assignSelectTeacher, setAssignSelectTeacher] = useState("");
  const { data: session } = useSession();

  const createSubject = async () => {
    setIsLoadingCompleted(false);
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
    setIsLoadingCompleted(true);
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

  const LoadData = async () => {
    setNewSubjectName("");
    const response = await sendRequest('/api/posts', {
      Request: "getclasses",
      SchoolName: session?.user.schoolName
    });
    if (response.message !== "OK") {
      setIsError(response.error);
      return;
    }
    setSchoolSubjects(response.results.doc);
  }

  const DeleteSubject = async (subName: string) => {
    setIsLoadingCompleted(false);
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
    setIsLoadingCompleted(true);
  }

  useEffect(() => {
    if (schoolSubjects)
      for (const sub of schoolSubjects.SubjectList) {
        if (sub.SubjectName === targetSubject)
          setTargetSubjectInfo(sub);
      }
  }, [targetSubject])

  const AssignTeacher = async (assign: boolean) => {
    setIsLoadingCompleted(false);
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
    setIsLoadingCompleted(true);
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

  useEffect(() => {
    LoadUsers();
  }, [])

  return (
    <Struct LoadingCompleted={setIsLoadingCompleted}>
      <LoadingScreen IsLoadingCompleted={isLoadingCompleted}>
        <ErrorContainer error={isError} />
        {curWindow === "create" ?
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
      </LoadingScreen>
    </Struct>
  )
}

export default Subjects