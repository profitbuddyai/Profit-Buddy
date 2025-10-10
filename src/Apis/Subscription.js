import { authClient } from '../Services/Axios';
import { EndPoints } from '../Utils/EndPoints';

export const createSubscription = async (payload) => {
  try {
    const { data } = await authClient.post(EndPoints.createSubscription, payload);
    return data;
  } catch (err) {
    console.error('Failed to create subscrition:', err);
    throw err;
  }
};

export const upgradeSubscription = async (payload) => {
  try {
    const { data } = await authClient.post(EndPoints.upgradeSubscription, payload);
    return data;
  } catch (err) {
    console.error('Failed to upgrade subscrition:', err);
    throw err;
  }
};

export const cancelSubscription = async () => {
  try {
    const { data } = await authClient.post(EndPoints.cancelSubscription);
    return data;
  } catch (err) {
    console.error('Failed to cancel Subscrition:', err);
    throw err;
  }
};

export const verifyCoupon = async (payload) => {
  try {
    const { data } = await authClient.post(EndPoints.verifyCoupon, payload);
    return data;
  } catch (err) {
    console.error('Failed to verify coupon:', err);
    throw err;
  }
};

export const getInvoices = async () => {
  try {
    const { data } = await authClient.get(EndPoints.getInvoices);
    return data;
  } catch (err) {
    console.error('Failed to fetch Invoices:', err);
    throw err;
  }
};
