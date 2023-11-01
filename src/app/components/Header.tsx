import Image from 'next/image'
import { logoutUser } from '../utils/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiBell, FiX } from 'react-icons/fi';

interface Notification {
    id: string;
    title: string;
    description: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    friendId: string;
}

export default function Header() {
    const router = useRouter(); // Moved useRouter to top level

    const [loginToken, setLoginToken] = useState<string | null>(null);
    const [openNotification, setOpenNotification] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            title: "New friend request",
            description: "You have a new friend request from John Doe",
            type: "friend_request",
            createdAt: "2021-10-14T17:00:00.000Z",
            updatedAt: "2021-10-14T17:00:00.000Z",
            userId: "1",
            friendId: "2"
        }
    ]);


    useEffect(() => {
      setLoginToken(
        localStorage.getItem('token') !== "undefined" 
          ? localStorage.getItem('token') 
          : null
      );
    }, []);
      

    const handleLogout = async () => {
        try {
            await logoutUser();
            setLoginToken(null);
            localStorage.removeItem('token');
            router.push('/'); // Using router object here
            
        } catch (error) {
            console.error('Error in handleLogout:', error);
        }
    };


    if (loginToken) {
        return (
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                    <a href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Pearl Lingo</span>
                        <Image src="/images/logo(nobg).png" width={192} height={192} alt="logo"/>
                    </a>
                    </div>
                    <div className="flex lg:gap-x-12">
                    <a href="/match" className="text-sm font-semibold leading-6 text-gray-900">Match</a>
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Contact us</a>
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">About us</a>
                    </div>

                    <div className="flex gap-1 lg:items-center lg:justify-end lg:flex-1 lg:w-0">
                        <FiBell 
                            className="text-2xl text-gray-500 hover:text-gray-900 cursor-pointer"
                            onClick={() => setOpenNotification(!openNotification)}
                        />
                        { openNotification && (
                            <div className="flex flex-col gap-4 absolute right-32 top-20 p-4 w-96 h-32 bg-white rounded-lg shadow-lg">
                                <div className="flex justify-between">
                                    <p className='text-xl font-medium text-gray-900'>Notification</p>
                                    <FiX 
                                        className="text-2xl text-gray-500 hover:text-gray-900 cursor-pointer"
                                        onClick={() => setOpenNotification(!openNotification)}
                                    />
                                </div>
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div className="flex flex-col cursor-pointer">
                                            <p className="text-base font-medium text-gray-500 hover:text-gray-900">{notification.title}</p>
                                            <p className="text-sm leading-6 text-gray-900">{notification.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm leading-6 text-gray-900">No notifications</p>
                                )}
                            </div>
                        )}
                        <p className="ml-4 text-base font-medium text-gray-500 hover:text-gray-900">ID: {localStorage.getItem('user_id')}</p>
                        <a
                            href="/friends"
                            className="ml-8 whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
                        >
                            My Friends
                        </a>
                        <button
                            className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-secondary"
                            onClick={handleLogout}
                            
                        >
                            Log out
                        </button>
                    </div>
                    
                </nav>
            </header>
        )
    }

    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                <a href="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">Pearl Lingo</span>
                    <Image src="/images/logo(nobg).png" width={192} height={192} alt="logo"/>
                </a>
                </div>
                <div className="flex lg:hidden">
                <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                    <span className="sr-only">Open main menu</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Contact us</a>
                <a href="#" className="text-sm font-semibold leading-6 text-gray-900">About us</a>
                </div>

                <div className="hidden lg:flex lg:items-center lg:justify-end lg:flex-1 lg:w-0">
                    <a href="/login" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                        Log in
                    </a>
                    <a
                        href="/sign-up"
                        className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-secondary"
                    >
                        Sign up
                    </a>
                </div>
                
            </nav>
        </header>
    )
}
