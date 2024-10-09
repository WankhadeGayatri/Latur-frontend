"use client";
import React, { useEffect, useRef } from "react";

const DataGalaxyLoader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Planet
    const planet = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 60,
      color: "#3B82F6", // Bright blue
    };

    // Stars (data points)
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 0.5,
      angle: Math.random() * Math.PI * 2,
      color: ["#60A5FA", "#34D399", "#A78BFA"][Math.floor(Math.random() * 3)],
    }));

    const drawGradientCircle = (
      x: number,
      y: number,
      radius: number,
      color1: string,
      color2: string
    ) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and animate stars
      stars.forEach((star) => {
        drawGradientCircle(
          star.x,
          star.y,
          star.radius,
          star.color,
          "rgba(255, 255, 255, 0.5)"
        );

        // Move stars towards the planet
        const dx = planet.x - star.x;
        const dy = planet.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > planet.radius) {
          star.x += (dx / distance) * star.speed;
          star.y += (dy / distance) * star.speed;
        } else {
          // Reset star position when it reaches the planet
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
        }
      });

      // Draw planet
      drawGradientCircle(
        planet.x,
        planet.y,
        planet.radius,
        "#3B82F6",
        "#60A5FA"
      );

      // Draw loading text
      ctx.font = "bold 24px Arial";
      ctx.fillStyle = "#1E40AF";
      ctx.textAlign = "center";
      ctx.fillText("Gathering Data...", canvas.width / 2, canvas.height - 50);

      // Draw pulsating ring around the planet
      ctx.beginPath();
      ctx.arc(
        planet.x,
        planet.y,
        planet.radius + 10 + Math.sin(Date.now() / 200) * 5,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
      ctx.lineWidth = 5;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};

export default DataGalaxyLoader;
