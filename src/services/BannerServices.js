import requests from "./httpServices";

const BannerServices = {
  getAllBanners: async () => {
    return requests.get("/banners");
  },
  getShowingBanners: async () => {
    return requests.get("/banners/show");
  },
};

export default BannerServices;
