# Modern Animated Landing Page

A production-ready, animated landing page built with React, Framer Motion, and Tailwind CSS v4, inspired by Usemotion's design.

## Features

### Core Features
- ✨ Smooth scroll-based animations that trigger as sections enter viewport
- 🎨 Animated hero section with floating/moving elements and gradient backgrounds
- 🖼️ Product demo animations showing UI interactions with tab switching
- 🌊 Smooth transitions between sections with fade-in/slide-up effects
- 📱 Fully responsive design optimized for mobile, tablet, and desktop
- ⚡ Performance-optimized with lazy loading and efficient re-renders

### Animation Features
- **Hero Section**: Animated gradient backgrounds with floating particle effects
- **Floating Cards**: Parallax-enabled floating UI elements with depth
- **Text Animations**: Fade-in and slide-up effects on scroll
- **Product Screenshots**: Interactive tab-based demo visualization
- **Hover Effects**: Subtle hover animations on interactive elements
- **Smooth Page Transitions**: Framer Motion-powered route animations

### Technical Stack
- **React 18.2.0**: Modern React with hooks and functional components
- **Framer Motion 12.x**: Professional-grade animation library
- **Tailwind CSS 4.x**: Utility-first CSS framework with custom theme
- **TypeScript Support**: Type-safe props and interfaces
- **Custom Hooks**: Reusable animation and scroll detection hooks

## Project Structure

```
frontend/src/
├── components/
│   └── landing/
│       ├── Navbar.jsx          # Sticky navigation with glassmorphism
│       ├── HeroSection.jsx     # Animated hero with floating cards
│       ├── FeaturesSection.jsx # Feature grid with hover effects
│       ├── ProductDemoSection.jsx # Interactive product demo
│       ├── TestimonialsSection.jsx # Social proof with floating cards
│       ├── CTASection.jsx      # Call-to-action with gradients
│       └── Footer.jsx          # Footer with newsletter signup
├── hooks/
│   └── useScrollAnimation.js   # Custom scroll & parallax hooks
├── pages/
│   └── LandingPage.jsx         # Main landing page composition
└── index.css                   # Tailwind config & custom styles
```

## Component Documentation

### 1. HeroSection
The hero section features:
- Animated gradient background with moving blobs
- Floating card elements with statistics and metrics
- Parallax effect on scroll
- CTA buttons with micro-interactions
- Responsive layout for all screen sizes

**Props**: None (self-contained)

### 2. FeaturesSection
Feature showcase with:
- Grid layout of feature cards
- Scroll-triggered animations (staggered)
- Hover effects with scale and shadow transitions
- Icon animations on hover
- Responsive grid (1-3 columns)

**Props**: None (self-contained)

### 3. ProductDemoSection
Interactive product demonstration:
- Tab-based UI switcher
- Animated transitions between demo states
- Mock browser chrome for context
- Real-time execution visualization
- Integration showcase grid

**Props**: None (self-contained)

### 4. TestimonialsSection
Social proof section featuring:
- Floating testimonial cards
- Scroll-triggered entrance animations
- 5-star rating animations
- Statistics counter
- Gradient decorative elements

**Props**: None (self-contained)

### 5. CTASection
Final call-to-action with:
- Animated gradient background
- Floating shape decorations
- Trust indicators
- Multiple CTA options
- Wave decoration at bottom

**Props**: None (self-contained)

### 6. Navbar
Sticky navigation bar with:
- Glassmorphism effect on scroll
- Mobile hamburger menu
- Smooth scroll to sections
- Logo animation
- Responsive breakpoints

**Props**: None (self-contained)

### 7. Footer
Comprehensive footer with:
- Multi-column layout
- Social media links
- Newsletter signup
- Sitemap links
- Legal links

**Props**: None (self-contained)

## Custom Hooks

### useScrollAnimation
Detects when elements enter the viewport for scroll-triggered animations.

```javascript
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const [ref, isVisible] = useScrollAnimation(0.2); // 20% threshold

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 50 }}
  animate={isVisible ? { opacity: 1, y: 0 } : {}}
>
  Content
</motion.div>
```

**Parameters**:
- `threshold` (number): Intersection observer threshold (0-1)

**Returns**:
- `ref`: Ref to attach to element
- `isVisible`: Boolean indicating visibility state

### useParallax
Creates parallax scroll effects for elements.

```javascript
import { useParallax } from '../hooks/useScrollAnimation';

const parallaxOffset = useParallax(0.5); // 50% speed

<div style={{ transform: `translateY(${parallaxOffset}px)` }}>
  Parallax Content
</div>
```

**Parameters**:
- `speed` (number): Parallax speed multiplier

**Returns**:
- `offset` (number): Pixel offset based on scroll position

## Styling & Theme

### Color Palette
The landing page uses a purple-blue gradient theme:

```css
Primary Colors:
- primary-50 to primary-900 (Blue shades)
- accent-50 to accent-900 (Purple shades)

Gradients:
- from-primary-600 to-accent-600 (Main gradient)
- from-primary-500 to-primary-700 (Buttons)
```

### Custom Utilities

#### .text-gradient
Creates animated gradient text:
```jsx
<h1 className="text-gradient animate-gradient">
  Gradient Text
</h1>
```

#### .glass-effect
Glassmorphism effect with backdrop blur:
```jsx
<div className="glass-effect">
  Glass Content
</div>
```

#### .animate-gradient
Animated moving gradient:
```jsx
<div className="bg-gradient-to-r from-primary-600 to-accent-600 animate-gradient">
  Animated Background
</div>
```

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Performance Optimizations

### 1. Intersection Observer
All scroll animations use the Intersection Observer API for better performance:
- No scroll event listeners
- Efficient viewport detection
- Automatic cleanup

### 2. Framer Motion Optimization
```javascript
// Use will-change for animated properties
animate={{ y: 0 }}
transition={{ duration: 0.6 }}
```

### 3. Image Optimization
- Use emoji/icons instead of images where possible
- Lazy load images (ready for implementation)
- Optimize SVGs

### 4. Code Splitting
- Components are lazily imported
- Route-based code splitting ready
- Dynamic imports for heavy components

## Accessibility

### Features
- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Color contrast compliance (WCAG AA)
- Reduced motion support (ready for implementation)

### Reduced Motion
Add this to index.css for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 13+
- Chrome Mobile: Latest

## Development

### Running Locally
```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm start

# Runs on http://localhost:3000
```

### Building for Production
```bash
# Create optimized build
npm run build

# Output in frontend/build/
```

### Environment Variables
No environment variables required for the landing page.

## Customization Guide

### Changing Colors
Update the color theme in `src/index.css`:

```css
@theme {
  --color-primary-600: #4a54e8;  /* Your primary color */
  --color-accent-600: #c026d3;   /* Your accent color */
}
```

### Modifying Content
1. **Hero Text**: Edit `components/landing/HeroSection.jsx`
2. **Features**: Update feature array in `FeaturesSection.jsx`
3. **Testimonials**: Modify testimonials array in `TestimonialsSection.jsx`
4. **Navigation Links**: Update navLinks in `Navbar.jsx`

### Adding New Sections
1. Create component in `components/landing/`
2. Import in `pages/LandingPage.jsx`
3. Add between existing sections
4. Apply scroll animations using `useScrollAnimation` hook

Example:
```javascript
import NewSection from '../components/landing/NewSection';

<main>
  <HeroSection />
  <FeaturesSection />
  <NewSection /> {/* New section */}
  <ProductDemoSection />
</main>
```

### Animation Timing
Adjust animation timing in components:

```javascript
// Faster animations
transition={{ duration: 0.3 }}

// Slower, smoother animations
transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}

// Delayed animations
transition={{ delay: 0.5, duration: 0.6 }}
```

## Troubleshooting

### Animations Not Working
1. Check Framer Motion is installed: `npm list framer-motion`
2. Verify IntersectionObserver support in browser
3. Check console for JavaScript errors

### Tailwind Classes Not Applied
1. Verify postcss.config.js has `@tailwindcss/postcss`
2. Check index.css has `@import "tailwindcss";`
3. Restart development server after config changes

### Performance Issues
1. Reduce number of animated elements
2. Increase IntersectionObserver threshold
3. Disable parallax on mobile
4. Use CSS transforms (not position properties)

## Production Checklist

- [ ] Test on multiple devices and browsers
- [ ] Verify all animations work smoothly
- [ ] Check responsive design breakpoints
- [ ] Test keyboard navigation
- [ ] Validate HTML and accessibility
- [ ] Optimize images and assets
- [ ] Test loading performance (Lighthouse)
- [ ] Review and optimize bundle size
- [ ] Enable production builds
- [ ] Configure CDN for static assets
- [ ] Set up analytics tracking
- [ ] Add meta tags for SEO
- [ ] Test social media previews

## Future Enhancements

### Planned Features
- [ ] Dark mode support
- [ ] Internationalization (i18n)
- [ ] A/B testing framework
- [ ] Advanced analytics integration
- [ ] Video backgrounds
- [ ] 3D animations with Three.js
- [ ] Scroll progress indicator
- [ ] Mouse parallax effects
- [ ] Interactive animations on hover
- [ ] Lottie animation support

### Performance Improvements
- [ ] Implement lazy loading for images
- [ ] Add service worker for offline support
- [ ] Optimize font loading
- [ ] Implement code splitting per section
- [ ] Add loading skeleton screens

## Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

### Inspiration
- [Usemotion.com](https://usemotion.com)
- [Stripe.com](https://stripe.com)
- [Linear.app](https://linear.app)

## License

This landing page is part of the SWEMT_02 project. All rights reserved.

## Support

For questions or issues, please open an issue in the GitHub repository.

---

**Built with** ❤️ **using React, Framer Motion, and Tailwind CSS**
