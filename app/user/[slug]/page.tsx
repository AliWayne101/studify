'use client'
import { SlugProps } from '@/interfaces';
import { sendRequest } from '@/utils';
import React, { useEffect, useState } from 'react'

const ViewUser = ({ params }: SlugProps) => {
    const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
    const [slug, setSlug] = useState("");

    useEffect(() => {
        const getSlug = async () => {
            const _slug = (await params).slug;
            setSlug(_slug);
        }
        getSlug();
    }, [params]);

    useEffect(() => {
        const getUser = async() => {
            setIsLoadingCompleted(false);
            const response = await sendRequest('/api/posts', {
                Request: "userprofile",
                UID: slug
            });
            console.log(response.results);
        }
        getUser();
    }, [slug])

    return (
        <div>ViewUser</div>
    )
}

export default ViewUser