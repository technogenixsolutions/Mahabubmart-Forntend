import requests from "./httpServices";

const ProductServices = {
  getShowingProducts: async () => {
    return requests.get("/products/show");
  },
  // getShowingStoreProducts: async ({ category = "", title = "" }) => {
  //   return requests.get(`/products/store?category=${category}&title=${title}`);
  // },


  getShowingStoreProducts: async ({ category = "", title = "", page = 1, limit = 1, price = "" }) => {
    let query = `?category=${category}&title=${title}&page=${page}&limit=${limit}`;
    if (price) query += `&price=${price}`;
    return requests.get(`/products/store${query}`);
  },
  getAllProducts: async ({ category = "", title = "", page = 1, limit = 18, price = "" }) => {
    let query = `?category=${category}&title=${title}&page=${page}&limit=${limit}`;
    if (price) query += `&price=${price}`;
    return requests.get(`/products${query}`);
  },
  // getDiscountedProducts: async () => {
  //   return requests.get("/products/discount");
  // },


    getDiscountedProducts: async ({ category = "", title = "", page = 1, limit = 18, price = "" }) => {
    let query = `?category=${category}&title=${title}&page=${page}&limit=${limit}`;
    if (price) query += `&price=${price}`;
    return requests.get(`/products/discount${query}`);
  },

  getProductBySlug: async (slug) => {
    return requests.get(`/products/${slug}`);
  },
};

export default ProductServices;
