import axios from 'axios';
import consola from 'consola';
import config from '../../config';

const service = axios.create({
  baseURL: `${config.host}/api`,
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    consola.error(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const { data } = response;
    const { code } = data;
    if (code === 0) {
      if (process.env.VUE_ENV === 'client') {
        window.location.reload();
      }
    }
    return response.data;
  },
  (error) => {
    consola.error(error);
    return Promise.reject(error);
  }
);

export default service;
