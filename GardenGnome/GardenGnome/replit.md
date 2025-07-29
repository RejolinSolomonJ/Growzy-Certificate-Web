# Certificate Management System

## Overview

This is a full-stack certificate verification and management system for Growzy Academy. The application allows users to verify certificates by entering a certificate number and provides an admin interface for managing certificates. It's built with a modern React frontend and Express.js backend, using a clean separation between client and server code.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

- **Frontend**: React with TypeScript, using Vite for development and building
- **Backend**: Express.js with TypeScript for REST API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **UI Framework**: Tailwind CSS with shadcn/ui components for consistent styling
- **State Management**: TanStack Query for server state management and caching

## Key Components

### Frontend Architecture
- **Component Structure**: Uses shadcn/ui component library with Radix UI primitives
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Styling**: Tailwind CSS with CSS variables for theming support

### Backend Architecture
- **API Layer**: Express.js REST endpoints under `/api` prefix
- **Data Layer**: Drizzle ORM with PostgreSQL for data persistence
- **Storage Abstraction**: Interface-based storage layer supporting both memory and database implementations
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

### Database Schema
The system uses a single `certificates` table with the following structure:
- `id`: Primary key (UUID)
- `certificateNumber`: Unique certificate identifier
- `recipientName`: Name of the certificate recipient
- `courseName`: Name of the completed course
- `issueDate`: Date the certificate was issued
- `completionDate`: Date the course was completed
- `grade`: Grade achieved (optional)
- `instructorName`: Name of the instructor (optional)
- `status`: Certificate status (active, revoked, expired)

## Data Flow

### Certificate Verification Flow
1. User enters certificate number on home page
2. Frontend sends POST request to `/api/certificates/verify`
3. Backend validates input and searches database
4. Returns certificate details if found and active
5. Frontend displays certificate details or error message

### Admin Management Flow
1. Admin accesses `/admin` route
2. Frontend fetches all certificates via GET `/api/certificates`
3. Admin can create, edit, or delete certificates
4. All mutations update the database and invalidate cached queries
5. Real-time UI updates through TanStack Query

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing for React
- **react-hook-form**: Form state management and validation
- **zod**: Runtime type validation and schema definition

### UI Dependencies
- **@radix-ui/***: Headless UI primitives for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating variant-based component APIs
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **tsx**: TypeScript execution environment

## Deployment Strategy

The application is configured for multiple deployment scenarios:

### Development
- Uses Vite dev server with HMR for frontend
- Express server with TypeScript compilation via tsx
- PostgreSQL database with Drizzle ORM for data persistence
- Automatic database seeding with sample certificates on startup

### Production
- Frontend built to static assets via Vite
- Backend bundled with esbuild for optimal performance
- Serves static files from Express server
- Uses PostgreSQL database with connection pooling

### Database Management
- Drizzle Kit for schema migrations and database management
- Environment variable configuration for database connections
- Support for both development and production database setups

The architecture prioritizes developer experience with hot reloading, type safety throughout the stack, and clear separation of concerns. The system now uses PostgreSQL for persistent data storage with automatic seeding of sample certificates.

## Recent Changes

### January 28, 2025
- **Database Integration**: Migrated from in-memory storage to PostgreSQL database
  - Added database connection layer using Drizzle ORM with Neon serverless PostgreSQL
  - Created DatabaseStorage implementation replacing MemStorage
  - Added automatic database seeding with sample certificates on server startup
  - Maintains same IStorage interface for seamless transition
- **Bulk Upload Feature**: Added CSV-based bulk certificate upload functionality
  - CSV format validation and parsing with error reporting
  - Template download feature for easy data preparation
  - Individual certificate processing with success/failure tracking
  - Integration with existing admin panel interface