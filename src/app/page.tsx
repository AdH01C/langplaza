"use client"

import Image from 'next/image'
import { useRef, useState } from 'react';
import { useSpring, animated, config, useInView } from 'react-spring';
import Header from './components/Header';
import FadeInFromLeft from './components/FadeInFromLeft';

type NumberCounterProps = {
  targetNumber: number;
}

const NumberCounter = ({ targetNumber }: NumberCounterProps) => {
  const [ref, inView] = useInView();

  const [started, setStarted] = useState(false);

  const props = useSpring({
    number: inView ? targetNumber : 0,
    from: { number: 0 },
    onStart: () => setStarted(true),
    config: { duration: 1000 }
  });

  return (
    <animated.div ref={ref}>
      {started && props.number.interpolate((number: number) => Math.floor(number).toLocaleString())}
    </animated.div>
  );
};


export default function Home() {
  return (
    <div className="flex flex-col w-screen min-h-screen bg-white overflow-hidden">
      <Header />

      <div className="relative isolate px-6 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-tertiary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <FadeInFromLeft>
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Announcing our partnership with MOE. <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="font-semibold text-primary"><span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></a>
              </div>
            </div>
          </FadeInFromLeft>
          
          <div className="text-center">
            <FadeInFromLeft>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Welcome to Pearl Lingo.</h1>
            
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Dive into a world of languages, connect with others, and join our vibrant community. We are totally separate from DuoLingo and we are not affiliated with them in any way. Like fr. Legit.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a href="/login" className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Get started</a>
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="text-sm font-semibold leading-6 text-gray-900">Learn more <span aria-hidden="true">→</span></a>
              </div>

            </FadeInFromLeft>
          </div>
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-tertiary to-secondary opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
        </div>
      </div>

      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
        <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center"/>
        <div className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl" aria-hidden="true">
          <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        <div className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu" aria-hidden="true">
          <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FadeInFromLeft>
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Learn with us</h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Connect with anyone accross the world in an instant. Learn a new language, or teach your own. 
              </p>
            </div>
          </FadeInFromLeft>
          
          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
              <a href="#">Join the team <span aria-hidden="true">&rarr;</span></a>
              <a href="#">Partner as a School <span aria-hidden="true">&rarr;</span></a>
              <a href="#">Our values <span aria-hidden="true">&rarr;</span></a>
              <a href="#">Meet our leadership <span aria-hidden="true">&rarr;</span></a>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col-reverse">
                <dt className="text-base leading-7 text-gray-300">Rooms worldwide</dt>
                <dd className="text-2xl font-bold leading-9 tracking-tight text-white">
                <NumberCounter targetNumber={334621} /></dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="text-base leading-7 text-gray-300">Regular members</dt>
                <dd className="text-2xl font-bold leading-9 tracking-tight text-white"><NumberCounter targetNumber={2984573}/></dd>
                
              </div>
              <div className="flex flex-col-reverse">
                <dt className="text-base leading-7 text-gray-300">Experts on standby</dt>
                <dd className="text-2xl font-bold leading-9 tracking-tight text-white"><NumberCounter targetNumber={18}/></dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="text-base leading-7 text-gray-300">Unlimited usage</dt>
                <dd className="text-2xl font-bold leading-9 tracking-tight text-white">Free</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

    </div>
  );
}
