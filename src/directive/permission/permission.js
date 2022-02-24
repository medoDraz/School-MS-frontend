import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  if (value) {
    const permissions = store.getters && store.getters.permissions
    const permission = value
    if (permissions.includes(permission)) {
      // console.log(permission)
      return true
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    // return false
  }
  // const roles = store.getters && store.getters.roles
  //
  // if (value && value instanceof Array) {
  //   if (value.length > 0) {
  //     const permissionRoles = value
  //
  //     const hasPermission = roles.some(role => {
  //       return permissionRoles.includes(role)
  //     })
  //
  //     if (!hasPermission) {
  //       el.parentNode && el.parentNode.removeChild(el)
  //     }
  //   }
  // } else {
  //   throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  // }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
