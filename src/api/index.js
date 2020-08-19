import request from '../utils/request';

/**
 * 获取作业
 */
export const getWorkList = (params) => {
  return request({
    url: '/pcr/getWorkList',
    method: 'get',
    params,
    withCredentials: true,
  });
};

/**
 * 新增作业
 */
export const createWork = (data) => {
  return request({
    url: '/pcr/createWork',
    method: 'post',
    data,
    withCredentials: true,
  });
};

/**
 * 更新作业
 */
export const updateWork = (data) => {
  return request({
    url: '/pcr/updateWork',
    method: 'post',
    data,
    withCredentials: true,
  });
};

/**
 * 删除作业
 */
export const deleteWork = (params) => {
  return request({
    url: '/pcr/deleteWork',
    method: 'get',
    params,
    withCredentials: true,
  });
};

/**
 * 查询作业
 */
export const queryWork = (params) => {
  return request({
    url: '/pcr/queryWork',
    method: 'get',
    params,
    withCredentials: true,
  });
};
