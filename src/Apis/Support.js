import { authClient } from '../Services/Axios';
import { EndPoints } from '../Utils/EndPoints';

export const submitSupportQuery = async (query = '') => {
  try {
    const { data } = await authClient.post(`${EndPoints.submitSupportQuery}`, { query });
    return data;
  } catch (error) {
    throw error;
  }
};
