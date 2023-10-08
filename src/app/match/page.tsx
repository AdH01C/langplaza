"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSpring, animated, config, useInView } from 'react-spring';
import Header from '../components/Header';
import { verify } from 'crypto';
import { startChat } from '../utils/auth';
import LoadingSpinner from '../components/Loading';


const languages = ['Spanish', 'English', 'French', 'German', 'Chinese', 'Japanese', 'Russian', 'Italian']

export default function Match() {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const router = useRouter();
  const [loginToken, setLoginToken] = useState<string | null>(null);
  const [error, setError] = useState(null);
  const [hasFailedMatching, setHasFailedMatching] = useState(false);

  const [chatStarted, setChatStarted] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    setLoginToken(
      localStorage.getItem('token') !== "undefined" 
        ? localStorage.getItem('token') 
        : null
    );
    // Set language by default
    setSelectedLanguage(languages[0])
    setLoading(false);
  }, []);


  const handleEnterPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
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

  const handleStartChat = async() => {
    // Get the room lanuage
    // join queue of the selected language
    // selectedLanguage --> "French"
    try{
      let resp = await startChat(loginToken, selectedLanguage)
      if (resp.id !== "" ){
        setChatStarted(true);
        initializeWebcam();
      }
    } catch (error: any) {
      console.error("Error starting chat:", error);
      setHasFailedMatching(true);
      setError(error.message);
    }
    
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
      {loading ? (
        <LoadingSpinner/>
      ) : (
        loginToken? (
          !chatStarted ? (
            <div className="flex flex-col items-center justify-center align-middle h-screen">
              {/* Text for getting ready */}
              <div className="text-4xl font-bold text-center text-black mb-4">
                Get ready to start your chat!
              </div>
              
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border rounded-md p-2 text-black"
                >
                {/* You can dynamically generate options based on available languages */}
                {
                  languages.map((language, index) => (
                    <option key={index} value={language}>{language}</option>
                  ))
                }
              </select>              
              <br></br>

              {/* Button to start chat */}
              <button
                onClick={handleStartChat}
                className="px-6 py-3 text-white bg-primary rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-opacity-50"
              >
                Start Chat
              </button>
              <div className={`${hasFailedMatching ? 'flex' : 'hidden'} justify-center mt-4`}>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">{error}.</strong>
                  <span className="block sm:inline"> Please try again.</span>
                </div>
              </div>
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
                    </div>
                    <span className="text-black">Other participant</span>
                  </div>
    
                  {/* Video Call Card 2 */}
                  <div className="flex flex-col items-center p-4 border rounded-md">
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
                  <button onClick={handleSendMessage} className="px-4 py-2 text-white bg-primary rounded-md hover:bg-secondary">
                    Send
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          <h1 className="text-4xl font-bold text-center text-black mt-64">Please log in to access this page.</h1>
        )
      )}
    </div>
  );
  
}
