"use client"

import { get } from 'http';
import React, { useState, useEffect, use } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { getAllFriendsGQL, getReceivedRequestsGQL, updateRequestStatusGQL } from '../utils/friends';
import { useRouter } from 'next/navigation';

export type Friend = {
  id: string;
  name: string;
};

export type FriendRequest = {
  id: string;
  user_id: string;
  user_name: string;
  target_user_id: string;
  target_user_name: string;
  request_message: string;
  request_status: string;
};

type FriendsListProps = {
  onInvite: (selectedFriend: Friend | null, room: string) => void;
  selectedFriend: Friend | null;
  setSelectedFriend: React.Dispatch<React.SetStateAction<Friend | null>>;
};

export const FriendsList: React.FC<FriendsListProps> = ({ onInvite, selectedFriend, setSelectedFriend }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const router = useRouter();
  const [room, setRoom] = useState<string>('');

  useEffect(() => {
    getAllFriendsGQL(localStorage.getItem('user_id'))
      .then((friends) => {
        setFriends(friends);
      })
      .catch((error) => {
        console.error('Get all friends error:', error);
      });

    getReceivedRequestsGQL(localStorage.getItem('user_id'))
    .then((friendRequests) => {
      if (friendRequests === null) {
        return;
      }
      const pending = friendRequests.filter((req: { request_status: string; }) => req.request_status === "pending");
      setFriendRequests(pending);
    })
    .catch((error) => {
      console.error('Get received requests error:', error);
    });
  }, []);

  const handleSelectFriend = (friend: Friend | null) => {
    if (selectedFriend === friend) {
      setSelectedFriend(null); // Deselect friend if it's already selected
    } else {
      setSelectedFriend(friend); // Select the clicked friend
    }
  };

  const handleAcceptRequest = async (friendRequest: FriendRequest) => {
    const data = await updateRequestStatusGQL(friendRequest.id, "accepted");
    console.log(data);
    getAllFriendsGQL(localStorage.getItem('user_id'))
      .then((friends) => {
        setFriends(friends);
      })
      .catch((error) => {
        console.error('Get all friends error:', error);
      });
    getReceivedRequestsGQL(localStorage.getItem('user_id'))
      .then((friendRequests) => {
        if (friendRequests === null) {
          return;
        }
        const pending = friendRequests.filter((req: { request_status: string; }) => req.request_status === "pending");
        setFriendRequests(pending);
      })
      .catch((error) => {
        console.error('Get received requests error:', error);
      });
  };

  const handleInvite = () => {
    if (!selectedFriend) {
      return; // Do nothing if no friend is selected
    }
    onInvite(selectedFriend, room);
  };

  return (
    <div className="flex flex-col gap-4 text-black">
      <a className='text-3xl'>Select Friends</a>
      <div className="flex flex-col gap-4 w-full"> 
        {friends && friends.map(friend => (
          <div 
            key={friend.id + friend.name}
            onClick={() => handleSelectFriend(friend)}
            className={
              `p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200 
                ${
                  selectedFriend === friend ? 
                    "bg-primary transform scale-105" : // Selected friend styling
                    "bg-neutral-300 hover:bg-neutral-500" // Non-selected friend styling
                }
              `
            }
          >
            <span>{friend.name}</span>
          </div>
        ))}

      </div>
      <button onClick={handleInvite} className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600">Invite to Room</button>

      <a className='text-3xl'>Accept Friends</a>
      <div className="flex flex-col gap-4 w-full">
        
          <div className={`p-4 rounded-lg shadow-sm transition-all duration-200`}>
            {friendRequests.map(friend => (
              <span className="flex justify-between gap-4" key={"friend" + friend.id}>
                <span>{friend.user_name}</span>
                <span>{friend.request_message}</span>
                <div className="flex gap-4">
                  <FiCheck 
                    className="cursor-pointer" 
                    onClick={() => handleAcceptRequest(friend)}
                  />
                  <FiX className="cursor-pointer" />
                </div>
              </span>))
            }
            { friendRequests.length == 0 ? (
              <p className="text-gray-400 text-xl">No one wants to be your friend.</p>
            ) : (
              null
            )}
            
          </div>
      </div>
      
    </div>
  );
  
};

