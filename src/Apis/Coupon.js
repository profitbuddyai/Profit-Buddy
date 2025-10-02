import { EndPoints } from '../Utils/EndPoints';
import { authClient } from '../Services/Axios';

export const getCoupons = async () => {
  try {
    const response = await authClient.get(`${EndPoints.getCoupons}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateCoupon = async (payload) => {
  try {
    const response = await authClient.post(`${EndPoints.generateCoupon}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteCoupon = async (couponId) => {
  try {
    const response = await authClient.delete(`${EndPoints.deleteCoupon}/${couponId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
