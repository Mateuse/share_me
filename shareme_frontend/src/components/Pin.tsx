import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4} from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from '../client';
import { fetchUser } from '../utils/fetchUser';

interface PinProps {
    pin: any
}
const Pin = ({pin: { postedBy, image, _id, destination, save}}: PinProps) => {

    const [postHovered, setPostHovered] = useState(false)

    const navigate = useNavigate();

    const user: any = fetchUser();

    const alreadySaved: boolean = !!(save?.filter((item: any) => item.postedBy._id === user.sub))?.length;

    const savePin = (id: any) => {
        if (!alreadySaved) {

            client
                .patch(id)
                .setIfMissing({ save: [] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user.sub,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user.sub
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload();
                })
        }
    }

    const unSavePin = (id: any) => {
        if (alreadySaved) {
            const removeSave = [`save[userId=="${user.sub}"]`]
            
            client
                .patch(id)
                .unset(removeSave)
                .commit()
                .then(() => {
                    window.location.reload();
                }, (err) => {
                    console.log(err)
                })
        }
    }

    const deletePin = (id: any) => {
        client 
            .delete(id)
            .then(() => {
                window.location.reload();
            })
    }

    return (
        <div className="m-2">
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
            >
                <img 
                className="rounded-lg w-full"
                src={urlFor(image).width(250).url()} />
                {postHovered && (
                        <div 
                            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-index-50"
                            style={{height: '100%'}}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <a
                                        href={`${image?.asset?.url}?dl=`}
                                        download
                                        onClick={(e: any) => e.stopPropagation()}
                                        className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                                    >
                                        <MdDownloadForOffline />
                                    </a>
                                </div>
                                {alreadySaved ? (
                                    <button
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            unSavePin(_id);
                                        }}
                                        type="button" 
                                        className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none">
                                        {save?.length} Saved
                                    </button>
                                ): (
                                    <button 
                                    onClick={(e: any) => {
                                        e.stopPropagation();
                                        savePin(_id);
                                    }}
                                    type="button" 
                                    className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none">
                                        Save
                                    </button>
                                )}
                            </div>  
                            <div className="flex items-center justify-between gap-2 w-full">
                                {destination && (
                                    <a
                                    href={`${destination}`}
                                    onClick={(e: any) => e.stopPropagation()}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:100 hover:shadow-md"
                                >
                                    <BsFillArrowRightCircleFill />
                                    {destination.length > 24 ? destination.slice(12, 24) : destination.slice(12)}
                                </a>
                                )}   
                                {postedBy?._id === user.sub && (
                                    <button
                                        type="button"
                                        onClick={(e: any) => {
                                            e.stopPropagation();
                                            deletePin(_id);
                                        }}
                                        className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold text-base rounded-3xl hover:shadow-md outlined-none"
                                    >
                                        <AiTwotoneDelete />
                                    </button>
                                )}              
                        </div>
                    </div>
                )}
            </div> 
            <Link to={`user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
                <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={postedBy?.image}
                    alt="user-profile"
                />
                <p className="font-semibold capitalize">{postedBy?.username}</p>
            </Link>       
        </div>
    )
}

export default Pin;