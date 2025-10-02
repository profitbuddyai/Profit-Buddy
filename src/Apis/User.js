import axios from 'axios';
import { EndPoints } from '../Utils/EndPoints';
import { setUser, setUserLoading } from '../Redux/Slices/UserSlice';
import { dispatch } from '../Redux/Store';
import { toast } from 'react-toastify';
import { authClient, publicClient } from '../Services/Axios';

export const registerUser = async (payload) => {
  try {
    const { data } = await publicClient.post(`${EndPoints.registerUser}`, payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (payload) => {
  try {
    const { data } = await publicClient.post(`${EndPoints.verifyEmail}`, payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (payload) => {
  try {
    const { data } = await publicClient.post(`${EndPoints.loginUser}`, payload);
    dispatch(setUser(data?.user));
    localStorage.setItem('ProfitBuddyToken', data?.token);
    return data;
  } catch (error) {
    throw error;
  }
};

export const requestPasswordReset = async (payload) => {
  try {
    const { data } = await publicClient.post(`${EndPoints.requestPasswordReset}`, payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const verifyResetToken = async (payload) => {
  try {
    const { data } = await publicClient.post(`${EndPoints.verifyResetToken}`, payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (payload) => {
  try {
    const { data } = await publicClient.post(`${EndPoints.resetPassword}`, payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async (payload) => {
  try {
    const { data } = await authClient.post(`${EndPoints.deleteAccount}`, payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const requestDeleteAccount = async (payload) => {
  try {
    const { data } = await authClient.post(`${EndPoints.requestDeleteAccount}`, payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserDetail = async () => {
  try {
    const { data } = await authClient.get(`${EndPoints.getUserDetail}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (payload) => {
  try {
    const { data } = await authClient.post(`${EndPoints.updateProfile}`, payload);
    return data;
  } catch (error) {
    throw error;
  }
};
