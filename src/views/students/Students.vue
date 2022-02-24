<template>
  <div class="app-container" style="padding-top: 45px; padding-left: 0px">
    <div class="filter-container">
      <el-input
        v-model="name"
        placeholder="keyword"
        style="width: 300px; margin-left: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        style="margin-left: 10px"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("search") }}
      </el-button>

      <el-button
        :loading="downloading"
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t("export") }}
      </el-button>
    </div>
    <el-table v-loading="dialogPermissionLoading" :data="usersList1" stripe>
      <el-table-column prop="id" :label="$t('id')" sortable width="80" />

      <el-table-column prop="name" :label="$t('name')" sortable />
      <el-table-column
        prop="school.name"
        :label="$t('School')"
        sortable
        width="100"
      />
      <el-table-column prop="grade.grade" :label="$t('grade')" sortable />
      <el-table-column
        prop="classgroup[0].code"
        :label="$t('Class')"
        sortable
        width="100"
      />

      <el-table-column
        prop="fees.total"
        :label="$t('Fees')"
        sortable
        width="100"
      />

      <el-table-column :label="$t('sibling')" sortable width="100">
        <template slot-scope="{ row }">
          <div
            v-for="student_sibling in row.student_sibling"
            :key="student_sibling"
          >
            {{ student_sibling.sibling_student_id }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('actions')">
        <template slot-scope="{ row }" style="display: initial">
          <el-dropdown
            class="avatar-container right-menu-item hover-effect"
            trigger="click"
          >
            <div class="avatar-wrapper">
              <el-button
                type="outline-primary"
                class="user-avatar"
                icon="el-icon-more"
                size="mini"
              />
            </div>
            <el-dropdown-menu slot="dropdown">
              <router-link :to="'/students/show/' + row.id">
                <el-dropdown-item v-if="checkPermission('Add_user')">
                  {{ $t("Student Fees") }}</el-dropdown-item>
              </router-link>
              <router-link :to="'/accounting/paymentLog/' + row.id">
                <el-dropdown-item>{{ $t("Payment Log") }}</el-dropdown-item>
              </router-link>
              <router-link :to="'/accounting/kashir/' + row.id">
                <el-dropdown-item>{{ $t("Set Payment") }}</el-dropdown-item>
              </router-link>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="total > 0"
      style="margin-top: 20px"
      :current-page.sync="query.page"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog
      :visible.sync="dialogPermissionVisible"
      :title="$t('edit_permissions') + ' - ' + currentUser.name"
    >
      <div v-loading="dialogPermissionLoading" class="form-container">
        <div
          class="permissions-container"
          style="height: 58vh; width: 100%; overflow-y: scroll"
        >
          <div class="block" style="display: flex">
            <el-form label-width="80px" label-position="top">
              <el-form-item :label="$t('permissions')">
                <div
                  v-for="menuPermission in menuPermissions"
                  :key="menuPermission.name"
                  style="margin-left: 20px"
                >
                  <el-checkbox
                    v-if="!rolePermissions.includes(menuPermission.name)"
                    v-model="permissions"
                    :label="menuPermission.name"
                    name="permissions[]"
                  />
                </div>
              </el-form-item>
            </el-form>
            <el-form
              label-width="80px"
              label-position="top"
              style="margin-left: 130px"
            >
              <el-form-item label="Permissions of Role">
                <div
                  v-for="menuPermission in menuPermissions"
                  :key="menuPermission.name"
                  style="margin-left: 20px"
                >
                  <el-checkbox
                    v-if="rolePermissions.includes(menuPermission.name)"
                    v-model="permissions"
                    :label="menuPermission.name"
                    :disabled="rolePermissions.includes(menuPermission.name)"
                    name="permissions[]"
                  />
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="clear-left" />
        </div>
        <div style="text-align: right">
          <el-button type="danger" @click="dialogPermissionVisible = false">
            {{ $t("cancel") }}
          </el-button>
          <el-button
            type="primary"
            @click.native="handleModifypermissions(currentUserId)"
          >
            {{ $t("confirm") }}
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
  components: {},
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
        role: [
          { required: true, message: 'Role is required', trigger: 'change' }
        ],
        name: [
          { required: true, message: 'Name is required', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Email is required', trigger: 'blur' },
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          { required: true, message: 'Password is required', trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
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
  mounted() {
    if (!this.checkPermission('User_Management')) {
      this.$router.push({ path: '/403' })
    }
    console.log('Component mounted.')
  },
  created() {
    this.getAllStudents()
  },
  methods: {
    checkPermission,
    getAllStudents(page) {
      this.dialogPermissionLoading = true
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      const formdata = new FormData()
      formdata.append('limit', this.query.limit)
      formdata.append('token', store.getters.token)
      this.axios
        .post(
          store.getters.api_route + 'students?page=' + page,
          formdata,
          config
        )
        .then(res => {
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.total = res.data.data.total
          this.per_page = res.data.data.per_page
          this.usersList1 = res.data.data.data
          console.log(this.usersList1)

          this.dialogPermissionLoading = false
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'error'
          })
        })
    },
    handleFilter() {
      this.dialogPermissionLoading = true
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      const formdata = new FormData()
      formdata.append('token', store.getters.token)
      formdata.append('limit', this.query.limit)
      formdata.append('search', this.name)
      this.axios
        .post(store.getters.api_route + 'students', formdata, config)
        .then(res => {
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.total = res.data.data.total
          this.per_page = res.data.data.per_page
          this.usersList1 = res.data.data.data
          this.dialogPermissionLoading = false
        })
        .catch(err => {
          console.log(err)

          this.$message({
            message: err,
            type: 'error'
          })
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
        .post(
          store.getters.api_route + 'accounting/user/change_status',
          formdata,
          config
        )
        .then(res => {
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          row.status = status
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'error'
          })
        })
    },
    getallpermissions() {
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      const formdata = new FormData()
      formdata.append('token', store.getters.token)
      this.axios
        .post(
          store.getters.api_route + 'accounting/permissions/index',
          formdata,
          config
        )
        .then(res => {
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.dialogPermissionLoading = false
          this.menuPermissions = res.data.data
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'error'
          })
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
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      const formdata = new FormData()
      formdata.append('user_id', row.id)
      formdata.append('token', store.getters.token)
      this.axios
        .post(
          store.getters.api_route + 'accounting/permissions/index',
          formdata,
          config
        )
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
          console.log(err)
          this.$message({
            message: err,
            type: 'error'
          })
        })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    handleModifypermissions(id) {
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      const formdata = new FormData()
      formdata.append('id', id)
      formdata.append('permissions', this.permissions)
      formdata.append('token', store.getters.token)
      this.axios
        .post(
          store.getters.api_route + 'accounting/user/change_permissions',
          formdata,
          config
        )
        .then(res => {
          this.dialogPermissionVisible = false
          this.$message({
            message: res.data.message,
            type: 'success'
          })
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: err,
            type: 'error'
          })
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
        const list = this.usersList1
        const tHeader = [
          'Student ID',
          'Name',
          'School',
          'Grade',
          'Calss',
          'Fees'
        ]
        const filterVal = [
          'id',
          'name',
          'school',
          'grade',
          'classgroup',
          'fees'
        ]

        const data = this.formatJson(filterVal, list)
        // console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'Students-list'
        })
        this.downloadLoading = false
      })
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
      return this.usersList1.map(v =>
        filterVal.map(j => {
          console.log(v[j])
          if (typeof v[j] === 'object') {
            // console.log(v[j])
            if (j === 'school') {
              if (v[j] !== null) return v[j].name
            } else if (j === 'grade') {
              if (v[j] !== null) return v[j].grade
            } else if (j === 'classgroup') {
              if (v[j] !== null) return v[j][0].code
            } else if (j === 'fees') {
              if (v[j] !== null) return v[j].total
            }
          } else {
            console.log(v[j])
            return v[j]
          }
        })
      )
    },
    handleSizeChange(val) {
      this.query.limit = val
      this.getAllStudents()
    },
    handleCurrentChange(val) {
      this.getAllStudents(val)
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
