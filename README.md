<div align="center">
  <img src="https://i.ibb.co/zhMky0qT/musical-zoe-high-resolution-logo-transparent.png" alt="Musical Zoe Logo" width="400"/>
</div>
<br>

# Musical Zoe Frontend 🎵

A modern, beautiful, and secure SvelteKit frontend for the Musical Zoe music API platform. Built with `Svelte` & `Typescript` and designed for optimal user experience across all devices. A quick deployment.

## ✨ Features

### � **Music Services Integration**

- **Lyrics Search**: Find lyrics and track information with rich metadata
- **Music News**: Latest industry news with advanced filtering capabilities
- **Trending Content**: Real-time trending tracks and artists with analytics
- **Track Information**: Comprehensive song details with album art and stats

### �🎨 **Modern Design System**

- **Professional Dashboard**: Beautiful, modular dashboard with intelligent layout
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Seamless theme switching with user preference persistence
- **Musical Branding**: Vibrant, music-inspired color palette and animations
- **Component-Based Architecture**: Modular, reusable UI components
- **Smart Grid Layout**: Eliminates awkward layouts on all screen sizes

### 🚀 **Technology Stack**

- **SvelteKit**: Full-stack web framework with SSR/SPA capabilities
- **Svelte 5**: Latest Svelte with runes and modern reactive primitives
- **TypeScript**: Type-safe development with excellent developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **shadcn-svelte**: High-quality, accessible component library
- **mode-watcher**: Robust dark mode implementation

### 🏗️ **Architecture Highlights**

- **Server-Side API Proxies**: Secure authentication and API integration
- **Modular Structure**: Organized components by feature and functionality
- **Type Safety**: Full TypeScript coverage with comprehensive interfaces
- **Modern Patterns**: Uses Svelte 5 runes instead of stores for state management
- **Security First**: Environment-aware configuration and bearer token authentication
- **Performance Optimized**: Efficient bundling, code splitting, and lazy loading

## � Dashboard Features

### Main Dashboard (`/dashboard`)

- **Personalized Welcome**: Dynamic greeting with user context
- **Music Stats**: Live metrics for lyrics searches, discoveries, and trends
- **Service Overview**: Interactive cards with quick stats and navigation
- **Smart Layout**: Responsive grid that eliminates awkward layouts on all screens
- **Activity Feed**: Recent music-related activities and interactions
- **Quick Actions**: Fast access to search, trends, news, and favorites

### Lyrics Search (`/dashboard/lyrics`)

- **Dual Search Methods**: Quick "Artist - Title" or separate field searches
- **Rich Results**: Album art, metadata, play counts, and track information
- **Search History**: Persistent storage of recent lyric searches
- **Full Lyrics Display**: Clean, readable format with copy functionality

### Music News (`/dashboard/news`)

- **Advanced Filtering**: Filter by country, type, genre, and article count
- **Real-time Search**: Client-side filtering by title, content, author, or source
- **Rich Article Cards**: High-quality images, source attribution, timestamps
- **External Integration**: Direct links to full articles with proper attribution

## 🎯 Project Status

### ✅ **Completed Features**

- [x] **Project Setup & Configuration**

  - SvelteKit with TypeScript and Tailwind CSS
  - shadcn-svelte integration with dark mode support
  - Modular folder structure and component organization
  - Environment-based configuration system

- [x] **Homepage & Landing**

  - Hero section with search functionality
  - Features showcase with animated cards
  - Services overview with API information
  - Contact form with validation
  - Footer with branding and links

- [x] **Authentication & Security**

  - Bearer token authentication system
  - Protected routes with middleware
  - Secure cookie-based token storage
  - Server-side API proxy routes

- [x] **Music Dashboard**

  - **Main Dashboard**: Personalized welcome with stats and activity feed
  - **Lyrics Search**: Dual search methods with rich metadata display
  - **Music News**: Advanced filtering with real-time search capabilities
  - **Trending Content**: Track/artist trends with time period filters
  - **Service Cards**: Interactive navigation cards with live stats

- [x] **API Integration**

  - Complete backend integration with Musical Zoe API
  - Server-side proxy routes for secure authentication
  - Error handling and loading states
  - TypeScript interfaces for all API responses
  - Environment-based endpoint configuration

- [x] **UI/UX Excellence**

  - Responsive dashboard layout (mobile → desktop)
  - Smart grid system preventing awkward layouts
  - Loading states with skeleton components
  - Error boundaries with user-friendly messages
  - Accessibility features (ARIA, keyboard navigation)

- [x] **Theming System**

  - Complete dark/light mode implementation
  - CSS variables for consistent theming
  - mode-watcher integration for theme persistence
  - Responsive theme toggle in navigation

- [x] **Component Library**
  - Modular dashboard widgets
  - Reusable UI components (Button, Card, ServiceCard)
  - Form elements with proper validation
  - Icon integration with Lucide Svelte
    <br>

### 🚧 **Future Enhancements**

- [ ] **Advanced Music Features**

  - Favorites and playlist management
  - Music recommendations engine
  - Social features (sharing, comments)
  - Advanced search filters and sorting

- [ ] **User Experience**

  - User profile management and preferences
  - Search history and saved searches
  - Notification system for trending content
  - Offline capabilities with service workers

- [ ] **Analytics & Insights**
  - User activity tracking and analytics
  - Music discovery insights
  - Performance monitoring and optimization
  - A/B testing framework for features

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
   cp .env.example .env.development
   # Edit .env.development with your configuration
   ```

   **Required Environment Variables:**

   ```bash
   # API Configuration
   VITE_API_BASE_URL="http://localhost:4000/v1"
   VITE_API_AUTHENTICATION_URL="${VITE_API_BASE_URL}/api/authentication"

   # Music API Endpoints
   VITE_MUSIC_API_NEWS_URL="${VITE_API_BASE_URL}/musical/news"
   VITE_MUSIC_API_TRENDS_URL="${VITE_API_BASE_URL}/musical/trends"
   VITE_MUSIC_API_LYRICS_URL="${VITE_API_BASE_URL}/musical/lyrics"
   VITE_MUSIC_API_TRACK_INFO_URL="${VITE_API_BASE_URL}/musical/track-info"

   # App Configuration
   VITE_APP_NAME="Musical Zoe"
   VITE_DEBUG_MODE="true"
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
│   │   ├── dashboard/         # Dashboard widgets
│   │   │   ├── LyricsSearchWidget.svelte
│   │   │   ├── TrendingWidget.svelte
│   │   │   └── MusicNewsWidget.svelte
│   │   └── ui/                # Reusable UI components
│   │       ├── Header.svelte
│   │       ├── Button.svelte
│   │       ├── Card.svelte
│   │       ├── Container.svelte
│   │       └── ServiceCard.svelte
│   ├── types/                 # TypeScript interfaces
│   │   └── music-api.ts       # API response types
│   ├── utils/                 # Utility functions
│   │   ├── token-helpers.ts   # Authentication utilities
│   │   └── logger.ts          # Logging utilities
│   └── components/            # shadcn-svelte components
├── routes/
│   ├── (home)/               # Homepage route group
│   │   ├── +layout.svelte    # Homepage-specific layout
│   │   └── +page.svelte      # Homepage
│   ├── (app)/                # Protected app routes
│   │   ├── dashboard/        # Dashboard pages
│   │   │   ├── +page.svelte  # Main dashboard
│   │   │   ├── lyrics/       # Lyrics search page
│   │   │   ├── news/         # Music news page
│   │   │   └── trends/       # Trending content page
│   │   └── +layout.svelte    # App layout with auth
│   ├── api/music/            # Server-side API proxies
│   │   ├── lyrics/+server.ts
│   │   ├── news/+server.ts
│   │   ├── trends/+server.ts
│   │   └── track-info/+server.ts
│   └── +layout.svelte        # Root layout
├── documentation/            # Project documentation
│   ├── DASHBOARD_IMPLEMENTATION.md
│   └── API_CONFIGURATION.md
├── app.css                   # Global styles and theme variables
├── app.html                  # App shell
└── .env.development          # Development environment config
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

This project uses a sophisticated modular component architecture:

- **Homepage Components** (`src/lib/web-components/homepage/`): Landing page sections
- **Dashboard Widgets** (`src/lib/web-components/dashboard/`): Interactive music service widgets
- **UI Components** (`src/lib/web-components/ui/`): Reusable interface elements
- **shadcn Components** (`src/lib/components/ui/`): High-quality component library

#### Dashboard Widgets

Each dashboard widget is a self-contained component:

```typescript
// Example: LyricsSearchWidget.svelte
- Handles its own state with Svelte 5 runes
- Integrates with API endpoints via fetch
- Includes loading states and error handling
- Responsive design for all screen sizes
```

### API Integration

The app uses server-side proxy routes for secure API communication:

```typescript
// src/routes/api/music/[service]/+server.ts
- Extracts bearer tokens from cookies
- Proxies requests to backend API
- Handles authentication and error states
- Returns typed responses to frontend
```

### Authentication Flow

1. User logs in via authentication endpoint
2. Bearer token stored in secure httpOnly cookie
3. Client-side requests use server-side proxies
4. Proxies extract token and forward to API
5. Responses returned with proper error handling

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
- **Documentation**: See `/documentation` folder for detailed implementation guides
- **API Configuration**: [API_CONFIGURATION.md](./documentation/API_CONFIGURATION.md)
- **Dashboard Implementation**: [DASHBOARD_IMPLEMENTATION.md](./documentation/DASHBOARD_IMPLEMENTATION.md)
- **Live Demo**: [Coming Soon]

## 📊 Performance & SEO

- **Core Web Vitals**: Optimized for excellent performance scores
- **Progressive Enhancement**: Works without JavaScript for core functionality
- **SEO Optimized**: Server-side rendering with proper meta tags
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- **Bundle Optimization**: Code splitting and tree shaking for minimal bundle sizes

## 🛡️ Security Features

- **Secure Authentication**: Bearer token authentication with httpOnly cookies
- **API Proxying**: Server-side proxies prevent direct API exposure
- **Environment Isolation**: Separate configurations for development/production
- **Input Validation**: Client and server-side validation for all user inputs
- **CORS Protection**: Proper cross-origin resource sharing configuration

## 🎨 Design System

The project follows a comprehensive design system:

- **Color Palette**: Music-inspired gradients and semantic colors
- **Typography**: Hierarchical text system with proper contrast ratios
- **Spacing**: Consistent 8px grid system for layout and components
- **Responsive Breakpoints**: Mobile-first approach with logical breakpoints
- **Animation**: Subtle, purposeful animations that enhance user experience

---

<div align="center">
  <p>Built with ❤️ using SvelteKit, and modern web technologies</p>
</div>
