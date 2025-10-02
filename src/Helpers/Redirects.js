const openInNewTab = (e, url) => {
  e?.preventDefault();
  e?.stopPropagation();
  if (url) window.open(url, '_blank');
};

export const redirectForSeller = (e, sellerId) => {
  if (!sellerId) return;
  const encoded = encodeURIComponent(sellerId.trim());
  openInNewTab(e, `/sellerProfile?sellerid=${encoded}`);
};

export const redirectToAmazonProductPage = (e, productAsin) => {
  if (!productAsin) return;
  const encoded = encodeURIComponent(productAsin.trim());
  openInNewTab(e, `https://www.amazon.com/dp/${encoded}`);
};

export const redirectToAmazonSellerPage = (e, sellerId) => {
  if (!sellerId) return;
  const encoded = encodeURIComponent(sellerId.trim());
  openInNewTab(e, `https://www.amazon.com/s?me=${encoded}`);
};

export const redirectToGoogleSearch = (e, searchTerm) => {
  if (!searchTerm) return;
  const encoded = encodeURIComponent(searchTerm.trim());
  openInNewTab(e, `https://www.google.com/search?q=${encoded}`);
};
export const redirectToSellerCentralHome = (e) => {
  openInNewTab(e, `https://sellercentral.amazon.com/`);
};

export const redirectToSellerCentralAddProduct = (e, asin) => {
  if (!asin) return;
  openInNewTab(e, `https://sellercentral.amazon.com/abis/listing/syh?asin=${asin}`);
};

export const redirectToSellerCentralInventory = (e, asin) => {
  if (!asin) return;
  openInNewTab(e, `https://sellercentral.amazon.com/myinventory/inventory?searchTerm=${asin}`);
};

export const redirectToSellerCentralOrders = (e, asin) => {
  if (!asin) return;
  openInNewTab(e, `https://sellercentral.amazon.com/orders-v3/search?q=${asin}&qt=asin`);
};
