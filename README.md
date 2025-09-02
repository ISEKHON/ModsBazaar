# ModsBazaar - FS22/25 Mods Store 🎮

A modern, gaming-style website for Farming Simulator 22/25 mods with lightning-fast performance, smooth animations, and an immersive user experience.

## ✨ Features

- 🎨 **Gaming-Style UI**: Immersive dark/light theme with neon accents and smooth animations
- ⚡ **Lightning Fast**: Built with Next.js 15 and Turbopack for optimal performance  
- 🎯 **Responsive Design**: Perfectly optimized for all devices and screen sizes
- 🌈 **Smooth Animations**: Powered by Framer Motion for fluid user interactions
- 📱 **Modern Framework**: Next.js 15 with TypeScript and Tailwind CSS
- 🔄 **Theme Switching**: Seamless dark/light mode toggle
- 📤 **Mod Submission**: Direct mod submission system for users
- 🛡️ **Admin Control**: Admin-only upload system for quality control
- 🎨 **Beautiful Loading States**: Engaging loading animations and transitions

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom gaming theme
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme**: Next-themes for dark/light mode
- **UI Components**: Radix UI primitives
- **Build Tool**: Turbopack for fast development

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ModsBazaar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000) (or 3001 if 3000 is in use)

## 📦 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🎨 Design System

### Color Palette
- **Neon Blue**: `#00d4ff` - Primary accent color
- **Neon Purple**: `#8b5cf6` - Secondary accent color
- **Neon Green**: `#00ff88` - Success/highlight color
- **Gaming Dark**: `#0a0a0f` - Primary dark background
- **Gaming Card**: `#1a1a2e` - Card backgrounds

### Typography
- **Gaming Font**: Orbitron (for headings and brand)
- **Display Font**: Inter (for body text)

### Animations
- **Float**: Smooth floating animations for cards
- **Glow**: Neon glow effects on hover
- **Slide**: Smooth slide transitions
- **Fade**: Elegant fade-in animations

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with gaming theme
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Home page
├── components/
│   ├── layout/            # Layout components
│   │   ├── Navbar.tsx     # Navigation with theme toggle
│   │   └── Footer.tsx     # Footer with social links
│   ├── sections/          # Page sections
│   │   ├── Hero.tsx       # Hero section with animations
│   │   ├── FeaturedMods.tsx # Featured mods showcase
│   │   ├── Categories.tsx  # Mod categories grid
│   │   └── SubmissionSection.tsx # Mod submission form
│   └── ui/                # UI components
│       ├── LoadingScreen.tsx # Gaming-style loading screen
│       └── toaster.tsx    # Toast notifications
└── lib/
    └── utils.ts           # Utility functions
```

## 🎮 Features Overview

### Hero Section
- Animated background with floating particles
- Dynamic gradient text effects
- Call-to-action buttons with hover animations
- Feature highlight cards

### Featured Mods
- Card-based layout with hover effects
- Rating and download statistics
- Category and version badges
- Smooth animations on scroll

### Categories
- Interactive category grid
- Icon animations on hover
- Progress bars and statistics
- Smooth hover transitions

### Mod Submission
- Comprehensive submission form
- Real-time validation
- Guidelines and requirements
- Success animations

### Navigation
- Responsive mobile menu
- Theme toggle functionality
- Smooth scroll navigation
- Gaming-style hover effects

## 🎨 Customization

### Adding New Colors
Edit `tailwind.config.js` to add new color variants:

```javascript
colors: {
  neon: {
    cyan: '#00ffff',
    magenta: '#ff00ff',
    // Add more colors
  }
}
```

### Creating New Animations
Add to the animations section in `tailwind.config.js`:

```javascript
animation: {
  'custom-bounce': 'customBounce 2s infinite',
}
```

### Custom Components
Follow the established pattern in `/components` directory with:
- TypeScript interfaces
- Framer Motion animations
- Responsive design
- Gaming theme classes

## 🔧 Development Guidelines

1. **Component Structure**: Use functional components with TypeScript
2. **Styling**: Prefer Tailwind classes with custom gaming theme
3. **Animations**: Use Framer Motion for smooth interactions
4. **Responsiveness**: Mobile-first design approach
5. **Performance**: Optimize images and use Next.js best practices

## 📱 Responsive Breakpoints

- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

## 🌟 Performance Features

- **Turbopack**: Ultra-fast development builds
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting for optimal loading
- **CSS Optimization**: Tailwind CSS purging for minimal bundle size

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch

### Manual Build
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎮 About

ModsBazaar is designed to be the ultimate destination for Farming Simulator mods, combining modern web technologies with a gaming-inspired design to create an engaging and performant user experience.

---

**Made with ❤️ for the farming community**
