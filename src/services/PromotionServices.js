import requests from "./httpServices";

const PromotionServices = {
  getAllPromotions: async () => {
    return requests.get("/promotions");
  },
  getShowingPromotions: async () => {
    return requests.get("/promotions/show");
  },
};

export default PromotionServices;
