<template>
  <div class="app-container" style="padding-top: 45px; padding-left: 0px;">
    <div class="filter-container">
      <el-input v-model="name" placeholder="keyword" clearable style="width: 300px; margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="handleFilter">
        {{ $t('search') }}
      </el-button>
      <router-link :to="'/setting/cafeteria/entry'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus">
          {{ $t('add') }}
        </el-button>
      </router-link>
      <el-button v-waves :loading="downloading" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('export') }}
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="usersList1" style="width: 100%;font-size: .80em" stripe>
      <el-table-column prop="id" :label="$t('id')" sortable width="50" />
      <el-table-column prop="name" :label="$t('name')" sortable width="180" />
      <el-table-column prop="description" :label="$t('description')" sortable width="180" />
      <el-table-column prop="email" :label="$t('email')" sortable width="180" />
      <el-table-column prop="telephone" :label="$t('phone')" sortable width="120" />
      <el-table-column prop="mobile" :label="$t('mobile')" sortable width="120" />
      <el-table-column :label="$t('type')" prop="type" sortable width="80">
        <template slot-scope="{row}">
          <p v-if="row.type === 0">{{ $t('NonSchool') }}</p>
          <p v-else>{{ $t('school') }}</p>
        </template>
      </el-table-column>
      <el-table-column :label="$t('status')" prop="status" sortable width="100">
        <template slot-scope="{row}">
          <el-tag v-if="row.status === 1" type="success">
            {{ $t('active') }}
          </el-tag>
          <el-tag v-if="row.status === 0" type="danger">
            {{ $t('suspended') }}
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
              <router-link :to="'/setting/cafeteria/entry/'+row.id">
                <el-dropdown-item>{{ $t('edit') }}</el-dropdown-item>
              </router-link>
              <!--              <el-dropdown-item divided @click.native="handleEditPermissions(row.id)">-->
              <!--                Edit Permissions-->
              <!--              </el-dropdown-item>-->
              <el-dropdown-item v-if="row.status !== 1" divided @click.native="handleModifyStatus(row,1)">
                {{ $t('active') }}
              </el-dropdown-item>
              <el-dropdown-item v-if="row.status !== 0" divided @click.native="handleModifyStatus(row,0)">
                {{ $t('suspend') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" :pagination="getAllUsers" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission' // Permission directive
import userslist from '@/api/userslist.json'
import store from '@/store'
import { parseTime } from '@/utils'

export default {
  name: 'Cafeterias',
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
      textMap: { update: 'Edit', create: 'Create' },
      dialogStatus: '',
      usersList1: [],
      tableData: [],
      users: userslist,
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
        this.getAllUsers(0)
      }
    }
  },
  created() {
    this.getAllUsers(0)
  },
  methods: {
    getAllUsers(page) {
      this.listLoading = true
      // let config = {
      //   headers: {"content-type": 'multipart/form-data'}
      // }
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
      // formdata.append('token', store.getters.token)
      formdata.append('limit', this.query.limit)
      formdata.append('search', this.name)
      formdata.append('page', page)
      this.axios.post(store.getters.api_route + 'pages/Cafetrias/list', formdata, config)
        .then(res => {
          // console.log(res.data.data.data)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.total = res.data.data.total
          this.per_page = res.data.data.per_page
          this.usersList1 = res.data.data.data
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
      // this.listQuery.page = 1
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
      // formdata.append('token', store.getters.token)
      formdata.append('limit', this.query.limit)
      formdata.append('search', this.name)
      this.axios.post(store.getters.api_route + 'pages/Cafetrias/list', formdata, config)
        .then(res => {
          // console.log(res)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.total = res.data.data.total
          this.per_page = res.data.data.per_page
          this.usersList1 = res.data.data.data
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
      formdata.append('status', status)
      formdata.append('token', store.getters.token)
      this.axios.post(store.getters.api_route + 'pages/changeSts', formdata, config)
        .then(res => {
          // console.log(res.data)
          this.$notify({
            title: 'success',
            message: res.data.message,
            type: 'success',
            duration: 2000
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
    async handleEditPermissions(id) {
      this.currentUserId = id
      this.dialogPermissionLoading = true
      this.dialogPermissionVisible = true
      this.axios.post(store.getters.api_route + 'accounting/permissions/index')
        .then(res => {
          // console.log(res.data.data)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.dialogPermissionLoading = false
          this.menuPermissions = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
      // const found = this.list.find(user => user.id === id);
      // const { data } = await userResource.permissions(id);
      // this.currentUser = {
      //   id: found.id,
      //   name: found.name,
      //   permissions: data,
      // };
      // this.dialogPermissionLoading = false;
      // this.$nextTick(() => {
      //   this.$refs.menuPermissions.setCheckedKeys(this.permissionKeys(this.userMenuPermissions));
      //   this.$refs.otherPermissions.setCheckedKeys(this.permissionKeys(this.userOtherPermissions));
      // });
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
        const tHeader = ['id', 'name', 'Description', 'email', 'phone', 'mobile', 'type', 'status']
        const filterVal = ['id', 'name', 'description', 'email', 'telephone', 'mobile', 'type', 'status']
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
      const { data, meta } = userslist
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
      return this.usersList1.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else if (j === 'type') {
          if (v[j] === 0) {
            return 'Non School'
          } else {
            return 'School'
          }
        } else if (j === 'status') {
          if (v[j] === 0) {
            return 'Suspended'
          } else {
            return 'Active'
          }
        } else {
          return v[j]
        }
      }))
    },
    handleSizeChange(val) {
      // console.log(`dgdg ${val} 条`)
    },
    handleCurrentChange(val) {
      this.getAllUsers(val)
      // console.log(`当前页: ${val}`)
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
    .el-form-item__content{
      display: inline-grid;
    }
}
</style>
