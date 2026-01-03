// Plan limits configuration
export const PLAN_LIMITS = {
  free: { trackers: 3, messages: 300 },
  pro: { trackers: 20, messages: 500 },
  businesspro: { trackers: Infinity, messages: Infinity },
} as const;

// Plan types
export type PlanType = 'free' | 'pro' | 'businesspro';
export type BillingPeriod = 'monthly' | 'yearly';

// Plan display names
export const PLAN_NAMES: Record<PlanType, string> = {
  free: 'Free',
  pro: 'Pro',
  businesspro: 'Business Pro',
};

// Pricing structure for paid plans
export interface PlanPricing {
  monthly: number;
  yearly: number;
  yearlyDiscount: number; // Percentage discount for yearly
}

// Detailed pricing for paid plans (pro and businesspro)
export const PLAN_PRICING: Record<'pro' | 'businesspro', PlanPricing> = {
  pro: {
    monthly: 9,
    yearly: 86.4, // $9 * 12 * 0.8 (20% discount)
    yearlyDiscount: 20,
  },
  businesspro: {
    monthly: 19,
    yearly: 182.4, // $19 * 12 * 0.8 (20% discount)
    yearlyDiscount: 20,
  },
};

// Display prices for plan boxes (monthly pricing)
export const PLAN_PRICES: Record<PlanType, string> = {
  free: '$0',
  pro: '$9',
  businesspro: '$19',
};

// Plan features
export const PLAN_FEATURES: Record<PlanType, string[]> = {
  free: ['3 Trackers', '300 Messages/month', 'Basic Analytics', 'Email Support'],
  pro: ['20 Trackers', '500 Messages/month', 'Advanced Analytics', 'Priority Support'],
  businesspro: ['Unlimited Trackers', 'Unlimited Messages', 'Premium Analytics', '24/7 Support'],
};

// Helper to get plan limits
export const getPlanLimits = (plan: PlanType) => PLAN_LIMITS[plan];

// Helper to check if upgrade is available
export const canUpgrade = (currentPlan: PlanType, targetPlan: PlanType): boolean => {
  const planOrder: PlanType[] = ['free', 'pro', 'businesspro'];
  return planOrder.indexOf(targetPlan) > planOrder.indexOf(currentPlan);
};

// Helper to check if downgrade is available
export const canDowngrade = (currentPlan: PlanType, targetPlan: PlanType): boolean => {
  const planOrder: PlanType[] = ['free', 'pro', 'businesspro'];
  return planOrder.indexOf(targetPlan) < planOrder.indexOf(currentPlan);
};
