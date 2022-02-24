import request from '@/utils/request';

export function login(data) {
  return request({
    url: 'http://127.0.0.1:8000/api/login',
    method: 'post',
    data: data,
  });
}

export function getInfo(token) {
  return request({
    url: 'http://127.0.0.1:8000/api/user/detail',
    method: 'post',
  });
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
  });
}

export function csrf() {
  return request({
    url: '/sanctum/csrf-cookie',
    method: 'get',
  });
}
