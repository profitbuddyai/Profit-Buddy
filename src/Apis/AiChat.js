import { authClient } from '../Services/Axios';
import BASE_URL from './../../config';
import { EndPoints } from './../Utils/EndPoints';

export const aiChatStream = async ({ message = '' }) => {
  try {
    const token = localStorage.getItem('ProfitBuddyToken'); // get your auth token

    const {data} = await authClient.get(`${EndPoints.aiChat}?message=${encodeURIComponent(message)}`);
    return data;
  } catch (error) {
    console.error('SSE failed:', err);
    throw error;
  }
};
