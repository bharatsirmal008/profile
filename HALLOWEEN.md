# Halloween wallpaper

The home page uses `src/components/HalloweenAnimation.tsx` inside the existing desktop-style Hero, with “I AM” above “BHARAT SIRMAL,” speed 0.5 and hidden controls. Both lines use bold distressed lettering, and the eyes remain visible throughout the loop. All artwork is inline SVG; no video or image asset is needed.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. Production: `npm run build`, then `npm start`.

Required dependencies are already in package.json: React / React DOM 19, Framer Motion 12, Tailwind CSS 4 and `@tailwindcss/postcss`. This project runs on Next.js 16. The existing global stylesheet imports Tailwind and the Caveat handwritten font; the component also includes system handwriting fallbacks.

## Reuse

```tsx
import { HalloweenAnimation } from "@/components/HalloweenAnimation";

export default function Example() {
  return (
    <HalloweenAnimation
      greeting="Happy"
      title="HALLOWEEN"
      color="#ed151f"
      speed={1}
      controls={true}
      className="min-h-screen"
    />
  );
}
```

`speed` is a playback multiplier (0.5 = 12 seconds, 2 = 3 seconds; maximum 4). Invalid or nonpositive values fall back to 1. Timeline values always refer to the six-second source sequence. Seeking pauses at the selected frame; Play resumes and Replay starts at zero. Instances use unique SVG IDs and independent clocks.

For a clean, responsive 16:9 embed:

```tsx
<HalloweenAnimation controls={false} />
```

Reduced-motion visitors see the full greeting and open eyes at 2.8 seconds. Playback only starts when they select Play or Replay; with controls hidden, this remains a still image. Changes to the system preference are respected until explicit playback is requested.

The SVG eye outline and eyelid paths use matching M/L/Q/Q/Z commands. Edit the path coordinates to change their shape. Distress scratches are deterministic SVG mask cutouts shared by both text lines. Title letters reveal between 0.8 and 2.8 seconds; eyes stay visible through the end; horizontal slice glitches occur during the remaining hold. One Framer Motion clock drives all animation and controls.
