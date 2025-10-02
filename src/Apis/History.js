import { authClient } from '../Services/Axios';
import { EndPoints } from '../Utils/EndPoints';

export const getHistory = async ({ page = 1 , limit = 10 }) => {
  try {
    const { data } = await authClient.get(`${EndPoints.getHistory}?page=${page}&limit=${limit}`);
    return data;
  } catch (err) {
    console.error('Failed to fetch history:', err);
  }
};

export const upsertHistory = async ({ asin, buyCost }) => {
  try {
    const { data } = await authClient.post(EndPoints.upsertHistory, { asin, buyCost });
    return data;
  } catch (err) {
    console.error('Failed to upsert history:', err);
  }
};
