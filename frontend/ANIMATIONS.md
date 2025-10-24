# Animation Components Documentation

This document provides a comprehensive guide to all the advanced animation components and hooks available in the frontend application, inspired by modern, polished designs like usemotion.com.

## Table of Contents
1. [Custom Hooks](#custom-hooks)
2. [Animation Components](#animation-components)
3. [Micro-Interactions](#micro-interactions)
4. [Usage Examples](#usage-examples)

---

## Custom Hooks

### `useMagneticEffect(strength)`
Creates a magnetic cursor effect where elements are attracted to the cursor.

**Parameters:**
- `strength` (number, default: 0.3) - Intensity of the magnetic pull

**Returns:** A ref to attach to your element

**Example:**
```jsx
import { useMagneticEffect } from '../hooks/useMagneticEffect';

const MyComponent = () => {
  const magneticRef = useMagneticEffect(0.4);

  return <button ref={magneticRef}>Hover me!</button>;
};
```

---

### `useCountUp(end, duration, decimals)`
Animates a number from 0 to a target value when the element comes into view.

**Parameters:**
- `end` (number) - Target number to count up to
- `duration` (number, default: 2000) - Animation duration in milliseconds
- `decimals` (number, default: 0) - Number of decimal places

**Returns:** `[ref, count]` - Ref to attach to container and the current count value

**Example:**
```jsx
import { useCountUp } from '../hooks/useCountUp';

const StatsCard = () => {
  const [ref, count] = useCountUp(10000, 2500, 0);

  return (
    <div ref={ref}>
      <h2>{count}+</h2>
      <p>Happy Users</p>
    </div>
  );
};
```

---

### `use3DTilt(maxTilt, perspective)`
Creates a 3D tilt effect based on mouse position over the element.

**Parameters:**
- `maxTilt` (number, default: 15) - Maximum tilt angle in degrees
- `perspective` (number, default: 1000) - CSS perspective value

**Returns:** A ref to attach to your element

**Example:**
```jsx
import { use3DTilt } from '../hooks/use3DTilt';

const Card3D = () => {
  const tiltRef = use3DTilt(10, 1200);

  return (
    <div ref={tiltRef} className="card">
      3D Tilt Card
    </div>
  );
};
```

---

## Animation Components

### `TextRevealByWord`
Reveals text word by word with a staggered animation.

**Props:**
- `text` (string) - The text to animate
- `className` (string) - Additional CSS classes
- `delay` (number, default: 0) - Delay before animation starts

**Example:**
```jsx
import { TextRevealByWord } from '../components/animations/TextReveal';

<TextRevealByWord
  text="Welcome to AgentGarden"
  className="text-4xl font-bold"
  delay={0.2}
/>
```

---

### `TextRevealByCharacter`
Reveals text character by character with a staggered animation.

**Props:**
- `text` (string) - The text to animate
- `className` (string) - Additional CSS classes
- `delay` (number, default: 0) - Delay before animation starts

**Example:**
```jsx
import { TextRevealByCharacter } from '../components/animations/TextReveal';

<TextRevealByCharacter
  text="Amazing!"
  className="text-2xl"
/>
```

---

### `TextSlideUp`
Slides text up from below with a smooth reveal.

**Props:**
- `text` (string) - The text to animate
- `className` (string) - Additional CSS classes
- `delay` (number, default: 0) - Delay before animation starts

---

### `TextGradientReveal`
Reveals text with an animated gradient sweep effect.

**Props:**
- `text` (string) - The text to animate
- `className` (string) - Additional CSS classes
- `delay` (number, default: 0) - Delay before animation starts

---

### `MagneticButton`
A button component that gets magnetically attracted to the cursor.

**Props:**
- `children` (ReactNode) - Button content
- `className` (string) - CSS classes
- `strength` (number, default: 0.4) - Magnetic pull strength
- `onClick` (function) - Click handler
- `...props` - Any other button props

**Example:**
```jsx
import MagneticButton from '../components/animations/MagneticButton';

<MagneticButton
  className="px-8 py-4 bg-primary-600 text-white rounded-xl"
  strength={0.3}
  onClick={() => console.log('Clicked!')}
>
  Get Started
</MagneticButton>
```

---

### `BlobBackground`
Animated liquid/blob background with organic flowing shapes.

**Props:**
- `className` (string) - Additional CSS classes

**Example:**
```jsx
import BlobBackground from '../components/animations/BlobBackground';

<section className="relative">
  <BlobBackground />
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</section>
```

---

### `StaggeredGrid`
Animates grid items with cascading delays for a staggered effect.

**Props:**
- `children` (ReactNode) - Grid items to animate
- `className` (string) - CSS classes for the grid container
- `staggerDelay` (number, default: 0.1) - Delay between each item
- `animationVariant` (string) - Animation type: 'fadeUp', 'fadeIn', 'scale', 'slideLeft', 'slideRight', 'rotate'

**Example:**
```jsx
import StaggeredGrid from '../components/animations/StaggeredGrid';

<StaggeredGrid
  className="grid grid-cols-3 gap-6"
  staggerDelay={0.15}
  animationVariant="fadeUp"
>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</StaggeredGrid>
```

---

## Micro-Interactions

### `RippleButton`
Button with a ripple effect on click.

**Example:**
```jsx
import { RippleButton } from '../components/animations/MicroInteractions';

<RippleButton
  className="px-6 py-3 bg-blue-600 text-white rounded-lg"
  onClick={() => alert('Clicked!')}
>
  Click Me
</RippleButton>
```

---

### `ShimmerCard`
Card with a shimmer effect on hover.

**Example:**
```jsx
import { ShimmerCard } from '../components/animations/MicroInteractions';

<ShimmerCard className="p-6 bg-white rounded-xl shadow-lg">
  <h3>Shimmer on Hover</h3>
</ShimmerCard>
```

---

### `BounceIcon`
Icon that bounces on hover.

**Example:**
```jsx
import { BounceIcon } from '../components/animations/MicroInteractions';

<BounceIcon>
  <svg>...</svg>
</BounceIcon>
```

---

### `PulseIndicator`
Animated pulsing indicator (useful for "live" or "active" status).

**Example:**
```jsx
import { PulseIndicator } from '../components/animations/MicroInteractions';

<div className="flex items-center gap-2">
  <PulseIndicator />
  <span>Live Now</span>
</div>
```

---

### `GlowCard`
Card with a glowing border effect on hover.

**Example:**
```jsx
import { GlowCard } from '../components/animations/MicroInteractions';

<GlowCard className="p-8 bg-white rounded-2xl">
  <h3>Glowing Border on Hover</h3>
</GlowCard>
```

---

### `FloatingElement`
Element that floats with a gentle up-and-down animation.

**Props:**
- `intensity` (number, default: 10) - Float distance in pixels

**Example:**
```jsx
import { FloatingElement } from '../components/animations/MicroInteractions';

<FloatingElement intensity={15}>
  <img src="icon.png" alt="Floating icon" />
</FloatingElement>
```

---

### `RevealOnHover`
Shows hidden content when hovering over an element.

**Props:**
- `children` - Default visible content
- `revealContent` - Content to show on hover

**Example:**
```jsx
import { RevealOnHover } from '../components/animations/MicroInteractions';

<RevealOnHover
  revealContent={<p>Hidden Message!</p>}
>
  <p>Hover to reveal</p>
</RevealOnHover>
```

---

### `StaggerChildren`
Animates children with staggered fade-in effect.

**Example:**
```jsx
import { StaggerChildren } from '../components/animations/MicroInteractions';

<StaggerChildren>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</StaggerChildren>
```

---

## Usage Examples

### Complete Example: Animated Stats Section

```jsx
import React from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { use3DTilt } from '../hooks/use3DTilt';
import { motion } from 'framer-motion';

const StatCard = ({ value, label }) => {
  const [countRef, count] = useCountUp(value, 2500);
  const tiltRef = use3DTilt(10, 1200);

  return (
    <motion.div
      ref={countRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div ref={tiltRef} className="p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-5xl font-bold text-gradient">{count}+</h2>
        <p className="text-gray-600">{label}</p>
      </div>
    </motion.div>
  );
};

const StatsSection = () => (
  <section className="py-24">
    <div className="grid grid-cols-4 gap-8">
      <StatCard value={10000} label="Users" />
      <StatCard value={50000} label="Workflows" />
      <StatCard value={99.9} label="Uptime %" />
      <StatCard value={2500000} label="Tasks Automated" />
    </div>
  </section>
);
```

---

### Complete Example: Hero Section with Multiple Animations

```jsx
import React from 'react';
import { TextRevealByWord } from '../components/animations/TextReveal';
import MagneticButton from '../components/animations/MagneticButton';
import BlobBackground from '../components/animations/BlobBackground';

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center">
    <BlobBackground />

    <div className="container mx-auto px-6 relative z-10">
      <h1 className="text-6xl font-bold mb-6">
        <TextRevealByWord text="Build AI Agents in Minutes" />
      </h1>

      <div className="flex gap-4">
        <MagneticButton
          className="px-8 py-4 bg-primary-600 text-white rounded-xl"
          strength={0.3}
        >
          Get Started
        </MagneticButton>

        <MagneticButton
          className="px-8 py-4 bg-white border border-gray-300 rounded-xl"
          strength={0.25}
        >
          Watch Demo
        </MagneticButton>
      </div>
    </div>
  </section>
);
```

---

## Best Practices

1. **Performance**: Use animations sparingly and avoid animating too many elements simultaneously
2. **Accessibility**: Respect `prefers-reduced-motion` for users who prefer minimal animations
3. **Mobile**: Some effects (like magnetic buttons) work best on desktop; consider disabling or modifying for mobile
4. **Timing**: Use consistent easing functions (e.g., `[0.22, 1, 0.36, 1]`) for a cohesive feel
5. **Viewport**: Use `whileInView` or `useInView` hooks to trigger animations only when elements are visible

---

## Dependencies

- `framer-motion` - Core animation library
- `react-intersection-observer` - For scroll-triggered animations

---

## Contributing

When adding new animation components:
1. Create the component in `/components/animations/`
2. Export it in `/components/animations/index.js`
3. Document it in this file with examples
4. Include TypeScript types if applicable
