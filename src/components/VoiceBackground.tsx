"use client";

import React, { useEffect, useRef } from "react";

export function VoiceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (ctx === null) {
      return;
    }

    let W: number = window.innerWidth;
    let H: number = window.innerHeight;

    let animationFrameId: number = 0;

    const resize = (): void => {
      W = window.innerWidth;
      H = window.innerHeight;

      canvas.width = W;
      canvas.height = H;
    };

    resize();

    window.addEventListener("resize", resize);

    /* ==========================================================
       PARTICLES
    ========================================================== */

    type Particle = {
      x: number;
      y: number;
      r: number;
      vy: number;
      vx: number;
      baseAlpha: number;
      flicker: number;
      hueMix: number;
    };

    const particleCount = 70;

    const particles: Particle[] = [];

    const makeParticle = (): Particle => ({
      x: Math.random() * W,
      y: H + Math.random() * 100,
      r: Math.random() * 1.8 + 0.4,
      vy: Math.random() * 0.35 + 0.08,
      vx: (Math.random() - 0.5) * 0.25,
      baseAlpha: Math.random() * 0.5 + 0.15,
      flicker: Math.random() * Math.PI * 2,
      hueMix: Math.random(),
    });

    for (let i = 0; i < particleCount; i++) {
      const particle = makeParticle();

      particle.y = Math.random() * H;

      particles.push(particle);
    }

    /* ==========================================================
       STREAKS
    ========================================================== */

    type Streak = {
      x: number;
      y: number;
      len: number;
      life: number;
      maxLife: number;
      alpha: number;
    };

    let streaks: Streak[] = [];

    const spawnStreak = (): void => {
      streaks.push({
        x: W * 0.25 + Math.random() * W * 0.5,
        y: H * 0.4 + Math.random() * H * 0.5,
        len: Math.random() * 80 + 40,
        life: 0,
        maxLife: Math.random() * 40 + 30,
        alpha: 0,
      });
    };

    const streakInterval = window.setInterval(() => {
      if (Math.random() < 0.6) {
        spawnStreak();
      }
    }, 1400);

    /* ==========================================================
       ANIMATION
    ========================================================== */

    let t = 0;
    let globalAlpha = 0;

    const startTime = performance.now();

    const tick = (now: number): void => {
      t += 0.016;

      const elapsed = (now - startTime) / 1000;

      globalAlpha = Math.min(1, elapsed / 2);

      ctx.clearRect(0, 0, W, H);

      ctx.save();

      ctx.globalAlpha = globalAlpha;

      /* ========================================================
         PARTICLES
      ======================================================== */

      for (const particle of particles) {
        particle.y -= particle.vy;

        particle.x += particle.vx + Math.sin(t * 0.5 + particle.flicker) * 0.05;

        particle.flicker += 0.01;

        if (particle.y < -10) {
          particle.y = H + 10;
          particle.x = Math.random() * W;
        }

        if (particle.x < -10) {
          particle.x = W + 10;
        }

        if (particle.x > W + 10) {
          particle.x = -10;
        }

        const alpha =
          particle.baseAlpha *
          (0.7 + 0.3 * Math.sin(t * 1.2 + particle.flicker));

        const r = Math.round(20 + particle.hueMix * 10);

        const g = Math.round(180 + particle.hueMix * 75);

        const b = Math.round(90 + particle.hueMix * 40);

        ctx.beginPath();

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;

        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);

        ctx.fill();
      }

      /* ========================================================
         STREAKS
      ======================================================== */

      streaks = streaks.filter((streak) => streak.life < streak.maxLife);

      for (const streak of streaks) {
        streak.life++;

        const progress = streak.life / streak.maxLife;

        streak.alpha = Math.sin(progress * Math.PI) * 0.35;

        const gradient = ctx.createLinearGradient(
          streak.x,
          streak.y - streak.len / 2,
          streak.x,
          streak.y + streak.len / 2,
        );

        gradient.addColorStop(0, "rgba(20,255,140,0)");

        gradient.addColorStop(0.5, `rgba(30,255,150,${streak.alpha})`);

        gradient.addColorStop(1, "rgba(20,255,140,0)");

        ctx.strokeStyle = gradient;

        ctx.lineWidth = 1;

        ctx.beginPath();

        ctx.moveTo(streak.x, streak.y - streak.len / 2);

        ctx.lineTo(streak.x, streak.y + streak.len / 2);

        ctx.stroke();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    /* ==========================================================
       CLEANUP
    ========================================================== */

    return () => {
      window.removeEventListener("resize", resize);

      window.clearInterval(streakInterval);

      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="voice-bg-stage">
      <style>{`
        .voice-bg-stage {
          --pure-black: #000000;
          --green-core: rgba(20, 255, 130, 1);
          --green-bright: rgba(10, 230, 110, 0.9);
          --green-mid: rgba(6, 160, 85, 0.55);
          --green-deep: rgba(3, 70, 42, 0.4);
          --green-haze: rgba(4, 100, 55, 0.22);

          position: absolute;
          inset: 0;
          width: 100%;
          height: 100vh;
          background: var(--pure-black);
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }

        .voice-bg-atmosphere {
          position: absolute;
          inset: 0;
          opacity: 0;
          animation: reveal 2s ease-out forwards;
        }

        @keyframes reveal {
          0% {
            opacity: 0;
          }

          100% {
            opacity: 1;
          }
        }

        .voice-bg-haze-edges {
          position: absolute;
          inset: -10%;
          background:
            radial-gradient(
              ellipse 140% 100% at 50% 120%,
              transparent 0%,
              var(--green-haze) 45%,
              transparent 75%
            );
          filter: blur(60px);
          animation:
            haze-drift
            22s ease-in-out infinite alternate;
        }

        @keyframes haze-drift {
          0% {
            transform: translate(0, 0) scale(1);
          }

          100% {
            transform:
              translate(1.5%, -1%)
              scale(1.05);
          }
        }

        .voice-bg-bloom {
          position: absolute;
          left: 50%;
          bottom: -25%;
          width: 130vw;
          height: 100vh;
          transform:
            translateX(-50%)
            scale(0.9);
          background:
            radial-gradient(
              ellipse 60% 55% at 50% 100%,
              var(--green-mid) 0%,
              var(--green-deep) 35%,
              transparent 70%
            );
          filter: blur(50px);
          animation:
            bloom-breathe
            7s ease-in-out infinite alternate;
          animation-delay: 1.8s;
        }

        @keyframes bloom-breathe {
          0% {
            transform:
              translateX(-50%)
              scale(0.92);
            opacity: 0.85;
          }

          100% {
            transform:
              translateX(-50%)
              scale(1.06);
            opacity: 1;
          }
        }

        .voice-bg-core {
          position: absolute;
          left: 50%;
          bottom: -10%;
          width: 60vw;
          height: 55vh;
          max-width: 900px;
          transform:
            translateX(-50%)
            scale(0.88);
          background:
            radial-gradient(
              circle at 50% 100%,
              var(--green-core) 0%,
              var(--green-bright) 18%,
              var(--green-mid) 38%,
              transparent 68%
            );
          filter: blur(70px);
          mix-blend-mode: screen;
          animation:
            core-breathe
            5.5s ease-in-out infinite alternate;
          animation-delay: 1.8s;
        }

        @keyframes core-breathe {
          0% {
            transform:
              translateX(-50%)
              scale(0.86);
            opacity: 0.75;
          }

          100% {
            transform:
              translateX(-50%)
              scale(1.02);
            opacity: 1;
          }
        }

        .voice-bg-rays {
          position: absolute;
          inset: 0;
          mix-blend-mode: screen;
        }

        .voice-bg-ray {
          position: absolute;
          bottom: -10%;
          width: 2px;
          height: 70%;
          background:
            linear-gradient(
              to top,
              rgba(20,255,140,0.28) 0%,
              rgba(20,255,140,0.10) 40%,
              transparent 100%
            );
          filter: blur(6px);
          opacity: 0;
          animation:
            ray-rise
            9s ease-in-out infinite;
        }

        .voice-bg-ray:nth-child(1) {
          left: 38%;
          width: 3px;
          animation-delay: 2.2s;
          animation-duration: 10s;
        }

        .voice-bg-ray:nth-child(2) {
          left: 47%;
          width: 2px;
          animation-delay: 3.4s;
          animation-duration: 8s;
        }

        .voice-bg-ray:nth-child(3) {
          left: 53%;
          width: 4px;
          animation-delay: 2.8s;
          animation-duration: 11s;
        }

        .voice-bg-ray:nth-child(4) {
          left: 60%;
          width: 2px;
          animation-delay: 4.2s;
          animation-duration: 9.5s;
        }

        .voice-bg-ray:nth-child(5) {
          left: 44%;
          width: 3px;
          animation-delay: 5s;
          animation-duration: 12s;
        }

        .voice-bg-ray:nth-child(6) {
          left: 56%;
          width: 2px;
          animation-delay: 3.8s;
          animation-duration: 10.5s;
        }

        @keyframes ray-rise {
          0% {
            opacity: 0;
            transform:
              translateY(10%)
              scaleY(0.9);
          }

          15% {
            opacity: 0.5;
          }

          50% {
            opacity: 0.3;
            transform:
              translateY(-6%)
              scaleY(1.05);
          }

          85% {
            opacity: 0.15;
          }

          100% {
            opacity: 0;
            transform:
              translateY(-20%)
              scaleY(1.1);
          }
        }

        .voice-bg-fog {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          mix-blend-mode: screen;
          opacity: 0.55;
        }

        .voice-bg-fog-1 {
          width: 50vw;
          height: 50vw;
          left: 20%;
          bottom: 0%;
          background:
            radial-gradient(
              circle,
              var(--green-deep),
              transparent 70%
            );
          animation:
            fog-drift-1
            26s ease-in-out infinite alternate;
          animation-delay: 2s;
        }

        .voice-bg-fog-2 {
          width: 45vw;
          height: 45vw;
          right: 15%;
          bottom: 5%;
          background:
            radial-gradient(
              circle,
              var(--green-haze),
              transparent 70%
            );
          animation:
            fog-drift-2
            32s ease-in-out infinite alternate;
          animation-delay: 2.4s;
        }

        .voice-bg-fog-3 {
          width: 35vw;
          height: 35vw;
          left: 45%;
          bottom: -10%;
          background:
            radial-gradient(
              circle,
              var(--green-mid),
              transparent 72%
            );
          animation:
            fog-drift-3
            20s ease-in-out infinite alternate;
          animation-delay: 1.6s;
        }

        @keyframes fog-drift-1 {
          0% {
            transform:
              translate(0, 0)
              scale(1);
          }

          100% {
            transform:
              translate(6%, -4%)
              scale(1.12);
          }
        }

        @keyframes fog-drift-2 {
          0% {
            transform:
              translate(0, 0)
              scale(1);
          }

          100% {
            transform:
              translate(-8%, -3%)
              scale(1.08);
          }
        }

        @keyframes fog-drift-3 {
          0% {
            transform:
              translate(-4%, 0)
              scale(0.95);
          }

          100% {
            transform:
              translate(4%, -6%)
              scale(1.1);
          }
        }

        #voice-bg-particle-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          mix-blend-mode: screen;
        }

        @media (prefers-reduced-motion: reduce) {
          .voice-bg-atmosphere,
          .voice-bg-bloom,
          .voice-bg-core,
          .voice-bg-haze-edges,
          .voice-bg-fog-1,
          .voice-bg-fog-2,
          .voice-bg-fog-3,
          .voice-bg-ray {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <div className="voice-bg-atmosphere">
        <div className="voice-bg-haze-edges" />
        <div className="voice-bg-bloom" />
        <div className="voice-bg-core" />

        <div className="voice-bg-fog voice-bg-fog-1" />
        <div className="voice-bg-fog voice-bg-fog-2" />
        <div className="voice-bg-fog voice-bg-fog-3" />

        <div className="voice-bg-rays">
          <div className="voice-bg-ray" />
          <div className="voice-bg-ray" />
          <div className="voice-bg-ray" />
          <div className="voice-bg-ray" />
          <div className="voice-bg-ray" />
          <div className="voice-bg-ray" />
        </div>
      </div>

      <canvas id="voice-bg-particle-canvas" ref={canvasRef} />
    </div>
  );
}
