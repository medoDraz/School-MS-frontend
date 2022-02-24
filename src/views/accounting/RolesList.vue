<template>

  <div class="app-container" style="padding-top: 45px;">
    <div class="filter-container">
      <el-input
        v-model="name"
        placeholder="keyword"
        style="width: 300px; margin-left: 10px;"
        class="filter-item"
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
      <router-link :to="'/setting/role/add'">
        <el-button
          v-if="checkPermission('Add_role')"
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-plus"
        >
          {{ $t('add') }}
        </el-button>
      </router-link>

      <el-button
        v-waves
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

    <el-table v-loading="listLoading" :data="rolesList1" stripe style="width: 100%">
      <el-table-column type="index" width="80" />
      <!-- <el-table-column prop="id" :label="$t('id')" sortable width="60" >
      </el-table-column> -->
      <el-table-column prop="name" :label="$t('role')" sortable width="420" />
      <el-table-column prop="focus" :label="$t('focus')" sortable width="240" />
      <el-table-column :label="$t('status')" sortable width="200">
        <template slot-scope="{row}">
          <el-tag v-if="row.status === 1" type="success">
            Active
          </el-tag>
          <el-tag v-if="row.status === 0" type="danger">
            Suspended
          </el-tag>
        </template>

      </el-table-column>

      <el-table-column :label="$t('actions')">
        <template slot-scope="{row}" style="display: initial;">

          <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
            <div class="avatar-wrapper">
              <el-button type="outline-primary" class="user-avatar" icon="el-icon-more" size="mini" />
            </div>
            <el-dropdown-menu slot="dropdown">

              <router-link :to="'/setting/role/edit/'+row.id">
                <el-dropdown-item v-if="checkPermission('Edit_role')">{{ $t('edit') }}</el-dropdown-item>
              </router-link>
              <el-dropdown-item
                v-if="row.status!=='1' && checkPermission('Edit_role')"
                divided
                @click.native="handleModifyStatus(row,'1')"
              >
                {{ $t('active') }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="row.status!=='0' && checkPermission('Edit_role')"
                divided
                @click.native="handleModifyStatus(row,'0')"
              >
                {{ $t('suspend') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>

      </el-table-column>
    </el-table>

    <el-pagination
      v-show="total>0"
      style="margin-top: 20px;"
      :current-page.sync="query.page"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

  </div>

</template>

<script>

// import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission' // Permission directive
import checkPermission from '@/utils/permission' // Permission checking
// import DropdownMenu from '@/components/Share/DropdownMenu'
import store from '@/store'
import { parseTime } from '@/utils'
export default {
  name: 'RolesList',
  components: { },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Active: 'success',
        Suspend: 'danger',
        deleted: 'danger'
      }
      return statusMap[status]
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
      statusOptions: ['Active', 'Suspend', 'Draft'],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      currentPage4: 4,
      dialogStatus: '',
      pageSizes: [10, 20, 30, 50],
      rolesList1: [],

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
      query: {
        page: 1,
        limit: 10,
        name: '',
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
        name: '',
        permissions: [],
        rolePermissions: []
      },
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
      rolesList3: [],
      menuPermissions: [],
      otherPermissions: []
    }
  },
  computed: {},
  mounted() {
    if (!this.checkPermission('User_Management')) {
      this.$router.push({ path: '/403' })
    }
    console.log('Component mounted.')
  },
  created() {
    this.getAllRoles()
  },
  methods: {
    checkPermission,
    getAllRoles(page) {
      this.listLoading = true
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      const formdata = new FormData()
      formdata.append('limit', this.query.limit)
      formdata.append('token', store.getters.token)
      this.axios
        .post(store.getters.api_route + 'accounting/roles/index?page=' + page, formdata, config)
        .then(res => {
          // console.log(res.data.data)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.total = res.data.data.total
          this.per_page = res.data.data.per_page
          this.rolesList1 = res.data.data.data
          this.listLoading = false
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
    handleFilter() {
      // this.query.page = 1
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      const formdata = new FormData()
      formdata.append('token', store.getters.token)
      formdata.append('search', this.name)
      this.axios
        .post(store.getters.api_route + 'accounting/roles/getallroles', formdata, config)
        .then(res => {
          // console.log(res)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.total = res.data.data.length
          this.rolesList1 = res.data.data
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
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      const formdata = new FormData()
      formdata.append('id', row.id)
      formdata.append('status', status)
      formdata.append('token', store.getters.token)
      this.axios
        .post(store.getters.api_route + 'accounting/role/change_status', formdata, config)
        .then(res => {
          console.log(res.data)
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          row.status = status
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
        const tHeader = ['id', 'name', 'focus', 'status']
        const filterVal = ['id', 'name', 'focus', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    async getList() {
      const { limit, page } = this.query
      this.loading = true
      const { data, meta } = this.userslist
      this.list = data
      this.list.forEach((element, index) => {
        element['index'] = (page - 1) * limit + index + 1
      })
      this.total = meta.total
      this.loading = false
    },
    handleDelete(row, index) {
      console.log(row)
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    formatJson(filterVal) {
      return this.rolesList1.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    handleSizeChange(val) {
      this.query.limit = val
      this.getAllRoles()
      // console.log(`dgdg ${val} 条`);
    },
    handleCurrentChange(val) {
      this.getAllRoles(val)
      // console.log(`当前页: ${val}`);
    }
  }
}

</script>

<style lang="scss" scoped>

  .main-container {
    min-height: 100%;
    -webkit-transition: margin-left 0.28s;
    transition: margin-left 0.28s;
    margin-left: 100px;
    position: relative;
  }

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
  }

</style>
