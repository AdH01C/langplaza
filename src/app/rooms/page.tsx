"use client"

import Image from 'next/image'
import { useRef, useState } from 'react';
import { useSpring, animated, config, useInView } from 'react-spring';
import Header from '../components/Header';
import RoomCard from '../components/RoomCard';

type Room = {
  id: number;
  flagImageSrc: string;
  language: string;
  href: string;
  hostName: string;
};

const languages = ['Spanish', 'English', 'French', 'German', 'Chinese', 'Japanese', 'Russian', 'Italian'];
const images = [
  '/images/spanish.jpg',
  '/images/english.jpg',
  '/images/french.jpg',
  '/images/german.jpg',
  '/images/chinese.jpg',
  '/images/japanese.jpg',
  '/images/russian.jpg',
  '/images/italian.jpg',
];
const hosts = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Green', 'David White'];

// Function to generate a random number between min and max (inclusive)
const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate a random room
const generateRandomRoom = (id: number): Room => {
  const randomLanguageIndex = getRandom(0, languages.length - 1);
  return {
    id: id,
    flagImageSrc: images[randomLanguageIndex],
    language: languages[randomLanguageIndex],
    href: `/room/${id}`,
    hostName: hosts[getRandom(0, hosts.length - 1)],
  };
};

export default function Rooms() {

  const rooms: Room[] = Array.from({ length: 100 }, (_, index) => generateRandomRoom(index + 1));
  
  // State for search and filter, search looks up language and name
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  // Filtered rooms based on search and selected language
  const filteredRooms = rooms.filter(room => {
    return (
      room.language.toLowerCase().includes(selectedLanguage.toLowerCase()) &&
      (room.language.toLowerCase().includes(searchTerm.toLowerCase()) || room.hostName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="flex flex-col w-screen min-h-screen bg-white overflow-hidden">
      <Header />
      <div className="bg-white">
        
        <div className="mx-auto max-w-2xl px-4 py-32 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Available rooms</h2>

          {/* Search and Filter */}
          <div className="mt-4 mb-6 flex justify-between items-center">
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-md p-2 text-black"
            />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="ml-4 border rounded-md p-2 text-black"
            >
              <option value="">All Languages</option>
              {/* You can dynamically generate options based on available languages */}
              {
                languages.map((language, index) => (
                  <option key={index} value={language}>{language}</option>
                ))
              }
              {/* Add more languages as needed */}
            </select>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
