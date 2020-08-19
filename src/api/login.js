import request from '../utils/request';
import config from '../../config';

/**
 * 登录
 */
export const login = (data) => {
  return request({
    url: `${config.host}/login/login`,
    method: 'post',
    data,
    withCredentials: true,
  });
};
