const PLANS = {
    FREE: { amount: 0, currency: 'INR', interval: 'month', limit: 1 },
    PREMIUM: { amount: 799, currency: 'INR', interval: 'month', limit: 5 },
    PREMIUM_PLUS: { amount: 1599, currency: 'INR', interval: 'month', limit: 10 },
} as const;

export default PLANS;
