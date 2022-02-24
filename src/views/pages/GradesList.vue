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
      <el-table-column :label="$t('grade_name')" prop="name" sortable />
      <el-table-column :label="$t('notes')" prop="notes" sortable />

      <el-table-column :label="$t('status')" prop="status" sortable>
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
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" :pagination="getAllGrades" />

    <el-dialog :title="textMap[dialogStatus]+' - ' + $t('grade')" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        label-position="left"
        label-width="170px"
        style="width: 575px; "
      >
        <el-form-item :label="$t('grade_name')" prop="name">
          <el-input
            ref="name"
            v-model="dataForm.name"
            :rows="1"
            type="text"
            class="article-text"
            autosize
            placeholder="Please enter the Grade Name"
            required
          />
        </el-form-item>
        <el-form-item :label="$t('notes')" prop="note">
          <el-input
            ref="name"
            v-model="dataForm.note"
            :rows="1"
            type="textarea"
            class="article-text"
            autosize
            placeholder="Please enter the Notes"
            required
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('cancel') }}
        </el-button>
        <el-button type="primary" @click="createData(dialogStatus)">
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
      store_id: '',

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
        id: undefined,
        note: '',
        name: ''
      },
      rules: {
        cafeteria: [{ required: true, message: 'Store is required', trigger: 'change' }],
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }]
      },
      permissionProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      permissions: [],
      Cafeterias: [],
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
        this.getAllGrades()
      }
    }
  },
  mounted() {
    // if (this.dataForm.name === '') {
    //   this.$refs.name.focus()
    // }

    if (!this.checkPermission('Access_Grade')) {
      this.$router.push({ path: '/403' })
    }
    console.log('Component mounted.')
  },
  created() {
    this.getAllGrades()
    // this.getAllCafeterias()
  },
  methods: {
    checkPermission,
    getAllCafeterias() {
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
      formdata.append('search', this.name)
      formdata.append('limit', this.query.limit)
      this.axios
        .post(store.getters.api_route + 'Access_Grades', formdata, config)
        .then(res => {
          // console.log(res.data.data)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.Cafeterias = res.data.data.data
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
    getAllGrades(page) {
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
      formdata.append('limit', this.query.limit)
      formdata.append('search', this.name)
      this.axios.post(store.getters.api_route + 'grades/index?page=' + page, formdata, config)
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
      formdata.append('store_id', this.store_id)
      this.axios.post(store.getters.api_route + 'grades/index', formdata, config)
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
      this.axios.post(store.getters.api_route + 'grade/change_status', formdata, config)
        .then(res => {
          // console.log(res.data)
          this.$message({
            message: this.$t(res.data.message),
            type: 'success'
          })
          row.status = Number(status)
          this.getAllGrades()
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

    createData(type) {
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
          formdata.append('name', this.dataForm.name)
          formdata.append('note', this.dataForm.note)
          // formdata.append('token', store.getters.token)
          let url = ''
          type === 'create' ? url = 'grade/store' : url = 'grade/update'
          this.axios
            .post(store.getters.api_route + url, formdata, config)
            .then(res => {
              if (res.data.error === true) {
                this.$notify({
                  title: res.data.message + ' are Required',
                  message: this.$t(res.data.data['email'][0]),
                  type: 'error',
                  duration: 2000
                })
              } else {
                this.dataForm.name = ''
                this.dataForm.cafeteria = ''
                this.dataForm.status = 1
                this.$refs.dataForm.resetFields()
                this.getAllGrades()
                this.dialogFormVisible = false
                // this.$store.dispatch('tagsView/delVisitedView', this.$route)
                // this.$router.push({ path: '/accounts_payables/banks' })

                this.$notify({
                  title: 'success',
                  message: this.$t(res.data.message),
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
          formdata.append('name', this.dataForm.name)
          formdata.append('store_id', this.dataForm.cafeteria)
          formdata.append('status', this.dataForm.status)

          this.axios
            .post(store.getters.api_route + 'pages/group/update', formdata, config)
            .then(res => {
              if (res.data.error === true) {
                this.$notify({
                  title: res.data.message + ' are Required',
                  message: res.data.data['email'][0],
                  type: 'error',
                  duration: 2000
                })
              } else {
                this.dataForm.name = ''
                this.dataForm.cafeteria = ''
                this.dataForm.status = 1
                this.$refs.dataForm.resetFields()
                this.getAllGrades()
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
      this.dataForm.id = row.id
      this.dataForm.name = row.name
      this.dataForm.note = row.notes
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'Grade name', 'Note', 'status']
        const filterVal = ['id', 'name', 'notes', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'Grades-list'
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
        if (j === 'status') {
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
      this.getAllGrades()
      // console.log(`dgdg ${val} 条`);
    },
    handleCurrentChange(val) {
      this.getAllGrades(val)
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
