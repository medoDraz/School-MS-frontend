<template>
  <div class="app-container" style="padding-top: 45px;">
    <div class="filter-container">
      <el-input
        v-model="name"
        placeholder="keyword"
        style="width: 300px; margin-left: 10px;"
        clearable
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="grade_id"
        placeholder="Grade"
        clearable
        style="width: 200px;margin-left: 10px;"
        class="filter-item"
        @change="handleFilter"
      >
        <div v-for="item in Grades" :key="item.id">
          <el-option
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </div>
      </el-select>
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
      <!--  v-if="checkPermission('Add_Banks')"     <router-link :to="'bank/entry/'">-->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click.native="handleCreate()"
      >
        {{ $t('add') }}
      </el-button>
      <!--      </router-link>-->

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
      <!--      <router-link :to="'/groups/groups_sorting'">-->
      <!--        <el-button-->
      <!--          v-waves-->
      <!--          class="filter-item"-->
      <!--          type="primary"-->
      <!--          style="margin-left: 10px;"-->
      <!--        >-->
      <!--          {{ $t('groups_sorting') }}-->
      <!--        </el-button>-->
      <!--      </router-link>-->
    </div>

    <el-table v-loading="listLoading" :data="rolesList1" stripe style="width: 100%;font-size: .8em">
      <el-table-column
        type="index"
        width="50"
        :label="$t('id')"
        sortable
      />
      <!-- <el-table-column prop="id" :label="$t('id')" sortable width="60" >
    </el-table-column> -->
      <el-table-column :label="$t('GroupName')" prop="name" />
      <el-table-column :label="$t('StoreName')" prop="store_id">
        <template slot-scope="{row}">
          <div v-if="row.grade !== 'null'" style="display: grid;">
            <span>{{ row.grade.name }}</span>
            <span v-if="row.grade.status === 0" style="color: #ff0000">{{ $t('suspended') }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('status')">
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

              <!--        v-if="checkPermission('Edit_Banks')"      <router-link :to="'bank/entry/'+row.id">-->
              <el-dropdown-item @click.native="handleUpdate(row)">
                {{ $t('edit') }}
              </el-dropdown-item>
              <!--              </router-link>-->
              <el-dropdown-item
                v-if="row.status!== 1"
                divided
                @click.native="handleModifyStatus(row,1)"
              >
                {{ $t('active') }}
              </el-dropdown-item>
              <!--              && checkPermission('Edit_Banks')-->
              <el-dropdown-item
                v-if="row.status!== 0"
                divided
                @click.native="handleModifyStatus(row,0)"
              >
                {{ $t('suspended') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>

      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" :pagination="getAllClasses" />

    <el-dialog :title="textMap[dialogStatus]+' - ' + $t('classes')" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        style="width: 575px; "
      >
        <el-row
          v-for="(item, index) in dataForm.data"
          :key="index"
        >
          <el-col :span="8" style="margin-right: 5px;">
            <el-form-item
              :prop="'data.' + index + '.grade_id'"
              :rules="{
                required: true,
                message: 'Grade is required',
                trigger: 'change'
              }"
            >
              <el-select
                v-model="item.grade_id"
                :placeholder="$t('grade_name')"
              >
                <el-option
                  v-for="grade in Grades"
                  :key="grade.id"
                  :label="grade.name"
                  :value="grade.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              :prop="'data.' + index + '.name'"
              :rules="{
                required: true,
                message: 'Class name is required',
                trigger: 'blur'
              }"
            >
              <el-input
                ref="name"
                v-model="item.name"
                :rows="1"
                type="text"
                class="article-text"
                autosize
                placeholder="Please enter the Class Name"
                required
              />
            </el-form-item>
          </el-col>
          <el-col v-if="dialogStatus==='create'" :span="2">
            <el-form-item>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                style="margin-left: 15px;"
                @click.prevent="remove_class(item)"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="dialogStatus==='create'" style="direction: rtl">
          <el-form-item>
            <el-button
              type="success"
              style="margin-right: 66px;"
              size="mini"
              @click="add_class"
            >{{ $t('new_class') }} <i
              class="el-icon-plus"
            /></el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('confirm') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission' // Permission directive
import checkPermission from '@/utils/permission' // Permission checking
// import DropdownMenu from '@/components/Share/DropdownMenu'
import store from '@/store'
// import { validNumber } from '@/utils/validate'

export default {
  name: 'BanksList',
  components: { Pagination },
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
      grade_id: '',

      loading: true,
      downloading: false,
      userCreating: false,

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
      dataForm: {
        data: [
          {
            key: 1,
            id: undefined,
            grade_id: '',
            name: '',
            status: 1
          }
        ],
        id: undefined,
        grade_id: '',
        name: '',
        status: 1
      },
      rules: {
        grade_id: [{ required: true, message: 'Grade is required', trigger: 'change' }],
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }]
      },
      permissionProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      permissions: [],
      Grades: [],
      rolesList3: [],
      accountsList: [],
      menuPermissions: [],
      otherPermissions: []
    }
  },
  computed: {},
  watch: {
    name: function(v) {
      // console.log(v)
      if (v) {
        this.name = v
        this.handleFilter()
      } else {
        this.getAllClasses()
      }
    }
  },
  mounted() {
    // if (this.dataForm.name === '') {
    //   this.$refs.name.focus()
    // }

    if (!this.checkPermission('Access_Class')) {
      this.$router.push({ path: '/403' })
    }
    console.log('Component mounted.')
  },
  created() {
    this.getAllGrades()
    this.getAllClasses()
  },
  methods: {
    add_class() {
      // console.log(this.education_instalments.length)
      this.dataForm.data.push({
        key: this.dataForm.data.length + 1,
        id: undefined,
        grade_id: '',
        name: '',
        status: 1
      })
    },
    remove_class(item) {
      var index = this.dataForm.data.indexOf(item)
      if (index !== -1) {
        this.dataForm.data.splice(index, 1)
      }
    },
    checkPermission,
    getAllGrades() {
      this.listLoading = true
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
      formdata.append('limit', 'NaN')
      this.axios.post(store.getters.api_route + 'grades/index', formdata, config)
        .then(res => {
          // console.log(res.data.data)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.total = res.data.data.total
          this.per_page = res.data.data.per_page
          this.Grades = res.data.data.data
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
    getAllClasses(page) {
      this.listLoading = true
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
      formdata.append('grade_id', this.grade_id)
      this.axios.post(store.getters.api_route + 'classes/index?page=' + page, formdata, config)
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
      formdata.append('grade_id', this.grade_id)
      this.axios.post(store.getters.api_route + 'classes/index', formdata, config)
        .then(res => {
          // console.log(res)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.total = res.data.data.total
          this.per_page = res.data.data.per_page
          this.rolesList1 = res.data.data.data
          // this.listLoading = false
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
      // formdata.append('token', store.getters.token)
      this.axios.post(store.getters.api_route + 'class/change_status', formdata, config)
        .then(res => {
          // console.log(res.data)
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          row.status = Number(status)
          this.getAllClasses()
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
      this.dataForm.id = ''
      this.dataForm.name = ''
      this.dataForm.cafeteria = ''
      this.dataForm.status = 1
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },

    createData() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
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
          formdata.append('classes', JSON.stringify(this.dataForm.data))

          // formdata.append('token', store.getters.token)

          this.axios
            .post(store.getters.api_route + 'class/store', formdata, config)
            .then(res => {
              if (res.data.error === true) {
                this.$notify({
                  title: res.data.message + ' are Required',
                  message: res.data.data['email'][0],
                  type: 'error',
                  duration: 2000
                })
              } else {
                this.dataForm.data = []
                this.dataForm.data.push({
                  key: this.dataForm.data.length + 1,
                  id: undefined,
                  grade_id: '',
                  name: '',
                  status: 1
                })
                this.$refs.dataForm.resetFields()
                this.getAllClasses()
                this.dialogFormVisible = false
                // this.$store.dispatch('tagsView/delVisitedView', this.$route)
                // this.$router.push({ path: '/accounts_payables/banks' })

                this.$notify({
                  title: 'success',
                  message: res.data.message,
                  type: 'success',
                  duration: 2000
                })
              }
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
        }
      })
    },
    updateData() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
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
          formdata.append('id', this.dataForm.id)
          formdata.append('classes', JSON.stringify(this.dataForm.data))

          this.axios
            .post(store.getters.api_route + 'class/update', formdata, config)
            .then(res => {
              if (res.data.error === true) {
                this.$notify({
                  title: res.data.message + ' are Required',
                  message: res.data.data['email'][0],
                  type: 'error',
                  duration: 2000
                })
              } else {
                this.dataForm.data = []
                this.dataForm.data.push({
                  key: this.dataForm.data.length + 1,
                  id: undefined,
                  grade_id: '',
                  name: '',
                  status: 1
                })
                this.$refs.dataForm.resetFields()
                this.getAllClasses()
                this.dialogFormVisible = false
                // this.$store.dispatch('tagsView/delVisitedView', this.$route)
                // this.$router.push({ path: '/accounts_payables/banks' })

                this.$notify({
                  title: 'success',
                  message: res.data.message,
                  type: 'success',
                  duration: 2000
                })
              }
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
        }
      })
    },
    handleFilter1(query) {
      // console.log(query)
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      const formdata = new FormData()
      formdata.append('token', store.getters.token)
      formdata.append('search', query)
      this.axios
        .post(store.getters.api_route + 'accounting/accounts/getallaccounts', formdata, config)
        .then(res => {
          // console.log(res)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          // this.total = res.data.data.length
          this.accountsList = res.data.data
          // return res.data.data
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
    getaccountdata() {
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      const formdata = new FormData()
      formdata.append('token', store.getters.token)
      formdata.append('id', this.dataForm.account_code)
      this.axios
        .post(store.getters.api_route + 'accounting/account/edit', formdata, config)
        .then(res => {
          this.accountdata = res.data.data
          // this.JvsForm.currency = res.data.data.currency
          // this.account_name = res.data.data.account_name

          // console.log(this.accountdata)
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
    previewFiles(event) {
      this.dataForm.form = event.target.files[0]
      // console.log(event.target.files)
    },
    handleUpdate(row) {
      // console.log(row)
      this.dataForm.data[0].id = row.id
      this.dataForm.data[0].name = row.name
      this.dataForm.data[0].grade_id = row.grade.id
      this.dataForm.data[0].status = row.status
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'Group name', 'Store Name', 'status']
        const filterVal = ['id', 'name', 'cafetria_stores', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    // async getList() {
    //   const { limit, page } = this.query
    //   this.loading = true
    //   const { data, meta } = userslist
    //   this.list = data
    //   this.list.forEach((element, index) => {
    //     element['index'] = (page - 1) * limit + index + 1
    //   })
    //   this.total = meta.total
    //   this.loading = false
    // },
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
    formatJson(filterVal) {
      return this.rolesList1.map((v, index) => filterVal.map(j => {
        // console.log(v)
        if (typeof v[j] === 'object') {
          if (j === 'cafetria_stores') {
            return v[j].name
          }
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
      }))
    },
    handleSizeChange(val) {
      this.query.limit = val
      this.getAllClasses()
      // console.log(`dgdg ${val} 条`);
    },
    handleCurrentChange(val) {
      this.getAllClasses(val)
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
