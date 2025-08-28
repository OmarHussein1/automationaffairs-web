# Automation Affairs Website

A modern, responsive website built with React, Vite, Tailwind CSS, and TypeScript for Automation Affairs - a business transformation consultancy specializing in intelligent automation solutions.

## 🚀 Features

- **Modern Tech Stack**: React 19 + Vite + TypeScript + Tailwind CSS
- **Internationalization**: English/German support with react-i18next
- **Design System**: Clean, minimal 2D aesthetic with geometric elements
- **Responsive Design**: Mobile-first approach with 12-column grid
- **Dark/Light Theme**: System preference detection with manual toggle
- **Accessibility**: WCAG 2.2 AA compliant with keyboard navigation
- **Performance**: Optimized for Core Web Vitals
- **Animations**: Subtle Framer Motion animations with reduced motion support

## 🎨 Design Tokens

### Typography
- **Headlines**: Lexend Tera (1.25 line height)
- **Body**: Lexend Deca (1.6 line height)
- **Scale**: Golden ratio (~1.618) based on 18px base

### Colors
- **Primary (Cobalt)**: #3b5bdb
- **Accent (Soft Lemon)**: #f3ff5a
- **Light Theme**: #f7f8fa bg, #ffffff surface, #0a0a0a ink
- **Dark Theme**: #0d0f12 bg, #121418 surface, #ffffff text

### Layout
- **Max Width**: 1200px content container
- **Spacing**: py-24 desktop / py-16 mobile sections
- **Borders**: 1px hairlines, rounded-2xl cards, rounded-full buttons

## 🌍 Internationalization

The site supports English (default) and German:
- **English routes**: `/`, `/about`, `/contact`, `/impressum`, `/privacy`
- **German routes**: `/de`, `/de/about`, `/de/contact`, `/de/impressum`, `/de/privacy`

## 📱 Pages

1. **Home** (`/`, `/de`) - Hero, Services, Process, Proof, CTA
2. **About** (`/about`, `/de/about`) - Mission, Vision, Values, Team
3. **Contact** (`/contact`, `/de/contact`) - Lead qualification form
4. **Impressum** (`/impressum`) - Austrian legal requirements
5. **Privacy** (`/privacy`, `/de/privacy`) - GDPR-compliant privacy policy

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🎯 Performance Targets

- **Initial bundle**: < 200KB gzipped
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **TTI**: < 3.5s on mobile

## ♿ Accessibility

- WCAG 2.2 AA compliant
- Keyboard navigation support
- Custom focus rings
- Skip links for screen readers
- Reduced motion support
- Semantic HTML structure

## 🔧 Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design tokens
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Internationalization**: react-i18next
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## 📂 Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, Layout
│   └── ui/              # Reusable UI components
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
└── assets/
    └── svg/             # SVG components and assets
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
