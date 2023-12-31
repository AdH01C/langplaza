"use client"

import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import { Friend, FriendsList } from '../components/FriendsList';
import LoadingSpinner from '../components/Loading';
import { createPrivateRoomGQL, addMessageGQL, getMessagesByUsersGQL } from '../utils/friends';

const host_ip = process.env.NEXT_PUBLIC_HOST_URL as string;

export default function Friends() {
  const [loginToken, setLoginToken] = useState<string | null>(null);    
  const [loading, setLoading] = useState(true);
  const [timeout, setTimeOut] = useState<NodeJS.Timeout | undefined>();
  const chatContainerRef = useRef<null | HTMLDivElement>(null);


  useEffect(() => {
    setLoginToken(
      localStorage.getItem('token') !== "undefined" 
        ? localStorage.getItem('token') 
        : null
    );
    setLoading(false);

  }, []);

  // const handleAccept = (room: string) => {
  //   // Handle the acceptance here
  //   // For example, you can send a request to your server to accept the invitation
  // }

  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  useEffect(() => {
    clearTimeout(timeout)
    if (selectedFriend == null) {
      return;
    }
    initializeChat(selectedFriend);
  }, [selectedFriend]);

  const initializeChat = async (selectedFriend: Friend) => {
    if (selectedFriend == null) {
      return;
    }
    const resp1 = await getMessagesByUsersGQL(localStorage.getItem("name"), '"' + selectedFriend?.name + '"');
    console.log("conversation 1", resp1);
    const resp2 = await getMessagesByUsersGQL(selectedFriend?.name, '"' + localStorage.getItem("name") + '"');
    console.log("conversation 2", resp2);
    try {
      const chatMessages = resp1.concat(resp2);
      chatMessages.sort(function(a: any,b: any){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.date_time).valueOf() - new Date(b.date_time).valueOf();
      });
      populateChat(chatMessages, selectedFriend)
      const timeout = setTimeout(() => {
        initializeChat(selectedFriend);
      }, 1000)
      setTimeOut(timeout)
    } catch (error) {
      // console.log(error);
    }
    
  };

  const handleInvite = async (selectedFriend: Friend | null, room: string) => {
    if (selectedFriend == null) {
      return;
    }
    // Handle the invitation here
    console.log('selectedFriend', selectedFriend?.id);
    const resp = await createPrivateRoomGQL(selectedFriend?.id);

    // Send the link to the user
    const friendMessages = messages[selectedFriend.id] || [];
    const messageWithLink = host_ip + `/room/${resp.id}`;
    setMessages({
      ...messages,
      [selectedFriend.id]: [...friendMessages, "You: " + messageWithLink],
    });
    await addMessageGQL(localStorage.getItem("name"), '"' + selectedFriend.name + '"', '"' + messageWithLink + '"');
    
    // Scroll to the bottom of the chat container
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    window.location.assign('/room/' + resp.id);
  };

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ [friendId: string]: string[] }>({});

  const handleSendMessage = async () => {
    if (message.trim() && selectedFriend) {
      const friendMessages = messages[selectedFriend.id] || [];
      setMessages({
        ...messages,
        [selectedFriend.id]: [...friendMessages, "You: " + message],
      });
      await addMessageGQL(localStorage.getItem("name"), '"' + selectedFriend.name + '"', '"' + message + '"');
      setMessage('');

      // Scroll to the bottom of the chat container
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }
  };

  const populateChat = async(chatMessages: Array<any>, selectedFriend: Friend) => {
    setMessages({});
    for (const message of chatMessages) {
      if (message.sender === localStorage.getItem("name")) {
        setMessages((prevMessages) => {
          const updatedMessages = {
            ...prevMessages,
            [selectedFriend.id]: [
              ...(prevMessages[selectedFriend.id] || []), // Preserve existing messages for the friend
              "You: " + message.content,
            ],
          };
        
          return updatedMessages;
        });
      } else {
        setMessages((prevMessages) => {
          const updatedMessages = {
            ...prevMessages,
            [selectedFriend.id]: [
              ...(prevMessages[selectedFriend.id] || []), // Preserve existing messages for the friend
              "Friend: " + message.content,
            ],
          };
        
          return updatedMessages;
        });
      }
    }
  }

  const handleEnterPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col w-screen min-h-screen bg-white overflow-hidden">
      <Header />
      {loading ? (
        <LoadingSpinner/>
      ) : (
       loginToken ? (
        <div className="relative isolate px-6 lg:px-8">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-tertiary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>
          <div className="flex h-screen sm:py-48 lg:py-56 gap-4">            
            <div className="flex w-1/4">
              <FriendsList 
                onInvite={handleInvite} 
                selectedFriend={selectedFriend} 
                setSelectedFriend={setSelectedFriend}
              />
            </div>

            <div className="flex flex-col text-black w-3/4">
              {/* Chat */}
              <div className="flex flex-col align-middle h-full w-full p-42">
                {selectedFriend ?
                 (<a className='text-3xl'>{selectedFriend.name} </a>):(<a className='text-3xl'>Select a friend</a>)}
                  <div className="flex-grow overflow-y-auto mt-2 mb-4 border rounded-md" ref={chatContainerRef}>
                    {(messages[selectedFriend?.id ?? ''] || []).map((msg: string, index: number) => (
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
                      className={`flex-grow px-3 py-2 mr-2 border rounded-md text-black ${selectedFriend ? '' : 'bg-gray-200'}`}
                      placeholder="Type your message..."
                      disabled={!selectedFriend}
                    />
                    <button onClick={handleSendMessage} className="px-4 py-2 text-white bg-primary rounded-md hover:bg-secondary">
                      Send
                    </button>
                  </div>
                </div>

            </div>
            
          </div>
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
            <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-tertiary to-secondary opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
          </div>
        </div>
      ) : (
        <h1 className="text-4xl font-bold text-center text-black mt-64">Please log in to access this page.</h1>
      ))}
      
    </div>
  );




}
