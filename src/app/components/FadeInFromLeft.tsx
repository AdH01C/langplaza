"use client"

import { useSpring, animated, config, useInView } from 'react-spring';

type FadeInFromLeftProps = {
    children: React.ReactNode;
}

const FadeInFromLeft: React.FC<FadeInFromLeftProps> = ({ children }): JSX.Element => {
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

export default FadeInFromLeft;
