"use client"
import Button from '@/app/components/Button'
import Struct from '@/app/Struct'
import React, { useEffect, useState } from 'react'
import "../../../css/actions/create/class.scss"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { sendRequest } from '@/utils'
import { ISubjectsInfo } from '@/schema/subjectsinfo'
const Subjects = () => {
  const [newSubjectName, setNewSubjectName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState("");
  const [schoolSubjects, setSchoolSubjects] = useState<ISubjectsInfo>();
  const { data: session } = useSession();

  const router = useRouter();
  const createSubject = async() => {
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

  useEffect(() => {
    if (session === undefined)
      router.push('/login');
    else {
      if (session?.user.role !== "Owner" && session?.user.role !== "Admin")
        router.push('/dashboard');

      // LoadUsers();
      LoadData();
    }
  }, [session])

  const LoadData = async() => {
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

  const DeleteSubject = (subName: string) => {

  }

  return (
    <Struct>
      <div className="class">
        <div className="navback">
          {/* <span className='link' onClick={() => setCurWindow("")}><FaArrowLeft className='navback-icon' />Go Back</span> */}
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
          <div className="class-create-input bold">
            <div className="class-create-input-inside">Subject Name</div>
            <div className="class-create-input-inside">Actions</div>
          </div>
          {schoolSubjects?.SubjectList.map((item, index) => (
            <div className="class-create-input" key={index}>
              <div className="class-create-input-inside"><span>{item.SubjectName}</span></div>
              <div className="class-create-input-inside"><span className='pointer' onClick={() => DeleteSubject(item.SubjectName)}>Delete</span></div>
            </div>
          ))}
        </div>
      </div>
    </Struct>
  )
}

export default Subjects