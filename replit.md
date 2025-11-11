# Card Printer Web Application

## Overview

A web-based utility for creating and printing custom playing cards. Users can upload images to generate printable cards in Magic: The Gathering dimensions (63mm x 88mm), arranged in a 3x3 grid layout optimized for standard letter-size paper. The application provides a workflow for uploading, previewing, managing, and printing cards with a focus on simplicity and efficiency.

## Recent Changes (November 11, 2025)

### Completed Features
- ✅ Card upload via drag-and-drop and file selection
- ✅ Automatic card sizing to 63mm x 88mm format
- ✅ 3-column responsive card grid preview
- ✅ Card deletion functionality
- ✅ Print preview mode with 3x3 layout (9 cards per page)
- ✅ Borderless printing support with @page CSS
- ✅ Beautiful loading and empty states
- ✅ Error handling with user feedback toasts
- ✅ FormData upload support for images

### Known Limitations
- Cards are stored in memory only - data is lost on server restart
- Attached HTML files reference external images that are not available in the project
- Card reordering not yet implemented
- No persistence layer configured

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR and optimized production builds
- Wouter for lightweight client-side routing (single-page application with home and 404 routes)

**UI Component System**
- Shadcn/ui component library following the "New York" style variant
- Radix UI primitives for accessible, unstyled base components
- Tailwind CSS for utility-first styling with custom design tokens
- Material Design principles adapted for a productivity tool (clear workflows, visual feedback, spatial organization)
- Inter font family loaded via Google Fonts CDN

**State Management**
- TanStack Query (React Query) for server state management, data fetching, and cache invalidation
- Local React state for UI-specific concerns (print mode, drag-and-drop states)
- Query invalidation pattern: mutations trigger cache updates to keep UI synchronized

**Design System Configuration**
- Custom Tailwind theme with HSL-based color system for light mode
- Consistent spacing scale (4, 6, 8 Tailwind units)
- Maximum container width of 7xl with centered layouts
- Card-specific aspect ratios matching 63mm x 88mm (approximately 5:7)

### Backend Architecture

**Server Framework**
- Express.js on Node.js for HTTP server and API routes
- ESM module system throughout (type: "module" in package.json)
- Development mode uses tsx for TypeScript execution; production builds with esbuild

**API Design Pattern**
- RESTful API endpoints under `/api` prefix
- File upload handling via Multer middleware with local disk storage
- Static file serving for uploaded images from `/uploads` directory
- Request/response logging middleware for API routes only

**Data Layer**
- Storage abstraction interface (`IStorage`) with in-memory implementation (`MemStorage`)
- Drizzle ORM configured for PostgreSQL with schema definition in shared directory
- Database schema includes cards table with fields: id, imageUrl, type, originalFileName, position, createdAt
- Position-based ordering for card arrangement in the grid

**File Upload System**
- Local filesystem storage in `uploads/` directory
- Filename generation using timestamp + random suffix to prevent collisions
- Image validation: accepts jpeg, jpg, png, gif, webp formats
- 10MB file size limit per upload
- Multer diskStorage strategy with destination and filename customization

### External Dependencies

**Database**
- Neon Serverless PostgreSQL driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database queries and migrations
- PostgreSQL-specific dialect and connection pooling
- Migration files generated in `/migrations` directory via drizzle-kit

**Development Tools**
- Replit-specific plugins for runtime error overlay, cartographer, and dev banner (development only)
- TypeScript compiler for type checking (noEmit mode, bundler handles transpilation)
- Path aliases configured: `@/*` for client source, `@shared/*` for shared code, `@assets/*` for attached assets

**UI Libraries**
- Comprehensive Radix UI component collection for accessible primitives (dialogs, dropdowns, tooltips, etc.)
- React Hook Form with Zod resolvers for form validation
- Lucide React for icon system
- Class Variance Authority (CVA) for component variant management
- CLSX and Tailwind Merge for conditional className handling

**Utility Libraries**
- date-fns for date manipulation
- Zod for runtime type validation and schema definition
- Multer for file uploads

**Session Management**
- No authentication currently implemented
