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
                <el-col :span="7" style="margin-right: 10px;">
                  <el-form-item :label="$t('date_range')" class="postInfo-container-item">
                    <span style="float: left; color:red; font-weight: bold;">*</span>
                    <span style="float: right; font-weight: bold;">:</span>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item prop="date_range" style="margin-bottom: 0px;">
                    <el-date-picker
                      v-model="FilterForm.date_range"
                      type="daterange"
                      range-separator="To"
                      :clearable="false"
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
          <el-row>
            <el-button v-waves :loading="downloading" class="filter-item" style="margin-left: 10px;margin-bottom: 0;" type="primary" icon="el-icon-download" @click="handleDownload">
              {{ $t('export') }}
            </el-button>
            <el-button v-print="printObj" type="success">
              {{ $t('print') }}
            </el-button>
            <el-button @click="resetForm('FilterForm')">{{ $t('clear') }}</el-button>
          </el-row>
        </el-card>
      </el-form>
    </div>
    <div id="printMe">
      <el-table v-loading="listLoading" :data="studentOrders" style="width: 100%;font-size: .80em" :cell-style="tableRowColor" stripe>
        <el-table-column prop="transaction.id" :label="$t('order_id')" width="70" />
        <el-table-column prop="transaction.student.name" :label="$t('student_name')" />
        <el-table-column prop="transaction.order_date" :label="$t('date')" width="90" />
        <el-table-column prop="item.name" :label="$t('item_name')" />
        <el-table-column prop="quantity" :label="$t('quantity')" width="85" />
        <el-table-column prop="price" :label="$t('Price/Item')" width="80">
          <template slot-scope="{row}">
            {{ Number(row.price).toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0' }}
          </template>
        </el-table-column>
        <el-table-column prop="vat" :label="$t('vat')" width="80">
          <template slot-scope="{row}">
            {{ Number(row.vat).toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0' }}
          </template>
        </el-table-column>
        <el-table-column prop="total" :label="$t('total')">
          <template slot-scope="{row}">
            {{ Number(row.total).toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0' }}
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
// import { parseTime } from '@/utils'
import moment from 'moment'
import checkPermission from '@/utils/permission'

export default {
  name: 'SalesReport',
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
        popTitle: 'Sales Reports',
        style: '@media print{@page{size:landscape}}'
        // extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      },
      statusOptions: ['Active', 'Suspend', 'Draft'],
      textMap: { update: 'Edit', create: 'Create' },
      dialogStatus: '',
      usersList1: [],
      studentOrders: [],
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
    // this.handleFilter()
  },
  methods: {
    tableRowColor({ row, column, rowIndex, columnIndex }) {
      // console.log(row)
      if (row.transaction.student.name === 'Total') {
        return 'background-color: #dcdde0;color: #287131;font-size: 15px;font-weight: bold;'
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.FilterForm.date_range = ''
      this.FilterForm.studentId = ''
      this.studentOrders = []
    },
    checkPermission,
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
      this.$refs.FilterForm.validate(valid => {
        if (valid) {
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
          formdata.append('id', this.FilterForm.studentId)
          formdata.append('start', this.FilterForm.date_range[0])
          formdata.append('end', this.FilterForm.date_range[1])
          this.axios.post(store.getters.api_route + 'cafeteria/sales_report', formdata, config)
            .then(res => {
              // console.log(res.data.data)
              const { data } = res
              if (!data) {
                console.log('sdfsf')
              }
              // this.total = res.data.data.total
              // this.per_page = res.data.data.per_page
              // this.studentOrders = res.data.orders
              // var orders = []
              // res.data.data.forEach(function(order) {
              //   order.details.forEach(function(item) {
              //     orders.push({
              //       'id': order.id,
              //       'student_name': order.student.name,
              //       'date': order.order_date,
              //       'item_name': item.item.name,
              //       'price': item.price,
              //       'quantity': item.quantity,
              //       'vat': item.vat,
              //       'total': Number(item.vat) + Number(item.sub_total)
              //     })
              //   })
              // })
              // var total_item_price = 0
              // var total_item_quantity = 0
              // var total_item_vat = 0
              // var total_price = 0
              // res.data.data.forEach(function(e) {
              //   total_item_price += Number(e.price)
              //   total_item_quantity += Number(e.quantity)
              //   total_item_vat += Number(e.vat)
              //   total_price += Number(e.vat) + Number(e.sub_total)
              //   e.total = Number(e.vat) + Number(e.sub_total)
              // })
              // console.log(orders)
              this.studentOrders = res.data.data
              if (this.studentOrders.length > 0) {
                this.studentOrders.push({
                  'id': '',
                  'transaction': { 'student': { 'name': 'Total' }},
                  'item': '',
                  'date': '',
                  'item_name': '',
                  'price': res.data.sum.total_item_price,
                  'quantity': res.data.sum.total_item_quantity,
                  'vat': res.data.sum.total_item_vat,
                  'total': Number(res.data.sum.total_item_vat) + Number(res.data.sum.total_sub_price)
                })
              }
              this.listLoading = false
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
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
          console.log(err)
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
        const tHeader = ['Order ID', 'Student Name', 'Date', 'Item Name', 'Price', 'Quantity', 'Vat', 'Total']
        const filterVal = ['transaction_id', 'transaction_student', 'transaction', 'item', 'price', 'quantity', 'vat', 'total']
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
      return this.studentOrders.map(v => filterVal.map(j => {
        if (typeof v[j] === 'object') {
          if (j === 'item') {
            return v[j].name ?? ''
          } else if (j === 'transaction') {
            return v[j].order_date ?? ''
          }
        } else if (j === 'transaction_student') {
          return v[j.split('_')[0]].student.name ?? ''
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
