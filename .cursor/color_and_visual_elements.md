# Color Palette and Visual Elements Specification

## Primary Color Palette

### Deep Blue (#10214b)
- **Usage**: Primary color for headers, navigation bars, and major UI elements
- **Psychological Association**: Professionalism, trust, stability, depth
- **Application**:
  - Main navigation background
  - Section headers
  - Footer background
  - Text highlight backgrounds

### Gold (#d7bd88)
- **Usage**: Accent color for highlights, interactive elements, and decorative features
- **Psychological Association**: Excellence, achievement, premium quality
- **Application**:
  - Call-to-action buttons
  - Scroll indicators
  - Progress bars
  - Decorative lines and borders
  - Hover states for primary elements

### Dust (#d03c3ba)
- **Usage**: Secondary accent for supporting elements and contrast areas
- **Psychological Association**: Sophistication, subtlety, warmth
- **Application**:
  - Secondary buttons
  - Background elements
  - Alternative hover states
  - Form element focus states

### Off-White (#ebe7e1)
- **Usage**: Base color for backgrounds and text areas
- **Psychological Association**: Clarity, space, premium paper quality
- **Application**:
  - Main content background
  - Text content areas
  - Card backgrounds
  - Form fields

## Extended Color Usage

### Gradients
- **Primary Gradient**: Linear gradient from #10214b to a slightly lighter blue (#1a3366)
  - Used for: Hero section background, call-to-action buttons
- **Accent Gradient**: Linear gradient from #d7bd88 to a slightly darker gold (#c5aa75)
  - Used for: Highlight areas, interactive elements

### Transparency Values
- Deep Blue with 80% opacity (#10214bd0) for overlay elements
- Gold with 20% opacity (#d7bd8833) for subtle background patterns
- Dust with 50% opacity (#d03c3b80) for hover effects

## Typography Color Application

- **Primary Headers**: Deep Blue (#10214b)
- **Secondary Headers**: Deep Blue (#10214b) with Gold accents
- **Body Text**: Dark gray (#333333) for optimal readability
- **Links**: Gold (#d7bd88) with Deep Blue hover state
- **Highlighted Text**: Deep Blue background with Off-White text
- **Secondary Text**: Medium gray (#666666) for captions and supporting text

## Pattern and Texture Specifications

### Geometric Patterns
- **Grid Pattern**: Fine-line gold grid on deep blue backgrounds (20x20px base unit)
- **Diagonal Lines**: Subtle gold diagonal lines (1px) spaced 40px apart at 45° angle
- **Squared Elements**: Modular squares ranging from 10x10px to 100x100px in repeating patterns
- **Abstract Shapes**: Angular polygons derived from square foundations

### Texture Applications
- **Noise Texture**: Subtle grain effect (2% opacity) applied to off-white backgrounds
- **Paper Texture**: Very subtle texture for off-white areas to avoid flat digital feel
- **Material Contrast**: CSS-based subtle lighting effects to simulate premium materials

## Interactive Element Specifications

### Buttons
- **Primary Buttons**: 
  - Background: Gold (#d7bd88)
  - Text: Deep Blue (#10214b)
  - Border: None
  - Hover: 10% darker gold (#c2a977)
  - Radius: 0px (square corners)

- **Secondary Buttons**:
  - Background: Transparent
  - Text: Gold (#d7bd88)
  - Border: 1px solid Gold (#d7bd88)
  - Hover: Gold background with Deep Blue text
  - Radius: 0px (square corners)

### Navigation Elements
- **Main Navigation**:
  - Background: Deep Blue (#10214b)
  - Text: Off-White (#ebe7e1)
  - Active Item: Gold underline
  - Hover: Gold text color
  
- **Secondary Navigation**:
  - Background: Off-White (#ebe7e1)
  - Text: Deep Blue (#10214b)
  - Active Item: Gold text
  - Hover: 10% darker off-white background

### Form Elements
- **Input Fields**:
  - Background: Off-White (#ebe7e1)
  - Border: 1px solid Deep Blue (#10214b)
  - Focus: 1px solid Gold (#d7bd88)
  - Text: Dark gray (#333333)
  
- **Select Menus**:
  - Styling consistent with input fields
  - Custom dropdown icon in Gold
  
- **Checkboxes & Radio Buttons**:
  - Custom styling with Gold accent for checked states

## Visual Element Spacing

### Margins and Padding
- **Section Margins**: 120px top/bottom
- **Content Padding**: 60px left/right on desktop, scaling proportionally on smaller screens
- **Element Spacing**: Consistent 30px between major elements, 15px between related elements

### Grid System
- **Base Grid**: 12-column system
- **Gutter**: 30px
- **Breakpoints**:
  - Desktop: 1200px+
  - Tablet: 768px - 1199px
  - Mobile: <768px

## Animation and Transition Specifications

### Timing
- **Quick Interactions**: 200ms
- **Standard Transitions**: 300ms
- **Elaborate Animations**: 500-700ms
- **Easing**: Cubic-bezier(0.25, 0.1, 0.25, 1) for natural motion

### Hover Effects
- Subtle scale transformations (1.05x)
- Color transitions
- Border/underline reveals
- Background color shifts

### Scroll-Triggered Animations
- Fade-in from 20% opacity
- Slide-in from 30px offset
- Reveal effects for content sections
- Parallax effects at 0.2-0.4 ratio

## Iconography

### Style
- Minimalist, geometric line icons
- 2px stroke weight
- Square-based proportions
- Consistent 24x24px base size

### Colors
- Primary: Deep Blue (#10214b)
- Secondary: Gold (#d7bd88)
- Contextual: Varies based on placement

### Animation
- Subtle rotation or scale on hover
- Reveal animations for icon groups
- State changes for interactive icons

## Special Effects

### Shadows
- **Subtle Card Shadow**: 0 4px 6px rgba(0,0,0,0.05)
- **Elevated Elements**: 0 10px 20px rgba(0,0,0,0.1)
- **Text Shadow**: None (for clean, modern appearance)

### Overlay Effects
- Deep Blue overlay at 80% opacity for modal backgrounds
- Gold gradient overlays for feature highlights
- Duotone effects for images (Deep Blue + Gold tinting)

### Background Effects
- Subtle parallax for hero section (0.2 ratio)
- Animated geometric patterns at low opacity
- Gradient transitions on scroll

This color and visual elements specification provides a comprehensive guide for implementing the "expensive materialistic" aesthetic with modern art influences throughout Marco Ruch's portfolio website. The guidelines ensure visual consistency while creating a premium, sophisticated experience that appeals to recruiters and potential employers.
