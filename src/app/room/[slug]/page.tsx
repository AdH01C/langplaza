"use client"

import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useSpring, animated, config, useInView } from 'react-spring';
import Header from '../../components/Header';
import RoomCard from '../../components/RoomCard';

export default function Room() {

  const videoRef = useRef<HTMLVideoElement>(null);

  const initializeWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        (videoRef.current as HTMLVideoElement).srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the webcam:", error);
    }
  };

  
  

  const [chatStarted, setChatStarted] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      // Your action here, for example:
      handleSendMessage();
    }
  };
  
  const handleStartChat = () => {
    setChatStarted(true);
    initializeWebcam();
    // You can add any initialization code for the chat here
  };
  
  const stopWebcam = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream?.getTracks();
    
      tracks?.forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    
      videoRef.current.srcObject = null;
    }
  }
  

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, "You: " + message]);
      setMessage('');
      // You can add code to send the message to the server or another user here
    }
  };

  return (
    <div className="flex flex-col w-screen min-h-screen bg-white overflow-hidden">
      <Header />
      {!chatStarted ? (
        <div className="flex flex-col items-center justify-center align-middle h-screen">
          {/* Text for getting ready */}
          <div className="text-4xl font-bold text-center text-black mb-4">
            Get ready to start your chat!
          </div>
          {/* Button to start chat */}
          <button
            onClick={handleStartChat}
            className="px-6 py-3 text-white bg-primary rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-opacity-50"
          >
            Start Chat
          </button>
        </div>
      ) : (
        <div className="flex h-screen">
          {/* Video Call */}
          <div className="flex flex-col w-256 pl-4 pt-32">
            <div className="flex flex-col align-bottom">
              {/* Video Call Card 1 */}
              <div className="flex flex-col items-center p-4 border rounded-md">
                <div className="w-full h-56 bg-gray-300 mb-2">
                  {/* Placeholder for video stream */}
                  {/* <Image src="/images/video-placeholder.jpg" alt="Video Stream 1" layout="fill" objectFit="cover" /> */}
                </div>
                <span className="text-black">Other participant</span>
              </div>

              {/* Video Call Card 2 */}
              <div className="flex flex-col items-center p-4 border rounded-md">
                {/* Placeholder for video stream */}
                <div className="h-56 bg-gray-300 mb-2">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full"></video>
                </div>
                <span className="text-black">You</span>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="flex flex-col align-middle h-full w-full p-4 pt-32">
            <div className="flex-grow overflow-y-auto mb-4 border rounded-md">
              {messages.map((msg, index) => (
                <div key={index} className="p-2 border-b text-black">
                  {msg}
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleEnterPress}
                className="flex-grow px-3 py-2 mr-2 border rounded-md text-black"
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage}  className="px-4 py-2 text-white bg-primary rounded-md hover:bg-secondary">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
