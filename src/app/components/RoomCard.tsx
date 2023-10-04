import { useSpring, animated, config, useInView } from 'react-spring';

// LanguageRoomCard.js
interface Room {
    flagImageSrc: string;
    language: string;
    href: string;
    hostName: string;
}

type FadeInFromLeftProps = {
    children: React.ReactNode;
  }
  
  const FadeInFromLeft = ({ children }: FadeInFromLeftProps) => {
    const [ref, inView] = useInView()
  
    const animation = useSpring({
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : 'translateX(-50px)',
      config: config.slow,
    })
  
    return (
      <animated.div ref={ref} style={animation}>
        {children}
      </animated.div>
    )
  }

interface RoomCardProps {
    room: Room;
}

import Image from 'next/image';

export default function RoomCard({ room }: RoomCardProps) {
    return (
        <FadeInFromLeft>
            <div className="border p-4 rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl text-black font-bold">{room.language} Room</h2>
                    <Image src={room.flagImageSrc} alt={room.language} width={128} height={128} />
                </div>
                <div className="flex flex-col items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-700">Host: {room.hostName}</p>
                    </div>
                    <div className="flex flex-col items-center space-x-2">
                        <p className="text-sm text-gray-700">Let&apos;s learn tgt lol.</p>
                        <a href={room.href} className="text-blue-500 hover:underline">
                            Join now
                        </a>
                    </div>
                </div>
            </div>
        </FadeInFromLeft>
    );
}
