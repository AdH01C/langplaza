"use client"

import { FormEvent, useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import FadeInFromLeft from '../components/FadeInFromLeft';
import { loginUser } from '../utils/auth';
import { Friend, FriendsList } from '../components/FriendsList';
import { useRouter } from 'next/navigation';

export default function Friends() {

  // const handleInvite = (selectedFriends: Friend[], room: string) => {
  //   // Handle the invitation here
  //   // For example, you can send a request to your server to create the invitation
  // };

  // const handleAccept = (room: string) => {
  //   // Handle the acceptance here
  //   // For example, you can send a request to your server to accept the invitation
  // }

  // const handleReject = (room: string) => {
  //   // Handle the rejection here
  //   // For example, you can send a request to your server to reject the invitation
  // }

  // const router = useRouter();
  // const [loginToken, setLoginToken] = useState<string | null>(null);
  
  // useEffect(() => {
    
  //   if (localStorage.getItem('token') != "undefined") {
  //     setLoginToken(localStorage.getItem('token'));
  //   }
  //   }, []);

  // if (!loginToken) {
  //   router.push('/');
  //   return null;
  // }
  
  return (
    <div className="flex flex-col w-screen min-h-screen bg-white overflow-hidden">
      <Header />

      <div className="relative isolate px-6 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-tertiary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        <div className="flex h-screen sm:py-48 lg:py-56">            
          <div className="flex bg-primary w-1/4">

          </div>

          <div className="flex bg-secondary w-3/4">

          </div>
          
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-tertiary to-secondary opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
        </div>
      </div>
    </div>
  );




}
