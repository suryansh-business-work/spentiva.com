# E2E Testing Guide - Spentiva Mobile App

## Framework: Maestro
Maestro is the recommended E2E testing framework for React Native / Expo apps.

### Installation
```bash
# macOS
curl -Ls "https://get.maestro.mobile.dev" | bash

# Windows (via WSL)
curl -Ls "https://get.maestro.mobile.dev" | bash

# Verify installation
maestro --version
```

### Running Tests

```bash
# Run all flows
maestro test e2e/flows/

# Run a specific flow
maestro test e2e/flows/01_auth_login.yaml

# Run with verbose output
maestro test --debug-output e2e/flows/

# Record a flow
maestro record e2e/flows/
```

### Prerequisites
1. App must be running on a simulator/emulator
2. Start the app: `npx expo start`
3. Ensure the backend server is running at the configured API_URL

### Test Flows

| # | Flow | Description |
|---|------|-------------|
| 01 | Auth Login | Login with valid/invalid credentials |
| 02 | Auth Register | Register a new account |
| 03 | Auth Forgot Password | Forgot password flow |
| 04 | Trackers List | View, search, refresh trackers |
| 05 | Tracker Detail | View tracker expenses |
| 06 | Add Expense | Add a new expense to tracker |
| 07 | Edit Expense | Edit an existing expense |
| 08 | Analytics | View analytics with filters |
| 09 | Usage | View usage statistics |
| 10 | Profile | View and edit profile |
| 11 | Settings | Toggle dark mode, check links |
| 12 | Support | View and create support tickets |
| 13 | Billing | View billing plans |
| 14 | Navigation | Full navigation flow test |
| 15 | Logout | Logout flow |
| 16 | Full User Journey | Complete end-to-end scenario |
