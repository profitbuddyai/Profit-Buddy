import { authClient } from '../../Services/Axios';
import { EndPoints } from '../../Utils/EndPoints';

export const inviteUser = async (payload) => {
  try {
    const { data } = await authClient.post(`${EndPoints.inviteUser}`, payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getInvitedUsers = async () => {
  try {
    const { data } = await authClient.get(`${EndPoints.getInvitedUsers}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteInvite = async (inviteId) => {
  try {
    const { data } = await authClient.delete(`${EndPoints.deleteInvite}/${inviteId}`);
    return data;
  } catch (error) {
    throw error;
  }
};
