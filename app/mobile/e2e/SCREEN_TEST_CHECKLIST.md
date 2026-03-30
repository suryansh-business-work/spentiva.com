# Spentiva Mobile App - Screen Test Checklist

## Simulator/Emulator Test Checklist

### 1. App Launch & Splash Screen
- [ ] App launches without crash
- [ ] Splash screen displays correctly
- [ ] Loading spinner visible during initialization
- [ ] Fonts load correctly (Inter family)
- [ ] App transitions to Login screen after initialization

### 2. Login Screen (/Auth/Login)
- [ ] Welcome text displays: "Welcome Back"
- [ ] Subtitle displays: "Sign in to Spentiva"
- [ ] Email input field renders
- [ ] Password input field renders
- [ ] Password toggle (eye icon) works
- [ ] "Sign In" button renders
- [ ] "Forgot Password?" link renders
- [ ] "Create Account" link renders
- [ ] Empty form submission shows validation errors
- [ ] Invalid email shows "Invalid email" error
- [ ] Short password shows "Min 6 characters" error
- [ ] Valid login navigates to Trackers screen
- [ ] Invalid login shows error snackbar
- [ ] Loading state shows on button during submission
- [ ] Keyboard avoids input fields (iOS/Android)
- [ ] Gradient background renders correctly

### 3. Register Screen (/Auth/Register)
- [ ] Screen navigated from Login "Create Account" link
- [ ] Header displays: "Create Account"
- [ ] Subtitle displays: "Join Spentiva today"
- [ ] First Name, Last Name, Email, Password, Confirm Password fields render
- [ ] Password toggle works for both password fields
- [ ] Empty form shows all validation errors
- [ ] Mismatched passwords show "Passwords must match"
- [ ] Email validation works
- [ ] Password min 8 chars validated
- [ ] Successful registration navigates to Trackers
- [ ] "Already have an account? Sign In" navigates back
- [ ] ScrollView works with keyboard open

### 4. Forgot Password Screen (/Auth/ForgotPassword)
- [ ] Screen accessible from Login
- [ ] Title: "Reset Password"
- [ ] Email input renders
- [ ] Empty submission shows error
- [ ] Valid email shows success message
- [ ] "Back to Sign In" navigates back

### 5. Reset Password Screen (/Auth/ResetPassword)
- [ ] Token input renders
- [ ] New Password & Confirm Password inputs render
- [ ] Password validation (uppercase, lowercase, number, min 8)
- [ ] Successful reset navigates to Login
- [ ] Password toggle works

### 6. Trackers Screen (Main Tab 1)
- [ ] Screen header: "Trackers"
- [ ] Search bar renders with placeholder "Search trackers..."
- [ ] Tracker cards display (name, type, currency)
- [ ] Pull-to-refresh works
- [ ] Search filtering works in real-time
- [ ] FAB (+) button visible at bottom right
- [ ] Empty state shows when no trackers
- [ ] Error state shows with retry button
- [ ] Tapping a tracker navigates to TrackerDetail

### 7. Tracker Detail Screen
- [ ] Header shows "Tracker"
- [ ] Back button works
- [ ] Breadcrumb: "Trackers > Expenses"
- [ ] Expense list loads
- [ ] Pull-to-refresh works
- [ ] Empty state for no expenses
- [ ] Error state with retry
- [ ] Tapping expense navigates to EditExpense

### 8. Add Expense Screen
- [ ] Header: "Add Expense"
- [ ] Back button works
- [ ] Breadcrumb renders
- [ ] Amount (numeric keyboard), Category, Description, Payment Method inputs
- [ ] Form validation works
- [ ] Successful submission shows snackbar and navigates back
- [ ] Error handling works

### 9. Edit Expense Screen
- [ ] Header: "Edit Expense"
- [ ] Loading state while fetching expense data
- [ ] Form pre-filled with existing data
- [ ] Update works and navigates back
- [ ] Error handling works

### 10. Analytics Screen (Main Tab 2)
- [ ] Header: "Analytics"
- [ ] Breadcrumb: "Analytics"
- [ ] Filter chips: Today, This Week, This Month, This Year, All Time
- [ ] Filter switching reloads data
- [ ] Expense, Income, Balance, Transactions stat cards
- [ ] Category breakdown displays
- [ ] Empty state when no data
- [ ] Error state with retry

### 11. Usage Screen (Main Tab 3)
- [ ] Header: "Usage"
- [ ] Breadcrumb: "Usage"
- [ ] Stat cards: Total Messages, Total Tokens, Your Messages, AI Messages
- [ ] Message Distribution progress bars
- [ ] Empty state when no data
- [ ] Error state with retry

### 12. More Screen (Main Tab 4)
- [ ] Header: "More"
- [ ] Profile card shows avatar, name, email
- [ ] Menu items: Profile, Billing, Support, Settings
- [ ] Dark/Light Mode toggle item
- [ ] Logout item (red styled)
- [ ] Each menu item navigates correctly
- [ ] Theme toggle works immediately

### 13. Profile Screen
- [ ] Header: "Profile" with back button
- [ ] Avatar with initials
- [ ] Name and email display
- [ ] Edit form: First Name, Last Name
- [ ] Save Changes button
- [ ] Account Status info
- [ ] Two-Factor Auth info
- [ ] Logout button with confirmation dialog
- [ ] Dialog Cancel and Logout buttons work

### 14. Billing Screen
- [ ] Header: "Billing" with back button
- [ ] Current Plan card
- [ ] Available Plans section
- [ ] Free, Pro, Business Pro plan cards
- [ ] Plan features listed
- [ ] Upgrade buttons for non-current plans

### 15. Support Screen
- [ ] Header: "Support" with back button
- [ ] Ticket list loads
- [ ] Ticket cards show: ID, status, subject, description, date
- [ ] Pull-to-refresh works
- [ ] FAB for new ticket
- [ ] Empty state when no tickets
- [ ] Error state with retry

### 16. Category Settings Screen
- [ ] Header: "Categories" with back button
- [ ] Category list loads
- [ ] Category cards show: color dot, name, subcategories
- [ ] Delete button works
- [ ] Pull-to-refresh works
- [ ] FAB for new category
- [ ] Empty state when no categories

### 17. Settings Screen
- [ ] Header: "Settings" with back button
- [ ] Appearance section with Dark Mode toggle
- [ ] About section: Version, Privacy Policy, Terms of Service
- [ ] Dark Mode switch toggles theme
- [ ] External links open browser

### 18. Cross-Cutting Concerns
- [ ] All screens responsive on different screen sizes
- [ ] Dark mode applies consistently across all screens
- [ ] No console errors/warnings in development mode
- [ ] Snackbar appears and auto-dismisses
- [ ] Navigation animations smooth (slide_from_right)
- [ ] Tab bar shows correct active/inactive colors
- [ ] Tab icons render correctly
- [ ] Font family 'Inter' variants render correctly
- [ ] SafeArea handles notch/status bar correctly
- [ ] App handles no network gracefully
- [ ] App recovers from background/suspended state
- [ ] Session persists across app restart
- [ ] Logout clears all session data
