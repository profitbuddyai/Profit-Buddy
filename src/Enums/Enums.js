import { NODE_ENV } from '../../config';
import LinkIcon from '../Assets/Profit Buddy AI/cropped_circle_image.png';

export const Project_Name = 'profit buddy';

//keepa time converter
export const KEEPA_EPOCH_START_MINUTES = 21564000;

//minimum valid product criteria
export const MIN_ROI = 0.25; // 25%
export const MIN_PROFIT = 3.0; // $3

// Fee Types
export const PLACEMENT_FEE_TYPES = ['minimal', 'partial', 'optimized'];
export const CRITERIA_FOR_LOWEST_REFERRAL_FEE = 15; // $15
export const LOWEST_REFERRAL_PERC = 0.08; // 8%
export const HIGHEST_REFERRAL_PERC = 0.15; // 15%

//currency
export const CURRENCY = '$';

//Graph Configs
export const SalesGraphKeys = {
  salesRank: { label: 'Sales Rank', symbol: '#', color: '#299912dc', yAxis: 'right', type: 'line', decimal: false },
  newPrice: { label: 'New Price', symbol: CURRENCY, color: '#039BE5', yAxis: 'left', type: 'line', decimal: true },
  amazon: { label: 'Amazon', symbol: CURRENCY, color: '#ff5900dc', yAxis: 'left', type: 'area', decimal: true },
  buyBox: { label: 'Buybox', symbol: CURRENCY, color: '#f70cd0dc', yAxis: 'left', type: 'line', decimal: true },
};

export const OfferGraphKeys = {
  offerCount: { label: 'Offer Count', symbol: '', color: '#039BE5', yAxis: 'left', type: 'line', decimal: false },
};

export const SalesConfig = [
  { name: 'Amazon', key: 'amazonPrice', color: '#ff8400', lightColor: '#fff3d6', symbol: '$', strokeWidth: 2, decimal: true, fillGraph: true },
  { name: 'New Price', key: 'newPrice', color: '#8888dd', lightColor: '#f0f0fb', symbol: '$', strokeWidth: 2, decimal: true },
  { name: 'Sales Rank', key: 'sellRank', color: '#8FBC8F', lightColor: '#eef7ee', symbol: '#', strokeWidth: 2, decimal: false, axis: 'y2', notFoundText: 'Unknown' },
  { name: 'BuyBox', key: 'buybox', color: '#ff00b4', lightColor: '#facfed', symbol: '$', strokeWidth: 2, decimal: true, notFoundText: 'Suppressed' },
];

export const OfferCountConfig = [{ name: 'Offer Count', key: 'offerCount', color: '#8888dd', lightColor: '#f0f0fb', symbol: '', strokeWidth: 2, decimal: false }];

//Icon Images
export const IconImages = {
  dimention: 'https://img.icons8.com/dusk/128/tesseract.png',
  google: 'https://img.icons8.com/fluency/96/google-logo.png',
  whiteAmzon: 'https://img.icons8.com/ios-filled/50/FFFFFF/amazon.png',
  amazon: 'https://img.icons8.com/color/96/amazon.png',
  sheets: 'https://img.icons8.com/fluency/96/google-sheets--v1.png',
  robot: 'https://img.icons8.com/fluency/96/message-bot.png',
  card: 'https://img.icons8.com/color/48/bank-card-back-side.png',
  link: LinkIcon,
};

export const ScaleFactors = {
  large: 1,
  small: 0.63,
  xsmall: 0.5,
};

// Subscription
export const COUPON_CODE_PREFIX = 'PROFIT-BUDDY-';

export const SUBSCRIPTION_PLANS_DATA = {
  basic_monthly: {
    id: 'basic_monthly',
    idName: 'Basic Plan Monthly',
    name: 'Basic',
    subText: 'Perfect for individual users getting started',
    price: 34.99,
    isPopular: false,
    type: 'monthly',
    quotas: { aiChat: 50, supportAccess: true },
    benefits: ['Cancel at anytime', 'Access to ProfitBuddy University, Store Spying, AI Buddy, Chrome Extension, Sales Estimator, and more...'],
    includes: ['1 User', 'Unlimited Product Lookups', 'AI Access', 'Basic Support'],
  },
  basic_yearly: {
    id: 'basic_yearly',
    idName: 'Basic Plan Yearly',
    name: 'Basic',
    subText: 'Perfect for individual users getting started',
    price: 249.99,
    saving: 170,
    isPopular: false,
    type: 'yearly',
    quotas: { aiChat: 600, supportAccess: true },
    benefits: ['Cancel at anytime', 'Access to ProfitBuddy University, Store Spying, AI Buddy, Chrome Extension, Sales Estimator, and more...'],
    includes: ['1 User', 'Unlimited Product Lookups', 'AI Access', 'Basic Support'],
  },
  business_monthly: {
    id: 'business_monthly',
    idName: 'Business Plan Monthly',
    name: 'Business',
    subText: 'Ideal for teams needing full access',
    price: 49.99,
    isPopular: true,
    type: 'monthly',
    quotas: { aiChat: -1, supportAccess: true },
    benefits: ['Cancel at anytime', 'Access to ProfitBuddy University, Store Spying, AI Buddy, Chrome Extension, Sales Estimator, and more...'],
    includes: ['3 Users (With Individual Analytics)', 'Unlimited Product Lookups', 'Unlimited AI Access', 'Priority Support + Onboarding'],
  },
  business_yearly: {
    id: 'business_yearly',
    idName: 'Business Plan Yearly',
    name: 'Business',
    subText: 'Ideal for teams needing full access',
    price: 399.99,
    saving: 200,
    isPopular: true,
    type: 'yearly',
    quotas: { aiChat: -1, supportAccess: true },
    benefits: ['Cancel at anytime', 'Access to ProfitBuddy University, Store Spying, AI Buddy, Chrome Extension, Sales Estimator, and more...'],
    includes: ['3 Users (With Individual Analytics)', 'Unlimited Product Lookups', 'Unlimited AI Access', 'Priority Support + Onboarding'],
  },
};

export const VITE_STRIPE_PUBLISHABLE_KEY = NODE_ENV !== 'production' ? import.meta.env.VITE_TEST_STRIPE_PUBLISHABLE_KEY : import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
