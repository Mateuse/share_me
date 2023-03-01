import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUser } from '../utils/fetchUser';
import { AiOutlineLogout } from 'react-icons/ai';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

export {};

const UserProfile = () => {
    const [ user, setUser ] = useState<any | null>(null);
    const [userPins, setUserPins] = useState<any | null>(null);
    const { userId } = useParams();

    useEffect(() => {
        const query = userQuery(userId)

        client.fetch(query).then((data) => {
            setUser(data[0]);
        });

        const userPinQuery = userCreatedPinsQuery(userId);
        client.fetch(userPinQuery).then((data) => {
            setUserPins(data);
        });
    }, [userId])

    if (!user) return(<Spinner message="Loading User Info" />)

    return (
    <>
        {user && (
            <div className="flex xl:flex-row flex-col m-auto" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
                <div className="flex justify-center items-center md:items-start flex-initial m-5">
                    <img
                        className="rounded-full"
                        src={user.image}
                        alt="user-image"
                    />
                    <p className="flex justify-center items-center flex-initial m-5 font-bold text-5xl">{user.username}</p>
                </div>
            </div>                
        )}
        {userPins?.length > 0 && (
            <h2 className="font-bold text-2xl mb-4 m-4 top-0 left-0">
                Your Posts
            </h2>
        )}
        <div className="flex">
        {userPins ? (
            <MasonryLayout pins={userPins} />
        ) : (
            <Spinner message="Lodaing your posts" />
        )}
        </div>
    </>
    )
}

export default UserProfile
