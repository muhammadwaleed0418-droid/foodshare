# Authentication UI Documentation

This document provides comprehensive documentation for the FoodShare authentication UI components and pages.

## Overview

The authentication system includes modern, premium, and fully responsive UI components built with:
- **Next.js 14** (App Router)
- **Tailwind CSS** with custom animations
- **TypeScript** for type safety
- **React Hook Form** for form management
- **Zod** for validation

## Components

### UI Components (`src/components/ui/`)

#### AuthInput
Reusable input field component with support for icons, error messages, and toggle buttons.

**Props:**
- `label?: string` - Input label
- `error?: string` - Error message to display
- `icon?: React.ReactNode` - Icon to display on the left
- `rightIcon?: React.ReactNode` - Icon to display on the right
- `onRightIconClick?: () => void` - Callback for right icon click
- All standard HTMLInputElement props

**Example:**
```tsx
<AuthInput
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  error={errors.email?.message}
  icon={<EmailIcon />}
/>
```

#### AuthButton
Reusable button component with multiple variants and loading state.

**Props:**
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost'` - Button style
- `size?: 'sm' | 'md' | 'lg'` - Button size
- `isLoading?: boolean` - Loading state with spinner
- `icon?: React.ReactNode` - Icon to display
- `fullWidth?: boolean` - Make button full width (default: true)

**Variants:**
- `primary` - Green gradient (default)
- `secondary` - Blue/cyan gradient
- `outline` - Green outline style
- `ghost` - Transparent with text

**Example:**
```tsx
<AuthButton
  variant="primary"
  size="lg"
  isLoading={isLoading}
  type="submit"
>
  Sign In
</AuthButton>
```

#### AuthCard
Glassmorphism card container for forms.

**Props:**
- `children: React.ReactNode` - Card content
- `className?: string` - Additional CSS classes

**Example:**
```tsx
<AuthCard>
  <form>{/* form content */}</form>
</AuthCard>
```

#### AuthLayout
Main layout wrapper that provides the split-screen hero section and form area.

**Props:**
- `children: React.ReactNode` - Form content
- `title: string` - Page title
- `subtitle?: string` - Page subtitle
- `footerText?: string` - Footer text (e.g., "Don't have an account?")
- `footerLink?: { text: string; href: string }` - Footer link

**Example:**
```tsx
<AuthLayout
  title="Welcome Back"
  subtitle="Enter your credentials"
  footerText="Don't have an account?"
  footerLink={{ text: 'Sign up', href: '/auth/register' }}
>
  <form>{/* form content */}</form>
</AuthLayout>
```

#### PasswordStrengthIndicator
Visual password strength meter with color-coded feedback.

**Props:**
- `password: string` - Password to evaluate
- `showLabel?: boolean` - Show strength label (default: true)

**Strength Levels:**
- **Too weak** (Red) - 0-2 criteria met
- **Weak** (Orange) - 3 criteria met
- **Fair** (Yellow) - 4 criteria met
- **Good** (Blue) - 5 criteria met
- **Strong** (Green) - 6 criteria met

**Criteria:**
1. At least 8 characters
2. At least 12 characters
3. Contains lowercase letters
4. Contains uppercase letters
5. Contains numbers
6. Contains special characters

**Example:**
```tsx
<PasswordStrengthIndicator password={password} showLabel={true} />
```

#### SocialLoginButtons
Pre-styled social login buttons for Google and GitHub.

**Props:**
- `isLoading?: boolean` - Disable buttons while loading

**Example:**
```tsx
<SocialLoginButtons isLoading={isLoading} />
```

### Form Components

#### LoginFormModern (`src/components/LoginFormModern.tsx`)
Modern login form with:
- Email input with validation
- Password input with show/hide toggle
- Remember me checkbox
- Forgot password link
- Social login buttons
- Error handling and messages

**Features:**
- NextAuth integration
- Form validation with React Hook Form + Zod
- Loading state management
- Error display with animations
- Responsive design
- Dark mode support

#### RegisterFormModern (`src/components/RegisterFormModern.tsx`)
Modern registration form with:
- Full name input
- Email input
- Phone number input
- Password input with strength indicator
- Confirm password with show/hide toggle
- Role dropdown (Donor, Receiver, Moderator)
- Terms & Conditions checkbox
- Social signup buttons

**Features:**
- Complete form validation
- Password strength indicator
- Success and error messages
- Responsive design
- Dark mode support

## Pages

### Login Page (`app/auth/login/page.tsx`)
- Uses `LoginFormModern` component
- Metadata for SEO
- Server-side rendered

### Register Page (`app/auth/register/page.tsx`)
- Uses `RegisterFormModern` component
- Metadata for SEO
- Server-side rendered

## Styling & Customization

### Dark Mode
Dark mode is automatically supported through Tailwind CSS `dark:` prefix. Toggle dark mode by adding the `dark` class to the HTML element:

```tsx
// In your layout or component
useEffect(() => {
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [isDarkMode]);
```

### Custom Animations
Available animations in `app/globals.css`:
- `fade-in` - Fade in effect
- `slide-up` - Slide up from bottom
- `slide-down` - Slide down from top
- `slide-left` - Slide in from left
- `slide-right` - Slide in from right
- `pulse-soft` - Soft pulsing effect
- `glow` - Glowing effect
- `shimmer` - Shimmer/loading effect

### Color Scheme
**Primary Colors:**
- Green: `#22c55e` - Main action color
- Blue: `#0ea5e9` - Secondary color

**Semantic Colors:**
- Green tones (50-900) - Success, primary actions
- Red tones - Errors
- Yellow tones - Warnings
- Blue tones - Secondary actions

### Responsive Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md-lg)
- Desktop: > 1024px (xl)

## Accessibility

All components follow WCAG 2.1 AA standards:
- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Color contrast ratios
- ✅ Reduced motion support
- ✅ Font size 16px+ on inputs (prevents zoom)

## Responsive Design

All components are fully responsive:
- **Mobile (< 640px)** - Single column, touch-friendly
- **Tablet (640px - 1024px)** - Optimized spacing
- **Desktop (> 1024px)** - Split-screen hero section

## Dark Mode Features

The authentication UI includes comprehensive dark mode support:
- Auto-detection based on system preferences
- Manual toggle support ready
- Smooth color transitions
- Optimized contrast ratios for readability
- Dark theme for glassmorphism cards

## Performance Optimizations

- Lazy loading of components
- CSS-in-JS with Tailwind (zero-runtime)
- Optimized animations using CSS transforms
- No unnecessary re-renders with React Hook Form
- Minimal bundle size with tree-shaking

## Usage Examples

### Login Form
```tsx
import { LoginFormModern } from '@/src/components/LoginFormModern';

export default function LoginPage() {
  return <LoginFormModern />;
}
```

### Register Form
```tsx
import { RegisterFormModern } from '@/src/components/RegisterFormModern';

export default function RegisterPage() {
  return <RegisterFormModern />;
}
```

### Custom Auth Component
```tsx
'use client';

import { AuthInput } from '@/src/components/ui/AuthInput';
import { AuthButton } from '@/src/components/ui/AuthButton';
import { AuthCard } from '@/src/components/ui/AuthCard';
import { AuthLayout } from '@/src/components/ui/AuthLayout';

export default function CustomAuthPage() {
  return (
    <AuthLayout
      title="Custom Auth"
      subtitle="Your custom subtitle"
      footerText="Need help?"
      footerLink={{ text: 'Contact us', href: '/contact' }}
    >
      <AuthCard>
        <form className="space-y-4">
          <AuthInput label="Username" placeholder="Enter your username" />
          <AuthButton>Submit</AuthButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions

## File Structure

```
src/components/
├── ui/
│   ├── AuthInput.tsx
│   ├── AuthButton.tsx
│   ├── AuthCard.tsx
│   ├── AuthLayout.tsx
│   ├── PasswordStrengthIndicator.tsx
│   └── SocialLoginButtons.tsx
├── LoginFormModern.tsx
└── RegisterFormModern.tsx

app/
├── auth/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
└── globals.css

tailwind.config.ts
```

## Future Enhancements

- Social login implementation (Google OAuth, GitHub OAuth)
- Password reset flow
- Email verification
- Two-factor authentication UI
- Biometric authentication
- Progressive Web App (PWA) support

## Support

For issues or questions about the authentication UI components, please refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
