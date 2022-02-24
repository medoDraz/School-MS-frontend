<template>

  <div class="app-container" style="padding-top: 45px; padding-left: 0;">
    <div class="filter-container">
      <el-input
        v-model="name"
        placeholder="keyword"
        style="width: 300px; margin-left: 10px;"
        clearable
        class="filter-item"
        @change="handleFilter"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        style="margin-left: 10px;"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t('search') }}
      </el-button>
      <router-link :to="'/user_management/user/entry'">
        <!--        v-if="checkPermission('Add_user')"-->
        <el-button
          v-if="checkPermission('Add_user')"
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-plus"
        >
          {{ $t('add') }}
        </el-button>
      </router-link>
      <el-button
        :loading="downloading"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t('export') }}
      </el-button>
    </div>
    <el-table v-loading="dialogPermissionLoading" :data="usersList1" stripe>
      <el-table-column type="index" :label="$t('id')" width="50" />
      <el-table-column prop="name" :label="$t('name')" sortable width="230" />
      <el-table-column prop="role.name" :label="$t('role')" sortable width="180">
        <template slot-scope="{row}">
          <p v-for="role in row.roles" :key="role.id">{{ role.name }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="email" :label="$t('email')" sortable width="230" />
      <el-table-column :label="$t('status')" prop="status" sortable width="110">
        <template slot-scope="{row}">
          <el-tag v-if="row.status === 1" type="success">
            {{ $t('active') }}
          </el-tag>
          <el-tag v-if="row.status === 0" type="danger">
            {{ $t('suspended') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label=" $t('actions') ">
        <template slot-scope="{row}" style="display: initial;">
          <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
            <div class="avatar-wrapper">
              <el-button type="outline-primary" class="user-avatar" icon="el-icon-more" size="mini" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <router-link :to="'/user_management/user/entry/'+row.id">
                <!--                v-if="checkPermission('Add_user')"-->
                <el-dropdown-item v-if="checkPermission('Edit_user')">{{ $t('edit') }}</el-dropdown-item>
              </router-link>
              <!--              v-if="checkPermission('Edit_user')"-->
              <el-dropdown-item v-if="checkPermission('Edit_user')" divided @click.native="handleEditPermissions(row)">
                {{ $t('edit_permissions') }}
              </el-dropdown-item>
              <!--              && checkPermission('Edit_user')-->
              <el-dropdown-item
                v-if="row.status === 0 && checkPermission('Edit_user')"
                divided
                @click.native="handleModifyStatus(row,1)"
              >
                {{ $t('active') }}
              </el-dropdown-item>
              <!--              && checkPermission('Edit_user')-->
              <el-dropdown-item
                v-if="row.status === 1 && checkPermission('Edit_user')"
                divided
                @click.native="handleModifyStatus(row,0)"
              >
                {{ $t('suspend') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" :pagination="getAllUsers" />

    <el-dialog :visible.sync="dialogPermissionVisible" :title=" $t('edit_permissions')+' - ' + currentUser.name">
      <div v-loading="dialogPermissionLoading" class="form-container">
        <div class="permissions-container" style="height: 58vh; width: 102%; overflow-y: scroll;">
          <div class="block" style="display: flex;">
            <el-form label-width="80px" label-position="top">
              <el-form-item :label="$t('permissions')">
                <div v-for="menuPermission in menuPermissions" :key="menuPermission.name" style="margin-left: 20px;">
                  <el-checkbox
                    v-if="!rolePermissions.includes(menuPermission.name)&&menuPermission.name"
                    v-model="permissions"
                    :label="menuPermission.name"
                    name="permissions[]"
                  />
                </div>
              </el-form-item>
            </el-form>
            <el-form label-width="80px" label-position="top" style="margin-left: 80px;">
              <el-form-item :label="$t('permissions_of_role')">
                <!--                <div style="display: inline-grid; margin-left: 40px;">-->
                <div v-for="menuPermission in menuPermissions" :key="menuPermission.name" style="margin-left: 20px;">
                  <el-checkbox
                    v-if="rolePermissions.includes(menuPermission.name)"
                    v-model="permissions"
                    :label="menuPermission.name"
                    :disabled="rolePermissions.includes(menuPermission.name)"
                    name="permissions[]"
                  />
                </div>

                <!--                </div>-->
              </el-form-item>
            </el-form>
          </div>
          <div class="clear-left" />
        </div>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogPermissionVisible=false">
            {{ $t('cancel') }}
          </el-button>
          <el-button type="primary" @click.native="handleModifypermissions(currentUserId)">
            {{ $t('confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>

</template>
<script>

import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission' // Permission directive
import checkPermission from '@/utils/permission'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import userslist from '@/api/userslist.json'
import store from '@/store'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Active: 'success',
        Suspend: 'danger',
        Archive: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    var validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.newUser.password) {
        callback(new Error('Password is mismatched!'))
      } else {
        callback()
      }
    }
    return {
      calendarTypeOptions,
      statusOptions: ['Active', 'Suspend', 'Draft'],
      textMap: { update: 'Edit', create: 'Create' },
      dialogStatus: '',
      usersList1: [],
      tableData: [],
      // users: userslist,
      list: null,
      total: 0,
      per_page: 0,
      listLoading: true,
      name: '',
      loading: true,
      downloading: false,
      userCreating: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      pageSizes: [10, 20, 30, 50],
      query: {
        page: 1,
        limit: 10,
        keyword: '',
        role: ''
      },
      roles: ['admin', 'manager', 'editor', 'user', 'visitor'],
      nonAdminRoles: ['editor', 'user', 'visitor'],
      newUser: {},
      dialogFormVisible: false,
      dialogPermissionVisible: false,
      dialogPermissionLoading: false,
      currentUserId: 0,
      currentUser: {
        id: '',
        name: '',
        permissions: [],
        rolePermissions: []
      },
      rolePermissions: [],
      rules: {
        role: [{ required: true, message: 'Role is required', trigger: 'change' }],
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
        email: [
          { required: true, message: 'Email is required', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
        ],
        password: [{ required: true, message: 'Password is required', trigger: 'blur' }],
        confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
      },
      permissionProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      permissions: [],
      cafeterias: [],
      menuPermissions: [],
      otherPermissions: []
    }
  },
  computed: {
    headers() {
      return [
        { text: 'Name', value: 'name' },
        { text: 'Name', value: 'name' },
        { text: 'Name', value: 'name' }
      ]
    },

    items() {
      return [
        { text: 'Name', value: 'name' },
        { text: 'Name', value: 'name' },
        { text: 'Name', value: 'name' }
      ]
    }
  },
  watch: {
    name: function(v) {
      // console.log(v)
      if (v) {
        this.name = v
        this.handleFilter()
      } else {
        this.getAllUsers()
      }
    }
  },
  mounted() {
    if (!this.checkPermission('Access_Users')) {
      this.$router.push({ path: '/403' })
    }
    console.log('Component mounted.')
  },
  created() {
    this.getAllUsers()
  },
  methods: {
    checkPermission,
    getAllUsers(page) {
      this.dialogPermissionLoading = true
      const header = {
        'Content-Type': 'multipart/form-data'
      }
      if (store.getters.token !== '') {
        header['AUTHORIZATION'] = 'Bearer ' + store.getters.token
      }
      const config = {
        headers: header// {"content-type": 'multipart/form-data'}
      }
      const formdata = new FormData()
      formdata.append('limit', this.query.limit)
      // formdata.append('token', store.getters.token)
      formdata.append('search', this.name)
      this.axios
        .post(store.getters.api_route + 'users/index?page=' + page, formdata, config)
        .then(res => {
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          // console.log(res.data.cafeterias)
          // this.cafeterias = res.data.cafeterias
          this.total = res.data.data.total
          this.per_page = res.data.data.per_page
          this.usersList1 = res.data.data.data
          // console.log(this.cafeterias[1])
          // const _this = this
          // this.usersList1.forEach(function(e) {
          //   if (e.cafeteria_id === 0) {
          //     e.cafeteria_name = 'All'
          //   } else {
          //     res.data.cafeterias.forEach(function(e1) {
          //       if (e1.id === e.cafeteria_id) {
          //         e.cafeteria_name = e1.name
          //       }
          //     })
          //   }
          // })
          this.dialogPermissionLoading = false
        })
        .catch(err => {
          console.log(err)
          if (err.response.status === 401) {
            this.$message({
              message: err.response.data.message,
              type: 'error'
            })
            location.reload()
            this.$router.push({ path: '/login' })
          } else {
            this.$message({
              message: err.response.data.message,
              type: 'error'
            })
          }
        })
    },
    blur() {
      console.log('sadsafd')
    },
    handleFilter() {
      this.dialogPermissionLoading = true
      const header = {
        'Content-Type': 'multipart/form-data'
      }
      if (store.getters.token !== '') {
        header['AUTHORIZATION'] = 'Bearer ' + store.getters.token
      }
      const config = {
        headers: header// {"content-type": 'multipart/form-data'}
      }
      const formdata = new FormData()
      formdata.append('token', store.getters.token)
      formdata.append('limit', this.query.limit)
      formdata.append('search', this.name)
      this.axios
        .post(store.getters.api_route + 'users/index', formdata, config)
        .then(res => {
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.cafeterias = res.data.cafeterias
          this.total = res.data.data.total
          this.per_page = res.data.data.per_page
          this.query.page = 1
          this.usersList1 = res.data.data.data
          this.dialogPermissionLoading = false
        })
        .catch(err => {
          if (err.response.status === 401) {
            this.$message({
              message: err.response.data.message,
              type: 'error'
            })
            location.reload()
            this.$router.push({ path: '/login' })
          } else {
            this.$message({
              message: err.response.data.message,
              type: 'error'
            })
          }
        })
    },
    handleModifyStatus(row, status) {
      const header = {
        'Content-Type': 'multipart/form-data'
      }
      if (store.getters.token !== '') {
        header['AUTHORIZATION'] = 'Bearer ' + store.getters.token
      }
      const config = {
        headers: header// {"content-type": 'multipart/form-data'}
      }
      const formdata = new FormData()
      formdata.append('id', row.id)
      formdata.append('status', Number(status))
      formdata.append('token', store.getters.token)
      this.axios
        .post(store.getters.api_route + 'user/change_status', formdata, config)
        .then(res => {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          row.status = Number(status)
          this.getAllUsers()
        })
        .catch(err => {
          if (err.response.status === 401) {
            this.$message({
              message: err.response.data.message,
              type: 'error'
            })
            location.reload()
            this.$router.push({ path: '/login' })
          } else {
            this.$message({
              message: err.response.data.message,
              type: 'error'
            })
          }
        })
    },
    getallpermissions() {
      const header = {
        'Content-Type': 'multipart/form-data'
      }
      if (store.getters.token !== '') {
        header['AUTHORIZATION'] = 'Bearer ' + store.getters.token
      }
      const config = {
        headers: header// {"content-type": 'multipart/form-data'}
      }
      const formdata = new FormData()
      formdata.append('token', store.getters.token)
      this.axios
        .post(store.getters.api_route + 'permissions/index', formdata, config)
        .then(res => {
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.dialogPermissionLoading = false
          this.menuPermissions = res.data.data
        })
        .catch(err => {
          if (err.response.status === 401) {
            this.$message({
              message: err.response.data.message,
              type: 'error'
            })
            location.reload()
            this.$router.push({ path: '/login' })
          } else {
            this.$message({
              message: err.response.data.message,
              type: 'error'
            })
          }
        })
    },
    permissionKeys(permissions) {
      return permissions.map(permssion => permssion.id)
    },
    async handleEditPermissions(row) {
      this.currentUserId = row.id
      this.currentUser.name = row.name
      this.dialogPermissionLoading = true
      this.dialogPermissionVisible = true
      this.getallpermissions()
      const header = {
        'Content-Type': 'multipart/form-data'
      }
      if (store.getters.token !== '') {
        header['AUTHORIZATION'] = 'Bearer ' + store.getters.token
      }
      const config = {
        headers: header// {"content-type": 'multipart/form-data'}
      }
      const formdata = new FormData()
      formdata.append('user_id', row.id)
      formdata.append('token', store.getters.token)
      this.axios
        .post(store.getters.api_route + 'permissions/index', formdata, config)
        .then(res => {
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.dialogPermissionLoading = false
          this.permissions = res.data.data.permissions
          this.rolePermissions = res.data.data.permissionsofRole
        })
        .catch(err => {
          if (err.response.status === 401) {
            this.$message({
              message: err.response.data.message,
              type: 'error'
            })
            location.reload()
            this.$router.push({ path: '/login' })
          } else {
            this.$message({
              message: err.response.data.message,
              type: 'error'
            })
          }
        })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    handleModifypermissions(id) {
      const header = {
        'Content-Type': 'multipart/form-data'
      }
      if (store.getters.token !== '') {
        header['AUTHORIZATION'] = 'Bearer ' + store.getters.token
      }
      const config = {
        headers: header// {"content-type": 'multipart/form-data'}
      }
      const formdata = new FormData()
      formdata.append('id', id)
      formdata.append('permissions', this.permissions)
      formdata.append('token', store.getters.token)
      this.axios
        .post(store.getters.api_route + 'user/change_permissions', formdata, config)
        .then(res => {
          this.dialogPermissionVisible = false
          this.$message({
            message: res.data.message,
            type: 'success'
          })
        })
        .catch(err => {
          if (err.response.status === 401) {
            this.$message({
              message: err.response.data.message,
              type: 'error'
            })
            location.reload()
            this.$router.push({ path: '/login' })
          } else {
            this.$message({
              message: err.response.data.message,
              type: 'error'
            })
          }
        })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'name', 'role', 'email', 'status']
        const filterVal = ['id', 'name', 'roles', 'email', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'Users-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      // const _this = this
      return this.usersList1.map((v, index) =>
        filterVal.map(j => {
          // console.log(j)
          if (typeof v[j] === 'object') {
            if (j === 'roles') {
              var roles = ''
              if (v[j] !== null) {
                v[j].forEach(function(e) {
                  roles = roles + e.name
                })
              }
              return roles
            }
          } else if (j === 'timestamp') {
            return parseTime(v[j])
          } else if (j === 'status') {
            if (v[j] === 0) {
              return 'Suspended'
            } else {
              return 'Active'
            }
          } else if (j === 'id') {
            return index + 1
          } else {
            return v[j]
          }
        })
      )
    },

    handleDelete(row, index) {
      // console.log(row)
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },

    handleSizeChange(val) {
      this.query.limit = val
      this.getAllUsers()
    },
    handleCurrentChange(val) {
      this.getAllUsers(val)
    }
  }
}
</script>
<style lang="scss" scoped>

  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }

  .dialog-footer {
    text-align: left;
    padding-top: 0;
    margin-left: 150px;
  }

  .app-container {
    flex: 1;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;

    .block {
      float: left;
      min-width: 250px;
    }

    .clear-left {
      clear: left;
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          padding-left: 7px;
          width: 28px;
          height: 28px;
          border-radius: 20px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }

    .el-form-item__content {
      display: inline-grid;
    }
  }

</style>
