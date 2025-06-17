<div align="center">
  <img src="https://i.ibb.co/zhMky0qT/musical-zoe-high-resolution-logo-transparent.png" alt="Musical Zoe Logo" width="400"/>
</div>
<br>

# Musical Zoe Frontend 🎵

A modern, beautiful, and secure SvelteKit frontend for the Musical Zoe music API platform. Built with cutting-edge `Svelte` & `Typescript` and designed for optimal user experience across all devices.

## ✨ Features

### 🎨 **Modern Design System**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Seamless theme switching with user preference persistence
- **Musical Branding**: Vibrant, music-inspired color palette and animations
- **Component-Based Architecture**: Modular, reusable UI components

### 🚀 **Technology Stack**
- **SvelteKit**: Full-stack web framework with SSR/SPA capabilities
- **Svelte 5**: Latest Svelte with runes and modern reactive primitives
- **TypeScript**: Type-safe development with excellent developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **shadcn-svelte**: High-quality, accessible component library
- **mode-watcher**: Robust dark mode implementation

### 🏗️ **Architecture Highlights**
- **Modular Structure**: Organized components by feature and functionality
- **Type Safety**: Full TypeScript coverage for reliable development
- **Modern Patterns**: Uses Svelte 5 runes instead of stores for state management
- **Security First**: Environment-aware configuration and secure API integration
- **Performance Optimized**: Efficient bundling and code splitting

## 🎯 Current Status

### ✅ **Completed Features**
- [x] **Project Setup & Configuration**
  - SvelteKit with TypeScript and Tailwind CSS
  - shadcn-svelte integration with dark mode support
  - Modular folder structure and component organization
  
- [x] **Homepage Components**
  - Hero section with search functionality
  - Features showcase with animated cards
  - Services overview with API information
  - Contact form with validation
  - Footer with branding and links
  
- [x] **Theming System**
  - Complete dark/light mode implementation
  - CSS variables for consistent theming
  - mode-watcher integration for theme persistence
  - Responsive theme toggle in navigation
  
- [x] **UI Components**
  - Header/Navigation with mobile-responsive menu
  - Reusable Button, Card, and Container components
  - Form elements with proper accessibility
  - Icon integration with Lucide Svelte
<br>

### 🚧 **In Development**
- [ ] **Authentication System**
  - User registration and login
  - Protected routes and middleware

- [ ] **API Integration**
  - Music data fetching from backend
  - Search functionality implementation
  - Real-time data updates
  - Error handling and loading states

- [ ] **Dashboard Features**
  - User dashboard with personalized content
  - Music library management
  - Playlist creation and management
  - User preferences and settings

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- npm, pnpm, or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/MusicalZoe-FE.git
   cd MusicalZoe-FE
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── lib/
│   ├── web-components/
│   │   ├── homepage/          # Homepage-specific components
│   │   │   ├── Hero.svelte
│   │   │   ├── Features.svelte
│   │   │   ├── Services.svelte
│   │   │   ├── Contact.svelte
│   │   │   └── Footer.svelte
│   │   └── ui/                # Reusable UI components
│   │       ├── Header.svelte
│   │       ├── Button.svelte
│   │       ├── Card.svelte
│   │       └── Container.svelte
│   ├── utils/                 # Utility functions
│   └── components/            # shadcn-svelte components
├── routes/
│   ├── (home)/               # Homepage route group
│   │   ├── +layout.svelte    # Homepage-specific layout
│   │   └── +page.svelte      # Homepage
│   └── +layout.svelte        # Root layout
├── app.css                   # Global styles and theme variables
└── app.html                  # App shell
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run dev:host     # Start server accessible on network

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Quality
npm run check        # Run type checking
npm run check:watch  # Watch mode type checking
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

### Component Development

This project uses a modular component architecture:

- **Homepage Components** (`src/lib/web-components/homepage/`): Page-specific components
- **UI Components** (`src/lib/web-components/ui/`): Reusable interface elements
- **shadcn Components** (`src/lib/components/ui/`): High-quality component library

### Theming

The project uses CSS variables for theming with shadcn-svelte:

```css
/* Light mode variables */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  /* ... more variables */
}

/* Dark mode variables */
.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  /* ... more variables */
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Backend Repository**: [Musical Zoe Backend](https://github.com/Blue-Davinci/musical-zoe-backend)
- **API Documentation**: [Coming Soon]
- **Design System**: [Coming Soon]
- **Live Demo**: [Coming Soon]

---

<div align="center">
  <p>Built with ❤️ using SvelteKit and modern web technologies</p>
</div>
