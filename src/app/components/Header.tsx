import Image from 'next/image'
import { fetchNotifications, logoutUserGQL } from '../utils/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiBell, FiX } from 'react-icons/fi';
import Link from 'next/link';
import BellWithNumber from './BellWithNumber';

interface Notification {
    request_id: string;
    request_message: string;
    request_status: string;
    target_user_id: string;
    user_id: string;
}

export default function Header() {
    const router = useRouter(); // Moved useRouter to top level

    const [loginToken, setLoginToken] = useState<string | null>(null);
    const [openNotification, setOpenNotification] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);


    useEffect(() => {
        setLoginToken(
            localStorage.getItem('token') !== "undefined" 
            ? localStorage.getItem('token') 
            : null
        );

        const data = fetchNotifications();
        data.then((res) => {
            // setNotifications(res.data.data);
            if (res && res[0]) {
                const notification = res[0].data;
                setNotifications([...notifications, notification]);
            }
        })
    }, []);
      

    const handleLogout = async () => {
        try {
            await logoutUserGQL();
            setLoginToken(null);
            localStorage.clear();
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
                    {/* <a href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Pearl Lingo</span>
                        <Image src="/images/logo(nobg).png" width={192} height={192} alt="logo"/>
                    </a> */}
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Pearl Lingo</span>
                        <Image src="/images/logo(nobg).png" width={192} height={192} alt="logo"/>
                    </Link>
                    </div>
                    <div className="flex lg:gap-x-12">
                    <Link href="/match" className="text-sm font-semibold leading-6 text-gray-900">Match</Link>
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Contact us</a>
                    <a href="#" className="text-sm font-semibold leading-6 text-gray-900">About us</a>
                    </div>

                    <div className="flex gap-1 lg:items-center lg:justify-end lg:flex-1 lg:w-0">
                        <BellWithNumber 
                            count={notifications.length}
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
                                        notification.request_status === "pending" ? (
                                            <div key={notification.request_id + notification.user_id + notification.request_status} className="flex flex-col">
                                                <p className="text-base font-medium text-gray-500">Friend Request ID: {notification.user_id}</p>
                                                <p className="text-sm leading-6 text-gray-900">Message: {notification.request_message} Status: {notification.request_status}</p>
                                            </div>
                                        ) : null
                                    ))
                                ) : (
                                    <p className="text-sm leading-6 text-gray-900">No notifications</p>
                                )}
                            </div>
                        )}
                        <p className="ml-4 text-base font-medium text-gray-500 hover:text-gray-900">ID: {localStorage.getItem('user_id')}</p>
                        <Link href="/friends" className="ml-8 whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                            My Friends
                        </Link>
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
                <Link href="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">Pearl Lingo</span>
                    <Image src="/images/logo(nobg).png" width={192} height={192} alt="logo"/>
                </Link>
                
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
                    <Link href="/login" className="text-base font-medium text-gray-500 hover:text-gray-900">
                        Log in
                    </Link>
                    <Link href="/sign-up" className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-secondary">
                        Sign up
                    </Link>
                </div>
                
            </nav>
        </header>
    )
}
