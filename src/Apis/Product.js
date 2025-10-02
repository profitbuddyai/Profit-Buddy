import axios from 'axios';
import { EndPoints } from '../Utils/EndPoints';
import { store } from '../Redux/Store';
import { setProductsLoading } from '../Redux/Slices/ProductSlice';
import { authClient } from '../Services/Axios';

export const getProduct = async (asin = '') => {
  try {
    const asinParam = Array.isArray(asin) ? asin.join(',') : asin;

    const query = new URLSearchParams({
      asin: asinParam,
    });
    const { data } = await authClient.get(`${EndPoints.getProducts}?${query.toString()}`);
    return data?.products;
  } catch (error) {
    throw error;
  }
};

export const searchProducts = async (searchTerm, page = 0) => {
  try {
    const query = new URLSearchParams({
      searchTerm: searchTerm,
      page: page,
    });
    store.dispatch(setProductsLoading(true));
    const { data } = await authClient.get(`${EndPoints.searchProducts}?${query.toString()}`);
    return data.products;
  } catch (error) {
    throw error;
  } finally {
    store.dispatch(setProductsLoading(false));
  }
};

export const findProductAsin = async (querry = {}) => {
  try {
    // const query = new URLSearchParams({
    //   ...querry,
    // });
    const { data } = await authClient.get(`${EndPoints.findProductAsin}?selection=${querry}`);
    return data?.asins;
  } catch (error) {
    throw error;
  }
};
