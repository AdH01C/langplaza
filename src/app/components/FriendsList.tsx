"use client"

import React, { useState, useEffect } from 'react';

export type Friend = {
  id: string;
  name: string;
  avatarUrl?: string;
};

type FriendsListProps = {
  onInvite: (selectedFriends: Friend[], room: string) => void;
};

export const FriendsList: React.FC<FriendsListProps> = ({ onInvite }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [room, setRoom] = useState<string>('');

  useEffect(() => {
    // Fetch the friends from your server here
    // For example:
    // fetch('/api/friends')
    //   .then(response => response.json())
    //   .then(data => setFriends(data));
  }, []);

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriends(prev => [...prev, friend]);
  };

  const handleDeselectFriend = (friend: Friend) => {
    setSelectedFriends(prev => prev.filter(f => f.id !== friend.id));
  };

  const handleInvite = () => {
    onInvite(selectedFriends, room);
  };

  return (
    <div>
      <h2>Select Friends</h2>
      <ul>
        {friends.map(friend => (
          <li key={friend.id}>
            <span>{friend.name}</span>
            {selectedFriends.includes(friend) ? (
              <button onClick={() => handleDeselectFriend(friend)}>Deselect</button>
            ) : (
              <button onClick={() => handleSelectFriend(friend)}>Select</button>
            )}
          </li>
        ))}
      </ul>
      <div>
        <label>
          Room:
          <input type="text" value={room} onChange={e => setRoom(e.target.value)} />
        </label>
      </div>
      <button onClick={handleInvite}>Invite to Room</button>
    </div>
  );
};
