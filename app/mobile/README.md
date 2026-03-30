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
- npm or pnpm
- Expo CLI (`npx expo`)
- Android Studio (with Android SDK & emulator) for Android builds
- Xcode (macOS only) for iOS builds

### Installation

```bash
cd app/mobile
npm install
```

### Development

```bash
npm start              # Start Expo dev server
npm run android        # Run on Android emulator
npm run ios            # Run on iOS simulator
npm run web            # Run in browser
```

### Testing

```bash
npm test               # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

### Code Quality

```bash
npm run type-check     # TypeScript type validation
npm run lint           # ESLint check
npm run format         # Prettier formatting
```

### Local Builds (Without EAS)

Build APK/AAB/IPA locally using the included build scripts:

```bash
# Android
npm run build:apk              # Release APK (signed, optimized)
npm run build:apk:debug        # Debug APK
npm run build:aab              # Release AAB (Play Store bundle)

# iOS (macOS only)
npm run build:ios              # Simulator build (Release)
npm run build:ios:device       # Device build (Release IPA)
npm run build:ios:debug        # Simulator build (Debug)
```

Build output goes to `builds/` folder with timestamp: `spentiva-release-2026-03-30_11-35-19.apk`

#### Release Keystore (Android)

Generate a release keystore for signing production APKs:

```bash
npm run generate:keystore
```

### EAS Cloud Builds

```bash
npm run eas:build:apk          # EAS build → Android APK (preview)
npm run eas:build:ios          # EAS build → iOS (preview, simulator)
npm run eas:build:production   # EAS build → Production (all platforms)
```

### Prebuild

```bash
npm run prebuild               # Generate native android/ios directories
npm run prebuild:clean         # Clean + regenerate native directories
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

Uses `@expo-google-fonts/inter` package — fonts are bundled and loaded automatically via `expo-font` at app startup. No manual download needed.

## Environment Configuration

Environment variables are in `.env.development` and `.env.production`:

| Variable               | Development                | Production                     |
|------------------------|----------------------------|--------------------------------|
| `API_URL`              | `http://10.0.2.2:5002`    | `https://server.spentiva.com`  |
| `IMAGEKIT_URL_ENDPOINT`| `https://ik.imagekit.io/esdata1` | `https://ik.imagekit.io/esdata1` |

> Note: `10.0.2.2` is the Android emulator's alias for the host machine's localhost.
