"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";

type LetterData = {
  char: string;
  rotate: number;
  stroke: number;
  duration: number;
  color: string;
};

type MouseState = {
  tx: number;
  ty: number;
  rotate: number;
  scale: number;
  borderRadius: string;
  strokeReduce: number;
};

const TEXT = "BHARAT\n&\nSIRMAL";
const LETTER_CHARS = Array.from(TEXT);

const COLORS = ["rgb(60, 182, 107)", "rgb(17, 17, 17)", "rgb(255, 90, 0)"];

const REST_MOUSE: MouseState = {
  tx: 0,
  ty: 0,
  rotate: 0,
  scale: 1,
  borderRadius: "0px",
  strokeReduce: 0,
};

const INITIAL_LETTERS: LetterData[] = LETTER_CHARS.map((char, index) => ({
  char,
  rotate: [
    -1.2, -0.8, 0.6, -0.5, 1.1, -0.7, 0.8, -1.1, 0.5, -0.6, 1, -0.8, 0.4,
  ][index % 13],
  stroke: [28, 34, 31, 24, 36, 27, 30, 25, 35, 29, 32, 26, 30][index % 13],
  duration: 0.85,
  color: "rgb(17, 17, 17)",
}));

function randomRotate() {
  return (Math.random() - 0.5) * 6;
}

function randomStroke() {
  return Math.random() * 57;
}

function randomDuration() {
  return 0.49 + Math.random() * 0.57;
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export default function StudioText({ onComplete }: { onComplete?: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);

  const [letters, setLetters] = useState<LetterData[]>(INITIAL_LETTERS);

  const [visibleLetters, setVisibleLetters] = useState(0);

  const [mouseStates, setMouseStates] = useState<MouseState[]>(
    LETTER_CHARS.map(() => ({
      ...REST_MOUSE,
    })),
  );

  /*
   * =========================================
   * LETTER INTRO
   * =========================================
   *
   * One visible letter every 0.5 seconds.
   *
   * The space is skipped, so it does NOT
   * consume 0.5 seconds.
   */
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const visibleIndexes = LETTER_CHARS.map((char, index) =>
      char === " " || char === "\n" ? null : index,
    ).filter((index): index is number => index !== null);

    visibleIndexes.forEach((letterIndex, sequenceIndex) => {
      const timer = setTimeout(
        () => {
          setVisibleLetters(letterIndex + 1);

          /*
           * Final visible character is &
           */
          if (sequenceIndex === visibleIndexes.length - 1) {
            /*
             * Give the final & time to
             * completely appear before
             * showing the hero.
             */
            const heroTimer = setTimeout(() => {
              if (onComplete) onComplete();
            }, 900);

            timers.push(heroTimer);
          }
        },
        500 + sequenceIndex * 500,
      );

      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  /*
   * =========================================
   * RANDOM FRAMER STYLE EFFECT
   * =========================================
   */
  useEffect(() => {
    const firstTimer = setTimeout(() => {
      const color = randomColor();

      setLetters((previous) =>
        previous.map((letter) => ({
          ...letter,
          rotate: randomRotate(),
          stroke: randomStroke(),
          duration: randomDuration(),
          color,
        })),
      );
    }, 1000);

    const timers: ReturnType<typeof setTimeout>[] = [];

    let stopped = false;

    const schedule = () => {
      if (stopped) return;

      const delay = 500 + Math.random() * 800;

      const timer = setTimeout(() => {
        if (stopped) return;

        const color = randomColor();

        setLetters((previous) =>
          previous.map((letter) => ({
            ...letter,
            rotate: randomRotate(),
            stroke: randomStroke(),
            duration: randomDuration(),
            color,
          })),
        );

        schedule();
      }, delay);

      timers.push(timer);
    };

    schedule();

    return () => {
      stopped = true;
      clearTimeout(firstTimer);

      timers.forEach(clearTimeout);
    };
  }, []);

  /*
   * =========================================
   * MOUSE INTERACTION
   * =========================================
   */
  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const section = sectionRef.current;

    if (!section) return;

    const rect = section.getBoundingClientRect();

    const mouseX = event.clientX - rect.left;

    const mouseY = event.clientY - rect.top;

    const states: MouseState[] = [];

    for (let index = 0; index < LETTER_CHARS.length; index++) {
      const element = section.querySelector<HTMLElement>(
        `[data-letter="${index}"]`,
      );

      if (!element) {
        states.push({
          ...REST_MOUSE,
        });

        continue;
      }

      const letterRect = element.getBoundingClientRect();

      const letterX = letterRect.left + letterRect.width / 2 - rect.left;

      const letterY = letterRect.top + letterRect.height / 2 - rect.top;

      const dx = mouseX - letterX;

      const dy = mouseY - letterY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      const influence = Math.max(0, 1 - distance / 400);

      states.push({
        tx: -dx * influence * 0.15,

        ty: -dy * influence * 0.15,

        rotate: dx * influence * 0.03,

        scale: 1 + influence * 0.08,

        borderRadius:
          `${influence * 40}% ` +
          `${influence * 60}% ` +
          `${influence * 70}% ` +
          `${influence * 30}%`,

        strokeReduce: influence * 0.5,
      });
    }

    setMouseStates(states);
  };

  const handleMouseLeave = () => {
    setMouseStates(
      LETTER_CHARS.map(() => ({
        ...REST_MOUSE,
      })),
    );
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      {/* =====================================
          INTRO
      ====================================== */}

      <section
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="
          flex
          h-screen
          w-full
          items-center
          justify-center
          overflow-hidden
          bg-white
        "
      >
        <div
          role="img"
          aria-label="BHARAT SIRMAL&"
          className="
            inline-flex
            flex-wrap
            items-baseline
            justify-center
            whitespace-pre-wrap
            text-center
            select-none
            font-['Amarna','Amarna_Placeholder',sans-serif]
            text-[160px]
            font-normal
            leading-[0.92]
            tracking-[-0.06em]

            max-[1200px]:text-[130px]
            max-[1000px]:text-[100px]
            max-[800px]:text-[80px]
            max-[600px]:text-[60px]
            max-[600px]:tracking-[-0.04em]
            max-[450px]:text-[48px]
            max-[380px]:text-[40px]
          "
        >
          {letters.map((letter, index) => {
            const mouse = mouseStates[index] ?? REST_MOUSE;

            const visible = index < visibleLetters;

            const finalRotate = letter.rotate + mouse.rotate;

            const finalScale = mouse.scale;

            const finalStroke = letter.stroke * (1 - mouse.strokeReduce);

            const hiddenTransform =
              `translateY(80px) ` +
              `rotate(${letter.rotate - 15}deg) ` +
              `scale(0.75)`;

            const visibleTransform =
              `translate(${mouse.tx}px, ${mouse.ty}px) ` +
              `rotate(${finalRotate}deg) ` +
              `scale(${finalScale})`;

            const style: CSSProperties = {
              opacity: visible ? 1 : 0,

              transform: visible ? visibleTransform : hiddenTransform,

              transitionProperty:
                "transform, opacity, border-radius, -webkit-text-stroke-width, color, -webkit-text-fill-color",

              transitionDuration: visible ? `${letter.duration}s` : "0.85s",

              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",

              transitionDelay: "0s",

              WebkitTextStroke: `${finalStroke}px ${letter.color}`,

              WebkitTextFillColor: letter.color,

              color: letter.color,

              borderRadius: mouse.borderRadius,

              transformOrigin: "50% 70%",

              willChange:
                "transform, opacity, border-radius, -webkit-text-stroke-width",
            };

            if (letter.char === "\n") {
              return (
                <div
                  key={`${letter.char}-${index}`}
                  data-letter={index}
                  className="w-full basis-full h-8 max-[900px]:h-6 max-[600px]:h-4 m-0 p-0 border-0"
                />
              );
            }

            return (
              <span
                key={`${letter.char}-${index}`}
                data-letter={index}
                aria-hidden="true"
                className="
                  inline-block
                  m-0
                  border-0
                  p-0
                "
                style={style}
              >
                {letter.char}
              </span>
            );
          })}
        </div>
      </section>
    </main>
  );
}
