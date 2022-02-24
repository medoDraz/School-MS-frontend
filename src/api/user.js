import request from '@/utils/request'
import store from '@/store'

export function login(data) {
  return request({
    url: store.getters.api_route + 'login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: store.getters.api_route + 'user/detail',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
