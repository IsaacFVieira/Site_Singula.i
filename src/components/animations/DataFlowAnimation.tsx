'use client';

import React, { useState, useEffect, useRef } from 'react';

interface DataFlowAnimationProps {
  className?: string;
  width?: number;
  height?: number;
}

const DataFlowAnimation: React.FC<DataFlowAnimationProps> = ({
  className = '',
  width = 400,
  height = 400
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = (e.clientX - centerX) / 50;
      const y = (e.clientY - centerY) / 50;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Hexagon path generator
  const createHexagonPath = (cx: number, cy: number, size: number) => {
    const points: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      points.push([x, y]);
    }
    return points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ') + ' Z';
  };

  // Positions for the 4 inner hexagons in an 'S' pattern
  const hexagonPositions = [
    { x: 120, y: 120, size: 35, active: true },
    { x: 200, y: 140, size: 35, active: false },
    { x: 180, y: 220, size: 35, active: false },
    { x: 260, y: 240, size: 35, active: false }
  ];

  // Connection lines between hexagons
  const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 }
  ];

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ width, height }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 400 400"
        className="w-full h-full"
        style={{
          transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <defs>
          {/* Gradient for connection lines */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FF88" />
            <stop offset="100%" stopColor="#00CC66" />
          </linearGradient>

          {/* Gradient for active hexagon */}
          <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FF88" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00CC66" stopOpacity="0.1" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Large outer hexagon */}
        <g filter="url(#glow)">
          <path
            d={createHexagonPath(200, 200, 180)}
            fill="none"
            stroke="#00FF88"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
        </g>

        {/* Connection lines with animated stroke */}
        {connections.map((conn, index) => {
          const from = hexagonPositions[conn.from];
          const to = hexagonPositions[conn.to];
          return (
            <g key={index}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#00FF88"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="10 10"
                style={{
                  animation: `dashFlow 1.5s linear infinite`,
                  animationDelay: `${index * 0.3}s`
                }}
              />
            </g>
          );
        })}

        {/* Inner hexagons with breathing animation */}
        {hexagonPositions.map((hex, index) => (
          <g key={index}>
            <g
              style={{
                transformOrigin: `${hex.x}px ${hex.y}px`,
                animation: `breathe 3s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`
              }}
            >
              {/* Hexagon fill */}
              <path
                d={createHexagonPath(hex.x, hex.y, hex.size)}
                fill={hex.active ? 'url(#activeGradient)' : '#1a1a2e'}
                stroke={hex.active ? '#00FF88' : '#2a2a3e'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={hex.active ? 'url(#glow)' : undefined}
              />
            </g>
          </g>
        ))}

        {/* Additional decorative lines */}
        <g opacity="0.4">
          <line
            x1="80"
            y1="100"
            x2="120"
            y2="80"
            stroke="#00FF88"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="280"
            y1="320"
            x2="320"
            y2="340"
            stroke="#00FF88"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <style jsx>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes dashFlow {
          0% {
            stroke-dashoffset: 20;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default DataFlowAnimation;
