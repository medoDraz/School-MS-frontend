<template>
  <div class="app-container" style="padding-top: 45px;">
    <div class="filter-container">
      <el-input
        v-model="name"
        placeholder="Search By Student Name"
        clearable
        style="width: 300px; margin-left: 10px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

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
    <el-table v-loading="listLoading" :data="ordersList" stripe>
      <el-table-column prop="id" :label="$t('id')" width="60" />
      <el-table-column prop="student.id" :label="$t('student_id')" width="80" />
      <el-table-column prop="student.name" :label="$t('student_name')" />
      <el-table-column prop="student.school.name" :label="$t('school')" />
      <el-table-column prop="student.grade.grade" :label="$t('grade')" />
      <el-table-column prop="student.classgroup[0].code" :label="$t('class')" />
      <el-table-column prop="created_at" label="Date" />
      <el-table-column prop="total" :label="$t('total')" />

      <el-table-column :label="$t('status')" prop="delivery_status" width="110">
        <template slot-scope="{ row }">
          <el-tag v-if="row.delivery_status ===1" type="success">
            {{ $t('delivered') }}
          </el-tag>
          <el-tag v-if="row.delivery_status ===-1" type="danger">
            {{ $t('in_kitchen') }}
          </el-tag>
          <el-tag v-if="row.delivery_status ===0" type="info">
            {{ $t('ready') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('actions')">
        <template slot-scope="{ row }" style="display: initial;">
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
              <el-dropdown-item
                @click.native="openDrawer(row.id, row)"
              >
                {{ $t('OrderItems') }}
              </el-dropdown-item>
              <!--              <router-link :to="'/setting/order/print/'+row.id">-->
              <el-dropdown-item divided @click.native="showDialog(row)">{{ $t('print') }}</el-dropdown-item>
              <!--              </router-link>-->

              <!--              <el-dropdown-item-->
              <!--                v-if="row.delivery_status === -1"-->
              <!--                divided-->
              <!--                @click.native="cancelOrder(row)"-->
              <!--              >-->
              <!--                {{ $t('cancel_order') }}-->
              <!--              </el-dropdown-item>-->

            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" :pagination="getAllItems" />

    <!--    <el-pagination-->
    <!--      v-show="total > per_page"-->
    <!--      style="margin-top: 20px;"-->
    <!--      :current-page.sync="query.page"-->
    <!--      layout="total, prev, pager, next, jumper"-->
    <!--      :total="total"-->
    <!--      @current-change="handleCurrentChange"-->
    <!--    />-->
    <!--    :before-close="handleClose"-->
    <el-dialog :title="$t('order')" :visible.sync="dialogFormVisible">
      <div id="printMe">
        <el-row style="text-align: center;margin-bottom: 7px;">
          {{ date }}
        </el-row>
        <el-row style="text-align: center;margin-bottom: 7px;">
          {{ $t('ReceiptNo') + ' # ' + lastorderID }}
        </el-row>
        <el-table :data="cartItems" border stripe style="width: 100%;font-size: .8em">
          <el-table-column type="index" width="50" sortable />
          <el-table-column :label="$t('item')" prop="name" />
          <el-table-column :label="$t('Qty')" prop="quantity" />
          <el-table-column :label="$t('price')" prop="price" />
          <el-table-column :label="$t('subTotal')" prop="subtotal" width="85" />
          <el-table-column :label="$t('vatAmount')" prop="vatAmount">
            <template slot-scope="{ row }">
              {{ Number(row.vatAmount).toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0' }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('total')" prop="total" />
        </el-table>
        <el-divider />
        <div>
          <el-row :gutter="20" style="margin-top: 15px;">
            <el-col :span="5">
              <div class="grid-content bg-purple-left">{{ $t('student_name') }}</div></el-col>
            <el-col :span="17">
              <div class="grid-content bg-purple-right align-center" style="text-align: center;">
                {{ studentName }}
              </div>
            </el-col>
          </el-row>
          <el-divider />
          <el-row :gutter="20" style="margin-top: 15px;">
            <el-col :span="5">
              <div class="grid-content bg-purple-left">{{ $t('payment_method') }}</div>
            </el-col>
            <el-col :span="17">
              <div class="grid-content bg-purple-right align-center" style="text-align: center;">
                {{ payment_method }}
              </div>
            </el-col>
          </el-row>
          <el-divider />
          <el-row :gutter="20" style="margin-top: 15px;">
            <el-col :span="5">
              <div class="grid-content bg-purple-left">{{ $t('subTotal') }}</div>
            </el-col>
            <el-col :span="17">
              <div class="grid-content bg-purple-right align-center" style="text-align: center;">
                {{ Number(subTotal).toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0' }}
              </div>
            </el-col>
          </el-row>
          <el-divider />
          <el-row :gutter="20" style="margin-top: 15px;">
            <el-col :span="5">
              <div class="grid-content bg-purple-left">{{ $t('Tax') }}</div>
            </el-col>
            <el-col :span="17">
              <div class="grid-content bg-purple-right align-center" style="text-align: center;">
                {{ Number(vat_total).toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0' }}
              </div>
            </el-col>
          </el-row>
          <el-divider />
          <el-row :gutter="20" style="margin-top: 15px;">
            <el-col :span="5">
              <div class="grid-content bg-purple-left" style="font-weight: bold;">{{ $t('total') }}</div></el-col>
            <el-col :span="17">
              <div class="grid-content bg-purple-right align-center" style="text-align: center;font-weight: bold;">
                {{ Number(total).toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0' }}
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('cancel') }}
        </el-button>
        <el-button v-print="printObj" style=" width: 200px; " type="success">
          {{ $t('print') }}
        </el-button>
      </div>
    </el-dialog>
    <el-drawer
      :title="$t('OrderItems')"
      :visible.sync="drawer"
      :direction="direction"
    >
      <div class="orderDetails">
        <el-card v-for="item in orderItems" :key="item.id" class="box-card" style="margin-bottom: 5px;margin-left: 5px;width: 96%;">
          <el-row>
            <el-col :span="8">
              <img
                :alt="item.name"
                class="rounded-circle img-custome image"
                style="height: 60px;"
                :src="imgUrl + item.image"
              >
            </el-col>
            <el-col :span="14">
              <el-row style="margin-bottom: 21px;text-align: end;">
                <el-col :span="8" style="text-align: left;">
                  {{ $t('name') + ' : ' }}
                </el-col>
                <el-col :span="16" style="text-align: left;">
                  <span style="padding-left: 10px;">{{ item.name }}</span>
                </el-col>
              </el-row>
              <el-row style="text-align: end;margin-bottom: 21px;">
                <el-col :span="8" style="text-align: left;">
                  {{ $t('price') + ' : ' }}
                </el-col>
                <el-col :span="16" style="text-align: left;">
                  <span style="padding-left: 10px;">{{ item.price }}</span>
                </el-col>
              </el-row>
              <el-row style="text-align: end;">
                <el-col :span="8" style="text-align: left;">
                  {{ $t('quantity') + ' : ' }}
                </el-col>
                <el-col :span="16" style="text-align: left;">
                  <span style="padding-left: 10px;">{{ item.quantity }}</span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission' // Permission directive
import store from '@/store'
import Pagination from '@/components/Pagination'
import checkPermission from '@/utils/permission'

export default {
  name: 'DeletedOrdersList',
  components: { Pagination },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Open: 'success',
        Closed: 'danger',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    // eslint-disable-next-line no-unused-vars
    var validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.newUser.password) {
        callback(new Error('Password is mismatched!'))
      } else {
        callback()
      }
    }
    return {
      printObj: {
        id: 'printMe',
        popTitle: 'Order Details',
        style: '@media print{@page{size:landscape}}'
        // extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      },
      drawer: false,
      direction: 'ltr',
      name: '',
      studentName: '',
      payment_method: '',
      lastorderID: '',
      date: new Date().toJSON().replace(/T|Z/g, ' '),
      statusOptions: ['Active', 'Suspend', 'Draft'],
      textMap: { update: 'Edit', create: 'Create' },
      dialogStatus: '',
      ordersList: [],
      orderItems: [],
      tableData: [],
      cartItems: [],
      list: null,
      subTotal: 0,
      vat_total: 0,
      total: 0,
      imgUrl: store.getters.app_route + 'storage/',
      per_page: 0,
      listLoading: true,
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

  },
  watch: {
    name: function(v) {
      if (v) {
        this.name = v
        this.handleFilter()
      } else {
        this.getAllItems(0)
      }
    }
  },
  mounted() {
    if (!this.checkPermission('Access_Orders')) {
      this.$router.push({ path: '/403' })
    }
    console.log('Component mounted.')
  },
  created() {
    this.getAllItems(0)
  },
  methods: {
    showDialog(row) {
      // console.log(row)
      var items = []
      var t = 0
      var sub_total = 0
      var vat_total = 0
      row.details.forEach(function(e) {
        e.item['quantity'] = e.quantity
        e.item.vatAmount = Number(e.item.quantity) * Number(e.item.price * (14 / 100)).toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0'
        e.item.subtotal = Number(e.item.quantity) * Number(e.item.price)
        e.item.total = Number(e.item.subtotal) + Number(e.item.vatAmount)
        vat_total += Number(e.item.vatAmount)
        sub_total += Number(e.item.quantity) * Number(e.item.price)
        t += Number(e.item.quantity) * Number(e.item.price) + Number(e.item.vatAmount)
        items.push(e.item)
      })
      this.subTotal = sub_total
      this.vat_total = vat_total
      this.total = t
      this.lastorderID = row.id
      this.date = row.created_at
      this.studentName = row.student.name
      this.payment_method = row.type
      this.cartItems = items
      // console.log(items)
      this.dialogFormVisible = true
    },
    checkPermission,
    handleClose(done) {
      this.$confirm('Are you sure you want to close this?')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    openDrawer(id, row) {
      // console.log(row)
      var items = []
      row.details.forEach(function(e) {
        e.item['quantity'] = e.quantity
        items.push(e.item)
      })
      this.orderItems = items
      this.drawer = true
    },
    getAllItems(page) {
      this.listLoading = true
      /*    let config = {
          headers: {"content-type": 'multipart/form-data'}
        }; */
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
      formdata.append('token', store.getters.token)
      this.axios
        .post(
          store.getters.api_route + 'cafeteria/Deleted_Orders/List?page=' + page,
          formdata,
          config
        )
        .then(res => {
          // console.log(res.data.data.items.per_page)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.total = res.data.data.total
          this.per_page = res.data.data.per_page
          this.ordersList = res.data.data.data
          this.listLoading = false
        // console.log(this.ordersList);
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
      formdata.append('token', store.getters.token)
      formdata.append('search', this.name)
      this.axios
        .post(
          store.getters.api_route + 'cafeteria/Deleted_Orders/List',
          formdata,
          config
        )
        .then(res => {
          // console.log(res)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.total = res.data.data.total
          this.per_page = res.data.data.per_page
          this.ordersList = res.data.data.data
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
    cancelOrder(row) {
      this.$confirm('This will delete the Order and Details And Student Balance retrieved. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
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

        formdata.append('token', store.getters.token)
        this.axios.post(store.getters.api_route + 'cafeteria/cancelOrder', formdata, config)
          .then(res => {
            // console.log(res.data)
            this.$notify({
              title: 'success',
              message: res.data.message,
              type: 'success',
              duration: 2000
            })
            this.getAllItems(0)
          })
          .catch(err => {
            console.log(err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
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
        const tHeader = [
          'id',
          'Student ID',
          'Student Name',
          'School',
          'Grade',
          'Class',
          'Date',
          'Total',
          'status'
        ]
        const filterVal = [
          'id',
          'student',
          'student_name',
          'student_school',
          'student_grade',
          'student_class',
          'created_at',
          'total',
          'delivery_status'
        ]
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
      // eslint-disable-next-line no-undef
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
      return this.ordersList.map(v =>
        filterVal.map(j => {
          console.log(v)
          if (j === 'timestamp') {
            // eslint-disable-next-line no-undef
            return parseTime(v[j])
          } else if (j === 'student') {
            // return v[j].student.id
            if (typeof v[j] === 'object') {
              if (j === 'student') {
                if (v[j]) {
                  return v[j].id
                }
              }
            }
          } else if (j === 'student_name') {
            if (v.student) {
              return v.student.name
            }
          } else if (j === 'student_school') {
            if (v.student && v.student.school.name) {
              return v.student.school.name
            }
          } else if (j === 'student_grade') {
            if (v.student && v.student.grade.grade) {
              return v.student.grade.grade
            }
          } else if (j === 'student_class') {
            if (v.student && v.student.classgroup.length > 0) {
              return v.student.classgroup[0].code
            }
          } else if (j === 'delivery_status') {
            if (v[j] === -1) {
              return 'In Kitchen'
            } else if (v[j] === 1) {
              return 'Delivered'
            } else if (v[j] === 0) {
              return 'Ready'
            }
          } else {
            return v[j]
          }
        })
      )
    },
    handleSizeChange(val) {
      // console.log(`dgdg ${val} 条`);
      this.getAllItems()
    },
    handleCurrentChange(val) {
      this.getAllItems(val)
      // console.log(`当前页: ${val}`);
    }
  }
}
</script>
<style lang="scss" scoped>
  .orderDetails {
    overflow-y: scroll;
    height: 359px;
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
