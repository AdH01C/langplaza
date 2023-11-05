"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { useSpring, animated, config, useInView } from 'react-spring';
import Header from '../../components/Header';
import { verify } from 'crypto';
import { startChat } from '../../utils/auth';
import LoadingSpinner from '../../components/Loading';
import { addRequest, createPrivateRoom, hasSentRequest, isFriend } from '../../utils/friends';
import { io, Socket } from "socket.io-client";

const videoURL = process.env.NEXT_PUBLIC_VIDEO_URL as string;

export default function Room({ params }: { params: { roomId: string } }) {
  const [loading, setLoading] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const router = useRouter();
  const [loginToken, setLoginToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>();
  const [myChatSocketId, setMyChatSocketId] = useState<string | null>(null);
  const [myVideoSocketId, setMyVideoSocketId] = useState<string | null>(null);
  const [error, setError] = useState(null);

  const [hasFailedMatching, setHasFailedMatching] = useState(false);
  const [hasFailedAddingFriend, setHasFailedAddingFriend] = useState(false);

  const [chatStarted, setChatStarted] = useState(0);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [chatSocket, setChatSocket] = useState<object | null>(null);

  const [otherUserID, setOtherUserID] = useState();
  const [videoSocket, setVideoSocket] = useState<Socket>();

  
  // Socket.IO implementation - Client
  const initializeChat = async (roomId: number) => {
    try {
      const socket = io(process.env.NEXT_PUBLIC_CHAT_URL as string);
      
      socket.on("connect", () => {
        setMyChatSocketId(socket.id); // Store the user's socket ID
        setMessages(messages => [...messages, "You connected with id: " + roomId]);
      });
      socket.on("receive-message", (message: string, senderSocketId: string) => {
        // Check if the sender is not the current user by comparing socket IDs
        if (senderSocketId !== myChatSocketId) {
          setMessages(prevMessages => [...prevMessages, "Friend: " + message]);
        }
      });
      
      setChatSocket(socket);
    } catch (error) {
      console.error("Error accessing the chat:", error);
    }
  };

  useEffect (() => {
    if (chatStarted == 1) {
      console.log("francis :)");
      handleStartChat();
    }

      
  }, [chatStarted]);
  
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem('token');
    const userIdFromLocalStorage = localStorage.getItem('user_id');
    
    if (tokenFromLocalStorage !== null && userIdFromLocalStorage !== null) {
      setLoginToken(tokenFromLocalStorage);
      setUserId(userIdFromLocalStorage);
    
      setLoading(false);
    }

    setChatStarted(chatStarted + 1);

    const handleTabClose = () => {
      // Call leaveChat when the tab is closed or refreshed
      leaveChat();
    };
  
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Call leaveChat when the tab becomes invisible
        leaveChat();
      }
    };
  
    // Add event listeners
    window.addEventListener('beforeunload', handleTabClose);
    document.addEventListener('visibilitychange', handleVisibilityChange);
  
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
}, []);


  const handleEnterPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };


  const initializeVideoConnections = async (roomId: number) => {
    const newSocket = io(videoURL);
    const pc_config = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
    let peerConnection = new RTCPeerConnection(pc_config);

    newSocket.on("all_users", (allUsers: Array<{ id: string; email: string }>) => {
      // Ensure userId is a string and not undefined
      const otherUsers = allUsers.filter(user => user.id !== myVideoSocketId);
      console.log("otherUsers", otherUsers);
      let len = otherUsers.length;
      if (len > 0) {
        createOffer(newSocket, peerConnection);
      }
    });

    newSocket.on("getOffer", (sdp: RTCSessionDescription) => {
      console.log("get offer");
      createAnswer(sdp, newSocket, peerConnection);
    });

    newSocket.on("getAnswer", (sdp: RTCSessionDescription) => {
      console.log("get answer");
      peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    newSocket.on("getCandidate", (candidate: RTCIceCandidateInit) => {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).then(() => {
        console.log("candidate add success");
      });
    });
    initializeWebcam("private-" + roomId, newSocket, peerConnection)
  }
// Corrected createOffer function with await
const createOffer = async (videoSocket: Socket, peerConnection: RTCPeerConnection) => {
  if (peerConnection && videoSocket) {
    try {
      const sdp = await peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
      await peerConnection.setLocalDescription(new RTCSessionDescription(sdp));
      videoSocket.emit("offer", sdp, "private-" + params.roomId);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }
};

// Corrected createAnswer function with await
const createAnswer = async (sdp: RTCSessionDescription, videoSocket: Socket, peerConnection: RTCPeerConnection) => {
  if (peerConnection && videoSocket) {
    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
      console.log("answer set remote description success");
      const answer = await peerConnection.createAnswer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
      videoSocket.emit("answer", answer, "private-" + params.roomId);
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  }
};


  const initializeWebcam = async (roomId: string, videoSocket: Socket, peerConnection: RTCPeerConnection) => {

    if (peerConnection && videoSocket) {
      try {
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true,
          })
          .then(stream => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
              localVideoRef.current.muted = true;
            }
            stream.getTracks().forEach(track => {
              peerConnection.addTrack(track, stream);
            });
            peerConnection.onicecandidate = e => {
              if (e.candidate) {
                console.log("onicecandidate");
                videoSocket.emit("candidate", e.candidate, roomId);
              }
            };
            peerConnection.oniceconnectionstatechange = e => {
              console.log(e);
            };

            peerConnection.ontrack = ev => {
              console.log("add remotetrack success");
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = ev.streams[0];
              }
            };

            videoSocket.emit("join", {
              roomId,
              userId: localStorage.getItem('user_id'),
            });
          })
      } catch (error) {
        console.error("Error accessing the webcam:", error);
      }
    }
  };

  const handleStartChat = async() => {
    try{
        initializeChat(parseInt(params.roomId));
        await initializeVideoConnections(parseInt(params.roomId));
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
      if (chatSocket) {
        (chatSocket as Socket).emit('send-message', message, "private-" + params.roomId);
      }
      setMessage('');
      // You can add code to send the message to the server or another user here
    }
  };

  const leaveChat = () => {
    stopWebcam();
    setChatStarted(false);
    setMessages([]);
    setMessage('');
  };

  return (
    <div className="flex flex-col w-screen min-h-screen bg-white overflow-hidden">
      <Header />
      {loading ? (
        <LoadingSpinner/>
      ) : (
        loginToken? (
            <div className="flex h-screen">

              {/* Video Call */}
              <div className="flex flex-col w-256 pl-4 pt-32">
                <div className="flex flex-col align-bottom">
                  {/* Video Call Card 1 */}
                  <div className="flex flex-col items-center p-4 border rounded-md">
                    <div className="w-full h-56 bg-gray-300 mb-2">
                      {/* Something */}
                          <video ref={remoteVideoRef} className='w-full h-full bg-white' autoPlay playsInline></video>
                    </div>
                    <span className="text-black">Other participant</span>
                  </div>
    
                  {/* Video Call Card 2 */}
                  <div className="flex flex-col items-center p-4 border rounded-md">
                    <div className="w-full h-56 bg-gray-300 mb-2">
                          <video ref={localVideoRef} className='w-full h-full bg-white' autoPlay playsInline></video>
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
         : (
          <h1 className="text-4xl font-bold text-center text-black mt-64">Please log in to access this page.</h1>
        )
      )}
    </div>
  );
  
}
