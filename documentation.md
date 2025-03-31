
# Police Record Check System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Authentication & Authorization](#authentication--authorization)
6. [Application Flow](#application-flow)
7. [Components](#components)
8. [Animations](#animations)
9. [Deployment](#deployment)
10. [Future Enhancements](#future-enhancements)

## Overview

The Police Record Check System is a comprehensive web application designed to streamline the process of applying for, managing, and verifying police record checks. The system serves multiple user roles including applicants, officers, verifiers, and administrators, each with specific permissions and capabilities.

## Features

### For Applicants
- User registration and authentication
- Application submission with different check types (standard, enhanced, vulnerable)
- Real-time application status tracking
- Document upload and management
- Secure payment processing
- Notification system

### For Officers
- Application review and processing
- Document verification
- Note-taking and internal communication
- Application status updates

### For Administrators
- User management and role assignment
- System configuration and settings
- Reporting and analytics
- Audit logs and security monitoring

### For Verifiers
- Verification of completed checks
- Document authentication

## Tech Stack

The application is built using modern web technologies:

- **Frontend**: React with TypeScript for a type-safe, component-based UI
- **Styling**: Tailwind CSS with shadcn/ui components for a responsive design
- **State Management**: React Context API for application state
- **Routing**: React Router for navigation
- **Backend**: Supabase for authentication, database, storage, and serverless functions
- **Animations**: Custom animation components and Framer Motion
- **Deployment**: Netlify for hosting

## Project Structure

The project follows a modular structure for maintainability:

```
src/
├── components/         # Reusable UI components
│   ├── animations/     # Animation components (FadeIn, ScaleIn, SlideIn)
│   └── ui/             # shadcn/ui components
├── contexts/           # React context providers
├── data/               # Mock data and constants
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations (Supabase)
├── lib/                # Utility functions
├── pages/              # Page components
└── types/              # TypeScript type definitions
```

## Authentication & Authorization

The system uses Supabase Authentication with JWT tokens to manage user sessions. User roles are stored in a dedicated `user_roles` table with the following roles:

- `applicant`: Standard users who can apply for record checks
- `officer`: Staff who process applications
- `administrator`: System administrators with full access
- `verifier`: Users who verify completed checks

Row Level Security (RLS) policies in Supabase enforce access control at the database level.

## Application Flow

1. **Registration**: Users create an account with email/password
2. **Profile Creation**: Users complete their profile information
3. **Application Submission**: Users fill out an application form and select the type of check
4. **Payment**: Users complete payment for the service
5. **Processing**: Officers review the application and perform necessary checks
6. **Verification**: Verifiers confirm the authenticity of the check
7. **Completion**: Users receive notification of completion and can access their results

## Components

### Core Components

- **ApplicationCard**: Displays application information in a card format
- **StatusBadge**: Visual indicator of application status
- **DocumentUpload**: Interface for uploading verification documents
- **Navbar**: Main navigation component
- **Sidebar**: Secondary navigation for authenticated users
- **Layout**: Page layout wrapper with consistent styling

### Animation Components

- **FadeIn**: Creates smooth fade-in transitions for elements
- **SlideIn**: Animates elements sliding into view
- **ScaleIn**: Provides scale animations for emphasis

## Animations

The system uses a combination of:

1. **CSS Transitions**: For basic hover and interactive effects
2. **Custom Animation Components**: For standardized entrance animations
3. **Framer Motion**: For more complex motion sequences

Animation utilities are defined in `src/lib/animations.ts` and provide consistent transitions throughout the application.

## Deployment

The application is configured for deployment on Netlify:

1. The build command is `npm run build`
2. The publish directory is `dist`
3. Environment variables required:
   - `VITE_SUPABASE_URL`: Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

## Database Structure

The Supabase database includes the following main tables:

1. **applications**: Stores all record check applications
2. **profiles**: Contains user profile information
3. **user_roles**: Manages user role assignments
4. **documents**: Tracks uploaded verification documents
5. **notifications**: Stores user notifications
6. **audit_logs**: Records system activity for security

## Future Enhancements

Potential future improvements include:

1. Mobile application for on-the-go access
2. Integration with government ID verification systems
3. Enhanced reporting and analytics dashboard
4. Automated background check processes
5. Multi-language support
6. Offline capabilities for field operations

---

## Development Guidelines

### Adding New Features

When adding new features:

1. Create components in dedicated files
2. Use TypeScript interfaces for prop definitions
3. Follow the existing naming conventions
4. Add appropriate tests
5. Update this documentation

### Styling Guidelines

1. Use Tailwind CSS utility classes
2. Follow the established color scheme:
   - Primary: Police blue theme
   - Accent: Highlight colors for important elements
   - Neutral: Grays for text and backgrounds
3. Maintain responsive design across all screen sizes
4. Use shadcn/ui components when available

### Code Quality

1. Run `npm run lint` before commits to ensure code quality
2. Maintain type safety with TypeScript
3. Follow React best practices for hooks and components
4. Use meaningful variable and function names
