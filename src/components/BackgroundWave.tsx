import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundWave: React.FC = () => {
    // Helper to generate parallel lines
    const WaveGroup = ({ d, count = 12, offset = 6, color, opacityBase }: { d: string, count?: number, offset?: number, color: string, opacityBase: number }) => (
        <g className={color}>
            {Array.from({ length: count }).map((_, i) => (
                <path
                    key={i}
                    d={d}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeOpacity={opacityBase - (i * 0.02)} // Fade out slightly
                    style={{ transform: `translateY(${i * offset}px)` }}
                />
            ))}
        </g>
    );

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-white dark:bg-gray-900 transition-colors">
            {/* 
                Added a base background color container here if needed, 
                but usually this component overlays the main bg.
                Actually, removing bg-white here to be transparent overlay if used with existing App.tsx bg.
                Wait, user reported "not bottom of screen". 
                I'll keep it transparent and just position the waves.
            */}
            <div className="absolute inset-0 z-0">
                {/* Wave Group 1 - Blueish */}
                <div className="absolute bottom-0 left-0 w-full h-[45vh] opacity-60">
                    <motion.div
                        className="flex w-[200%]"
                        animate={{ x: "-50%" }}
                        transition={{
                            repeat: Infinity,
                            duration: 40,
                            ease: "linear"
                        }}
                    >
                        <svg viewBox="0 0 1440 600" className="w-1/2 h-full preserve-3d">
                            <WaveGroup
                                d="M0,200 C480,350 960,50 1440,200"
                                count={15}
                                offset={8}
                                color="text-blue-400 dark:text-blue-600"
                                opacityBase={0.6}
                            />
                        </svg>
                        <svg viewBox="0 0 1440 600" className="w-1/2 h-full preserve-3d">
                            <WaveGroup
                                d="M0,200 C480,350 960,50 1440,200"
                                count={15}
                                offset={8}
                                color="text-blue-400 dark:text-blue-600"
                                opacityBase={0.6}
                            />
                        </svg>
                    </motion.div>
                </div>

                {/* Wave Group 2 - Purpleish/Indigo */}
                <div className="absolute bottom-0 left-0 w-full h-[40vh] opacity-50">
                    <motion.div
                        className="flex w-[200%]"
                        animate={{ x: "-50%" }}
                        transition={{
                            repeat: Infinity,
                            duration: 25,
                            ease: "linear"
                        }}
                    >
                        <svg viewBox="0 0 1440 600" className="w-1/2 h-full preserve-3d">
                            <WaveGroup
                                d="M0,300 C360,150 1080,450 1440,300"
                                count={18}
                                offset={6}
                                color="text-indigo-400 dark:text-indigo-600"
                                opacityBase={0.5}
                            />
                        </svg>
                        <svg viewBox="0 0 1440 600" className="w-1/2 h-full preserve-3d">
                            <WaveGroup
                                d="M0,300 C360,150 1080,450 1440,300"
                                count={18}
                                offset={6}
                                color="text-indigo-400 dark:text-indigo-600"
                                opacityBase={0.5}
                            />
                        </svg>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

