"use client"

import React, { useState, useEffect } from 'react';

export type Friend = {
  id: string;
  name: string;
  avatarUrl?: string;
};

type FriendsListProps = {
  onInvite: (selectedFriend: Friend | null, room: string) => void;
  selectedFriend: Friend | null;
  setSelectedFriend: React.Dispatch<React.SetStateAction<Friend | null>>;
};

export const FriendsList: React.FC<FriendsListProps> = ({ onInvite, selectedFriend, setSelectedFriend }) => {
  const [friends, setFriends] = useState<Friend[]>(
    [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Doe' },
      { id: '3', name: 'John Smith' },
      { id: '4', name: 'Jane Smith' },
    ]
  );
  
  const [room, setRoom] = useState<string>('');

  useEffect(() => {
    // Fetch the friends from your server here
    // For example:
    // fetch('/api/friends')
    //   .then(response => response.json())
    //   .then(data => setFriends(data));
  }, []);

  const handleSelectFriend = (friend: Friend | null) => {
    if (selectedFriend === friend) {
      setSelectedFriend(null); // Deselect friend if it's already selected
    } else {
      setSelectedFriend(friend); // Select the clicked friend
    }
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
        {friends.map(friend => (
          <div 
            key={friend.id}
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
        
          <div 
            className={
              `p-4 rounded-lg shadow-sm cursor-pointer transition-all duration-200
              `
            }
          >
            <span>None</span>
          </div>
      </div>
      
    </div>
  );
  
};

