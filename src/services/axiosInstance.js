import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  // baseURL: "https://orb-production-2793.up.railway.app/",
  // baseURL: "https://orb-smoky.vercel.app/",
    baseURL: "https://orb-production-a6c0.up.railway.app/",

});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = token;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

export default axiosInstance;
// import axios from "axios";
// import Cookies from "js-cookie";

// const axiosInstance = axios.create({
//   baseURL: "https://orb-smoky.vercel.app/",
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = Cookies.get("token");
//   if (token) {
//     config.headers.Authorization = `${token}`; // لو الباك محتاج Bearer
//   }

//   // خلي الـ axios يضبط Content-Type لو FormData
//   if (config.data instanceof FormData) {
//     // axios بيضبطه لوحده
//     delete config.headers["Content-Type"];
//   } else {
//     // JSON → تأكدي Header صح
//     config.headers["Content-Type"] = "application/json";
//   }

//   return config;
// });


// export default axiosInstance;
