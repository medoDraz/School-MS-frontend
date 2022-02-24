import request from '@/utils/request'
import Resource from '@/api/resource'
import store from '@/store'



export function	getRoutes() {
	  return request({
		url: '/vue-element-admin/routes',
		method: 'get'
	  })
	}

export function	getRoles(data) {
	  return request({
		url: 'https://betaw.skolconnect.com/api/accounting/roles/index',
		method: 'post',
		data: data
	  })
	}

export function	addRole(data) {
	  return request({
		url: '/vue-element-admin/role',
		method: 'post',
		data
	  })
	}

export function	updateRole(id, data) {
	  return request({
		url: `/vue-element-admin/role/${id}`,
		method: 'put',
		data
	  })
	}

export function	deleteRole(id) {
	  return request({
		url: `/vue-element-admin/role/${id}`,
		method: 'delete'
	  })
	}
