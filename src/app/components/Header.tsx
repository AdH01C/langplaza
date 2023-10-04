import Image from 'next/image'
import { logoutUser } from '../utils/logout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
    // check if token exists
    // if token exists, show logout button
    // if token does not exist, show login button

    const [loginToken, setLoginToken] = useState<string | null>(null);

    useEffect(() => {
        // This code will only run on the client side
        if (localStorage.getItem('token') != "undefined")
            setLoginToken(localStorage.getItem('token'));
    }, []); // The empty dependency array means this useEffect runs once when the component mounts


    const handleLogout = async () => {
        try {
            await logoutUser();
            setLoginToken(null);
            localStorage.removeItem('token');
            useRouter().push('/');
            
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

                    <div className="flex lg:items-center lg:justify-end lg:flex-1 lg:w-0">
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
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                <a href="/match" className="text-sm font-semibold leading-6 text-gray-900">Match</a>
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
