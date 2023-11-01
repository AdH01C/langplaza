"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { useSpring, animated, config, useInView } from 'react-spring';
import Header from '../components/Header';
import { verify } from 'crypto';
import { startChat } from '../utils/auth';
import LoadingSpinner from '../components/Loading';
import { addRequest, hasSentRequest, isFriend } from '../utils/friends';
import { io, Socket } from "socket.io-client";
type FriendRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  setMessage: (message: string) => void;
}

function FriendRequestModal({ isOpen, onClose, onConfirm, message, setMessage }: FriendRequestModalProps) {
  return (
    isOpen && (
      <div className="text-black fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-lg w-96">
          <h2 className="text-xl mb-4">Send a Friend Request</h2>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Enter your message..."
            className="w-full p-2 border rounded"
            rows={5}
          />
          <div className="flex justify-end gap-4 mt-4">
            <button onClick={onClose} className="px-4 py-2 text-gray-700">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary">
              Send Request
            </button>
          </div>
        </div>
      </div>
    )
  );
}

const languages = ['Spanish', 'English', 'French', 'German', 'Chinese', 'Japanese', 'Russian', 'Italian']
const videoURL = "http://localhost:5000"

export default function Match() {
  const [loading, setLoading] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const router = useRouter();
  const [loginToken, setLoginToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState(null);
  const [isCurrentlyFriend, setIsCurrentlyFriend] = useState(false);
  const [hasAddedFriend, setHasAddedFriend] = useState(false);
  const [hasFailedMatching, setHasFailedMatching] = useState(false);
  const [hasFailedAddingFriend, setHasFailedAddingFriend] = useState(false);
  const [friendError, setFriendError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [friendRequestMessage, setFriendRequestMessage] = useState('');


  const [chatStarted, setChatStarted] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const [otherUserID, setOtherUserID] = useState(6);
  const [videoSocket, setVideoSocket] = useState<Socket>();

  const [roomId, setRoomId] = useState<number>();
  // const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();
  // const [createOfferState, setCreateOffer] = useState<boolean>();
  // const []
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem('token');
    const userIdFromLocalStorage = localStorage.getItem('user_id');
    
    setLoginToken(tokenFromLocalStorage);
    setUserId(userIdFromLocalStorage);
    // Set language by default
    setSelectedLanguage(languages[0]);
    
    if (tokenFromLocalStorage !== null && userIdFromLocalStorage !== null) {
      setLoading(false);
    }
}, []);

  // useEffect(() => {
  //   initializeWebcam(roomId);
  // }, [videoSocket, peerConnection, roomId])
  const handleEnterPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  const initializeVideoConnections = async (roomId: number) => {
    const newSocket = io(videoURL)
    const pc_config = {
      iceServers: [
        // {
        //   urls: 'stun:[STUN_IP]:[PORT]',
        //   'credentials': '[YOR CREDENTIALS]',
        //   'username': '[USERNAME]'
        // },
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
    let peerConnection = new RTCPeerConnection(pc_config);

    newSocket.on("all_users", (allUsers: Array<{ id: string; email: string }>) => {
      let len = allUsers.length;
      if (len > 0) {
        createOffer(newSocket, peerConnection);
      }
    });

    newSocket.on("getOffer", (sdp: RTCSessionDescription) => {
      //console.log(sdp);
      console.log("get offer");
      createAnswer(sdp, newSocket, peerConnection);
    });

    newSocket.on("getAnswer", (sdp: RTCSessionDescription) => {
      console.log("get answer");
      peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
      //console.log(sdp);
    });

    newSocket.on("getCandidate", (candidate: RTCIceCandidateInit) => {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).then(() => {
        console.log("candidate add success");
      });
    });

    // setVideoSocket(newSocket);
    // setPeerConnection(peerConnection);
    initializeWebcam(roomId, newSocket, peerConnection)
  }
  const createOffer = (videoSocket: Socket, peerConnection: RTCPeerConnection,) => {
    if (peerConnection && videoSocket) {

      peerConnection
        .createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
        .then(sdp => {
          peerConnection.setLocalDescription(new RTCSessionDescription(sdp));
          videoSocket.emit("offer", sdp);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  const createAnswer = (sdp: RTCSessionDescription, videoSocket: Socket, peerConnection: RTCPeerConnection) => {
    if (peerConnection && videoSocket) {
      peerConnection.setRemoteDescription(new RTCSessionDescription(sdp)).then(() => {
        console.log("answer set remote description success");
        peerConnection
          .createAnswer({
            offerToReceiveVideo: true,
            offerToReceiveAudio: true,
          })
          .then(sdp1 => {
            console.log("create answer");
            peerConnection.setLocalDescription(new RTCSessionDescription(sdp1));
            videoSocket.emit("answer", sdp1);
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  };

  const initializeWebcam = async (roomId: number | undefined, videoSocket: Socket, peerConnection: RTCPeerConnection) => {

    if (peerConnection && videoSocket) {
      try {
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true,
          })
          .then(stream => {
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            stream.getTracks().forEach(track => {
              peerConnection.addTrack(track, stream);
            });
            peerConnection.onicecandidate = e => {
              if (e.candidate) {
                console.log("onicecandidate");
                videoSocket.emit("candidate", e.candidate);
              }
            };
            peerConnection.oniceconnectionstatechange = e => {
              console.log(e);
            };

            peerConnection.ontrack = ev => {
              console.log("add remotetrack success");
              if (remoteVideoRef.current)
                remoteVideoRef.current.srcObject = ev.streams[0];
            };

            videoSocket.emit("join", {
              roomId,
              userId,
            });
          })
      } catch (error) {
        console.error("Error accessing the webcam:", error);
      }
    }
  };

  const handleStartChat = async() => {
    // Get the room lanuage
    // join queue of the selected language
    // selectedLanguage --> "French"
    try{
      const resp = await startChat(userId, selectedLanguage)

      if (resp.id && resp.id !== "" ){
        setChatStarted(true);

        setRoomId(resp.id);
        // Add the other user id to the state


        if (await isFriend(userId, otherUserID)) {
          setIsCurrentlyFriend(true);
        }

        if (await hasSentRequest(userId, otherUserID)) {
          setHasAddedFriend(true);
        }
        await initializeVideoConnections(resp.id);
        // setOtherUserID();
      }
    } catch (error: any) {
      console.error("Error starting chat:", error);
      setHasFailedMatching(true);
      setError(error);
      setLoading(true);
    }
    
  };
  
  const stopWebcam = () => {
    if (localVideoRef.current) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const tracks = stream?.getTracks();
    
      tracks?.forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    
      localVideoRef.current.srcObject = null;
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, "You: " + message]);
      setMessage('');
      // You can add code to send the message to the server or another user here
    }
  };

  const leaveChat = () => {
    stopWebcam();
    setChatStarted(false);
    setMessages([]);
    setMessage('');
  }


  const handleAddFriend = () => {
    setIsModalOpen(true);
  }
  
  const handleFriendRequest = async () => { 
    try {
      await addRequest(userId, otherUserID, friendRequestMessage);
      setHasAddedFriend(true);
    } catch (error) {
      setMessages([...messages, "Error adding friend: " + error]);
      setHasFailedAddingFriend(true);
    }
    setIsModalOpen(false);
  }
  

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
                  <strong className="font-bold">Error:</strong>
                  <span className="block sm:inline"> {error}</span>
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
                      {/* Something */}
                          <video ref={remoteVideoRef} autoPlay playsInline></video>

                    </div>
                    <span className="text-black">Other participant</span>
                  </div>
    
                  {/* Video Call Card 2 */}
                  <div className="flex flex-col items-center p-4 border rounded-md">
                    <div className="h-full bg-gray-300 mb-2">
                          <video ref={localVideoRef} autoPlay playsInline></video>
                    </div>
                    <span className="text-black">You</span>
                  </div>

                  <div className="flex justify-center gap-4 mt-4">
                  {/* Leave and add friend */}
                  {chatStarted ? (
                    isCurrentlyFriend ? (
                      <></> // Don't render any button when isCurrentlyFriend is true
                    ) : (
                      hasAddedFriend ? (
                        <button
                          className="px-4 py-2 mb-4 text-white bg-gray-600 rounded-md"
                        >
                          Requested
                        </button>
                      ) : (
                        <button
                          className="px-4 py-2 mb-4 text-white bg-primary rounded-md hover-bg-secondary"
                          onClick={handleAddFriend}
                        >
                          Add Friend
                        </button>
                      )
                    )
                  ) : (
                    <></>
                  )}

                    <button onClick={() => leaveChat()} className="px-4 py-2 mb-4 text-white bg-red-600 rounded-md hover:bg-red-800">
                      Leave Chat
                    </button>
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

    <FriendRequestModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onConfirm={handleFriendRequest}
      message={friendRequestMessage}
      setMessage={setFriendRequestMessage}
    />
    </div>
  );
  
}
