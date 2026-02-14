"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
  duration: number;
  shape: "circle" | "square" | "star";
}

const COLORS = [
  "#7c3aed", "#ec4899", "#3b82f6", "#f59e0b",
  "#10b981", "#6366f1", "#f43f5e", "#8b5cf6",
  "#14b8a6", "#f97316",
];

export function ConfettiEffect() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 3,
        shape: (["circle", "square", "star"] as const)[Math.floor(Math.random() * 3)],
      });
    }
    setParticles(newParticles);

    const timer = setTimeout(() => setShow(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!show || particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          25% { transform: translateY(25vh) rotate(180deg) scale(0.9); opacity: 1; }
          50% { transform: translateY(50vh) rotate(360deg) scale(0.8); opacity: 0.8; }
          75% { transform: translateY(75vh) rotate(540deg) scale(0.6); opacity: 0.5; }
          100% { transform: translateY(110vh) rotate(720deg) scale(0.3); opacity: 0; }
        }
        @keyframes confetti-sway {
          0%, 100% { margin-left: 0; }
          25% { margin-left: 15px; }
          75% { margin-left: -15px; }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.shape !== "star" ? p.color : "transparent",
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "square" ? "2px" : "0",
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards, confetti-sway ${p.duration * 0.6}s ease-in-out ${p.delay}s infinite`,
            ...(p.shape === "star" ? {
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              backgroundColor: p.color,
            } : {}),
          }}
        />
      ))}
    </div>
  );
}
