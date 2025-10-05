# Design Guidelines: Hyper-Animated Luxury Curtain Portfolio

## Design Approach

**Selected Approach:** Reference-Based (Luxury Portfolio Hybrid)
- Primary inspiration: High-end fashion portfolios (Net-a-Porter, Burberry) meets architectural showcase sites
- Secondary influence: Apple's refined minimalism for UI elements
- Core principle: Treat digital fabric presentation with same luxury as physical curtains

## Core Design Principles

1. **"The Fabric Unveiled"** - Every interaction mimics the tactile experience of handling luxury fabrics
2. **Content-Forward Minimalism** - Design elements recede, letting curtain imagery dominate
3. **Motion as Narrative** - Animations tell the story of fabric quality and craftsmanship
4. **Tactile Luxury** - Create an almost physical sense of material interaction

## Color Palette

**Primary Colors (Dark Mode Focused):**
- Background: Deep charcoal to pure black (0 0% 8% to 0 0% 0%)
- Surface: Subtle elevation with 0 0% 12% to 0 0% 15%

**Accent & Metallic:**
- Brushed Brass highlights: 38 45% 65%
- Matte Black interactive elements: 0 0% 10%
- Polished Chrome accents: 210 15% 75%

**Text:**
- Primary: 0 0% 98% (near white)
- Secondary: 0 0% 70% (muted)
- Tertiary: 0 0% 50% (subtle)

## Typography

**Font Pairing:**
- Headlines: Modern geometric serif (e.g., PP Editorial, Alike Angular) - dramatic weight variation (300-700)
- Body: Lightweight sans-serif (e.g., Inter, Satoshi) - 300-400 weights
- Display sizes: text-6xl to text-8xl for hero statements
- Body: text-sm to text-base for readability

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 8, 12, 16, 24, 32 (minimal set for rhythm)
- Mobile padding: p-4 to p-8
- Desktop padding: p-12 to p-32
- Section gaps: gap-8 to gap-16
- Generous negative space is key

**Grid Structure:**
- Masonry-style portfolio grids (not uniform)
- Asymmetric layouts preferred over centered
- Full-bleed images with contained text overlays

## Advanced Animation Framework

### The "Drape Effect" (Primary Transition)
**Vertical Pleat/Gather:** Outgoing image collapses inward forming vertical pleats, revealing next image underneath
**Horizontal Swipe with Texture Warp:** Image distorts mimicking fabric stretch during swipe transition
**Curtain Draw Motion:** New image pushes old one with realistic curtain-drawing physics

### Micro-Interactions
- Thumbnail expansion: Fluid growth from grid to full-screen
- Tap feedback: Subtle glow or metallic sheen (50-100ms duration)
- Scroll indicators: Animated progress lines/dots
- Navigation transforms: Fan-out or morph animations

### Scroll-Triggered Reveals
- Fabric swatch pull-out from side
- Hardware hotspot reveals with zoom
- Text blocks cascade into view
- Timeline drawing animation

## Page Structure Specifications

### Home Page: The Grand Unveil
- **Hero:** Full-screen high-def video loop or ultra-slow curtain reveal sequence
- **Animated Headline:** Individual letters drop with subtle light reflection
- **Signature Collection:** 3-5 hero projects, each takes over screen on scroll with Drape Effect transitions
- **Curtain Type Explorer:** Interactive icons that morph hero image on tap
- **Sticky CTA:** Animated "Explore Portfolio" or "Book Consultation" button

### Portfolio Gallery
- **Dynamic Masonry Grid:** Subtle breathing micro-animations on thumbnails
- **Swipe Filters:** Horizontal scrollable ribbon, tap triggers cascading grid rearrangement
- **Endless Scroll:** Graceful pre-loaded item animations
- **Drape Effect:** Primary navigation between projects

### Project Detail Page
- **Hero:** Full-screen curtain image with subtle breathing parallax background
- **Interactive Elements:**
  - Before/After slider with refined horizontal drag
  - Fabric visualizer (tap to change opacity/lighting)
  - Hardware hotspots with zoom pop-overs
- **Image Carousel:** Room views, textures, details with Drape transitions
- **Similar Projects:** Horizontal scroll carousel at bottom

### Process Timeline
- **Vertical Interactive Timeline:** Central animated line draws as user scrolls
- **Illustrated Stages:** Consultation → Design → Fabrication → Installation → Aftercare
- **Micro-Animations:** Icons animate on viewport entry

## Component Library

**Navigation:**
- Floating bottom bar (mobile-first)
- Fan-out or morph animations
- Minimal icon set with elegant transforms

**Buttons/CTAs:**
- Soft glow on interaction
- Metallic sheen animation
- Slight 'push' effect (2-3px transform)

**Cards/Thumbnails:**
- Continuous micro-breathing scale (1-1.02)
- Gentle shimmer overlay
- Expand animation to detail view

**Overlays:**
- Backdrop blur for buttons over images
- Semi-transparent panels: backdrop-blur-xl bg-black/30
- Fade-in with slide animations

## Images

**Hero Section:** Yes - Full-screen luxury curtain installation
- High-resolution curtain close-up with dramatic lighting
- Subtle fabric texture detail visible
- Soft natural light filtering through (dawn/dusk aesthetic)

**Portfolio Grid:** 8-12 high-quality curtain installation images
- Mix of full room shots and detail close-ups
- Varied compositions (vertical/horizontal)
- Professional interior photography aesthetic

**Detail Pages:** Multiple views per project
- Room context shot
- Fabric texture macro
- Hardware close-up
- Installation process or motorization

**Process Page:** Illustrated journey or product photography for each stage

## Performance & Experience

- **Target:** 60fps animations on mobile devices
- **Tech Stack Hints:** GSAP for complex animations, CSS transforms for simple ones, lazy loading essential
- **Gesture Control:** Swipe, tap, long-press, diagonal swipe to close
- **Haptic Feedback:** Optional subtle vibrations on key interactions
- **Accessibility:** Animation toggle, keyboard navigation for all features

## Critical UX Mandates

1. Every interaction provides immediate visual feedback
2. Drape Effect is the signature transition - use consistently
3. No standard fades/slides - every animation has fabric metaphor
4. Information revealed progressively through scroll
5. Mobile gestures feel natural and intuitive
6. Loading states maintain luxury aesthetic (elegant skeleton screens)