import axios from 'axios';
import { EndPoints } from '../Utils/EndPoints';
import { authClient } from '../Services/Axios';

export const getGraphData = async (asin = '', days = 'all') => {
  try {
    const query = new URLSearchParams({
      asin,
      days
    });
    const { data } = await authClient.get(`${EndPoints.getGraphData}?${query.toString()}`);
    return data?.grpahData;
  } catch (error) {
    throw error;
  }
};
