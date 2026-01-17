# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start Vite dev server with HMR (port 5173)
npm run build    # TypeScript compile + Vite production build
npm run lint     # ESLint validation
npm run preview  # Preview production build locally
```

No test framework is currently configured.

## Architecture Overview

**Stack**: React 19 + TypeScript + Vite + Tailwind CSS + Supabase

### Routing Structure (App.tsx)
- Multi-language support: English (default) at `/` routes, German at `/de/` routes
- German routes use localized slugs: `/de/uber-uns`, `/de/kontakt`, `/de/datenschutz`
- Client portal routes under `/dashboard`, `/projects/:id`, `/assets`, `/knowledge` are protected by `RequireAuth`
- Language detection happens via `LanguageWrapper` component based on URL path

### Key Directories
- `src/components/layout/` - Header, Footer, Layout wrapper, GridBackground
- `src/components/ui/` - Reusable components using CVA (class-variance-authority)
- `src/components/auth/` - RequireAuth protected route wrapper
- `src/pages/client/` - Client portal pages (Dashboard, Projects, Assets, Knowledge)
- `src/context/AuthContext.tsx` - Supabase auth state management
- `src/lib/i18n.ts` - All translations (EN/DE) are inline in this file
- `src/lib/supabase.ts` - Supabase client initialization
- `src/hooks/` - Custom hooks for theme toggle and GSAP scroll animations

### Styling Patterns
- Use `cn()` from `src/lib/utils.ts` for conditional class merging (clsx + tailwind-merge)
- Component variants use CVA pattern (see `src/components/ui/Button.tsx`)
- Dark mode is class-based with system preference detection + manual toggle
- Design tokens defined in `tailwind.config.js`:
  - Primary: Cobalt Blue (#3b5bdb)
  - Accent: Soft Lemon (#f3ff5a)
  - Fonts: Lexend Tera (headings), Lexend Deca (body)
  - Typography uses golden ratio scale (1.618x)

### Animation Libraries
- **Framer Motion**: React component animations, page transitions
- **GSAP + ScrollTrigger**: Scroll-based animations (see `useGSAPScrollAnimations` hook)

### Backend Integration
- **Supabase**: Authentication (email/password), database, real-time
- **n8n webhooks**: Contact form submissions (VITE_N8N_WEBHOOK_URL)

### Environment Variables
```
VITE_N8N_WEBHOOK_URL      # n8n webhook for contact form
VITE_SUPABASE_URL         # Supabase project URL
VITE_SUPABASE_ANON_KEY    # Supabase public anon key
```

## Internationalization

Translations live entirely in `src/lib/i18n.ts` as inline objects. To add/modify translations:
1. Find the appropriate key namespace (nav, hero, services, about, contact, etc.)
2. Add both `en` and `de` values
3. Access via `useTranslation()` hook: `t('namespace.key')`
