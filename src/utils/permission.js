import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value) {
    const permissions = store.getters && store.getters.permissions
    const permission = value
    if (permissions.includes(permission)) {
      // console.log(permission)
      return true
    }
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
