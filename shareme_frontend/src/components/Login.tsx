import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';   
import logo from '../assets/logo.png';
import { GoogleLogin } from '@react-oauth/google';
import { client } from '../client';
import jwt_decode from 'jwt-decode';

export {};

function Login() {
  const navigate = useNavigate();

  const createOrGetUser = (res: any) => {
    const decoded: any = jwt_decode(res.credential);
    localStorage.setItem('user', JSON.stringify(decoded))

    const { name, picture, sub } = decoded;

    const doc = {
      _id: sub,
      _type: 'user',
      username: name,
      image: picture
    }

    client.createIfNotExists(doc).then(() => {
      navigate('/', {replace: true});
    });
  }

  const responseGoogleFail = (res: any) => {
    console.log(res);
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video 
          src={shareVideo}
          itemType="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="logo" width="130px" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin 
              onSuccess={(response) => createOrGetUser(response)}
              onError={() => console.log('error')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
