import axios from "axios";
import { EndPoints } from "../Utils/EndPoints";
import { authClient } from "../Services/Axios";

export const getProductOffers = async (asin = '') => {
  try {
    const query = new URLSearchParams({
      asin,
    });
    const response = await authClient.get(`${EndPoints.getProductOffer}?${query.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
