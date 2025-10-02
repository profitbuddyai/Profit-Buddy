export const buildSellerAsinQuery = (productsQuery, seller, sellerId) => {
  const categoryMap =
    seller?.categories?.reduce((acc, cat) => {
      acc[cat.name] = cat.id;
      return acc;
    }, {}) || {};

  const query = {
    sellerIds: sellerId,
    page: 0,
    perPage: 10000,
  };

  if (productsQuery.rootCategory?.length) {
    query.rootCategory = productsQuery.rootCategory.map((catName) => categoryMap[catName]).filter(Boolean);
  }

  if (productsQuery.brand?.length) {
    query.brand = productsQuery.brand;
  }

  const selection = encodeURIComponent(JSON.stringify(query));

  return selection;
};