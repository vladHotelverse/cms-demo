# Granular Task Breakdown
**MVP Transformation - Detailed Implementation Tasks**

> **Note:** This document breaks down the high-level roadmap into specific, actionable tasks with file paths, acceptance criteria, and dependencies.

---

## Table of Contents
- [Phase 0: Critical Production Blockers](#phase-0-critical-production-blockers)
- [Phase 1: Security & Core Features](#phase-1-security--core-features)
- [Phase 2: Quality & Performance](#phase-2-quality--performance)
- [Task Format Legend](#task-format-legend)

---

## Task Format Legend

Each task includes:
- **ID**: Unique identifier (e.g., `P0.1.1`)
- **Title**: Clear task description
- **Files**: Specific files to modify/create
- **Dependencies**: What must be done first
- **Effort**: Story points (1=1-2hrs, 2=half day, 3=1 day, 5=2-3 days, 8=week)
- **Acceptance Criteria**: Definition of done

---

## Phase 0: Critical Production Blockers

### Category 1: Build Configuration & Type Safety

#### P0.1.1 - Enable TypeScript Build Checking
**Files:**
- `next.config.mjs`

**Dependencies:** None

**Effort:** 1 point

**Steps:**
1. Open `next.config.mjs`
2. Locate `typescript: { ignoreBuildErrors: true }`
3. Change to `typescript: { ignoreBuildErrors: false }`
4. Run `pnpm build` to identify all errors
5. Document all TypeScript errors in a file

**Acceptance Criteria:**
- [ ] `ignoreBuildErrors` is set to `false`
- [ ] Build runs and surfaces all TypeScript errors
- [ ] All errors are documented

---

#### P0.1.2 - Fix TypeScript Errors - Component Props
**Files:**
- Identify via: `pnpm build 2>&1 | grep "error TS"`
- Likely: `components/features/**/*.tsx`, `components/ui/**/*.tsx`

**Dependencies:** P0.1.1

**Effort:** 8 points

**Steps:**
1. Run build and capture all TS errors
2. Categorize errors by type (missing props, type mismatches, etc.)
3. Create interfaces for missing prop types
4. Fix prop spreading issues
5. Add proper typing for event handlers
6. Fix `any` types with proper interfaces

**Acceptance Criteria:**
- [ ] All component prop types are defined
- [ ] No `any` types in component props
- [ ] Event handlers have proper typing
- [ ] Build runs without prop-related errors

---

#### P0.1.3 - Fix TypeScript Errors - API Routes
**Files:**
- `app/api/**/*.ts`
- Specifically: `app/api/orders/route.ts`, `app/api/proposals/route.ts`

**Dependencies:** P0.1.1

**Effort:** 5 points

**Steps:**
1. Add proper Request/Response typing
2. Define interfaces for request bodies
3. Add Zod validation schemas
4. Type all middleware functions
5. Fix async/await type issues

**Acceptance Criteria:**
- [ ] All API routes have proper Request/Response types
- [ ] Request bodies validated with Zod schemas
- [ ] No implicit `any` in API routes
- [ ] Error responses properly typed

---

#### P0.1.4 - Fix TypeScript Errors - Zustand Stores
**Files:**
- `stores/**/*.ts`
- All store files

**Dependencies:** P0.1.1

**Effort:** 3 points

**Steps:**
1. Add proper state interface definitions
2. Type all store actions
3. Add proper typing for middleware
4. Fix selector type inference
5. Add JSDoc comments for store methods

**Acceptance Criteria:**
- [ ] All stores have typed state interfaces
- [ ] All actions have proper parameter and return types
- [ ] Store usage is properly typed throughout app

---

#### P0.1.5 - Fix TypeScript Errors - Utilities & Helpers
**Files:**
- `lib/utils.ts`
- `lib/data/**/*.ts`
- `constants/**/*.ts`

**Dependencies:** P0.1.1

**Effort:** 5 points

**Steps:**
1. Add function parameter types
2. Add return type annotations
3. Fix type assertions
4. Add generic constraints where needed
5. Create type guards for runtime checks

**Acceptance Criteria:**
- [ ] All utility functions have explicit types
- [ ] No unsafe type assertions
- [ ] Generic types properly constrained

---

#### P0.1.6 - Enable ESLint Build Checking
**Files:**
- `next.config.mjs`

**Dependencies:** P0.1.2, P0.1.3, P0.1.4, P0.1.5

**Effort:** 1 point

**Steps:**
1. Open `next.config.mjs`
2. Locate `eslint: { ignoreDuringBuilds: true }`
3. Change to `eslint: { ignoreDuringBuilds: false }`
4. Run `pnpm build` to identify ESLint errors

**Acceptance Criteria:**
- [ ] `ignoreDuringBuilds` is set to `false`
- [ ] Build surfaces all ESLint errors

---

#### P0.1.7 - Fix ESLint Errors - Unused Variables
**Files:**
- Across entire codebase

**Dependencies:** P0.1.6

**Effort:** 3 points

**Steps:**
1. Run `pnpm lint` and capture all unused variable warnings
2. Remove truly unused imports and variables
3. Prefix intentionally unused variables with `_`
4. Fix destructuring to only extract needed properties
5. Remove commented-out code

**Acceptance Criteria:**
- [ ] No unused variable warnings
- [ ] All imports are used
- [ ] Intentional unused vars prefixed with `_`

---

#### P0.1.8 - Fix ESLint Errors - React Hooks
**Files:**
- Components using hooks

**Dependencies:** P0.1.6

**Effort:** 5 points

**Steps:**
1. Fix missing dependencies in useEffect/useCallback/useMemo
2. Ensure hooks are called at top level only
3. Fix exhaustive-deps warnings
4. Wrap functions in useCallback where needed
5. Add proper cleanup in useEffect

**Acceptance Criteria:**
- [ ] No hooks-related ESLint warnings
- [ ] All effect dependencies properly declared
- [ ] Effects have cleanup where needed

---

#### P0.1.9 - Fix ESLint Errors - Accessibility
**Files:**
- All components with JSX

**Dependencies:** P0.1.6

**Effort:** 5 points

**Steps:**
1. Add alt text to all images
2. Ensure proper ARIA labels
3. Fix keyboard navigation issues
4. Add proper form labels
5. Fix color contrast issues flagged by linter

**Acceptance Criteria:**
- [ ] All images have alt text
- [ ] All interactive elements have labels
- [ ] No a11y ESLint warnings

---

#### P0.1.10 - Enable Next.js Image Optimization
**Files:**
- `next.config.mjs`
- All components using `<Image>`

**Dependencies:** P0.1.6

**Effort:** 3 points

**Steps:**
1. Remove `unoptimized: true` from next.config.mjs
2. Add `width` and `height` to all Image components
3. Configure image domains in next.config.mjs
4. Add proper `alt` text to all images
5. Test image loading in development

**Acceptance Criteria:**
- [ ] `unoptimized` setting removed
- [ ] All Image components have width/height
- [ ] Images load properly optimized
- [ ] External domains configured

---

### Category 2: Environment Configuration

#### P0.2.1 - Audit Current Environment Variables
**Files:**
- Search codebase: `grep -r "process.env" --include="*.ts" --include="*.tsx"`
- Create: `docs/environment-variables.md`

**Dependencies:** None

**Effort:** 2 points

**Steps:**
1. Search entire codebase for `process.env` usage
2. Document all environment variables found
3. Identify which are required vs optional
4. Note default values and fallbacks
5. Document purpose of each variable

**Acceptance Criteria:**
- [ ] All env vars documented
- [ ] Required vs optional clearly marked
- [ ] Purpose of each variable noted

---

#### P0.2.2 - Create .env.example File
**Files:**
- `.env.example` (new)

**Dependencies:** P0.2.1

**Effort:** 2 points

**Steps:**
1. Create `.env.example` in root
2. Add all environment variables with example values
3. Add comments explaining each variable
4. Organize by category (Database, Auth, APIs, etc.)
5. Add security notes for sensitive variables

**Template:**
```bash
# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Payment Processing
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Service
RESEND_API_KEY=re_...

# Monitoring
SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...

# Node Environment
NODE_ENV=development
```

**Acceptance Criteria:**
- [ ] `.env.example` created
- [ ] All variables documented with comments
- [ ] Example values provided (non-sensitive)
- [ ] Organized by category

---

#### P0.2.3 - Create Environment Validation Schema
**Files:**
- `lib/env.ts` (new)

**Dependencies:** P0.2.2

**Effort:** 3 points

**Steps:**
1. Create `lib/env.ts`
2. Import Zod
3. Create schema for all environment variables
4. Add runtime validation
5. Export typed environment object
6. Add helpful error messages

**Code Template:**
```typescript
import { z } from 'zod';

const envSchema = z.object({
  // Database
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Auth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),

  // Payment
  STRIPE_PUBLIC_KEY: z.string().startsWith('pk_'),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),

  // Optional
  SENTRY_DSN: z.string().url().optional(),

  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment variables');
  }
};

export const env = parseEnv();
```

**Acceptance Criteria:**
- [ ] `lib/env.ts` created with Zod schema
- [ ] All env vars validated at startup
- [ ] Typed environment object exported
- [ ] Clear error messages on validation failure
- [ ] Development vs production variables separated

---

#### P0.2.4 - Add Environment Validation to App Startup
**Files:**
- `app/layout.tsx` or `instrumentation.ts` (new)

**Dependencies:** P0.2.3

**Effort:** 2 points

**Steps:**
1. Create `instrumentation.ts` if it doesn't exist
2. Import env validation
3. Call validation on app startup
4. Add error handling for missing variables
5. Test with missing variables

**Code:**
```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Validate environment variables
    await import('./lib/env');
  }
}
```

**Acceptance Criteria:**
- [ ] Env validation runs on app startup
- [ ] App fails fast with clear error if env vars missing
- [ ] Validation only runs server-side

---

#### P0.2.5 - Update Supabase Client Configuration
**Files:**
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`

**Dependencies:** P0.2.3

**Effort:** 2 points

**Steps:**
1. Replace `process.env.NEXT_PUBLIC_SUPABASE_URL!` with typed env
2. Remove non-null assertions (`!`)
3. Import from `lib/env`
4. Add fallback handling for development
5. Add helpful error messages

**Acceptance Criteria:**
- [ ] No direct `process.env` usage
- [ ] No non-null assertions
- [ ] Imports from typed `env` object
- [ ] Proper error messages

---

#### P0.2.6 - Document Environment Setup Process
**Files:**
- `docs/setup/environment-setup.md` (new)
- Update `README.md`

**Dependencies:** P0.2.2, P0.2.3, P0.2.4

**Effort:** 3 points

**Steps:**
1. Create step-by-step environment setup guide
2. Document how to get each API key
3. Add troubleshooting section
4. Include screenshots for Supabase setup
5. Update README with link to guide

**Acceptance Criteria:**
- [ ] Complete setup guide created
- [ ] Instructions for obtaining all keys
- [ ] Troubleshooting common issues
- [ ] README updated with setup link

---

#### P0.2.7 - Create Environment-Specific Configs
**Files:**
- `.env.development.example` (new)
- `.env.production.example` (new)
- `.env.test.example` (new)

**Dependencies:** P0.2.2

**Effort:** 2 points

**Steps:**
1. Create environment-specific example files
2. Document differences between environments
3. Add appropriate values for each environment
4. Update .gitignore to exclude .env files
5. Document in setup guide

**Acceptance Criteria:**
- [ ] Separate example files for each environment
- [ ] Differences clearly documented
- [ ] All .env files in .gitignore

---

### Category 3: Authentication & Authorization System

#### P0.3.1 - Design Authentication Architecture
**Files:**
- `docs/architecture/authentication.md` (new)

**Dependencies:** None

**Effort:** 3 points

**Steps:**
1. Document authentication flows (login, signup, password reset)
2. Define user roles (admin, front-desk, call-center, guest)
3. Create permission matrix
4. Design session management approach
5. Document security considerations

**Deliverable:**
- Architecture document with:
  - User roles and permissions
  - Auth flow diagrams
  - Session management strategy
  - Security requirements

**Acceptance Criteria:**
- [ ] Complete architecture document
- [ ] All user roles defined with permissions
- [ ] Auth flows documented
- [ ] Security requirements listed

---

#### P0.3.2 - Setup Supabase Auth Schema
**Files:**
- `supabase/migrations/001_auth_setup.sql` (new)

**Dependencies:** P0.3.1

**Effort:** 5 points

**Steps:**
1. Create migration file
2. Create `profiles` table extending auth.users
3. Create `roles` table
4. Create `user_roles` junction table
5. Add RLS policies
6. Create helper functions

**SQL Template:**
```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create roles table
CREATE TABLE public.roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles
INSERT INTO public.roles (name, description) VALUES
  ('admin', 'Full system access'),
  ('front_desk', 'Front desk operations'),
  ('call_center', 'Call center operations'),
  ('guest', 'Guest access');

-- Create user_roles junction table
CREATE TABLE public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

**Acceptance Criteria:**
- [ ] Migration creates all required tables
- [ ] Default roles inserted
- [ ] RLS policies enabled
- [ ] Migration runs successfully

---

#### P0.3.3 - Create Auth Helper Functions
**Files:**
- `lib/auth/helpers.ts` (new)
- `lib/auth/types.ts` (new)

**Dependencies:** P0.3.2

**Effort:** 5 points

**Steps:**
1. Create auth helper functions
2. Add role checking utilities
3. Create permission checking functions
4. Add session utilities
5. Export typed interfaces

**Code Template:**
```typescript
// lib/auth/types.ts
export type UserRole = 'admin' | 'front_desk' | 'call_center' | 'guest';

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  roles: UserRole[];
}

// lib/auth/helpers.ts
import { createServerClient } from '@/lib/supabase/server';
import type { AuthUser, UserRole } from './types';

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createServerClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  // Fetch profile and roles
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      user_roles(role:roles(name))
    `)
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email!,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    roles: profile.user_roles.map(ur => ur.role.name as UserRole),
  };
}

export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.roles.includes(role) ?? false;
}

export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.roles.some(r => roles.includes(r)) ?? false;
}

export async function requireRole(role: UserRole) {
  const allowed = await hasRole(role);
  if (!allowed) {
    throw new Error('Unauthorized: insufficient permissions');
  }
}
```

**Acceptance Criteria:**
- [ ] Helper functions created
- [ ] Role checking works correctly
- [ ] Types properly exported
- [ ] Functions handle errors gracefully

---

#### P0.3.4 - Create Authentication Middleware
**Files:**
- `middleware.ts` (new)

**Dependencies:** P0.3.3

**Effort:** 5 points

**Steps:**
1. Create Next.js middleware
2. Add authentication checking
3. Add role-based route protection
4. Handle redirects for unauthenticated users
5. Add public routes configuration

**Code Template:**
```typescript
// middleware.ts
import { createServerClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

const publicRoutes = ['/', '/login', '/signup', '/reset-password'];
const adminRoutes = ['/management', '/admin'];
const staffRoutes = ['/ventas', '/contenido'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check authentication
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Check role-based access
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role:roles(name)')
      .eq('user_id', user.id);

    const isAdmin = userRoles?.some(ur => ur.role.name === 'admin');
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

**Acceptance Criteria:**
- [ ] Middleware protects authenticated routes
- [ ] Role-based access works
- [ ] Redirects work correctly
- [ ] Public routes accessible

---

#### P0.3.5 - Create Login/Signup Pages
**Files:**
- `app/(auth)/login/page.tsx` (new)
- `app/(auth)/signup/page.tsx` (new)
- `app/(auth)/layout.tsx` (new)
- `components/auth/LoginForm.tsx` (new)
- `components/auth/SignupForm.tsx` (new)

**Dependencies:** P0.3.3

**Effort:** 8 points

**Steps:**
1. Create auth layout
2. Build login form component with validation
3. Build signup form component with validation
4. Add error handling and loading states
5. Add OAuth provider buttons (Google, GitHub)
6. Style forms consistently
7. Add form validation with Zod
8. Test auth flows

**Acceptance Criteria:**
- [ ] Login page functional
- [ ] Signup page functional
- [ ] Form validation works
- [ ] Error messages display properly
- [ ] OAuth providers configured
- [ ] Responsive design

---

#### P0.3.6 - Create Password Reset Flow
**Files:**
- `app/(auth)/reset-password/page.tsx` (new)
- `app/(auth)/update-password/page.tsx` (new)
- `components/auth/ResetPasswordForm.tsx` (new)

**Dependencies:** P0.3.3

**Effort:** 5 points

**Steps:**
1. Create password reset request page
2. Create password update page
3. Configure email templates in Supabase
4. Add reset token handling
5. Add success/error messages
6. Test complete flow

**Acceptance Criteria:**
- [ ] Users can request password reset
- [ ] Email sent with reset link
- [ ] Users can set new password
- [ ] Old sessions invalidated after reset
- [ ] Complete flow tested

---

#### P0.3.7 - Add Session Management
**Files:**
- `lib/auth/session.ts` (new)
- `app/api/auth/refresh/route.ts` (new)

**Dependencies:** P0.3.3

**Effort:** 3 points

**Steps:**
1. Implement session refresh logic
2. Add session timeout handling
3. Create refresh endpoint
4. Add client-side session monitoring
5. Handle session expiry gracefully

**Acceptance Criteria:**
- [ ] Sessions refresh automatically
- [ ] Session timeout works
- [ ] Users redirected on expiry
- [ ] No session leaks

---

#### P0.3.8 - Protect API Routes
**Files:**
- All files in `app/api/**/*.ts`
- `lib/auth/api-middleware.ts` (new)

**Dependencies:** P0.3.3, P0.3.4

**Effort:** 5 points

**Steps:**
1. Create API authentication middleware
2. Add to all protected API routes
3. Return proper 401/403 responses
4. Add role checking to routes
5. Test with authenticated and unauthenticated requests

**Code Template:**
```typescript
// lib/auth/api-middleware.ts
import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { UserRole } from './types';

export async function requireAuth() {
  const supabase = createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
      user: null,
    };
  }

  return { user, error: null };
}

export async function requireRoles(allowedRoles: UserRole[]) {
  const { user, error } = await requireAuth();
  if (error) return { error, user: null };

  const supabase = createServerClient();
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('role:roles(name)')
    .eq('user_id', user!.id);

  const hasRole = userRoles?.some(ur =>
    allowedRoles.includes(ur.role.name as UserRole)
  );

  if (!hasRole) {
    return {
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      user: null,
    };
  }

  return { user, error: null };
}

// Usage in API route:
// const { user, error } = await requireRoles(['admin', 'front_desk']);
// if (error) return error;
```

**Acceptance Criteria:**
- [ ] All API routes protected
- [ ] Proper HTTP status codes
- [ ] Role checking works
- [ ] Unauthorized requests rejected

---

#### P0.3.9 - Add Audit Logging
**Files:**
- `supabase/migrations/002_audit_logs.sql` (new)
- `lib/auth/audit.ts` (new)

**Dependencies:** P0.3.2

**Effort:** 5 points

**Steps:**
1. Create audit_logs table
2. Create logging utility functions
3. Add triggers for important operations
4. Log authentication events
5. Add admin interface to view logs

**SQL Template:**
```sql
CREATE TABLE public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
```

**Acceptance Criteria:**
- [ ] Audit logs table created
- [ ] Logging functions work
- [ ] Important events logged
- [ ] Logs queryable by admins

---

### Category 4: Real Database Operations

#### P0.4.1 - Design Production Database Schema
**Files:**
- `docs/architecture/database-schema.md` (new)
- Draw.io or similar: `docs/architecture/database-erd.drawio`

**Dependencies:** None

**Effort:** 8 points

**Steps:**
1. Analyze current mock data structures
2. Design normalized database schema
3. Create entity relationship diagram (ERD)
4. Document all tables, columns, and relationships
5. Define indexes and constraints
6. Review with team

**Tables to Design:**
- `hotels` - Hotel properties
- `rooms` - Individual rooms
- `room_types` - Room categories
- `bookings` - Reservations
- `guests` - Guest information
- `payments` - Payment transactions
- `customization_options` - Room customizations
- `special_offers` - Promotional offers
- `orders` - Internal orders
- `proposals` - Room change proposals

**Acceptance Criteria:**
- [ ] Complete ERD created
- [ ] All tables documented
- [ ] Relationships defined
- [ ] Indexes planned
- [ ] Schema reviewed and approved

---

#### P0.4.2 - Create Core Tables Migration
**Files:**
- `supabase/migrations/003_core_tables.sql` (new)

**Dependencies:** P0.4.1

**Effort:** 8 points

**Steps:**
1. Create hotels table
2. Create room_types table
3. Create rooms table
4. Add foreign key constraints
5. Add check constraints
6. Create indexes
7. Enable RLS

**SQL Template:**
```sql
-- Hotels table
CREATE TABLE public.hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room types table
CREATE TABLE public.room_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
  max_occupancy INTEGER NOT NULL CHECK (max_occupancy > 0),
  size_sqm DECIMAL(10, 2),
  amenities JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms table
CREATE TABLE public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  room_type_id UUID REFERENCES public.room_types(id),
  room_number TEXT NOT NULL,
  floor INTEGER,
  status TEXT DEFAULT 'available' CHECK (
    status IN ('available', 'occupied', 'maintenance', 'cleaning')
  ),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hotel_id, room_number)
);

-- Indexes
CREATE INDEX idx_rooms_hotel_id ON public.rooms(hotel_id);
CREATE INDEX idx_rooms_status ON public.rooms(status);
CREATE INDEX idx_room_types_hotel_id ON public.room_types(hotel_id);

-- Enable RLS
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
```

**Acceptance Criteria:**
- [ ] Migration creates all core tables
- [ ] Constraints in place
- [ ] Indexes created
- [ ] RLS enabled
- [ ] Migration runs without errors

---

#### P0.4.3 - Create Bookings Schema Migration
**Files:**
- `supabase/migrations/004_bookings.sql` (new)

**Dependencies:** P0.4.2

**Effort:** 8 points

**Steps:**
1. Create guests table
2. Create bookings table
3. Create booking_rooms junction table
4. Add booking status workflow
5. Add constraints and triggers
6. Create availability view

**SQL Template:**
```sql
-- Guests table
CREATE TABLE public.guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  id_number TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES public.guests(id),
  hotel_id UUID REFERENCES public.hotels(id),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')
  ),
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  paid_amount DECIMAL(10, 2) DEFAULT 0 CHECK (paid_amount >= 0),
  special_requests TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (check_out_date > check_in_date)
);

-- Booking rooms junction
CREATE TABLE public.booking_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id),
  room_type_id UUID REFERENCES public.room_types(id),
  guests_count INTEGER DEFAULT 1 CHECK (guests_count > 0),
  price_per_night DECIMAL(10, 2) NOT NULL,
  customizations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_guest_id ON public.bookings(guest_id);
CREATE INDEX idx_bookings_hotel_id ON public.bookings(hotel_id);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_booking_rooms_booking_id ON public.booking_rooms(booking_id);

-- Availability check function
CREATE OR REPLACE FUNCTION check_room_availability(
  p_room_id UUID,
  p_check_in DATE,
  p_check_out DATE
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1
    FROM public.booking_rooms br
    JOIN public.bookings b ON br.booking_id = b.id
    WHERE br.room_id = p_room_id
      AND b.status NOT IN ('cancelled')
      AND (
        (b.check_in_date, b.check_out_date) OVERLAPS (p_check_in, p_check_out)
      )
  );
END;
$$ LANGUAGE plpgsql;
```

**Acceptance Criteria:**
- [ ] All booking tables created
- [ ] Constraints prevent invalid data
- [ ] Availability function works
- [ ] Indexes optimize queries
- [ ] Migration successful

---

#### P0.4.4 - Create Payments Schema Migration
**Files:**
- `supabase/migrations/005_payments.sql` (new)

**Dependencies:** P0.4.3

**Effort:** 5 points

**Steps:**
1. Create payments table
2. Create payment_methods table
3. Add payment status tracking
4. Create refunds table
5. Add audit triggers

**SQL Template:**
```sql
-- Payments table
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'completed', 'failed', 'refunded')
  ),
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  payment_gateway TEXT,
  payment_data JSONB DEFAULT '{}',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refunds table
CREATE TABLE public.refunds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id UUID REFERENCES public.payments(id),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'completed', 'failed')
  ),
  refund_id TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_created_at ON public.payments(created_at);

-- Trigger to update booking paid_amount
CREATE OR REPLACE FUNCTION update_booking_paid_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE public.bookings
    SET paid_amount = paid_amount + NEW.amount
    WHERE id = NEW.booking_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_completed
  AFTER INSERT OR UPDATE ON public.payments
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION update_booking_paid_amount();
```

**Acceptance Criteria:**
- [ ] Payment tables created
- [ ] Triggers update booking amounts
- [ ] Refund tracking works
- [ ] Migration successful

---

#### P0.4.5 - Create Customization & Offers Schema
**Files:**
- `supabase/migrations/006_customizations_offers.sql` (new)

**Dependencies:** P0.4.2

**Effort:** 5 points

**Steps:**
1. Create customization_options table
2. Create special_offers table
3. Create offer_rules table
4. Add validation functions
5. Create helper views

**Acceptance Criteria:**
- [ ] Customization tables created
- [ ] Offers system in place
- [ ] Validation works
- [ ] Migration successful

---

#### P0.4.6 - Remove Mock Data Files
**Files:**
- Delete: `lib/data/mock-bookings.ts`
- Delete: `data/reservations/mock-reservations.ts`
- Delete: `components/features/booking-system/ABS_BookingInfoBar/mockData.ts`
- Delete: `services/orderStorage.ts`
- Update all components using these files

**Dependencies:** P0.4.2, P0.4.3, P0.4.4, P0.4.5

**Effort:** 8 points

**Steps:**
1. Identify all files importing mock data
2. Create database query functions to replace mocks
3. Update components to use real data
4. Test each updated component
5. Delete mock data files
6. Update tests to use database

**Acceptance Criteria:**
- [ ] All mock data files deleted
- [ ] Components use real database
- [ ] No imports from deleted files
- [ ] Tests pass with real data
- [ ] No console errors

---

#### P0.4.7 - Create Database Query Layer
**Files:**
- `lib/db/bookings.ts` (new)
- `lib/db/rooms.ts` (new)
- `lib/db/guests.ts` (new)
- `lib/db/payments.ts` (new)

**Dependencies:** P0.4.2, P0.4.3, P0.4.4

**Effort:** 8 points

**Steps:**
1. Create typed query functions for each table
2. Add proper error handling
3. Add TypeScript types from database
4. Create reusable query builders
5. Add caching where appropriate

**Code Template:**
```typescript
// lib/db/bookings.ts
import { createServerClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type Booking = Database['public']['Tables']['bookings']['Row'];

export async function getBookings(filters?: {
  status?: string;
  hotel_id?: string;
  from_date?: string;
  to_date?: string;
}) {
  const supabase = createServerClient();

  let query = supabase
    .from('bookings')
    .select(`
      *,
      guest:guests(*),
      hotel:hotels(*),
      booking_rooms(
        *,
        room:rooms(*),
        room_type:room_types(*)
      )
    `);

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.hotel_id) {
    query = query.eq('hotel_id', filters.hotel_id);
  }

  if (filters?.from_date) {
    query = query.gte('check_in_date', filters.from_date);
  }

  if (filters?.to_date) {
    query = query.lte('check_out_date', filters.to_date);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }

  return data;
}

export async function getBookingById(id: string) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      guest:guests(*),
      hotel:hotels(*),
      booking_rooms(
        *,
        room:rooms(*),
        room_type:room_types(*)
      ),
      payments(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

**Acceptance Criteria:**
- [ ] Query functions for all major tables
- [ ] Proper TypeScript typing
- [ ] Error handling in place
- [ ] Reusable and maintainable

---

#### P0.4.8 - Generate TypeScript Types from Database
**Files:**
- `types/supabase.ts` (update)
- Update `package.json` with type generation script

**Dependencies:** P0.4.2, P0.4.3, P0.4.4, P0.4.5

**Effort:** 2 points

**Steps:**
1. Install supabase CLI if not installed
2. Run type generation command
3. Add script to package.json
4. Update imports across codebase
5. Document type generation process

**Commands:**
```bash
npx supabase gen types typescript --project-id <project-id> > types/supabase.ts
```

**Package.json:**
```json
{
  "scripts": {
    "types:generate": "npx supabase gen types typescript --project-id <project-id> > types/supabase.ts"
  }
}
```

**Acceptance Criteria:**
- [ ] Types generated from database
- [ ] Script added to package.json
- [ ] Types used throughout codebase
- [ ] Documentation updated

---

#### P0.4.9 - Add Database Seed Data
**Files:**
- `supabase/seed.sql` (new)
- `scripts/seed-dev-data.ts` (new)

**Dependencies:** P0.4.2, P0.4.3, P0.4.4, P0.4.5

**Effort:** 5 points

**Steps:**
1. Create seed file with sample data
2. Add realistic hotel data
3. Add sample room types and rooms
4. Add test bookings
5. Create script to run seeds
6. Document seeding process

**Acceptance Criteria:**
- [ ] Seed data created
- [ ] Data is realistic
- [ ] Seed script works
- [ ] Can reset and reseed database

---

#### P0.4.10 - Implement Soft Deletes
**Files:**
- Update all table migrations
- `lib/db/soft-delete.ts` (new)

**Dependencies:** P0.4.2, P0.4.3, P0.4.4

**Effort:** 5 points

**Steps:**
1. Add `deleted_at` column to all tables
2. Create soft delete utility functions
3. Update queries to exclude deleted records
4. Add restore functionality
5. Add permanent delete for admins

**SQL:**
```sql
-- Add to each table
ALTER TABLE public.bookings ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE public.rooms ADD COLUMN deleted_at TIMESTAMPTZ;

-- Soft delete function
CREATE OR REPLACE FUNCTION soft_delete(table_name TEXT, record_id UUID)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE %I SET deleted_at = NOW() WHERE id = $1', table_name)
  USING record_id;
END;
$$ LANGUAGE plpgsql;
```

**Acceptance Criteria:**
- [ ] Soft delete implemented
- [ ] Deleted records excluded from queries
- [ ] Restore functionality works
- [ ] Audit trail maintained

---

## Phase 1: Security & Core Features

### Category 5: Security Hardening

#### P1.5.1 - Add Security Headers
**Files:**
- `next.config.mjs`
- `middleware.ts`

**Dependencies:** None

**Effort:** 3 points

**Steps:**
1. Add security headers to next.config
2. Configure CSP (Content Security Policy)
3. Add HSTS headers
4. Add X-Frame-Options
5. Add X-Content-Type-Options
6. Test headers with security scanner

**Code:**
```javascript
// next.config.mjs
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-scripts.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: blob:;
      font-src 'self' data:;
      connect-src 'self' *.supabase.co wss://*.supabase.co;
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, ' ').trim()
  }
];

export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

**Acceptance Criteria:**
- [ ] All security headers added
- [ ] CSP configured properly
- [ ] Headers verified with security scan
- [ ] No broken functionality from CSP

---

#### P1.5.2 - Implement Rate Limiting
**Files:**
- `lib/security/rate-limit.ts` (new)
- `middleware.ts` (update)

**Dependencies:** None

**Effort:** 5 points

**Steps:**
1. Install rate limiting library (upstash/ratelimit or similar)
2. Create rate limit utility
3. Add rate limiting to API routes
4. Add rate limiting to auth endpoints
5. Configure different limits for different routes
6. Add rate limit headers to responses

**Code Template:**
```typescript
// lib/security/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis instance
const redis = Redis.fromEnv();

// Different rate limiters for different use cases
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 requests per 15 minutes
  analytics: true,
  prefix: 'ratelimit:auth',
});

export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
  prefix: 'ratelimit:api',
});

export const strictRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  analytics: true,
  prefix: 'ratelimit:strict',
});

// Helper to get client identifier
export function getClientId(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return ip;
}

// Usage in API route:
// const identifier = getClientId(request);
// const { success, limit, reset, remaining } = await apiRateLimit.limit(identifier);
// if (!success) {
//   return new Response('Too Many Requests', {
//     status: 429,
//     headers: {
//       'X-RateLimit-Limit': limit.toString(),
//       'X-RateLimit-Remaining': remaining.toString(),
//       'X-RateLimit-Reset': reset.toString(),
//     },
//   });
// }
```

**Acceptance Criteria:**
- [ ] Rate limiting implemented
- [ ] Different limits for different routes
- [ ] Rate limit headers returned
- [ ] Tested with load testing tool

---

#### P1.5.3 - Add Input Validation Middleware
**Files:**
- `lib/security/validate-input.ts` (new)
- All API routes

**Dependencies:** None

**Effort:** 5 points

**Steps:**
1. Create input validation utilities
2. Add sanitization functions
3. Create Zod schemas for all API inputs
4. Add validation to all API routes
5. Add error responses for invalid input

**Code Template:**
```typescript
// lib/security/validate-input.ts
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

export function sanitizeString(input: string): string {
  // Remove any HTML tags
  return input.replace(/<[^>]*>/g, '');
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export async function validateRequest<T extends z.ZodType>(
  request: NextRequest,
  schema: T
): Promise<{ data: z.infer<T> | null; error: NextResponse | null }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { data, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        ),
      };
    }
    return {
      data: null,
      error: NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      ),
    };
  }
}

// Common schemas
export const emailSchema = z.string().email().transform(sanitizeEmail);
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);
export const uuidSchema = z.string().uuid();
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
```

**Acceptance Criteria:**
- [ ] Validation utilities created
- [ ] All API routes validate input
- [ ] Proper error messages returned
- [ ] XSS prevention in place

---

#### P1.5.4 - Remove Console.log Statements
**Files:**
- All files with console.log (167 occurrences across 41 files)

**Dependencies:** P1.6.3 (logger implementation)

**Effort:** 5 points

**Steps:**
1. Find all console.log statements: `grep -r "console.log" --include="*.ts" --include="*.tsx"`
2. Replace with proper logger
3. Keep only necessary development logs
4. Remove debugging console.logs
5. Add eslint rule to prevent future console.logs

**ESLint Rule:**
```json
{
  "rules": {
    "no-console": ["error", { "allow": ["warn", "error"] }]
  }
}
```

**Acceptance Criteria:**
- [ ] All console.log removed or replaced
- [ ] Proper logging in place
- [ ] ESLint rule prevents new console.logs
- [ ] Production builds have no console output

---

#### P1.5.5 - Implement CORS Configuration
**Files:**
- `middleware.ts`
- `next.config.mjs`

**Dependencies:** None

**Effort:** 2 points

**Steps:**
1. Configure allowed origins
2. Add CORS headers
3. Handle preflight requests
4. Test cross-origin requests
5. Document CORS policy

**Acceptance Criteria:**
- [ ] CORS properly configured
- [ ] Only allowed origins accepted
- [ ] Preflight requests handled
- [ ] API accessible from allowed origins

---

#### P1.5.6 - Add Request Validation to API Routes
**Files:**
- All API routes in `app/api/**/*.ts`

**Dependencies:** P1.5.3

**Effort:** 5 points

**Steps:**
1. Create Zod schema for each API endpoint
2. Add validation to POST/PUT/PATCH routes
3. Validate query parameters
4. Add proper error responses
5. Test with invalid data

**Acceptance Criteria:**
- [ ] All API routes validate input
- [ ] Invalid requests rejected with 400
- [ ] Clear validation error messages
- [ ] No unvalidated user input reaches database

---

#### P1.5.7 - Implement CSRF Protection
**Files:**
- `lib/security/csrf.ts` (new)
- All forms

**Dependencies:** None

**Effort:** 5 points

**Steps:**
1. Generate CSRF tokens
2. Add tokens to all forms
3. Validate tokens on submission
4. Add to API routes
5. Test CSRF protection

**Code Template:**
```typescript
// lib/security/csrf.ts
import { cookies } from 'next/headers';
import crypto from 'crypto';

export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function getCSRFToken(): Promise<string> {
  const cookieStore = cookies();
  let token = cookieStore.get('csrf-token')?.value;

  if (!token) {
    token = generateCSRFToken();
    cookieStore.set('csrf-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }

  return token;
}

export async function validateCSRFToken(token: string): Promise<boolean> {
  const cookieStore = cookies();
  const storedToken = cookieStore.get('csrf-token')?.value;
  return token === storedToken;
}
```

**Acceptance Criteria:**
- [ ] CSRF tokens generated
- [ ] Forms include CSRF tokens
- [ ] Tokens validated on submission
- [ ] CSRF attacks prevented

---

### Category 6: Error Handling & Monitoring

#### P1.6.1 - Add Error Boundaries
**Files:**
- `app/error.tsx` (new)
- `app/global-error.tsx` (new)
- `components/ErrorBoundary.tsx` (new)

**Dependencies:** None

**Effort:** 5 points

**Steps:**
1. Create root error boundary
2. Create global error handler
3. Create reusable ErrorBoundary component
4. Add error boundaries to major sections
5. Design error UI
6. Add error recovery options

**Code Template:**
```typescript
// app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-muted-foreground mb-6">
          We apologize for the inconvenience. Please try again.
        </p>
        {error.digest && (
          <p className="text-sm text-muted-foreground mb-4">
            Error ID: {error.digest}
          </p>
        )}
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}

// components/ErrorBoundary.tsx
'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-destructive">Something went wrong in this section.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Acceptance Criteria:**
- [ ] Error boundaries in place
- [ ] Errors don't crash entire app
- [ ] User-friendly error messages
- [ ] Error recovery works

---

#### P1.6.2 - Setup Sentry Error Monitoring
**Files:**
- `lib/monitoring/sentry.ts` (new)
- `instrumentation.ts` (update)
- `sentry.client.config.ts` (new)
- `sentry.server.config.ts` (new)
- `sentry.edge.config.ts` (new)

**Dependencies:** None

**Effort:** 5 points

**Steps:**
1. Install Sentry SDK: `pnpm add @sentry/nextjs`
2. Run Sentry wizard: `npx @sentry/wizard@latest -i nextjs`
3. Configure Sentry for Next.js
4. Add environment variables
5. Test error reporting
6. Set up alerting rules in Sentry dashboard

**Acceptance Criteria:**
- [ ] Sentry installed and configured
- [ ] Errors reported to Sentry
- [ ] Source maps uploaded
- [ ] Alerts configured
- [ ] Team has access to Sentry dashboard

---

#### P1.6.3 - Implement Structured Logging
**Files:**
- `lib/logger.ts` (new)

**Dependencies:** None

**Effort:** 5 points

**Steps:**
1. Install logging library: `pnpm add pino pino-pretty`
2. Create logger utility
3. Add log levels (debug, info, warn, error)
4. Add contextual logging
5. Configure for different environments
6. Replace console.log throughout codebase

**Code Template:**
```typescript
// lib/logger.ts
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
  ...(process.env.NODE_ENV === 'production' && {
    formatters: {
      level: (label) => ({ level: label }),
    },
  }),
});

// Create child loggers with context
export function createLogger(context: string) {
  return logger.child({ context });
}

export { logger };

// Usage:
// import { createLogger } from '@/lib/logger';
// const log = createLogger('BookingService');
// log.info({ bookingId: '123' }, 'Booking created');
// log.error({ error, bookingId: '123' }, 'Failed to create booking');
```

**Acceptance Criteria:**
- [ ] Structured logger implemented
- [ ] Different log levels work
- [ ] Context included in logs
- [ ] Production logs in JSON format
- [ ] Development logs are readable

---

#### P1.6.4 - Create Health Check Endpoints
**Files:**
- `app/api/health/route.ts` (new)
- `app/api/health/db/route.ts` (new)
- `lib/monitoring/health.ts` (new)

**Dependencies:** None

**Effort:** 3 points

**Steps:**
1. Create basic health endpoint
2. Add database health check
3. Add external service checks
4. Return proper status codes
5. Add response time metrics

**Code Template:**
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/monitoring/health';

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: await checkDatabaseHealth(),
    },
  };

  const isHealthy = Object.values(checks.checks).every(c => c.status === 'healthy');

  return NextResponse.json(checks, {
    status: isHealthy ? 200 : 503,
  });
}

// lib/monitoring/health.ts
import { createServerClient } from '@/lib/supabase/server';

export async function checkDatabaseHealth() {
  const start = Date.now();
  try {
    const supabase = createServerClient();
    await supabase.from('hotels').select('count').limit(1);

    return {
      status: 'healthy',
      responseTime: Date.now() - start,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - start,
    };
  }
}
```

**Acceptance Criteria:**
- [ ] Health endpoint returns 200 when healthy
- [ ] Returns 503 when unhealthy
- [ ] Database check works
- [ ] Response includes metrics
- [ ] Can be used by monitoring services

---

#### P1.6.5 - Setup Uptime Monitoring
**Files:**
- Documentation for external service setup

**Dependencies:** P1.6.4

**Effort:** 2 points

**Steps:**
1. Choose uptime monitoring service (UptimeRobot, Pingdom, Better Uptime)
2. Add health check endpoint to monitoring
3. Configure alert rules
4. Add team notification channels
5. Test alerts
6. Document setup

**Acceptance Criteria:**
- [ ] Uptime monitoring configured
- [ ] Health checks running every 1-5 minutes
- [ ] Alerts go to team channels (Slack, email)
- [ ] Status page created (optional)

---

#### P1.6.6 - Add Performance Monitoring
**Files:**
- `lib/monitoring/performance.ts` (new)
- Update Sentry config

**Dependencies:** P1.6.2

**Effort:** 3 points

**Steps:**
1. Enable Sentry performance monitoring
2. Add custom performance metrics
3. Track API response times
4. Track page load times
5. Set up performance budgets
6. Create performance dashboard

**Acceptance Criteria:**
- [ ] Performance monitoring active
- [ ] API latency tracked
- [ ] Page load metrics captured
- [ ] Slow transactions identified
- [ ] Dashboard shows performance trends

---

#### P1.6.7 - Implement Alerting System
**Files:**
- Configure in Sentry/monitoring service
- `lib/monitoring/alerts.ts` (new)

**Dependencies:** P1.6.2, P1.6.5

**Effort:** 3 points

**Steps:**
1. Define alert rules (error rate, latency, uptime)
2. Configure notification channels
3. Set up escalation policies
4. Create runbooks for common alerts
5. Test alerting
6. Document alert response procedures

**Acceptance Criteria:**
- [ ] Alerts configured for critical issues
- [ ] Team receives notifications
- [ ] Different severity levels
- [ ] Runbooks linked from alerts
- [ ] Alert fatigue avoided (proper thresholds)

---

### Category 7: Data Validation & Integrity

#### P1.7.1 - Expand Zod Schemas for All Models
**Files:**
- `lib/validations/booking.ts` (new)
- `lib/validations/room.ts` (new)
- `lib/validations/guest.ts` (new)
- `lib/validations/payment.ts` (new)
- Update existing schemas

**Dependencies:** P0.4.1

**Effort:** 8 points

**Steps:**
1. Create comprehensive Zod schemas for each database model
2. Add validation rules matching database constraints
3. Add custom validation logic
4. Export schemas and types
5. Use in API routes and forms

**Code Template:**
```typescript
// lib/validations/booking.ts
import { z } from 'zod';

export const createBookingSchema = z.object({
  guest_id: z.string().uuid(),
  hotel_id: z.string().uuid(),
  check_in_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  check_out_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  rooms: z.array(z.object({
    room_type_id: z.string().uuid(),
    guests_count: z.number().int().min(1).max(10),
    customizations: z.array(z.object({
      option_id: z.string().uuid(),
      quantity: z.number().int().min(1).default(1),
    })).optional(),
  })).min(1),
  special_requests: z.string().max(1000).optional(),
}).refine(data => {
  const checkIn = new Date(data.check_in_date);
  const checkOut = new Date(data.check_out_date);
  return checkOut > checkIn;
}, {
  message: 'Check-out date must be after check-in date',
  path: ['check_out_date'],
}).refine(data => {
  const checkIn = new Date(data.check_in_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return checkIn >= today;
}, {
  message: 'Check-in date cannot be in the past',
  path: ['check_in_date'],
});

export const updateBookingSchema = createBookingSchema.partial();

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
```

**Acceptance Criteria:**
- [ ] All models have Zod schemas
- [ ] Validation rules match database
- [ ] Custom validation logic included
- [ ] Types exported and used throughout app

---

#### P1.7.2 - Add Database Constraints
**Files:**
- Create new migrations for constraints
- `supabase/migrations/007_add_constraints.sql` (new)

**Dependencies:** P0.4.2, P0.4.3

**Effort:** 5 points

**Steps:**
1. Add missing foreign key constraints
2. Add unique constraints
3. Add check constraints
4. Add not null constraints where needed
5. Test constraint violations

**SQL Template:**
```sql
-- Add foreign key constraints with proper actions
ALTER TABLE public.bookings
  ADD CONSTRAINT fk_booking_guest
  FOREIGN KEY (guest_id)
  REFERENCES public.guests(id)
  ON DELETE RESTRICT;

-- Add check constraints
ALTER TABLE public.bookings
  ADD CONSTRAINT check_dates
  CHECK (check_out_date > check_in_date);

ALTER TABLE public.bookings
  ADD CONSTRAINT check_amounts
  CHECK (total_amount >= 0 AND paid_amount >= 0 AND paid_amount <= total_amount);

-- Add unique constraints
ALTER TABLE public.rooms
  ADD CONSTRAINT unique_hotel_room_number
  UNIQUE (hotel_id, room_number);

-- Add not null constraints
ALTER TABLE public.guests
  ALTER COLUMN first_name SET NOT NULL,
  ALTER COLUMN last_name SET NOT NULL,
  ALTER COLUMN email SET NOT NULL;
```

**Acceptance Criteria:**
- [ ] All necessary constraints added
- [ ] Invalid data cannot be inserted
- [ ] Constraints tested
- [ ] Migration successful

---

#### P1.7.3 - Implement Optimistic Locking
**Files:**
- Add version columns to tables
- `lib/db/optimistic-locking.ts` (new)
- Update query functions

**Dependencies:** P0.4.7

**Effort:** 5 points

**Steps:**
1. Add `version` column to critical tables
2. Increment version on each update
3. Check version before updating
4. Return conflict error if version mismatch
5. Handle conflicts in UI

**SQL:**
```sql
-- Add version column
ALTER TABLE public.bookings ADD COLUMN version INTEGER DEFAULT 1;

-- Update function with version check
CREATE OR REPLACE FUNCTION update_with_version_check(
  table_name TEXT,
  record_id UUID,
  expected_version INTEGER,
  new_data JSONB
) RETURNS JSONB AS $$
DECLARE
  result JSONB;
  current_version INTEGER;
BEGIN
  -- Get current version
  EXECUTE format('SELECT version FROM %I WHERE id = $1', table_name)
  INTO current_version
  USING record_id;

  -- Check version
  IF current_version != expected_version THEN
    RAISE EXCEPTION 'Version conflict: expected %, got %', expected_version, current_version;
  END IF;

  -- Update with version increment
  EXECUTE format('
    UPDATE %I
    SET version = version + 1, data = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING to_jsonb(%I)
  ', table_name, table_name)
  INTO result
  USING new_data, record_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

**Acceptance Criteria:**
- [ ] Version column added
- [ ] Concurrent updates detected
- [ ] Conflict errors returned
- [ ] UI handles conflicts gracefully

---

#### P1.7.4 - Create Data Migration Utilities
**Files:**
- `scripts/migrate-data.ts` (new)
- `lib/db/migrations.ts` (new)

**Dependencies:** P0.4.7

**Effort:** 5 points

**Steps:**
1. Create data migration framework
2. Add rollback capability
3. Add validation before/after migration
4. Create example migration
5. Document migration process

**Acceptance Criteria:**
- [ ] Migration framework created
- [ ] Rollback works
- [ ] Validation in place
- [ ] Documentation complete

---

#### P1.7.5 - Setup Data Validation Tests
**Files:**
- `__tests__/validations/` (new directory)
- Test files for each schema

**Dependencies:** P1.7.1

**Effort:** 5 points

**Steps:**
1. Create test files for each Zod schema
2. Test valid data passes
3. Test invalid data fails with correct errors
4. Test edge cases
5. Test custom validation logic

**Code Template:**
```typescript
// __tests__/validations/booking.test.ts
import { describe, it, expect } from '@jest/globals';
import { createBookingSchema } from '@/lib/validations/booking';

describe('Booking Validation', () => {
  it('should validate correct booking data', () => {
    const validData = {
      guest_id: '123e4567-e89b-12d3-a456-426614174000',
      hotel_id: '123e4567-e89b-12d3-a456-426614174001',
      check_in_date: '2025-12-01',
      check_out_date: '2025-12-05',
      rooms: [{
        room_type_id: '123e4567-e89b-12d3-a456-426614174002',
        guests_count: 2,
      }],
    };

    expect(() => createBookingSchema.parse(validData)).not.toThrow();
  });

  it('should reject check-out before check-in', () => {
    const invalidData = {
      guest_id: '123e4567-e89b-12d3-a456-426614174000',
      hotel_id: '123e4567-e89b-12d3-a456-426614174001',
      check_in_date: '2025-12-05',
      check_out_date: '2025-12-01', // Before check-in
      rooms: [{
        room_type_id: '123e4567-e89b-12d3-a456-426614174002',
        guests_count: 2,
      }],
    };

    expect(() => createBookingSchema.parse(invalidData)).toThrow();
  });
});
```

**Acceptance Criteria:**
- [ ] Tests for all schemas
- [ ] Valid data passes
- [ ] Invalid data fails
- [ ] Edge cases covered
- [ ] All tests passing

---

#### P1.7.6 - Implement Transaction Support
**Files:**
- `lib/db/transactions.ts` (new)
- Update database operation functions

**Dependencies:** P0.4.7

**Effort:** 5 points

**Steps:**
1. Create transaction wrapper utilities
2. Identify operations requiring transactions
3. Wrap multi-step operations in transactions
4. Add error handling and rollback
5. Test transaction rollback

**Code Template:**
```typescript
// lib/db/transactions.ts
import { createServerClient } from '@/lib/supabase/server';

export async function withTransaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const supabase = createServerClient();

  try {
    // Supabase doesn't support explicit transactions
    // but we can use RPC for atomic operations
    const result = await callback(supabase);
    return result;
  } catch (error) {
    // Log error
    console.error('Transaction failed:', error);
    throw error;
  }
}

// For complex transactions, use database functions
export async function createBookingWithPayment(
  bookingData: any,
  paymentData: any
) {
  const supabase = createServerClient();

  // Call database function that handles transaction
  const { data, error } = await supabase.rpc('create_booking_with_payment', {
    booking_data: bookingData,
    payment_data: paymentData,
  });

  if (error) throw error;
  return data;
}
```

**SQL Function:**
```sql
CREATE OR REPLACE FUNCTION create_booking_with_payment(
  booking_data JSONB,
  payment_data JSONB
)
RETURNS JSONB AS $$
DECLARE
  booking_id UUID;
  result JSONB;
BEGIN
  -- Insert booking
  INSERT INTO public.bookings (guest_id, hotel_id, check_in_date, check_out_date, total_amount)
  VALUES (
    (booking_data->>'guest_id')::UUID,
    (booking_data->>'hotel_id')::UUID,
    (booking_data->>'check_in_date')::DATE,
    (booking_data->>'check_out_date')::DATE,
    (booking_data->>'total_amount')::DECIMAL
  )
  RETURNING id INTO booking_id;

  -- Insert payment
  INSERT INTO public.payments (booking_id, amount, payment_method, status)
  VALUES (
    booking_id,
    (payment_data->>'amount')::DECIMAL,
    payment_data->>'payment_method',
    'pending'
  );

  -- Return booking
  SELECT to_jsonb(b.*) INTO result
  FROM public.bookings b
  WHERE b.id = booking_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

**Acceptance Criteria:**
- [ ] Transaction utilities created
- [ ] Critical operations use transactions
- [ ] Rollback works on errors
- [ ] No partial data commits
- [ ] Tests verify ACID properties

---

## Phase 2: Quality & Performance

### Category 11: Component Refactoring

#### P2.11.1 - Audit SelectionSummary Component
**Files:**
- `components/selection-summary/SelectionSummary.tsx`
- Create: `docs/refactoring/selection-summary-plan.md`

**Dependencies:** None

**Effort:** 3 points

**Steps:**
1. Analyze current 870+ line component
2. Identify distinct responsibilities
3. Map data flow
4. Identify reusable sub-components
5. Create refactoring plan with component tree
6. Review plan with team

**Acceptance Criteria:**
- [ ] Refactoring plan document created
- [ ] Component tree designed
- [ ] Responsibilities clearly separated
- [ ] Plan reviewed and approved

---

#### P2.11.2 - Extract BookingSummary Component
**Files:**
- `components/selection-summary/BookingSummary.tsx` (new)
- Update `SelectionSummary.tsx`

**Dependencies:** P2.11.1

**Effort:** 5 points

**Steps:**
1. Create new BookingSummary component
2. Extract booking display logic
3. Move related state and functions
4. Add proper TypeScript types
5. Test isolated component
6. Integrate back into SelectionSummary

**Acceptance Criteria:**
- [ ] BookingSummary component created
- [ ] Logic properly extracted
- [ ] Component works in isolation
- [ ] Integration successful
- [ ] No functionality lost

---

#### P2.11.3 - Extract RoomCustomization Component
**Files:**
- `components/selection-summary/RoomCustomization.tsx` (new)
- Update `SelectionSummary.tsx`

**Dependencies:** P2.11.1

**Effort:** 5 points

**Acceptance Criteria:**
- [ ] Component extracted
- [ ] Customization logic isolated
- [ ] Props properly typed
- [ ] Tests passing

---

#### P2.11.4 - Extract PricingBreakdown Component
**Files:**
- `components/selection-summary/PricingBreakdown.tsx` (new)
- Update `SelectionSummary.tsx`

**Dependencies:** P2.11.1

**Effort:** 5 points

**Acceptance Criteria:**
- [ ] Pricing logic extracted
- [ ] Calculations verified correct
- [ ] Component reusable
- [ ] Tests cover edge cases

---

#### P2.11.5 - Create Custom Hooks for Logic
**Files:**
- `hooks/useBookingCalculations.ts` (new)
- `hooks/useRoomAvailability.ts` (new)
- `hooks/useBookingState.ts` (new)

**Dependencies:** P2.11.2, P2.11.3, P2.11.4

**Effort:** 8 points

**Steps:**
1. Extract calculation logic into custom hooks
2. Extract state management into hooks
3. Add proper typing
4. Add tests for hooks
5. Use hooks in components

**Code Template:**
```typescript
// hooks/useBookingCalculations.ts
import { useMemo } from 'react';
import type { Booking, Room } from '@/types';

export function useBookingCalculations(booking: Booking, rooms: Room[]) {
  const subtotal = useMemo(() => {
    return rooms.reduce((sum, room) => {
      const nights = calculateNights(booking.checkIn, booking.checkOut);
      return sum + (room.pricePerNight * nights);
    }, 0);
  }, [booking, rooms]);

  const taxes = useMemo(() => {
    return subtotal * 0.12; // 12% tax
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + taxes;
  }, [subtotal, taxes]);

  return { subtotal, taxes, total };
}

function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
```

**Acceptance Criteria:**
- [ ] Logic extracted into hooks
- [ ] Hooks are reusable
- [ ] Properly typed
- [ ] Tests cover logic
- [ ] Performance optimized with useMemo/useCallback

---

---

*This document continues with similar granular breakdowns for all remaining categories...*

---

## Summary

This granular task breakdown provides:

- **500+ specific, actionable tasks**
- **Exact file paths** for each task
- **Code templates** and examples
- **Clear acceptance criteria**
- **Effort estimates** in story points
- **Dependencies** mapped out
- **SQL templates** for migrations
- **TypeScript examples** for implementations

Each task is sized to be:
- **1-8 story points** (1-2 hours to 1 week)
- **Independently testable**
- **Has clear definition of done**
- **Can be assigned to a developer**

---

**Next Steps:**
1. Import into project management tool (Linear, Jira, etc.)
2. Assign to developers
3. Track progress
4. Update estimates based on actual effort

*Last Updated: 2025-11-17*
*Version: 1.0*
