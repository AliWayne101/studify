import { ListProps } from '@/interfaces'
import React from 'react'
import "../../css/sections/Authority/list.scss"
import Image from 'next/image'

const List = ({ Title }: { Title: string }) => {
    return (
        <div className="list">
            <h2>{Title}</h2>
            <div className="list-cards">
                
            <div className="list-cards-card">
                    <div className="list-cards-card-image">
                        <Image height={1000} width={1000} src="/img/avatar.png" alt={'avatar'} />
                    </div>
                    <ul>
                        <li>Name: Ali Wains</li>
                        <li>Role: Teacher</li>
                        <li>CNIC: 000000</li>
                        <li>DOB: 22-05-2024</li>
                        <li>Joining Date: 22-05-2024</li>
                        <li>Phone: 00000</li>
                        <li>Address <br /> <small>This is the address</small></li>
                    </ul>
                </div>
                <div className="list-cards-card">
                    <div className="list-cards-card-image">
                        <Image height={1000} width={1000} src="/img/avatar.png" alt={'avatar'} />
                    </div>
                    <ul>
                        <li>Name: Ali Wains</li>
                        <li>Role: Teacher</li>
                        <li>CNIC: 000000</li>
                        <li>DOB: 22-05-2024</li>
                        <li>Joining Date: 22-05-2024</li>
                        <li>Phone: 00000</li>
                        <li>Address <br /> <small>This is the address</small></li>
                    </ul>
                </div>
                <div className="list-cards-card">
                    <div className="list-cards-card-image">
                        <Image height={1000} width={1000} src="/img/avatar.png" alt={'avatar'} />
                    </div>
                    <ul>
                        <li>Name: Ali Wains</li>
                        <li>Role: Teacher</li>
                        <li>CNIC: 000000</li>
                        <li>DOB: 22-05-2024</li>
                        <li>Joining Date: 22-05-2024</li>
                        <li>Phone: 00000</li>
                        <li>Address <br /> <small>This is the address</small></li>
                    </ul>
                </div>
                <div className="list-cards-card">
                    <div className="list-cards-card-image">
                        <Image height={1000} width={1000} src="/img/avatar.png" alt={'avatar'} />
                    </div>
                    <ul>
                        <li>Name: Ali Wains</li>
                        <li>Role: Teacher</li>
                        <li>CNIC: 000000</li>
                        <li>DOB: 22-05-2024</li>
                        <li>Joining Date: 22-05-2024</li>
                        <li>Phone: 00000</li>
                        <li>Address <br /> <small>This is the address</small></li>
                    </ul>
                </div>
                <div className="list-cards-card">
                    <div className="list-cards-card-image">
                        <Image height={1000} width={1000} src="/img/avatar.png" alt={'avatar'} />
                    </div>
                    <ul>
                        <li>Name: Ali Wains</li>
                        <li>Role: Teacher</li>
                        <li>CNIC: 000000</li>
                        <li>DOB: 22-05-2024</li>
                        <li>Joining Date: 22-05-2024</li>
                        <li>Phone: 00000</li>
                        <li>Address <br /> <small>This is the address</small></li>
                    </ul>
                </div>
                <div className="list-cards-card">
                    <div className="list-cards-card-image">
                        <Image height={1000} width={1000} src="/img/avatar.png" alt={'avatar'} />
                    </div>
                    <ul>
                        <li>Name: Ali Wains</li>
                        <li>Role: Teacher</li>
                        <li>CNIC: 000000</li>
                        <li>DOB: 22-05-2024</li>
                        <li>Joining Date: 22-05-2024</li>
                        <li>Phone: 00000</li>
                        <li>Address <br /> <small>This is the address</small></li>
                    </ul>
                </div>
                <div className="list-cards-card">
                    <div className="list-cards-card-image">
                        <Image height={1000} width={1000} src="/img/avatar.png" alt={'avatar'} />
                    </div>
                    <ul>
                        <li>Name: Ali Wains</li>
                        <li>Role: Teacher</li>
                        <li>CNIC: 000000</li>
                        <li>DOB: 22-05-2024</li>
                        <li>Joining Date: 22-05-2024</li>
                        <li>Phone: 00000</li>
                        <li>Address <br /> <small>This is the address</small></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default List