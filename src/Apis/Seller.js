import axios from 'axios';
import { EndPoints } from '../Utils/EndPoints';
import { authClient } from '../Services/Axios';

export const getSellerInfo = async (sellerId = '') => {
  try {
    const query = new URLSearchParams({
      sellerId,
    });
    const { data } = await authClient.get(`${EndPoints.getSellerInfo}?${query.toString()}`);
    return data?.seller;
  } catch (error) {
    throw error;
  }
};

export const getSellerRevenue = async (sellerId = '', sellerAsins = '') => {
  try {
    const query = new URLSearchParams({
      sellerId,
      sellerAsins,
    });
    const { data } = await authClient.get(`${EndPoints.getSellerRevenue}?${query.toString()}`);
    return data?.sellerRevenue;
  } catch (error) {
    throw error;
  }
};
