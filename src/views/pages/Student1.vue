<template>
  <div class="createPost-container">
    <!--    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm">-->
    <div class="createPost-main-container" style="margin-top: 40px;">
      <div class="postInfo-container">
        <el-row>
          <el-col :span="13">
            <el-card class="box-card">
              <div class="filter-container">
                <el-input
                  v-model="name"
                  placeholder="Search by ID and Name of Student"
                  style="width: 178px; margin-left: 10px;margin-right: 10px;"
                  class="filter-item"
                  clearable
                  size="mini"
                  @keyup.enter.native="handleFilter"
                />
                <el-select
                  v-model="profit"
                  placeholder="School"
                  clearable
                  size="mini"
                  style="width: 125px;margin-right: 10px;"
                  class="filter-item"
                  @change="handleFilter"
                >
                  <div v-for="item in ProfitOptions" :key="item.key">
                    <el-option
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </div>
                </el-select>
                <el-select
                  v-model="grade"
                  placeholder="Grade"
                  clearable
                  size="mini"
                  style="width: 125px;"
                  class="filter-item"
                  @change="handleFilter"
                >
                  <div v-for="item in grades" :key="item.id">
                    <el-option
                      :key="item.id"
                      :label="item.grade"
                      :value="item.id"
                    />
                  </div>
                </el-select>
                <el-button
                  v-waves
                  class="filter-item"
                  type="primary"
                  size="mini"
                  style="margin-left: 10px"
                  icon="el-icon-search"
                  @click="handleFilter"
                >
                  {{ $t("search") }}
                </el-button>
                <!--                  <el-button-->
                <!--                    :loading="downloading"-->
                <!--                    class="filter-item"-->
                <!--                    style="margin-left: 10px"-->
                <!--                    type="primary"-->
                <!--                    icon="el-icon-download"-->
                <!--                    @click="handleDownload"-->
                <!--                  >-->
                <!--                    {{ $t("export") }}-->
                <!--                  </el-button>-->
              </div>
              <el-table v-loading="dialogPermissionLoading" height="600" style="width: 100%;font-size: .80em" :data="usersList1" stripe>
                <el-table-column prop="id" :label="$t('id')" width="80" />
                <el-table-column prop="name" :label="$t('name')">
                  <template slot-scope="{ row }">
                    <el-button type="text" @click="StudentBalance(row)">
                      {{ row.first_name }} {{ row.middle_name }} {{ row.last_name }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="school.name" :label="$t('School')" width="100" />
                <el-table-column prop="grade.grade" :label="$t('grade')" width="100" />
                <el-table-column prop="balance" :label="$t('balance')" width="100">
                  <template slot-scope="{ row }">
                    <span>{{ Number(row.balance).toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0' }}</span><br>
                    <span v-if="row.balance_limit > 0" style="color:red;">Limit :  {{ Number(row.balance_limit).toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0' }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" :pagination="handleFilter" />
            </el-card>
          </el-col>
          <el-col :span="11">
            <el-card class="box-card">
              <el-tabs v-model="activeName" type="card" style="margin-top:0;" vertical>
                <el-tab-pane key="Balance" :label="$t('balance')" name="Balance">
                  <!--                  <keep-alive>-->
                  <el-form ref="UserForm" class="form-container" :model="UserForm" :rules="UserRules" size="mini">
                    <el-card class="box-card">
                      <el-row>
                        <el-row>
                          <el-col :span="8" style="margin-right: 10px;">
                            <el-form-item :label="$t('ReceiptNo')" class="postInfo-container-item">
                              <span style="float: right; font-weight: bold;">:</span>
                            </el-form-item>
                          </el-col>
                          <el-col :span="15">
                            <el-form-item>
                              <el-input v-model="UserForm.id" readonly type="text" class="article-textarea" autosize placeholder="Please enter Amount" required />
                            </el-form-item>
                          </el-col>

                        </el-row>

                      </el-row>
                      <el-row>
                        <el-row>
                          <el-col :span="8" style="margin-right: 10px;">
                            <el-form-item :label="$t('PaymentDate')" class="postInfo-container-item">
                              <span style="float: left; color:red; font-weight: bold;">*</span>
                              <span style="float: right; font-weight: bold;">:</span>
                            </el-form-item>
                          </el-col>
                          <el-col :span="15">
                            <el-form-item prop="date">
                              <el-date-picker
                                v-model="UserForm.date"
                                type="date"
                                disabled
                                format="dd-MM-yyyy"
                                value-format="yyyy-MM-dd"
                                placeholder="Pick a day"
                              />
                            </el-form-item>
                          </el-col>

                        </el-row>

                      </el-row>
                      <el-row>
                        <el-row>
                          <el-col :span="8" style="margin-right: 10px;">
                            <el-form-item :label="$t('student_name')" class="postInfo-container-item">
                              <span style="float: left; color:red; font-weight: bold;">*</span>
                              <span style="float: right; font-weight: bold;">:</span>
                            </el-form-item>
                          </el-col>
                          <el-col :span="15">
                            <el-form-item prop="student">
                              <el-input v-model="UserForm.student" readonly type="text" class="article-textarea" autosize placeholder="Please enter Student Name" required />
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-row>
                      <el-row>
                        <el-row>
                          <el-col :span="8" style="margin-right: 10px;">
                            <el-form-item :label="$t('amount')" class="postInfo-container-item">
                              <span style="float: left; color:red; font-weight: bold;">*</span>
                              <span style="float: right; font-weight: bold;">:</span>
                            </el-form-item>
                          </el-col>
                          <el-col :span="15">
                            <el-form-item prop="amount">
                              <el-input v-model="UserForm.amount" type="text" class="article-textarea" autosize placeholder="Please enter Amount" style="width: 100%;" required />
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-row>
                      <el-row>
                        <el-row>
                          <el-col :span="8" style="margin-right: 10px;">
                            <el-form-item :label="$t('note')" class="postInfo-container-item">
                              <span style="float: right; font-weight: bold;">:</span>
                            </el-form-item>
                          </el-col>
                          <el-col :span="15">
                            <el-form-item>
                              <el-input
                                ref="last_name"
                                v-model="UserForm.note"
                                :rows="1"
                                type="textarea"
                                class="article-textarea"
                                autosize
                                placeholder="Please enter the Notes"
                              />
                            </el-form-item>
                          </el-col>
                        </el-row>

                      </el-row>
                      <el-button
                        style="margin-left: 40%; width: 200px; margin-top: 10px;"
                        type="success"
                        @click.native.prevent="store"
                      >
                        {{ $t('submit') }}
                      </el-button>
                    </el-card>
                  </el-form>
                  <el-table v-loading="loading" height="375" style="width: 100%;font-size: .80em" :data="studentBalances" show-summary stripe>
                    <el-table-column type="index" width="50" />
                    <el-table-column prop="type" :label="$t('type')" width="100" />
                    <el-table-column prop="amount" :label="$t('amount')" width="110">
                      <template slot-scope="{row}">
                        {{ Number(row.amount).toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0' }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="date" :label="$t('date')" width="100" />
                    <el-table-column prop="message" :label="$t('note')" />
                    <!--                <el-table-column prop="grade.grade" :label="$t('grade')" />-->
                    <!--                <el-table-column prop="classgroup[0].code" :label="$t('Class')" width="100" />-->
                  </el-table>
                  <!--                  </keep-alive>-->
                </el-tab-pane>
                <el-tab-pane key="DailyLimit" :label="$t('daily_limit')" name="DailyLimit">
                  <div style="height: 666px;">
                    <el-form ref="DailyLimit" class="form-container" :model="DailyLimit" :rules="DailyLimitRules" size="mini">
                      <el-card class="box-card">
                        <el-row>
                          <el-row>
                            <el-col :span="8" style="margin-right: 10px;">
                              <el-form-item :label="$t('PaymentDate')" class="postInfo-container-item">
                                <span style="float: left; color:red; font-weight: bold;">*</span>
                                <span style="float: right; font-weight: bold;">:</span>
                              </el-form-item>
                            </el-col>
                            <el-col :span="15">
                              <el-form-item prop="date">
                                <el-date-picker
                                  v-model="DailyLimit.date"
                                  type="date"
                                  disabled
                                  format="dd-MM-yyyy"
                                  value-format="yyyy-MM-dd"
                                  placeholder="Pick a day"
                                />
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-row>
                        <el-row>
                          <el-row>
                            <el-col :span="8" style="margin-right: 10px;">
                              <el-form-item :label="$t('student_name')" class="postInfo-container-item">
                                <span style="float: left; color:red; font-weight: bold;">*</span>
                                <span style="float: right; font-weight: bold;">:</span>
                              </el-form-item>
                            </el-col>
                            <el-col :span="15">
                              <el-form-item prop="student">
                                <el-input v-model="DailyLimit.student" readonly type="text" class="article-textarea" autosize placeholder="Please enter Student Name" required />
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-row>
                        <el-row>
                          <el-row>
                            <el-col :span="8" style="margin-right: 10px;">
                              <el-form-item :label="$t('daily_limit')" class="postInfo-container-item">
                                <span style="float: left; color:red; font-weight: bold;">*</span>
                                <span style="float: right; font-weight: bold;">:</span>
                              </el-form-item>
                            </el-col>
                            <el-col :span="15">
                              <el-form-item prop="amount">
                                <el-input v-model="DailyLimit.amount" type="text" class="article-textarea" autosize placeholder="Please enter Amount" style="width: 100%;" required />
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-row>
                        <el-row>
                          <el-row>
                            <el-col :span="8" style="margin-right: 10px;">
                              <el-form-item :label="$t('note')" class="postInfo-container-item">
                                <span style="float: right; font-weight: bold;">:</span>
                              </el-form-item>
                            </el-col>
                            <el-col :span="15">
                              <el-form-item>
                                <el-input
                                  ref="last_name"
                                  v-model="DailyLimit.note"
                                  :rows="1"
                                  type="textarea"
                                  class="article-textarea"
                                  autosize
                                  placeholder="Please enter the Notes"
                                />
                              </el-form-item>
                            </el-col>
                          </el-row>

                        </el-row>
                        <el-button
                          style="margin-left: 35%; width: 100px; margin-top: 10px;"
                          type="success"
                          @click.native.prevent="DailyLimitStore"
                        >
                          {{ $t('submit') }}
                        </el-button>
                        <el-button
                          style="margin-left: 10px; width: 100px; margin-top: 10px;"
                          type="danger"
                          icon="el-icon-delete"
                          @click.native.prevent="DailyLimitDelete"
                        >
                          {{ $t('delete') }}
                        </el-button>
                      </el-card>
                    </el-form>
                  </div>
                </el-tab-pane>
              </el-tabs>

            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--    </el-form>-->
  </div>
</template>

<script>
// import { searchStudent } from '@/api/student-search'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission' // Permission directive
import store from '@/store'
import Pagination from '@/components/Pagination'
import moment from 'moment'
import checkPermission from '@/utils/permission'

export default {
  name: 'Student',
  components: { Pagination },
  directives: { waves, permission },
  data() {
    return {
      activeName: 'Balance',
      students: [],
      value: [],
      student: null,
      name: '',
      profit: '',
      grade: '',
      total: 0,
      loading: false,
      dialogPermissionLoading: false,
      ruleForm: {
        student: ''
      },
      UserForm: {
        id: 0,
        student_id: '',
        student: '',
        date: moment().format('YYYY-MM-DD'),
        amount: null,
        note: ''
      },
      DailyLimit: {
        id: 'new',
        student_id: '',
        student: '',
        date: moment().format('YYYY-MM-DD'),
        amount: null,
        note: ''
      },

      DailyLimitRules: {
        date: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        student: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        amount: [
          { required: true, pattern: /^\d*(\.\d{1,2})?$/, message: 'Amount is required' }
        ]
      },
      UserRules: {
        date: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        student: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        amount: [
          { required: true, pattern: /^\d*(\.\d{1,2})?$/, message: 'Amount is required' }
        ]
      },

      usersList1: [],
      grades: [],
      ProfitOptions: [],
      studentBalances: [],
      student_details: '',
      query: {
        page: 1,
        limit: 10,
        keyword: '',
        role: ''
      },
      rules: {
        student: [
          {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    },
    name: function(v) {
      // console.log(v)
      this.name = v
      this.handleFilter()
    }
  },
  mounted() {
    if (!this.checkPermission('Access_Student_Balance')) {
      this.$router.push({ path: '/403' })
    }
    this.handleFilter()
    this.getAllSchool()
    this.GetAllGrade()
  },
  methods: {
    checkPermission,
    remoteMethod(query) {
      this.loading = true
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
        this.loading = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.$store.dispatch('tagsView/delVisitedView', this.$route)
          this.$router.push('/setting/student-balance/' + this.ruleForm.student)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    StudentBalance(row) {
      this.student_details = row
      var balance = []
      this.loading = true
      this.UserForm.student = row.first_name + ' ' + row.middle_name + ' ' + row.last_name
      this.UserForm.student_id = row.id
      this.DailyLimit.student = row.first_name + ' ' + row.middle_name + ' ' + row.last_name
      this.DailyLimit.student_id = row.id
      if (row.student_wallet) {
        row.student_wallet.forEach(function(e) {
          if (e.type === 'balance' || e.type === 'order') {
            // console.log(row.student_wallet)
            balance.push(e)
          }
        })
      }
      if (row.student_balance_limits) {
        this.DailyLimit.amount = row.student_balance_limits.balance_limit
        this.DailyLimit.id = row.student_balance_limits.id
        this.DailyLimit.note = row.student_balance_limits.note
      }
      this.studentBalances = balance
      this.UserForm.id = balance.length + 1
      this.loading = false
      // console.log(row.student_wallet)
    },
    store() {
      this.$refs.UserForm.validate(valid => {
        if (valid) {
          if (Number(this.UserForm.amount) > 0) {
            this.loading = true
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
            // const id = this.$route.params && this.$route.params.id
            // formdata.append('id', id)
            formdata.append('student_id', this.UserForm.student_id)
            // formdata.append('parent_id', 2313)
            formdata.append('date', this.UserForm.date)
            formdata.append('amount', this.UserForm.amount)
            formdata.append('note', this.UserForm.note)
            // formdata.append('password_confirmation', this.UserForm.password_confirmation)
            // formdata.append('role', this.UserForm.password);
            // formdata.append('token', store.getters.token)
            this.axios
              .post(store.getters.api_route + 'pages/student_balance/store', formdata, config)
              .then(res => {
                if (res.data.error === true) {
                  this.$notify({
                    title: res.data.message + ' are Required',
                    message: res.data.message + ' are Required',
                    type: 'error',
                    duration: 2000
                  })
                } else {
                  this.UserForm.amount = ''
                  this.UserForm.note = ''
                  this.$refs.UserForm.resetFields()
                  var balance = []
                  if (res.data.student.student_wallet) {
                    res.data.student.student_wallet.forEach(function(e) {
                      if (e.type === 'balance' || e.type === 'order') {
                        balance.push(e)
                      }
                    })
                  }
                  this.studentBalances = balance
                  this.UserForm.id = balance.length + 1
                  this.handleFilter()
                  this.loading = false
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
          } else {
            this.$swal.fire({
              icon: 'error',
              text: 'The Amount must be bigger than zero',
              position: 'top-end',
              toast: true,
              showConfirmButton: false,
              timer: 2000
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    DailyLimitStore() {
      this.$refs.DailyLimit.validate(valid => {
        if (valid) {
          if (Number(this.DailyLimit.amount) > 0) {
            this.loading = true
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
            formdata.append('id', this.DailyLimit.id)
            formdata.append('student_id', this.DailyLimit.student_id)
            // formdata.append('parent_id', 2313)
            formdata.append('date', this.DailyLimit.date)
            formdata.append('amount', this.DailyLimit.amount)
            formdata.append('note', this.DailyLimit.note)
            this.axios
              .post(store.getters.api_route + 'cafeteria/student_balance/limit_save', formdata, config)
              .then(res => {
                if (res.data.error === true) {
                  this.$notify({
                    title: res.data.message + ' are Required',
                    message: res.data.message + ' are Required',
                    type: 'error',
                    duration: 2000
                  })
                } else {
                  this.DailyLimit.amount = ''
                  this.DailyLimit.note = ''
                  this.$refs.DailyLimit.resetFields()
                  var balance = []
                  if (res.data.student.student_wallet) {
                    res.data.student.student_wallet.forEach(function(e) {
                      if (e.type === 'balance' || e.type === 'order') {
                        balance.push(e)
                      }
                    })
                  }
                  this.studentBalances = balance
                  this.UserForm.id = balance.length + 1
                  this.handleFilter()
                  this.loading = false
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
          } else {
            this.$swal.fire({
              icon: 'error',
              text: 'The Amount must be bigger than zero',
              position: 'top-end',
              toast: true,
              showConfirmButton: false,
              timer: 2000
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    DailyLimitDelete() {
      this.$refs.DailyLimit.validate(valid => {
        if (valid) {
          // if (Number(this.DailyLimit.amount) > 0) {
          this.$confirm('This will Delete Student Daily Limit. Continue?', 'Warning', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            this.loading = true
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
            // formdata.append('id', this.DailyLimit.id)
            formdata.append('student_id', this.DailyLimit.student_id)
            // formdata.append('parent_id', 2313)
            // formdata.append('date', this.DailyLimit.date)
            // formdata.append('amount', this.DailyLimit.amount)
            // formdata.append('note', this.DailyLimit.note)
            this.axios
              .post(store.getters.api_route + 'cafeteria/student_balance/limit_delete', formdata, config)
              .then(res => {
                if (res.data.error === true) {
                  this.$notify({
                    title: res.data.message + ' are Required',
                    message: res.data.message + ' are Required',
                    type: 'error',
                    duration: 2000
                  })
                } else {
                  this.DailyLimit.amount = ''
                  this.DailyLimit.note = ''
                  this.$refs.DailyLimit.resetFields()
                  this.$refs.UserForm.resetFields()
                  // var balance = []
                  // if (res.data.student.student_wallet) {
                  //   res.data.student.student_wallet.forEach(function(e) {
                  //     if (e.type === 'balance' || e.type === 'order') {
                  //       balance.push(e)
                  //     }
                  //   })
                  // }
                  // this.studentBalances = balance
                  // this.UserForm.id = balance.length + 1
                  this.handleFilter()
                  this.loading = false
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
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'Delete Canceled'
            })
          })
          // }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getAllSchool() {
      // this.dialogPermissionLoading = true
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
        .post(store.getters.api_route + 'cafeteria/getallschool', formdata, config)
        .then(res => {
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.ProfitOptions = res.data.data

          // this.dialogPermissionLoading = false
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
    GetAllGrade() {
      // this.dialogPermissionLoading = true
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
        .post(store.getters.api_route + 'cafeteria/getallgrades', formdata, config)
        .then(res => {
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          // console.log(res.data)
          this.grades = res.data
          // this.dialogPermissionLoading = false
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
    handleFilter(page) {
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
      formdata.append('profit', this.profit)
      formdata.append('grade', this.grade)
      this.axios
        .post(store.getters.api_route + 'cafeteria/students?page=' + page, formdata, config)
        .then(res => {
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.total = res.data.data.total
          this.per_page = res.data.data.per_page
          // this.query.page = 1
          this.usersList1 = res.data.data.data
          this.usersList1.forEach(function(student) {
            if (student.student_wallet) {
              var balance = 0
              student.student_wallet.forEach(function(item) {
                if (item.type === 'balance' || item.type === 'order') {
                  balance += Number(item.amount)
                }
              })
              student.balance = balance
            }
            if (student.student_balance_limits) {
              student.balance_limit = student.student_balance_limits.balance_limit
            } else {
              student.balance_limit = ''
            }
          })

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
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-form-item {
    margin-left: 0;
    margin-bottom: 5px;
  }
  .el-row {
    margin-bottom: 0;
    margin-top: 5px;
  }
</style>
<style>
  .el-card__body {
    padding: 10px;
  }
  .el-form-item {
    margin-left: 0;
    margin-bottom: 5px;
  }
  .el-select {
    display: block;
    padding-right: 8px;
  }

  .el-row {
    margin-bottom: 20px;

  &
  :last-child {
    margin-bottom: 0;
  }

  }
  .el-col {
    border-radius: 4px;
  }
</style>
