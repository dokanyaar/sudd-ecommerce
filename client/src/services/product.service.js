import api from '../lib/api';

// get all products
export const getProducts = async () => {
  const { data } = await api.get('/products');

  return data;
};

// get product by slug
export const getProductBySlug = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);

  return data;
};
