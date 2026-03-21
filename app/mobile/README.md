# Spentiva Mobile App

React Native mobile application for Spentiva expense management platform.

## Tech Stack

- **Framework:** React Native 0.81.5 + Expo 54
- **Language:** TypeScript (strict mode)
- **UI:** React Native Paper (Material Design 3)
- **State:** Zustand (UI state)
- **Navigation:** React Navigation v7 (Stack + Bottom Tabs)
- **Forms:** Formik + Yup
- **API:** REST APIs via custom `http` utility (Bearer token auth)
- **Testing:** Jest + @testing-library/react-native

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm
- Expo CLI (`npx expo`)

### Installation

```bash
cd app/mobile
pnpm install
```

### Development

```bash
pnpm start          # Start Expo dev server
pnpm android        # Run on Android emulator
pnpm ios            # Run on iOS simulator
```

### Code Quality

```bash
pnpm type-check     # TypeScript validation
pnpm lint           # ESLint check
pnpm format         # Prettier formatting
pnpm test           # Run tests
pnpm test:coverage  # Test coverage report
```

### Build

```bash
pnpm build:apk      # Android APK (via EAS)
pnpm build:ios       # iOS build (via EAS)
pnpm build:production # Production build (all platforms)
```

## Project Structure

```
app/mobile/
├── App.tsx                    # Entry point
├── src/
│   ├── colors.ts              # Theme color tokens
│   ├── config.ts              # Environment configuration
│   ├── fonts.ts               # Font definitions
│   ├── theme.ts               # Material Design 3 theme
│   ├── components/            # Reusable UI components
│   │   ├── AppButton.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorView.tsx
│   │   ├── ExpenseItemCard.tsx
│   │   ├── FormInput.tsx
│   │   ├── LoadingOverlay.tsx
│   │   ├── ScreenHeader.tsx
│   │   ├── StatCard.tsx
│   │   └── TrackerCard.tsx
│   ├── contexts/              # Zustand stores & React Context
│   │   ├── authStore.ts
│   │   ├── themeStore.ts
│   │   └── SnackbarContext.tsx
│   ├── services/              # REST API service layer
│   │   ├── trackerService.ts
│   │   ├── expenseService.ts
│   │   ├── analyticsService.ts
│   │   ├── usageService.ts
│   │   ├── categoryService.ts
│   │   ├── supportService.ts
│   │   └── paymentService.ts
│   ├── hooks/                 # Custom reusable hooks
│   │   ├── useImagePicker.ts
│   │   ├── useLocation.ts
│   │   ├── useNetwork.ts
│   │   └── useNotifications.ts
│   ├── navigation/            # Navigation configuration
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainTabNavigator.tsx
│   ├── screens/               # Screen components
│   │   ├── auth/
│   │   ├── TrackersScreen.tsx
│   │   ├── TrackerDetailScreen.tsx
│   │   ├── AnalyticsScreen.tsx
│   │   ├── UsageScreen.tsx
│   │   ├── MoreScreen.tsx
│   │   └── ...
│   ├── types/                 # TypeScript definitions
│   │   ├── index.ts
│   │   └── navigation.ts
│   └── utils/                 # Helper utilities
│       ├── error.ts
│       ├── http.ts
│       ├── logger.ts
│       └── storage.ts
├── assets/
│   └── fonts/               # Inter font files
├── .env.development
├── .env.production
└── app.json                 # Expo config
```

## Architecture

- **Screens** are thin — only UI rendering
- **Services** (`src/services/`) wrap all REST API calls using `http.ts`
- **Hooks** contain business logic
- **Utils** hold shared helper functions
- **Stores** (Zustand) manage UI state outside components
- **Navigation** is fully typed with TypeScript

## Font Setup

Download Inter font family from Google Fonts and place the TTF files in `assets/fonts/`:
- Inter-Regular.ttf
- Inter-Medium.ttf
- Inter-SemiBold.ttf
- Inter-Bold.ttf
