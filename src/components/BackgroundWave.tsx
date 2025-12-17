import React, { useEffect, useRef } from 'react';

export const BackgroundWave: React.FC = () => {
    // Configuration matching user's latest tweaks + optimizations
    const config = {
        width: 1440,
        height: 1400,
        step: 5, // Resolution (higher = smoother)
        layers: [
            { count: 5, spacing: 12, amplitude: 15, period: 4, speed: 0.002, color: '#c084fc', opacity: 0.2, phaseBase: 0 },   // Back
            { count: 5, spacing: 18, amplitude: 25, period: 4, speed: 0.003, color: '#22d3ee', opacity: 0.5, phaseBase: 1 },   // Mid
            { count: 5, spacing: 24, amplitude: 40, period: 4, speed: 0.005, color: '#fb923c', opacity: 0.8, phaseBase: 2.5 }  // Front
        ]
    };

    // Refs to store path elements for direct DOM manipulation (Performance)
    const pathRefs = useRef<(SVGPathElement | null)[][]>([]);
    const animationFrameId = useRef<number>();

    // Initial setup of refs grid
    pathRefs.current = config.layers.map(layer => new Array(layer.count).fill(null));

    useEffect(() => {
        let time = 0;

        const animate = () => {
            time += 1;
            const { width, height, step } = config;

            config.layers.forEach((layer, layerIndex) => {
                // Determine vertical position
                // user wants it at the bottom.
                // We leave some padding (150px) from the absolute bottom (1400) so peaks don't clip.
                const totalBundleHeight = layer.count * layer.spacing;
                const startY = height - totalBundleHeight - 100;

                for (let i = 0; i < layer.count; i++) {
                    const pathEl = pathRefs.current[layerIndex][i];
                    if (!pathEl) continue;

                    const rowPhase = i * 0.15; // Offset between lines in bundle
                    const t = time * layer.speed;

                    let d = `M 0 ${startY + (i * layer.spacing)}`;

                    for (let x = 0; x <= width; x += step) {
                        const nx = x / width; // Normalized X (0 -> 1)

                        // INTERFERENCE PATTERN (Standing Wave-like effect)
                        // Wave 1: Moves Right
                        const w1 = Math.sin((nx * Math.PI * 2 * layer.period) + t + rowPhase + layer.phaseBase);

                        // Wave 2: Moves Left (Travels opposite direction at different freq)
                        const w2 = Math.sin((nx * Math.PI * 3 * layer.period) - (t * 0.8) + rowPhase);

                        // Wave 3: Time-based "Breathing" (Pulse)
                        const breathing = Math.sin(t * 0.5 + nx * Math.PI);

                        // Combine them:
                        // The primary shape is W1 + W2 (Interference). 
                        // We modulate the amplitude slightly with 'breathing' for organic feel.
                        const totalWave = (w1 + w2 * 0.5) * (1 + breathing * 0.2);

                        const y = totalWave * layer.amplitude;

                        d += ` L ${x} ${startY + (i * layer.spacing) + y}`;
                    }

                    pathEl.setAttribute('d', d);
                }
            });

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-white dark:bg-black transition-colors duration-300">
            {/* Gradient Definition */}
            <svg className="absolute w-0 h-0">
                <defs>
                    <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.6" />
                        <stop offset="40%" stopColor="#22d3ee" stopOpacity="0.8" />
                        <stop offset="80%" stopColor="#fb923c" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#d8b4fe" stopOpacity="0.5" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Background & Blend Modes */}
            <div className="absolute inset-0 z-0 opacity-100 dark:opacity-90 mix-blend-normal dark:mix-blend-screen flex items-center justify-center">
                <svg viewBox="0 0 1440 1400" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                    {config.layers.map((layer, layerIndex) => (
                        <g key={`layer-${layerIndex}`} opacity={layer.opacity}>
                            {Array.from({ length: layer.count }).map((_, lineIndex) => (
                                <path
                                    key={`path-${layerIndex}-${lineIndex}`}
                                    ref={el => pathRefs.current[layerIndex][lineIndex] = el}
                                    fill="none"
                                    stroke="url(#meshGradient)"
                                    strokeWidth="1.5"
                                    strokeOpacity={0.8}
                                />
                            ))}
                        </g>
                    ))}
                </svg>

                {/* Secondary glow blobs */}
                {/* <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-purple-500/20 dark:bg-purple-900/30 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-orange-500/20 dark:bg-orange-900/30 rounded-full blur-[100px] pointer-events-none" /> */}
            </div>
        </div>
    );
};
