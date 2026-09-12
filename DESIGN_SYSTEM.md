# Zivora Design System

A cohesive design system for Zivora — India's social connection platform for meaningful relationships, friendships, and communities.

## Brand Identity

### Brand Personality
- **Warm & Trustworthy**: Approachable, safe, respectful
- **Distinctive Professional Minimal**: Clean, purposeful, not sterile
- **India-First**: Culturally aware, locally relevant
- **Balanced Density**: Breathing room without emptiness

### Core Values
1. **Safety First** — Every feature designed with user safety in mind
2. **Authentic Connection** — Real people, meaningful interactions
3. **Inclusive Design** — Accessible to all adults 18+
4. **Thoughtful Minimalism** — Purpose over decoration

---

## Design Tokens

### Color System

#### Primary Palette (Brand Purple)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#F0EAFB` | Subtle backgrounds, hover states |
| `primary-100` | `#E4D6FC` | Light accents, badges |
| `primary-200` | `#C9ACF7` | Secondary actions |
| `primary-300` | `#AD82F2` | Interactive elements |
| `primary-400` | `#9259ED` | Links, focus rings |
| `primary-500` | `#7950C9` | **Primary brand color** |
| `primary-600` | `#6440AF` | Primary hover, pressed |
| `primary-700` | `#4D318A` | Text emphasis |
| `primary-800` | `#3D266B` | Dark text on light |
| `primary-900` | `#2E1E4F` | Headings on dark |
| `primary-950` | `#1A0F2E` | Dark mode surfaces |

#### Semantic Colors
| Category | Light | Dark | Usage |
|----------|-------|------|-------|
| **Success** | `#3C7A5C` | `#E7F2EC` | Confirmations, online status |
| **Warning** | `#9A6B1E` | `#FAF0DC` | Cautions, pending states |
| **Error** | `#B0576B` | `#F9E9EE` | Destructive actions, errors |
| **Info** | `#6440AF` | `#F0EAFB` | Information, help |

#### Neutral/Surface
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `surface-50` | `#FAF9FC` | `#2D2238` | Page background |
| `surface-100` | `#F5F3FC` | `#52485C` | Card backgrounds |
| `surface-200` | `#EBE7F7` | `#665C73` | Elevated surfaces |
| `surface-900` | `#52485C` | `#EBE7F7` | Inverted text |
| `surface-950` | `#2D2238` | `#FAF9FC` | Dark mode base |

#### Text Colors
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `text-primary` | `#27233F` | `#FAF9FC` | Primary content |
| `text-secondary` | `#5A5475` | `#DDD8F0` | Secondary content |
| `text-tertiary` | `#8D8199` | `#B5ACDA` | Tertiary, hints |
| `text-quaternary` | `#B5ACBE` | `#7F728F` | Placeholders, disabled |

#### Border Colors
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `border-subtle` | `#EAE7EF` | `#3D266B` | Hairline dividers |
| `border-default` | `#D9D2E3` | `#4D318A` | Standard borders |
| `border-emphasis` | `#C9C2E5` | `#6440AF` | Strong borders |
| `border-focus` | `#7950C9` | `#9259ED` | Focus states |

### Spacing Scale
Based on 4px unit:
```css
--space-1: 4px   --space-5: 20px   --space-12: 48px
--space-2: 8px   --space-6: 24px   --space-14: 56px
--space-3: 12px  --space-7: 28px   --space-16: 64px
--space-4: 16px  --space-8: 32px   --space-20: 80px
--space-10: 40px --space-24: 96px
```

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | `0` | Sharp corners |
| `radius-xs` | `4px` | Small chips, badges |
| `radius-sm` | `6px` | Buttons, inputs |
| `radius-md` | `8px` | Cards, dropdowns |
| `radius-lg` | `10px` | Modals, panels |
| `radius-xl` | `12px` | Large cards |
| `radius-2xl` | `14px` | Feature cards |
| `radius-3xl` | `16px` | Hero sections |
| `radius-4xl` | `24px` | Major containers |
| `radius-full` | `9999px` | Pills, avatars |

### Typography

#### Font Families
- **Heading**: `Satoshi`, `Manrope`, `system-ui` — Brand voice, hierarchy
- **Body**: `Inter`, `system-ui` — Readable, versatile
- **UI/Mono**: `Space Grotesk`, `ui-monospace` — Metrics, codes, labels

#### Type Scale
| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `xs` | 11px | 1.45 | 450 | Captions, labels |
| `sm` | 12px | 1.5 | 450 | Body small, metadata |
| `base` | 13px | 1.55 | 450 | **Default body** |
| `lg` | 14px | 1.6 | 500 | Emphasized body |
| `xl` | 15px | 1.6 | 500 | Large body |
| `2xl` | 17px | 1.5 | 600 | Subheadings |
| `3xl` | 21px | 1.4 | 600 | Section titles |
| `4xl` | 26px | 1.35 | 650 | Page titles |
| `5xl` | 31px | 1.3 | 650 | Hero headings |
| `6xl` | 38px | 1.25 | 700 | Large hero |
| `7xl` | 48px | 1.2 | 800 | Marketing |

#### Font Weights
| Token | Value |
|-------|-------|
| `normal` | 400 |
| `medium` | 450 |
| `semibold` | 550 |
| `bold` | 600 |
| `extrabold` | 650 |
| `black` | 700 |
| `heavy` | 800 |

### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-xs` | `0 1px 2px rgba(40,22,63,0.05)` | Subtle depth |
| `shadow-sm` | `0 2px 8px rgba(40,22,63,0.08)` | Cards, dropdowns |
| `shadow-md` | `0 4px 16px rgba(40,22,63,0.1)` | Elevated cards |
| `shadow-lg` | `0 8px 32px rgba(40,22,63,0.12)` | Modals, popovers |
| `shadow-xl` | `0 20px 64px rgba(40,22,63,0.15)` | Major overlays |
| `shadow-inner` | `inset 0 2px 4px rgba(40,22,63,0.06)` | Input focus |
| `shadow-focus` | `0 0 0 3px rgba(121,80,201,0.18)` | Focus rings |

### Transitions
| Token | Value | Usage |
|-------|-------|-------|
| `transition-fast` | `120ms ease` | Micro-interactions |
| `transition-base` | `180ms ease` | **Default** |
| `transition-slow` | `250ms ease` | Modals, drawers |
| `transition-slower` | `350ms ease` | Page transitions |
| `transition-spring` | `300ms cubic-bezier(0.34,1.56,0.64,1)` | Playful elements |

### Z-Index Scale
| Token | Value | Usage |
|-------|-------|-------|
| `z-hide` | -1 | Hidden |
| `z-base` | 0 | Default |
| `z-dropdown` | 10 | Dropdowns |
| `z-sticky` | 20 | Sticky headers |
| `z-fixed` | 30 | Fixed elements |
| `z-modal-backdrop` | 40 | Modal overlays |
| `z-modal` | 50 | Modal panels |
| `z-popover` | 60 | Popovers, tooltips |
| `z-tooltip` | 70 | Tooltips |
| `z-toast` | 80 | Toasts |

### Breakpoints
| Token | Value | Target |
|-------|-------|--------|
| `xs` | 480px | Small phones |
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |
| `3xl` | 1920px | Ultra-wide |

### Icon Sizes
| Token | Value |
|-------|-------|
| `icon-xs` | 12px |
| `icon-sm` | 14px |
| `icon-md` | 16px |
| `icon-lg` | 18px |
| `icon-xl` | 20px |
| `icon-2xl` | 24px |
| `icon-3xl` | 28px |
| `icon-4xl` | 32px |

### Avatar Sizes
| Token | Value |
|-------|-------|
| `avatar-xs` | 24px |
| `avatar-sm` | 32px |
| `avatar-md` | 36px |
| `avatar-lg` | 40px |
| `avatar-xl` | 46px |
| `avatar-2xl` | 56px |
| `avatar-3xl` | 72px |
| `avatar-4xl` | 96px |

---

## Component Library

### Primitives

#### Button
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" loading={false}>
  Primary Action
</Button>

// Variants: primary | secondary | ghost | danger | outline
// Sizes: xs | sm | md | lg | xl
// Props: fullWidth, icon, iconPosition, loading, disabled
```

#### IconButton
```tsx
import { IconButton } from '@/components/ui';

<IconButton 
  aria-label="Open menu" 
  size="md" 
  variant="subtle"
>
  <Menu size={20} />
</IconButton>

// Variants: default | subtle | ghost
// Sizes: xs | sm | md | lg
```

#### Input / Textarea / Select
```tsx
import { Input, Textarea, Select } from '@/components/ui';

<Input
  label="Email"
  placeholder="you@example.com"
  error="Invalid email"
  iconLeft={<Mail />}
/>

<Textarea
  label="Bio"
  placeholder="Tell us about yourself..."
  maxLength={1000}
/>

<Select
  label="City"
  options={[
    { value: 'bengaluru', label: 'Bengaluru' },
    { value: 'mumbai', label: 'Mumbai' }
  ]}
  placeholder="Select city"
/>
```

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui';

<Card variant="default" padding="md" hover>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Variants: default | elevated | outlined | filled
// Padding: none | sm | md | lg | xl
```

#### Avatar
```tsx
import { Avatar, AvatarStack } from '@/components/ui';

<Avatar 
  src="/user.jpg" 
  name="Aarav Sharma" 
  size="md" 
  status="online" 
/>

// Sizes: xs | sm | md | lg | xl | 2xl | 3xl | 4xl
// Status: online | offline | busy | away

<AvatarStack 
  avatars={[{ name: 'Aarav', image: '/a.jpg' }, { name: 'Priya' }]} 
  max={4} 
  size="sm" 
/>
```

#### Badge / Tag / Pill
```tsx
import { Badge, Tag, Pill } from '@/components/ui';

<Badge variant="success" size="md" dot>Verified</Badge>
<Tag variant="brand" size="sm">Community</Tag>
<Pill variant="brand" icon={<Heart />}>Following</Pill>

// Badge variants: default | success | warning | error | info | brand | outline | subtle
// Tag variants: default | brand | success | warning | error
// Pill variants: default | brand | success | warning | error | outline
```

### Feedback Components

#### Modal
```tsx
import { Modal, ConfirmModal, AlertModal } from '@/components/ui';

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure?"
  size="md"
>
  <ModalFooter>
    <Button variant="ghost" onClick={onClose}>Cancel</Button>
    <Button variant="danger" onClick={handleConfirm}>Delete</Button>
  </ModalFooter>
</Modal>

// Sizes: sm | md | lg | xl | full
```

#### Toast
```tsx
import { ToastProvider, useToast } from '@/components/ui';

// In provider
<ToastProvider>
  <App />
</ToastProvider>

// In component
const { addToast } = useToast();
addToast({
  type: 'success',
  title: 'Profile saved',
  message: 'Your changes have been saved.',
  duration: 5000,
});
```

#### Empty State
```tsx
import { EmptyState } from '@/components/ui';

<EmptyState
  icon={<HeartHandshake size={28} />}
  title="No connections yet"
  description="Start exploring to find your people"
  action={<Button onClick={goDiscover}>Discover people</Button>}
/>
```

#### Loading / Skeleton
```tsx
import { LoadingState, Skeleton, SkeletonCard } from '@/components/ui';

<LoadingState variant="spinner" size="md" text="Loading..." />
<Skeleton variant="text" lines={3} />
<SkeletonCard />
```

### Form Components

#### FormField
```tsx
import { FormField, Checkbox, Switch, RadioGroup, Radio } from '@/components/ui';

<FormField label="Email" description="We'll never share this" error={errors.email}>
  <Input {...register('email')} />
</FormField>

<Checkbox label="I agree to terms" onChange={handleAgree} />
<Switch label="Incognito mode" description="Hide from discovery" />

<RadioGroup name="intent" value={intent} onChange={setIntent}>
  <Radio value="relationship" label="Relationship" description="Looking for a partner" />
  <Radio value="friendship" label="Friendship" description="Platonic connections" />
</RadioGroup>
```

### Navigation

#### Tabs
```tsx
import { Tabs, TabList, TabTrigger, TabContent } from '@/components/ui';

<Tabs defaultValue="discover" variant="line">
  <TabList aria-label="Main navigation">
    <TabTrigger value="discover" icon={<Compass />}>Discover</TabTrigger>
    <TabTrigger value="connections" icon={<Heart />} badge={5}>Connections</TabTrigger>
    <TabTrigger value="messages" icon={<MessageCircle />}>Messages</TabTrigger>
  </TabList>
  <TabContent value="discover">Discover content</TabContent>
  <TabContent value="connections">Connections content</TabContent>
</TabContent>

// Variants: line | enclosed | soft | pills
```

#### Breadcrumb
```tsx
import { Breadcrumb } from '@/components/ui';

<Breadcrumb 
  items={[
    { label: 'Home', href: '/' },
    { label: 'Communities', href: '/communities' },
    { label: 'Bengaluru Board Games', current: true }
  ]}
/>
```

#### Pagination
```tsx
import { Pagination } from '@/components/ui';

<Pagination 
  currentPage={1} 
  totalPages={10} 
  onPageChange={setPage}
  showFirstLast
  showPrevNext
/>
```

### Layout Components

#### AppShell
```tsx
import { 
  AppShell, 
  SidebarProvider, 
  Sidebar, 
  SidebarSection, 
  SidebarItem, 
  Topbar, 
  TopbarSearch,
  UserMenu 
} from '@/components/ui';

<SidebarProvider>
  <AppShell
    sidebar={
      <Sidebar>
        <SidebarSection label="Explore">
          <SidebarItem href="/discover" icon={<Compass />} active>Discover</SidebarItem>
          <SidebarItem href="/connections" icon={<Heart />} badge={3}>Connections</SidebarItem>
        </SidebarSection>
      </Sidebar>
    }
    topbar={
      <Topbar
        left={<TopbarSearch value={query} onChange={setQuery} />}
        right={<UserMenu name="Aarav" email="aarav@example.com" />}
      />
    }
  >
    <main>Page content</main>
  </AppShell>
</SidebarProvider>
```

### Data Display

#### PersonCard
```tsx
import { PersonCard } from '@/components/ui';

<PersonCard
  person={{
    id: '1',
    name: 'Aarav',
    age: 28,
    city: 'Bengaluru',
    distance: 5,
    bio: 'Love hiking and coffee',
    intent: 'Relationship',
    interests: ['Hiking', 'Coffee', 'Photography'],
    image: '/aarav.jpg',
    verified: true,
    online: true,
    compatibility: 92,
  }}
  liked={false}
  onLike={handleLike}
  onMessage={handleMessage}
/>
```

#### CommunityCard
```tsx
import { CommunityCard } from '@/components/ui';

<CommunityCard
  community={{
    id: '1',
    title: 'Bengaluru Board Games',
    description: 'Weekly board game meetups',
    category: 'Social mixer',
    city: 'Bengaluru',
    image: '/community.jpg',
    members: 1240,
    capacity: 5000,
  }}
  joined={false}
  onJoin={handleJoin}
  avatars={[{ name: 'Aarav' }, { name: 'Priya' }]}
/>
```

#### EventCard
```tsx
import { EventCard } from '@/components/ui';

<EventCard
  event={{
    id: '1',
    title: 'Sunday Coffee & Conversations',
    description: 'Casual meetup at Third Wave',
    category: 'Food & drink',
    city: 'Bengaluru',
    location: 'Third Wave Coffee, Koramangala',
    date: '2024-01-21T10:00:00Z',
    image: '/event.jpg',
    members: 24,
    capacity: 30,
  }}
  joined={false}
  saved={false}
  onJoin={handleJoin}
  onSave={handleSave}
/>
```

---

## UX Rules

### Interaction Patterns

1. **Progressive Disclosure** — Show essential info first, reveal details on demand
2. **Optimistic Updates** — Immediate feedback, reconcile with server
3. **Forgiving Actions** — Undo for destructive actions, confirmations for irreversible ones
4. **Consistent Feedback** — Every action has visible response (loading, success, error)

### Navigation
- **Primary**: Sidebar (desktop), Bottom sheet (mobile)
- **Secondary**: Tabs within views
- **Contextual**: Breadcrumbs, inline links
- **Search**: Global `⌘K` / `Ctrl+K` palette

### Forms
- **Inline Validation** — On blur, not on change
- **Clear Errors** — Specific, actionable messages
- **Smart Defaults** — Pre-fill from profile/context
- **Accessible Labels** — Every input has associated label

### Empty States
- **Illustrated** — Friendly icon + clear message
- **Actionable** — Primary CTA to resolve emptiness
- **Contextual** — Different messages for different empty reasons

### Loading States
- **Skeleton Screens** — For predictable content structure
- **Spinners** — For quick, indeterminate loads
- **Progressive** — Show content as it arrives

---

## Accessibility Rules (WCAG 2.1 AA)

### Color Contrast
- **Text**: Minimum 4.5:1 (AA), 7:1 (AAA for large text)
- **UI Components**: 3:1 against adjacent colors
- **Focus Indicators**: 3:1 against background

### Keyboard Navigation
- **Tab Order** — Logical, follows visual hierarchy
- **Focus Visible** — Always visible, never outline: none without replacement
- **Skip Links** — Skip to main content
- **Trapped Focus** — Modals, drawers trap focus

### Screen Readers
- **Semantic HTML** — Proper heading hierarchy (h1→h6)
- **ARIA Labels** — Icon buttons, complex widgets
- **Live Regions** — Toasts, dynamic updates
- **Descriptions** — Form hints, error messages via `aria-describedby`

### Motion
- **Respects `prefers-reduced-motion`** — Disable animations
- **No Auto-play** — Videos, carousels pause by default
- **Essential Only** — Animation conveys meaning, not decoration

### Touch Targets
- **Minimum 44×44px** — All interactive elements
- **Adequate Spacing** — 8px between targets

---

## Responsive Behavior

### Breakpoint Strategy
| Breakpoint | Layout Changes |
|------------|----------------|
| `< 640px` (xs) | Single column, full-width cards, bottom nav |
| `640-767px` (sm) | Two-column grids, collapsible sidebar |
| `768-1023px` (md) | Sidebar overlay, 2-3 column grids |
| `1024-1279px` (lg) | Fixed sidebar, 3-4 column grids |
| `1280-1535px` (xl) | Comfortable density, 4-5 columns |
| `≥ 1536px` (2xl) | Max-width container, generous spacing |

### Component Adaptations

#### Sidebar
- **Desktop (≥lg)**: Fixed, always visible
- **Tablet (md)**: Collapsible, overlay on open
- **Mobile (<md)**: Off-canvas drawer, backdrop

#### Cards
- **Grid**: `auto-fit` / `auto-fill` with `minmax(280px, 1fr)`
- **Compact**: Horizontal layout on mobile
- **Expanded**: More columns on larger screens

#### Typography
- **Fluid Scaling** — Clamp-based responsive sizing
- **Line Length** — Max 65-75ch for readability

#### Touch Optimizations
- **Larger Targets** — 48px minimum on mobile
- **Swipe Gestures** — Cards, drawers
- **Pull-to-Refresh** — Lists, feeds

---

## Component States

### Interactive States (All Components)
| State | Visual Treatment |
|-------|------------------|
| **Default** | Base styles |
| **Hover** | Subtle background/border change, cursor pointer |
| **Active/Pressed** | Scale 0.98, darker background |
| **Focus** | 3px ring, brand color, offset 2px |
| **Focus-Visible** | Same as focus, keyboard only |
| **Disabled** | 50% opacity, not-allowed cursor |
| **Loading** | Spinner, disabled, preserved dimensions |
| **Error** | Red border, error message, shake animation |

### Data States
| State | Treatment |
|-------|-----------|
| **Empty** | EmptyState component with CTA |
| **Loading** | Skeleton matching content shape |
| **Partial** | Show available, skeleton for rest |
| **Error** | Inline error with retry action |
| **Success** | Toast + inline confirmation |

---

## Dark Mode

### Implementation
- **CSS Variables** — All colors via `--color-*` custom properties
- **Media Query** — `@media (prefers-color-scheme: dark)`
- **Class Toggle** — `.dark` class for manual override
- **No Flash** — Inline script in `<head>` reads preference

### Color Mapping
| Light | Dark | Notes |
|-------|------|-------|
| `surface-50` | `surface-950` | Page bg |
| `surface-100` | `surface-900` | Cards |
| `text-primary` | `text-inverse` | Primary text |
| `border-subtle` | `surface-800` | Dividers |
| `shadow-*` | Darker, more opaque | Depth perception |

### Images
- **Avatars** — Same, with subtle inner shadow
- **Photos** — Slightly reduced brightness (CSS filter)
- **Illustrations** — Dark-mode variants where needed

---

## Motion Guidelines

### Principles
1. **Purposeful** — Every animation has a reason
2. **Performant** — Transform/opacity only, 60fps
3. **Respectful** — Honors reduced motion
4. **Consistent** — Same easing, durations across system

### Standard Durations
- **Micro** (120ms): Button hover, checkbox toggle
- **Base** (180ms): Modal open, dropdown, tooltip
- **Macro** (250ms): Page transitions, drawer slide
- **Expressive** (350ms): Celebration, onboarding

### Easing
- **Ease-out** (default): `cubic-bezier(0, 0, 0.2, 1)` — Entrance
- **Ease-in**: `cubic-bezier(0.4, 0, 1, 1)` — Exit
- **Spring**: `cubic-bezier(0.34, 1.56, 0.64, 1)` — Playful
- **Linear**: `linear` — Spinners, progress

---

## Visual QA Checklist

### Before Merge
- [ ] Light & dark mode tested
- [ ] All breakpoints verified (xs, sm, md, lg, xl, 2xl)
- [ ] Keyboard navigation complete (Tab, Enter, Escape, Arrows)
- [ ] Screen reader tested (NVDA/VoiceOver)
- [ ] Color contrast verified (text, UI, focus)
- [ ] Reduced motion respected
- [ ] Touch targets ≥ 44px
- [ ] Focus order logical
- [ ] Error states accessible
- [ ] Loading states present
- [ ] Empty states helpful
- [ ] RTL support (if applicable)

### Tools
- **Storybook** — Component isolation, viewport testing
- **Chromatic** — Visual regression
- **axe-core** — Automated a11y
- **Lighthouse** — Performance, a11y, SEO

---

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do |
|----------|-------|
| Hardcode colors | Use CSS variables / design tokens |
| Mix spacing units | Use spacing scale exclusively |
| Custom shadows | Use shadow tokens |
| `outline: none` without replacement | Always provide visible focus |
| Fixed pixel sizes | Use relative units (rem, clamp) |
| Arbitrary z-index | Use z-index scale |
| Inline styles for layout | Use utility classes / CSS Grid/Flex |
| Animation without purpose | Animate with intent |
| Ignore reduced motion | Respect `prefers-reduced-motion` |
| Color-only status | Icon + color + text |

---

## Implementation Guide

### Adding New Components
1. **Define API** — Props, variants, states
2. **Build with Tokens** — Only design token values
3. **Add Stories** — All variants, states, sizes
4. **Write Tests** — Unit, a11y, visual regression
5. **Document** — Usage, examples, do/don't
6. **Review** — Design + engineering sign-off

### Updating Tokens
1. **Audit Impact** — Find all usages
2. **Update Source** — `src/design/tokens.ts`
3. **Regenerate CSS** — `src/design/variables.css`
4. **Test Thoroughly** — All themes, breakpoints
5. **Version** — Semver for breaking changes

### Theming
```css
/* Custom theme override */
:root {
  --color-brand-purple: #YOUR_COLOR;
  --color-primary-500: #YOUR_COLOR;
  --color-primary-600: #YOUR_DARKER;
}

/* Or via data attribute */
[data-theme="custom"] {
  --color-brand-purple: #YOUR_COLOR;
}
```

---

## Resources

- **Tokens Source**: `src/design/tokens.ts`
- **CSS Variables**: `src/design/variables.css`
- **Components**: `src/components/ui/`
- **Hooks**: `src/lib/utils.ts`
- **Types**: `src/lib/types.ts`

---

*Last updated: 2024 — Zivora Design System v1.0*