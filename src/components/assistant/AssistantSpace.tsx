"use client";

import { memo, type CSSProperties } from "react";
import styles from "./Assistant.module.css";

// Fixed positions keep the first client render identical to the server render.
const stars = Array.from({ length: 190 }, (_, i) => ({
  x: ((i * 73 + i * i * 17) % 997) / 9.97,
  y: ((i * 137 + i * i * 11) % 991) / 9.91,
  size: i % 23 === 0 ? 2.5 : i % 5 === 0 ? 1.5 : 0.8,
  delay: -(i % 19),
  duration: 4 + i % 9,
  travel: 14 + i % 22,
  driftX: 12 + i % 29,
  driftY: -(18 + i % 43),
}));

export const AssistantSpace = memo(function AssistantSpace() {
  return (
    <div className={styles.space} aria-hidden="true">
      <div className={styles.nebula} />
      <div className={styles.aurora} />
      <div className={styles.stars}>
        {stars.map((star, i) => <i key={i} style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, "--delay": `${star.delay}s`, "--duration": `${star.duration}s`, "--travel": `${star.travel}s`, "--drift-x": `${star.driftX}px`, "--drift-y": `${star.driftY}px` } as CSSProperties} />)}
      </div>
      <div className={styles.shootingStars}>{[0, 1, 2].map(i => <i key={i} style={{ left: `${18 + i * 26}%`, top: `${8 + i * 11}%`, "--shoot-delay": `${i * 5 + 2}s`, "--shoot-duration": `${15 + i * 4}s` } as CSSProperties} />)}</div>
      <div className={styles.streaks}>{[10, 24, 66, 75, 88].map((left, i) => <i key={left} style={{ left: `${left}%`, animationDelay: `${-i * 3}s` }} />)}</div>
      <div className={styles.horizonGlow} />
      <div className={styles.planet} />
    </div>
  );
});
