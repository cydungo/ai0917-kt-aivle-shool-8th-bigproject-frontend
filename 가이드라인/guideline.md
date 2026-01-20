# Project Guidelines

## UI/UX Design Philosophy

The project follows a **Minimalist B2B SaaS** aesthetic, prioritizing clarity, efficiency, and role-based distinctiveness.

- **Design System**: Built on `shadcn/ui` and `Tailwind CSS`.
- **Core Principles**:
  - **Minimalism**: Clean interfaces with ample whitespace, avoiding unnecessary decorations.
  - **Clarity**: High contrast text and clear hierarchy using font weights and sizes.
  - **Consistency**: Uniform spacing (8px grid) and component behavior across the application.
  - **Responsiveness**: Seamless transition from desktop (sidebar navigation) to mobile (bottom navigation).

## Role-Based Identity

The system employs a color-coded identity system to distinguish user roles, enhancing context and usability.

| Role                 | Primary Color | Hex       | Identity                |
| :------------------- | :------------ | :-------- | :---------------------- |
| **Admin (관리자)**   | Deep Graphite | `#2D3436` | Stability, Control      |
| **Manager (운영자)** | Royal Blue    | `#0984E3` | Trust, Professionalism  |
| **Author (작가)**    | Deep Indigo   | `#6C5CE7` | Creativity, Inspiration |

**Usage**: Apply these colors to:

- Active navigation states (sidebar/bottom nav).
- Primary action buttons.
- Focus rings and accent elements.

## Component Guidelines

### Layout & Spacing

- **Grid System**: Use an 8px base unit for all margins, paddings, and gaps (`p-2`, `m-4`, `gap-2`).
- **Containers**: Prefer `1px solid border (#E5E7EB)` over drop shadows for cards and containers to maintain a flat, clean look.
- **Mobile First**: Ensure all layouts adapt gracefully.
  - **Desktop**: 260px fixed sidebar.
  - **Mobile (<768px)**: Hide sidebar, show 56px bottom navigation bar or hamburger menu.

### Typography

- **Font**: `Inter` (sans-serif) for all text.
- **Scale**:
  - Body: `16px` (`text-base`) for readability.
  - Headers: `text-lg`, `text-xl`, `text-2xl` for hierarchy.
  - Labels/Buttons: `14px` (`text-sm`) with `font-medium`.

### Buttons

- **Height**: Minimum `48px` touch target on mobile.
- **Radius**: `4px` (`rounded-md`).
- **Variants**:
  - **Primary**: Solid fill (Role Color). Main actions.
  - **Secondary**: Outline (1px Role Color/Border). Supporting actions.
  - **Ghost**: Text-only/Hover bg. Navigation or less critical actions.

### Icons

- **Library**: `Lucide-react`.
- **Style**: Stroke width `1.5` for a refined look.
- **Size**: Standard `w-4 h-4` or `w-5 h-5`.

## Architecture & State Management

### Tech Stack

- **Framework**: React + Vite (CSR).
- **Language**: TypeScript.
- **Styling**: Tailwind CSS + shadcn/ui.
- **State Management**: TanStack Query (React Query) v5.
- **HTTP Client**: Axios (Centralized `apiClient`).

### API Integration

- **Centralized Client**: Use `src/app/api/axios.ts` for all requests.
  - Base URL: `import.meta.env.VITE_BACKEND_URL` / `import.meta.env.VITE_AI_BASE_URL`.
  - Auth: **HttpOnly Cookies** (No `localStorage` for tokens).
- **Service Layer**: Business logic resides in `src/app/services/`.
  - `authService.ts`, `adminService.ts`, etc.
- **Data Fetching**: Use `useQuery` for reads and `useMutation` for writes.
  - Handle loading/error states declaratively.

## Directory Structure

- `src/app/api`: Axios instance and interceptors.
- `src/app/components`: Reusable UI components (`/ui` for shadcn).
- `src/app/pages`: Route components grouped by domain (`/auth`, `/dashboard`).
- `src/app/services`: API service functions.
- `src/app/types`: TypeScript interfaces and types.
- `src/styles`: Global styles and theme definitions.

## Development Workflow

- **Environment Variables**: Manage via `.env` (git-ignored) and `.env.example`.
- **Linting/Formatting**: Follow project `.eslintrc.cjs` and Prettier config.

## Development Environment & Network (Additional)

### Networking (ngrok & Tailscale)

Since backend services are distributed across local environments:

1.  **Tailscale (Database/Main Backend)**:
    - Ensure your machine is connected to the Tailscale mesh network.
    - `VITE_BACKEND_URL` in `.env` should point to the peer's Tailscale IP (e.g., `http://100.x.y.z:8080`).
2.  **Ngrok (AI Service)**:
    - The AI service is exposed via public tunnel.
    - `VITE_AI_BASE_URL` in `.env` uses the ngrok URL (e.g., `https://xxxx.ngrok-free.app`).
    - **Important**: Ngrok requires a special header to bypass the warning page.
    - **Solution**: The `authorService.ts` is already configured to send `'ngrok-skip-browser-warning': 'true'`.

### Mocking with MSW (Mock Service Worker)

To solve the issue of **"Backend is offline"** or **"Unstable connection"**:

- **What it is**: A tool that intercepts API requests in the browser and returns fake data immediately.
- **How to enable**:
  1. Open `src/main.tsx`.
  2. Set `const ENABLE_MSW = true;` inside `enableMocking` function.
  3. Start the app (`npm run dev`).
  4. You will see `[MSW] Mocking enabled.` in the browser console.
- **How to modify mocks**:
  - Edit `src/mocks/handlers.ts` to change response data or add new API endpoints.

## Project Management & Reminders

### Personal Files

- All personal files (logs, CSVs, references) are stored in `Personal_Folder/`.
- This folder is git-ignored to prevent accidental commits of sensitive or local-only data.

### Backend Connection

- **Tailscale**: Not yet finalized as the definitive backend solution. Currently used for database access but subject to change.
- **Ngrok**: Used for AI service exposure.

### Documentation

- `DEV_LOG.md`: Located in `Personal_Folder/`. Use for daily retrospective and progress tracking.
- `DEV_LOG_GUIDELINE.md`: Located in `Personal_Folder/`. Reference for writing logs.
