import "../css/sections/diarycomponent.scss"
import "../css/actions/update/diary.scss"
import { UserDiary } from '@/interfaces'
import React from 'react'

const DiaryComponent: React.FC<{ data: UserDiary | undefined }> = ({ data }) => {
    return (
        <>{data !== undefined &&
            <div className="diaryc">
                <h1>Diary Details</h1>
                <div className="diaryc-detail">Name <span>{data.User.Name}</span></div>
                <div className="diaryc-detail">Class <span>{data.Diary?.ClassName}</span></div>
                <div className="diaryc-detail">Dated <span>{data.Diary && new Date(data.Diary?.DiaryFor.toString()).toLocaleDateString()}</span></div>
                <div className="diary-view">
                    {data.Diary && data.Diary.Diaries.map((diary) => (
                        <div className="diary-view-entry" key={diary.Subject}>
                            <div className="diary-view-entry-in"><h3>{diary.Subject}</h3></div>
                            <div className="diary-view-entry-in">{diary.Diary}</div>
                        </div>
                    ))}
                </div>
            </div>
        }</>

    )
}

export default DiaryComponent