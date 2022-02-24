<template>
  <div class="app-container" style="padding-top: 45px;">
    <el-form ref="dataForm" class="form-container" :model="dataForm" :rules="rules">
      <el-card class="box-card">
        <el-row>
          <el-col :span="8">
            <el-row>
              <el-col :span="8" style="margin-right: 10px;padding-top: 10px;">
                <span style="float: right; font-weight: bold;">{{ $t('Calendar Status') }} :</span>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <el-switch
                    v-model="calendar_status"
                    style="display: block;margin-top: 7px;"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="ON"
                    inactive-text="OFF"
                    size="mini"
                    @change="calendarStatus()"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="16">
            <el-row>
              <el-col :span="4" style="margin-right: 10px;padding-top: 10px;">
                <span style="float: right; font-weight: bold;">{{ $t('Cafeteria') }} :</span>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="store_id">
                  <el-select
                    v-model="dataForm.store_id"
                    placeholder="Cafeteria"
                    clearable
                    style="width: 200px;margin-left: 10px;"
                    class="filter-item"
                    size="mini"
                    @change="handleFilter"
                  >
                    <div>
                      <div v-if="user_cafeteria_id === 0">
                        <div v-for="item in Cafeterias" :key="item.id">
                          <el-option
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          />
                        </div>
                      </div>
                      <div v-else>
                        <div v-for="item in Cafeterias" :key="item.id">
                          <el-option
                            v-if="user_cafeteria_id === item.id"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          />
                        </div>
                      </div>
                    </div>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-button
              class="filter-item"
              style="margin-left: 10px;border-radius: 4px 0 0 4px;"
              type="primary"
              icon="el-icon-arrow-left"
              @click.native="getnextweek(firstday, 'back')"
            />
            <el-button
              class="filter-item"
              style="margin-left: 0;border-radius: 0 4px 4px 0;"
              type="primary"
              icon="el-icon-arrow-right"
              @click.native="getnextweek(lastday, 'next')"
            />
            <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              @click.native="getfirstday(currentDate)"
            >
              {{ $t('today') }}
            </el-button>
          </el-col>
          <el-col :span="11"><h3>{{ firstWeek+ ' - '+ lastWeek +' ' + currentYear }}</h3></el-col>
        </el-row>
      </el-card>
    </el-form>

    <el-table v-loading="listLoading" :data="rolesList1" :header-cell-style="classHeaderChecker" :cell-class-name="classChecker" border style="width: 100%;font-size: .8em;margin-top: 10px;">

      <el-table-column :label="weekDays[0]" prop="Sun">
        <template slot="header">
          <span style="margin-left: 15px;">Sun {{ weekDays[0] }}</span>
          <br>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleItems(weekDays[0],'Sun')"
          >
            {{ $t('items') }}
          </el-button>
        </template>
        <template slot-scope="{row}">
          <div v-for="item in row.Sun" :key="item.id">
            <el-card class="box-card" style="margin-top: 3px;">
              <el-row>
                <el-col :span="10">
                  <img
                    :alt="item.name"
                    class="rounded-circle img-custome image"
                    style="height: 33px;width: 33px;"
                    :src="imgUrl + item.image"
                  >
                </el-col>
                <el-col :span="13">
                  {{ item.name }}
                </el-col>
              </el-row>
            </el-card>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="weekDays[1]" prop="Mon">
        <template slot="header">
          <span style="margin-left: 15px;">Mon {{ weekDays[1] }}</span>
          <br>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleItems(weekDays[1],'Mon')"
          >
            {{ $t('items') }}
          </el-button>
        </template>
        <template slot-scope="{row}">
          <div v-for="item in row.Mon" :key="item.id">
            <el-card class="box-card" style="margin-top: 3px;">
              <el-row>
                <el-col :span="10">
                  <img
                    :alt="item.name"
                    class="rounded-circle img-custome image"
                    style="height: 33px;width: 33px;"
                    :src="imgUrl + item.image"
                  >
                </el-col>
                <el-col :span="13">
                  {{ item.name }}
                </el-col>
              </el-row>
            </el-card>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="weekDays[2]" prop="Tue">
        <template slot="header">
          <span style="margin-left: 15px;">Tue  {{ weekDays[2] }}</span>
          <br>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleItems(weekDays[2],'Tue')"
          >
            {{ $t('items') }}
          </el-button>
        </template>
        <template slot-scope="{row}">
          <div v-for="item in row.Tue" :key="item.id">
            <el-card class="box-card" style="margin-top: 3px;">
              <el-row>
                <el-col :span="10">
                  <img
                    :alt="item.name"
                    class="rounded-circle img-custome image"
                    style="height: 33px;width: 33px;"
                    :src="imgUrl + item.image"
                  >
                </el-col>
                <el-col :span="13">
                  {{ item.name }}
                </el-col>
              </el-row>
            </el-card>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="weekDays[3]" prop="Wed">
        <template slot="header">
          <span style="margin-left: 15px;">Wed  {{ weekDays[3] }}</span>
          <br>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleItems(weekDays[3],'Wed')"
          >
            {{ $t('items') }}
          </el-button>
        </template>
        <template slot-scope="{row}">
          <div v-for="item in row.Wed" :key="item.id">
            <el-card class="box-card" style="margin-top: 3px;">
              <el-row>
                <el-col :span="10">
                  <img
                    :alt="item.name"
                    class="rounded-circle img-custome image"
                    style="height: 33px;width: 33px;"
                    :src="imgUrl + item.image"
                  >
                </el-col>
                <el-col :span="13">
                  {{ item.name }}
                </el-col>
              </el-row>
            </el-card>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="weekDays[4]" prop="Thu">
        <template slot="header">
          <span style="margin-left: 15px;">Thu  {{ weekDays[4] }}</span>
          <br>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleItems(weekDays[4],'Thu')"
          >
            {{ $t('items') }}
          </el-button>
        </template>
        <template slot-scope="{row}">
          <div v-for="item in row.Thu" :key="item.id">
            <el-card class="box-card" style="margin-top: 3px;">
              <el-row>
                <el-col :span="10">
                  <img
                    :alt="item.name"
                    class="rounded-circle img-custome image"
                    style="height: 33px;width: 33px;"
                    :src="imgUrl + item.image"
                  >
                </el-col>
                <el-col :span="13">
                  {{ item.name }}
                </el-col>
              </el-row>
            </el-card>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="weekDays[5]" prop="Fri">
        <template slot="header">
          <span style="margin-left: 15px;">Fri  {{ weekDays[5] }}</span>
          <br>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleItems(weekDays[5],'Fri')"
          >
            {{ $t('items') }}
          </el-button>
        </template>
        <template slot-scope="{row}">
          <div v-for="item in row.Fri" :key="item.id">
            <el-card class="box-card" style="margin-top: 3px;">
              <el-row>
                <el-col :span="10">
                  <img
                    :alt="item.name"
                    class="rounded-circle img-custome image"
                    style="height: 33px;width: 33px;"
                    :src="imgUrl + item.image"
                  >
                </el-col>
                <el-col :span="13">
                  {{ item.name }}
                </el-col>
              </el-row>
            </el-card>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="weekDays[6]" prop="Sat">
        <template slot="header">
          <span style="margin-left: 15px;">Sat  {{ weekDays[6] }}</span>
          <br>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleItems(weekDays[6],'Sat')"
          >
            {{ $t('items') }}
          </el-button>
        </template>
        <template slot-scope="{row}">
          <div v-for="item in row.Sat" :key="item.id">
            <el-card class="box-card" style="margin-top: 3px;">
              <el-row>
                <el-col :span="10">
                  <img
                    :alt="item.name"
                    class="rounded-circle img-custome image"
                    style="height: 33px;width: 33px;"
                    :src="imgUrl + item.image"
                  >
                </el-col>
                <el-col :span="13">
                  {{ item.name }}
                </el-col>
              </el-row>
            </el-card>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="$t('items')" :visible.sync="dialogFormVisible">
      <el-table v-loading="userCreating" :data="items" stripe style="width: 100%;font-size: .8em">
        <el-table-column prop="id" width="50px">
          <template slot-scope="{row}">
            <input v-model="row.cal" type="checkbox" @click="addItemCalender(row)">
          </template>
        </el-table-column>
        <el-table-column prop="items_cats.name" :label="$t('image')">
          <template slot-scope="{row}">
            <img
              :alt="row.name"
              class="rounded-circle img-custome image"
              style="height: 33px;width: 33px;"
              :src="imgUrl + row.image"
            >
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('ItemName')" />
        <el-table-column prop="items_cats.name" :label="$t('Group')">
          <template slot-scope="{row}">
            <p v-if="row.items_cats">{{ row.items_cats.name }}</p>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogFormVisible = false">
          {{ $t('close') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission' // Permission directive
import checkPermission from '@/utils/permission' // Permission checking
// import DropdownMenu from '@/components/Share/DropdownMenu'
import store from '@/store'
import moment from 'moment'
// import { validNumber } from '@/utils/validate'

export default {
  name: 'Calendar',
  components: {},
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
      imgUrl: store.getters.app_route + 'storage/',
      currentPage4: 4,
      user_cafeteria_id: store.getters.cafeteria_id,
      dialogStatus: '',
      pageSizes: [10, 20, 30, 50],
      rolesList1: [
        {
          Sun: [],
          Mon: [],
          Tue: [],
          Wed: [],
          Thu: [],
          Fri: [],
          Sat: []
        }
      ],

      list: null,
      total: 0,
      per_page: 0,
      listLoading: false,
      calendar_status: false,
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
        store_id: '',
        name: '',
        status: 1
      },
      rules: {
        store_id: [{ required: true, message: 'Cafeteria is required', trigger: 'change' }],
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }]
      },
      permissionProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      firstWeek: '',
      firstday: '',
      lastday: '',
      lastWeek: '',
      day: '',
      currentYear: '',
      currentDate: moment(),
      permissions: [],
      Cafeterias: [],
      rolesList3: [],
      accountsList: [],
      weekDays: [],
      weekDays1: [],
      items: []
    }
  },
  computed: {},
  watch: {
  },
  mounted() {
    // if (this.dataForm.name === '') {
    //   this.$refs.name.focus()
    // }

    if (!this.checkPermission('Access_Groups')) {
      this.$router.push({ path: '/403' })
    }
    console.log('Component mounted.')
  },
  created() {
    // this.getAllRoles()
    this.getCalendarStatus()
    this.getAllCafeterias()
    this.getfirstday(this.currentDate)
  },
  methods: {
    checkPermission,
    getfirstday(currentDate) {
      this.listLoading = true
      var startDate = currentDate.clone().startOf('week')
      var endDate = currentDate.clone().endOf('week')
      var days = []
      for (let i = 0; i <= 6; i++) {
        // days.push(moment(startDate).add(i, 'days').format('MM-Do,dddd'))
        days.push(moment(startDate).add(i, 'days').format('YYYY-MM-DD'))
        this.weekDays1.push(moment(startDate).add(i, 'days').format('YYYY-MM-DD'))
      }
      // console.log(moment(endDate).add(7, 'day').startOf('week').format('YYYY-MM-DD'))
      this.firstWeek = startDate.format('MMM-DD')
      this.firstday = startDate.format('YYYY-MM-DD')
      this.lastday = endDate.format('YYYY-MM-DD')
      this.lastWeek = endDate.format('MMM-DD')
      this.currentYear = moment(startDate).year()
      this.weekDays = days
      this.handleFilter()
      this.listLoading = false
    },
    getnextweek(day, type) {
      this.listLoading = true
      var today = ''
      var nextweek = ''
      if (type === 'next') {
        today = new Date(day)
        nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
        // console.log(nextweek, moment(nextweek).startOf('week').format('YYYY-MM-DD'))
      } else {
        today = new Date(day)
        nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
        // console.log(nextweek1, moment(nextweek1).startOf('week').format('YYYY-MM-DD'))
      }
      var startDate = moment(nextweek).startOf('week')
      var endDate = moment(nextweek).endOf('week')
      var days = []
      for (let i = 0; i <= 6; i++) {
        // days.push(moment(startDate).add(i, 'days').format('MM-Do,dddd'))
        days.push(moment(startDate).add(i, 'days').format('YYYY-MM-DD'))
        this.weekDays1.push(moment(startDate).add(i, 'days').format('YYYY-MM-DD'))
      }
      // console.log(moment(endDate).add(7, 'day').startOf('week').format('YYYY-MM-DD'))
      this.firstWeek = startDate.format('MMM-DD')
      this.lastWeek = endDate.format('MMM-DD')
      this.firstday = startDate.format('YYYY-MM-DD')
      this.lastday = endDate.format('YYYY-MM-DD')
      this.currentYear = moment(startDate).year()
      this.weekDays = days
      this.handleFilter()
      this.listLoading = false
    },
    classChecker({ row, column }) {
      if (column.label === moment().format('YYYY-MM-DD')) {
        // console.log(column.label, moment().format('YYYY-MM-DD'))
        return 'CurrentDay'
      }
    },
    classHeaderChecker({ row, column }) {
      // console.log(column.label, moment().format('YYYY-MM-DD'))
      if (column.label === moment().format('YYYY-MM-DD')) {
        // console.log(column.label, moment().format('YYYY-MM-DD'))
        return 'CurrentDay'
      }
    },

    calendarStatus() {
      // console.log(this.calendar_status)
      if (!this.calendar_status) {
        var message = 'Are you sure you want to turn Calendar items Off?'
        // console.log('Are you sure you want to turn Calendar items Off?')
      } else {
        message = 'Are you sure you want to turn Calendar items On?'
      }
      this.$swal({
        title: message,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes Do it!',
        cancelButtonText: 'No',
        showCloseButton: true,
        showLoaderOnConfirm: true
      }).then(result => {
        if (result.value) {
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
          formdata.append('calendar_status', this.calendar_status)
          this.axios.post(store.getters.api_route + 'cafeteria/calendar/change_status', formdata, config)
            .then(res => {
              const { data } = res
              if (!data) {
                console.log('sdfsf')
              }

              this.$notify({
                title: 'success',
                message: res.data.message,
                type: 'success',
                duration: 2000
              })
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
        } else {
          this.calendar_status = !this.calendar_status
          this.$notify({
            title: 'Cancelled',
            message: 'Calendar Status is not changed',
            type: 'info',
            duration: 2000
          })
        }
      })
    },
    getCalendarStatus() {
      console.log(this.calendar_status)
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
      formdata.append('calendar_status', this.calendar_status)
      this.axios.post(store.getters.api_route + 'cafeteria/calendar/get_status', formdata, config)
        .then(res => {
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          console.log(res.data.data.data)
          if (res.data.data) {
            this.calendar_status = (res.data.data.data === 'true') ?? true
          }
          // this.$notify({
          //   title: 'success',
          //   message: res.data.message,
          //   type: 'success',
          //   duration: 2000
          // })
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
      formdata.append('token', store.getters.token)
      formdata.append('limit', 'NaN')
      this.axios
        .post(store.getters.api_route + 'cafeteria/listCafetria', formdata, config)
        .then(res => {
          // console.log(res.data.data)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.Cafeterias = res.data.data
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
    getAllRoles(page) {
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
      formdata.append('store_id', this.dataForm.store_id)
      this.axios.post(store.getters.api_route + 'pages/groups/index?page=' + page, formdata, config)
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
      formdata.append('store_id', this.dataForm.store_id)
      formdata.append('start', this.firstday)
      formdata.append('end', this.lastday)
      this.axios.post(store.getters.api_route + 'cafeteria/calendaritems', formdata, config)
        .then(res => {
          // console.log(moment(this.firstday).format('ddd'))
          // console.log(res.data.data)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          const _this = this
          this.rolesList1[0]['Sun'] = []
          this.rolesList1[0]['Mon'] = []
          this.rolesList1[0]['Tue'] = []
          this.rolesList1[0]['Wed'] = []
          this.rolesList1[0]['Thu'] = []
          this.rolesList1[0]['Fri'] = []
          this.rolesList1[0]['Sat'] = []
          res.data.data.forEach(function(e) {
            _this.rolesList1[0][moment(e.day).format('ddd')].push(e.item)
            // console.log(moment(e.day).format('ddd'))
            // console.log(_this.rolesList1[0][moment(e.day).format('ddd')])
          })
          this.items = res.data.items
          // this.total = res.data.data.total
          // this.per_page = res.data.data.per_page
          // this.rolesList1 = res.data.data.data
          // this.listLoading = false
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
      this.axios.post(store.getters.api_route + 'pages/group/change_status', formdata, config)
        .then(res => {
          // console.log(res.data)
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          row.status = Number(status)
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
    handleItems(day, type) {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          console.log(this.rolesList1[0][type])
          this.day = day
          // console.log(this.rolesList1[0][type])
          const _this = this
          this.items.forEach(function(e) {
            e['cal'] = false
            _this.rolesList1[0][type].forEach(function(e1) {
              if (e.id === e1.id) {
                e['cal'] = true
              }
            })
          })
          this.dialogFormVisible = true
        }
      })
    },
    addItemCalender(row) {
      this.userCreating = true
      console.log(row.cal)
      // row.col = !row.col
      // console.log(row.cal)
      // return false
      if (row.cal === false) {
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
        formdata.append('store_id', this.dataForm.store_id)
        formdata.append('item_id', row.id)
        formdata.append('day', this.day)
        formdata.append('start', this.firstday)
        formdata.append('end', this.lastday)
        this.axios.post(store.getters.api_route + 'cafeteria/calendaritem/add', formdata, config)
          .then(res => {
            // console.log(moment(this.firstday).format('ddd'))
            // console.log(res.data.data)
            const { data } = res
            if (!data) {
              console.log('sdfsf')
            }
            const _this = this
            this.rolesList1[0]['Sun'] = []
            this.rolesList1[0]['Mon'] = []
            this.rolesList1[0]['Tue'] = []
            this.rolesList1[0]['Wed'] = []
            this.rolesList1[0]['Thu'] = []
            this.rolesList1[0]['Fri'] = []
            this.rolesList1[0]['Sat'] = []
            res.data.data.forEach(function(e) {
              _this.rolesList1[0][moment(e.day).format('ddd')].push(e.item)
            })
            row['cal'] = true
            // this.items = res.data.items
            // this.items.forEach(function(e) {
            //   e['cal'] = false
            //   _this.rolesList1[0][moment(e.day).format('ddd')].forEach(function(e1) {
            //     if (e.id === e1.id) {
            //       e['cal'] = true
            //     }
            //   })
            // })
            this.$notify({
              title: 'success',
              message: res.data.message,
              type: 'success',
              duration: 2000
            })
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
      } else {
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
        formdata.append('store_id', this.dataForm.store_id)
        formdata.append('item_id', row.id)
        formdata.append('day', this.day)
        formdata.append('start', this.firstday)
        formdata.append('end', this.lastday)
        this.axios.post(store.getters.api_route + 'cafeteria/calendaritem/delete', formdata, config)
          .then(res => {
            // console.log(moment(this.firstday).format('ddd'))
            // console.log(res.data.data)
            const { data } = res
            if (!data) {
              console.log('sdfsf')
            }
            const _this = this
            this.rolesList1[0]['Sun'] = []
            this.rolesList1[0]['Mon'] = []
            this.rolesList1[0]['Tue'] = []
            this.rolesList1[0]['Wed'] = []
            this.rolesList1[0]['Thu'] = []
            this.rolesList1[0]['Fri'] = []
            this.rolesList1[0]['Sat'] = []
            res.data.data.forEach(function(e) {
              _this.rolesList1[0][moment(e.day).format('ddd')].push(e.item)
            })
            // this.items = res.data.items
            // this.items.forEach(function(e) {
            //   e['cal'] = false
            //   _this.rolesList1[0][moment(e.day).format('ddd')].forEach(function(e1) {
            //     if (e.id === e1.id) {
            //       e['cal'] = true
            //     }
            //   })
            // })
            row['cal'] = false
            this.$notify({
              title: 'success',
              message: res.data.message,
              type: 'success',
              duration: 2000
            })
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
      }
      this.userCreating = false
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
          formdata.append('name', this.dataForm.name)
          formdata.append('store_id', this.dataForm.cafeteria)
          formdata.append('status', this.dataForm.status)
          // formdata.append('token', store.getters.token)

          this.axios
            .post(store.getters.api_route + 'pages/group/add', formdata, config)
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
                this.getAllRoles()
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
                this.getAllRoles()
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
      this.dataForm.cafeteria = row.cafetria_stores.id
      this.dataForm.status = row.status
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
<style>
  .el-card__body {
    padding: 12px;
  }
  .CurrentDay {
    background-color: rgba(215, 212, 57, 0.16) !important;
  }
</style>
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
