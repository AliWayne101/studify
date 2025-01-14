import { ListProps } from '@/interfaces'
import React from 'react'
import "../../css/sections/Authority/list.scss"
import Image from 'next/image'
import { getImageLink } from '@/utils'

const List = ({ Title, List }: ListProps) => {
    return (
        <div className="list">
            <h2>{Title}</h2>
            <div className="list-cards">
                {List?.map((doc, index) => (
                    <div className="list-cards-card" key={index}>
                        <div className="list-cards-card-image">
                            <Image height={1000} width={1000} src={getImageLink(doc.Image)} alt={doc.Name} />
                        </div>
                        <ul>
                            <li><span>Name:</span> {doc.Name}</li>
                            <li><span>Role:</span> {doc.Role}</li>
                            <li><span>CNIC:</span> {doc.CNIC}</li>
                            <li><span>Phone:</span> {doc.Phone}</li>
                            <li><span>DOB:</span> {doc.DOB.toLocaleDateString()}</li>
                            <li><span>Joining Date:</span> {doc.JoinedOn.toLocaleDateString()}</li>
                            <li>Address <br /> <small>{doc.Address}</small></li>
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default List