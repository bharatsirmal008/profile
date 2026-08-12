import React from "react";

interface RobotLoaderProps {
  /** Show the loader. When false, nothing is rendered. */
  isLoading: boolean;
  /** Whether the robot is thinking (shows speech bubble). Default true. */
  isThinking?: boolean;
  /** Whether the robot is speaking (animates mouth). Default false. */
  isSpeaking?: boolean;
  /** Size in pixels for the robot's width. Height scales proportionally. Default 180. */
  size?: number;
  /** Optional label shown under the robot, e.g. "Thinking..." */
  label?: string;
}

/**
 * RobotLoader
 * An animated robot mascot used as a loading indicator while waiting for an AI response.
 * The robot floats, blinks, and shows a speech bubble with animated dots.
 *
 * Usage:
 *   const [isLoading, setIsLoading] = useState(false);
 *   ...
 *   <RobotLoader isLoading={isLoading} label="Getting your answer..." />
 */
const RobotLoader: React.FC<RobotLoaderProps> = ({
  isLoading,
  isThinking = true,
  isSpeaking = false,
  size = 180,
  label,
}) => {
  if (!isLoading) return null;

  const height = (size / 240) * 340;

  return (
    <div style={styles.wrapper}>
      <svg
        width={size}
        height={height}
        viewBox="0 0 240 340"
        role="img"
        aria-label="Loading"
      >
        <title>Loading</title>
        <desc>An animated robot mascot indicating the AI is generating a response.</desc>

        <g id="bot" style={styles.floatGroup}>
          <ellipse cx="120" cy="316" rx="46" ry="8" fill="#0c2a38" opacity="0.12" />

          {/* legs */}
          <rect x="86" y="230" width="30" height="52" rx="14" fill="#5f93ae" />
          <rect x="124" y="230" width="30" height="52" rx="14" fill="#5f93ae" />
          <rect x="86" y="264" width="30" height="16" rx="6" fill="#16303f" />
          <rect x="124" y="264" width="30" height="16" rx="6" fill="#16303f" />

          {/* body */}
          <rect x="80" y="146" width="80" height="98" rx="34" fill="#5f93ae" />
          <rect x="80" y="182" width="80" height="8" fill="#16303f" opacity="0.5" />
          <circle cx="120" cy="204" r="7" fill="#16303f" />

          {/* arms */}
          <rect x="52" y="150" width="26" height="60" rx="13" fill="#4f7d97" />
          <circle cx="65" cy="150" r="14" fill="#456f86" />
          <rect x="162" y="150" width="26" height="60" rx="13" fill="#4f7d97" />
          <circle cx="175" cy="150" r="14" fill="#456f86" />

          {/* head */}
          <rect x="60" y="24" width="120" height="126" rx="48" fill="#5f93ae" />
          <rect x="46" y="52" width="18" height="34" rx="9" fill="#4f7d97" />
          <rect x="176" y="52" width="18" height="34" rx="9" fill="#4f7d97" />
          <rect x="80" y="44" width="80" height="70" rx="18" fill="#10222c" />

          {/* eyes */}
          <g id="eyes" style={styles.eyes}>
            <ellipse cx="102" cy="78" rx="10" ry="12" fill="#7fe8ff" />
            <ellipse cx="138" cy="78" rx="10" ry="12" fill="#7fe8ff" />
          </g>

          {/* smile */}
          <path
            d="M100 96 Q120 106 140 96"
            stroke="#7fe8ff"
            strokeWidth={3.5}
            fill="none"
            strokeLinecap="round"
          >
            {isSpeaking && (
              <animate
                attributeName="d"
                values="M100 96 Q120 106 140 96; M100 96 Q120 115 140 96; M100 96 Q120 106 140 96"
                dur="0.3s"
                repeatCount="indefinite"
              />
            )}
          </path>
        </g>

        {/* speech bubble */}
        {isThinking && (
          <g style={styles.bubbleGroup}>
            <path
              d="M182 20 h48 a10 10 0 0 1 10 10 v22 a10 10 0 0 1 -10 10 h-6 l-10 12 v-12 h-32 a10 10 0 0 1 -10 -10 v-22 a10 10 0 0 1 10 -10 z"
              fill="#f4f2ec"
            />
            <circle cx="196" cy="41" r="4" fill="#5f93ae" style={{ ...styles.dot, animationDelay: "0s" }} />
            <circle cx="208" cy="41" r="4" fill="#5f93ae" style={{ ...styles.dot, animationDelay: "0.2s" }} />
            <circle cx="220" cy="41" r="4" fill="#5f93ae" style={{ ...styles.dot, animationDelay: "0.4s" }} />
          </g>
        )}
      </svg>

      {label && <p style={styles.label}>{label}</p>}

      <style>{`
        @keyframes robot-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-11px); } }
        @keyframes bubble-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes dot-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        @keyframes eye-blink { 0%, 92%, 100% { transform: scaleY(1); } 96% { transform: scaleY(0.1); } }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: "1.5rem 0",
  },
  floatGroup: {
    animation: "robot-float 3.2s ease-in-out infinite",
    transformOrigin: "120px 320px",
  },
  bubbleGroup: {
    animation: "bubble-float 3.2s ease-in-out infinite",
    transformOrigin: "200px 50px",
  },
  eyes: {
    animation: "eye-blink 4s ease-in-out infinite",
    transformOrigin: "120px 78px",
  },
  dot: {
    animation: "dot-pulse 1.2s ease-in-out infinite",
  },
  label: {
    fontSize: 14,
    color: "#5f6b73",
    margin: 0,
  },
};

export default RobotLoader;
