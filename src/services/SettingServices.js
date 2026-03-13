// import requests from "./httpServices";

// const SettingServices = {
//   //store setting all function
//   getOnlineStoreSetting: async () => {
//     return requests.get("/setting/store/all");
//   },
//   //store customization setting all function
//   getStoreCustomizationSetting: async () => {
//     return requests.get("/setting/store/customization/all");
//   },

//   getShowingLanguage: async () => {
//     return requests.get(`/language/show`);
//   },

//   getGlobalSetting: async () => {
//     return requests.get("/setting/global/all");
//   },
// };

// export default SettingServices;


import requests from "./httpServices";

const noCache = {
  params: { t: Date.now() },
  headers: {
    "Cache-Control": "no-cache",
  },
};

const SettingServices = {
  // store setting
  getOnlineStoreSetting: async () => {
    const res = await requests.get("/setting/store/all", noCache);
    return res.data;
  },

  // store customization setting
  getStoreCustomizationSetting: async () => {
    const res = await requests.get(
      "/setting/store/customization/all",
      noCache
    );
    return res.data;
  },

  // language
  getShowingLanguage: async () => {
    const res = await requests.get("/language/show", noCache);
    return res.data;
  },

  // global setting
  getGlobalSetting: async () => {
    const res = await requests.get("/setting/global/all", noCache);
    return res.data;
  },
};

export default SettingServices;
