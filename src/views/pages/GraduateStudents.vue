<template>
  <div class="app-container" style="padding-top: 45px; padding-left: 5px;">
    <div class="filter-container">
      <el-form ref="FilterForm" size="small" class="form-container" :model="FilterForm" :rules="FilterRules">
        <el-card class="header" body-style="padding: 10px;" style="margin-bottom: 15px;">
          <el-row>
            <el-col :span="8" style="margin-left: 8px;">
              <el-row style="margin-top: 8px;">
                <el-col :span="6" style="margin-right: 10px;">
                  <el-form-item :label="$t('student')" class="postInfo-container-item">
                    <span style="float: right; font-weight: bold;">:</span>
                  </el-form-item>
                </el-col>
                <el-col :span="17">
                  <el-form-item style="margin-bottom: 0;">
                    <el-select
                      v-model="FilterForm.studentId"
                      filterable
                      remote
                      clearable
                      reserve-keyword
                      :placeholder="$t('SearchStudent')"
                      :remote-method="remoteMethod"
                      style="margin-left: 10px;width: 100%;"
                      @change="handleFilter()"
                    >
                      <el-option
                        v-for="student in students"
                        :key="student.id"
                        :label="student.first_name + ' ' + student.middle_name + ' ' + student.last_name"
                        :value="student.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12" style="margin-left: 10px;">
              <el-row style="margin-top: 8px;">
                <el-col :span="6" style="margin-right: 10px;">
                  <el-form-item :label="$t('date_range')" class="postInfo-container-item">
                    <span style="float: right; font-weight: bold;">:</span>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item style="margin-bottom: 0px;">
                    <el-date-picker
                      v-model="FilterForm.date_range"
                      type="daterange"
                      range-separator="To"
                      value-format="yyyy-MM-dd"
                      start-placeholder="Start date"
                      end-placeholder="End date"
                      @change="handleFilter()"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="3">
              <el-button v-waves class="filter-item" type="primary" style="margin-left: 10px;margin-bottom: 0;margin-top: 6px;" icon="el-icon-search" @click="handleFilter">
                {{ $t('search') }}
              </el-button>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 10px;">
            <el-button v-waves :loading="downloading" class="filter-item" style="margin-left: 10px;margin-bottom: 0;" type="primary" icon="el-icon-download" @click="handleDownload">
              {{ $t('export') }}
            </el-button>
            <el-button v-print="printObj" type="success">
              {{ $t('print') }}
            </el-button>
            <el-button @click="resetForm('FilterForm')">{{ $t('clear') }}</el-button>
          </el-row>
          <!--          <span v-if="!FilterForm.studentId && !FilterForm.date_range" style="color: red;">* This page may run slowly because the data is large</span>-->
        </el-card>
      </el-form>
      <!--      <el-button v-waves :loading="downloading" class="filter-item" style="margin-left: 10px;margin-bottom: 0;" type="primary" icon="el-icon-download" @click="handleDownload">-->
      <!--        {{ $t('export') }}-->
      <!--      </el-button>-->
    </div>
    <div id="printMe">
      <el-table v-loading="listLoading" :data="studentWallets" style="width: 100%;font-size: .70em" :cell-style="tableRowColor" stripe>
        <el-table-column prop="id" :label="$t('transaction_no')" width="100" />
        <el-table-column prop="student_name" :label="$t('student_name')" />
        <el-table-column prop="date" :label="$t('date')" />
        <el-table-column prop="note" :label="$t('note')" />
        <el-table-column prop="amount" :label="$t('amount')" />
        <el-table-column :label="$t('type')" prop="type">
          <template slot-scope="{row}">
            <el-tag v-if="row.type === 'balance'" type="success">
              {{ $t('balance') }}
            </el-tag>
            <el-tag v-if="row.type === 'order'" type="danger">
              {{ $t('order') }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" :pagination="getAllUsers" />-->
  </div>
</template>
<script>
// import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission' // Permission directive
import userslist from '@/api/userslist.json'
import store from '@/store'
import { parseTime } from '@/utils'
import moment from 'moment'
import checkPermission from '@/utils/permission'

export default {
  name: 'StudentBalanceReport',
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
    }
  },
  data() {
    return {
      printObj: {
        id: 'printMe',
        popTitle: 'Student Balance Reports',
        style: '@media print{@page{size:landscape}}'
        // extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      },
      statusOptions: ['Active', 'Suspend', 'Draft'],
      textMap: { update: 'Edit', create: 'Create' },
      dialogStatus: '',
      usersList1: [],
      studentWallets: [],
      students: [],
      studentId: '',
      users: userslist,
      list: null,
      total: 0,
      per_page: 0,
      listLoading: false,
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
      FilterForm: {
        studentId: '',
        date_range: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        to: ''
      },
      FilterRules: {
        studentId: [{ required: true, message: 'Student is required', trigger: 'change' }],
        date_range: [{ required: true, message: 'This field is required', trigger: 'change' }],
        to: [{ required: true, message: 'This field is required', trigger: 'change' }]
      },
      pickerOptions: {
        disabledDate: this.disabledDate
      },
      pickerFromOptions: {
        disabledDate: this.disabledFromDate
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
    this.handleFilter()
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.FilterForm.date_range = ''
      this.FilterForm.studentId = ''
      // this.studentWallets = []
      this.handleFilter()
    },
    tableRowColor({ row, column, rowIndex, columnIndex }) {
      if (row.student_name === 'Total') {
        return 'background-color: #dcdde0;color: #287131;font-size: 15px;font-weight: bold;'
      }
    },
    checkPermission,
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0 || index === 1 || index === 4) {
          sums[index] = ''
          return
        }
        if (index === 2) {
          sums[index] = 'Total'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    disabledDate(time) {
      // console.log(new Date(this.pfrom).getTime())
      return time.getTime() <= new Date(this.FilterForm.from).getTime()
    },
    disabledFromDate(time) {
      console.log(time.getTime())
      return time.getTime() >= new Date(this.FilterForm.to).getTime()
    },
    remoteMethod(query) {
      if (query !== '') {
        this.search_data = []
        const header = {
          'Content-Type': 'multipart/form-data'
        }
        if (store.getters.token !== '') {
          header['AUTHORIZATION'] = 'Bearer ' + store.getters.token
        }
        const config = {
          headers: header// {"content-type": 'multipart/form-data'}
        }
        var url = store.getters.api_route + 'cafeteria/student/search'
        const formdata = new FormData()
        formdata.append('token', store.getters.token)
        formdata.append('q', query)
        this.axios.post(url, formdata, config).then(response => {
          this.students = response.data.data.students
        })
      } else {
        this.students = []
      }
    },
    getStudentInfo() {
      const header = {
        'Content-Type': 'multipart/form-data'
      }
      if (store.getters.token !== '') {
        header['AUTHORIZATION'] = 'Bearer ' + store.getters.token
      }
      const config = {
        headers: header// {"content-type": 'multipart/form-data'}
      }
      var url = store.getters.api_route + 'pages/student/details'
      const formdata = new FormData()
      formdata.append('token', store.getters.token)
      formdata.append('student_id', this.studentId)
      this.axios.post(url, formdata, config).then(response => {
        // console.log(response)
        this.studentName = response.data.data.first_name + ' ' + response.data.data.middle_name + ' ' + response.data.data.last_name
        // this.student_medical = response.data.data.medical
        var food_allergies = ''
        if (response.data.data.medical.length > 0) {
          response.data.data.medical.forEach(function(e) {
            // console.log(e)
            food_allergies = e.food_allergies + ' - ' + food_allergies
          })
        }
        this.student_medical = food_allergies
        var balance = 0
        this.studentLimit = 0
        this.studentBalanceLimit = 0
        this.balanceLimit = false
        if (response.data.data.student_balance_limits) {
          this.studentLimit = response.data.data.student_balance_limits
          this.studentBalanceLimit = response.data.data.student_balance_limits.balance_limit
        }
        if (response.data.studentOrders) {
          this.studentOrders = response.data.studentOrders
          if (Number(this.studentOrders.total_orders) > this.studentBalanceLimit) {
            this.balanceLimit = true
            this.$swal.fire({
              icon: 'error',
              text: 'You have to choose payment method',
              position: 'top-end',
              toast: true,
              showConfirmButton: false,
              timer: 2000
            })
          }
        }
        if (response.data.data.student_wallet) {
          response.data.data.student_wallet.forEach(function(e) {
            if (e.type === 'balance' || e.type === 'order') {
              // console.log(e)
              balance += Number(e.amount)
            }
          })
        }
        // console.log(balance)
        this.studentWallet = balance
        this.studentBalance = balance
        this.lastorderID = Number(response.data.lastorderID) + 1
        this.cartItems.sort()
        // this.students = response.data.data.students
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
      // formdata.append('token', store.getters.token)
      formdata.append('student_id', this.FilterForm.studentId)
      if (this.FilterForm.date_range) {
        formdata.append('from', this.FilterForm.date_range[0])
        formdata.append('to', this.FilterForm.date_range[1])
      }
      this.axios.post(store.getters.api_route + 'cafeteria/StudentsBalance', formdata, config)
        .then(res => {
          // console.log(res)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          // this.total = res.data.data.total
          // this.per_page = res.data.data.per_page
          // this.studentWallets = res.data.data.student_wallet
          var orders = []
          var total_price = 0
          res.data.data.forEach(function(student) {
            student.student_wallet.forEach(function(order) {
              // order.details.forEach(function(item) {
              if (order.type === 'balance') {
                orders.push({
                  'id': order.id,
                  'student_name': student.first_name + ' ' + student.middle_name + ' ' + student.last_name,
                  'date': order.date,
                  'note': order.message,
                  'amount': order.amount,
                  'type': order.type
                })
                // })
                total_price += Number(order.amount)
              }
            })
          })

          if (orders.length > 0) {
            orders.push({
              'id': '',
              'student_name': 'Total',
              'date': '',
              'note': '',
              'amount': Number(total_price).toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0',
              'type': ''
            })
          }
          this.studentWallets = orders
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
        const tHeader = ['Transaction No.', 'Student Name', 'Date', 'Note', 'Amount', 'Type']
        const filterVal = ['id', 'student_name', 'date', 'note', 'amount', 'type']
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
      return this.studentWallets.map(v => filterVal.map(j => {
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
