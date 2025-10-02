import { HIGHEST_REFERRAL_PERC, LOWEST_REFERRAL_PERC, MIN_PROFIT, MIN_ROI, PLACEMENT_FEE_TYPES } from '../Enums/Enums';

export const calculateMaxCost = (salePrice, totalFees) => {
  const maxCostByROI = (salePrice - totalFees) / (1 + MIN_ROI);

  const profit = salePrice - totalFees - maxCostByROI;

  if (profit >= MIN_PROFIT) {
    return Math.floor(maxCostByROI * 100) / 100;
  } else {
    const maxCostByProfit = salePrice - totalFees - MIN_PROFIT;
    return Math.floor(maxCostByProfit * 100) / 100;
  }
};

export const getFbaFeeRange = (originalSalePrice, fbaFee) => {
  if (originalSalePrice < 10) {
    return {
      lowestFba: Number(fbaFee.toFixed(2)),
      highestFba: Number((fbaFee + 0.77).toFixed(2)),
    };
  } else {
    return {
      lowestFba: Number(Math.max(0, fbaFee - 0.77).toFixed(2)),
      highestFba: Number(fbaFee.toFixed(2)),
    };
  }
};

export const calculateTotalFees = (product, salePrice, storageMonths = 0, isFBA = true, fbmFee = 0, placementFeeType = PLACEMENT_FEE_TYPES[0]) => {
  const { fbaFees = 0, prepFee = 0, closingFee = 0, storageFees = 0, inboundPlacementFee = {}, inboundShippingFee = 0 } = product?.fees || {};

  const { highestFba, lowestFba } = getFbaFeeRange(product?.info?.salePrice, fbaFees);

  const currentPlacementFee = inboundPlacementFee?.[placementFeeType];

  const referralFeePercent = salePrice <= 15 ? LOWEST_REFERRAL_PERC : HIGHEST_REFERRAL_PERC;
  const referralFee = salePrice * referralFeePercent;

  const appliedInboundShippingFee = isFBA ? inboundShippingFee : 0;
  const convertedStorageFee = isFBA ? storageMonths * storageFees : 0;
  const appliedPrepFee = isFBA ? prepFee : 0;
  const appliedPlacementFee = isFBA ? currentPlacementFee : 0;
  const fulfillmentFee = isFBA ? (salePrice < 10 ? lowestFba : highestFba) : Number(fbmFee);

  const totalFees = referralFee + fulfillmentFee + appliedInboundShippingFee + convertedStorageFee + appliedPrepFee + appliedPlacementFee + closingFee;

  return {
    referralFeePercent,
    referralFee,
    fulfillmentFee,
    inboundShippingFee: appliedInboundShippingFee,
    storageFee: convertedStorageFee,
    prepFee: appliedPrepFee,
    placementFee: appliedPlacementFee,
    closingFee,
    totalFees,
  };
};

export const calculateProfitMargin = (sellingPrice, costPrice, referralFee, fulfillmentFee) => {
  const totalCost = costPrice + referralFee + fulfillmentFee;
  const profit = sellingPrice - totalCost;
  const profitMargin = (profit / sellingPrice) * 100;
  return profitMargin.toFixed(2);
};

export const calculateProfit = (salePrice, costPrice, totalFees) => {
  return salePrice - costPrice - (totalFees || 0);
};

export const calculateROI = (profit, costPrice) => {
  return ((profit / costPrice) * 100).toFixed(2); // ROI %
};

export const calculateProfitAndROI = (totalFees, salePrice, costPrice) => {
  const profit = calculateProfit(salePrice, costPrice, totalFees);
  const roi = calculateROI(profit, costPrice);

  return {
    profit: Math.floor(profit * 100) / 100,
    roi,
  };
};

export const calculateOfferProfitAndROI = (product, offerPrice, storageMonth, fulfillment, fbmFee = 0, buyCost, placementFeeType) => {
  try {
    const fees = calculateTotalFees(product ?? {}, Number(offerPrice) || 0, storageMonth ?? 0, fulfillment === 'FBA', fbmFee ?? 0, placementFeeType);

    const { profit = 0, roi = 0 } = calculateProfitAndROI(fees?.totalFees, Number(offerPrice) || 0, Number(buyCost) || 0) || {};

    return { profit, roi };
  } catch (err) {
    console.error('Error in safeProfitAndROI:', err);
    return { profit: 0, roi: 0 };
  }
};

export const calculateEstimatSellerAsinRevenue = (product, noOfSeller = 1) => {
  if (!product || !product.info) return 0;

  const { buybox, salePrice, monthlySold } = product.info;
  const avgPrice = salePrice || buybox || 0;
  // const sellerSales = noOfSeller > 1 ? monthlySold : monthlySold;
  const estimatedRevenue = monthlySold * avgPrice;

  return estimatedRevenue;
};
