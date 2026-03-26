/** Navigation type definitions */

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  TrackerDetail: { trackerId: string; tab?: string };
  ExpenseDetail: { trackerId: string; expenseId: string };
  AddExpense: { trackerId: string };
  EditExpense: { trackerId: string; expenseId: string };
  CategorySettings: { trackerId: string };
  Support: undefined;
  SupportDetail: { ticketId: string };
  Billing: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Trackers: undefined;
  Analytics: undefined;
  Usage: undefined;
  More: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string } | undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
