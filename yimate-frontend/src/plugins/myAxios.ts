import axios from "axios";

// 判断为开发环境还是部署环境
const isDev = process.env.NODE_ENV === 'development';

// 创建实例时配置默认值
const myAxios = axios.create({
  baseURL: "http://localhost:8080/api",
});

// 在发送请求时携带凭证（cookie）
myAxios.defaults.withCredentials = true;

// Add a request interceptor
myAxios.interceptors.request.use(
  function (config) {
    console.log("我要发请求了", config);
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

myAxios.interceptors.response.use(
  function (response) {
    console.log("我收到响应了", response);
    // 未登录则跳转到登录页
    if (response?.data?.code === 40100) {
      const redirectUrl = window.location.href;
      window.location.href = `/user/login?redirect=${redirectUrl}`;
    }
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 解决 类型“AxiosResponse<any, any>”上不存在属性"xxx"
declare module "axios" {
  interface AxiosResponse<T = any> {
    // 这个地方放属性
    code: any;
    description: any;
  }
  // export function create(config?: AxiosRequestConfig): AxiosInstance;
}

export default myAxios;
