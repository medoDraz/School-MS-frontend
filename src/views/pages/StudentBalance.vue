<template :loading="loading">

  <div style="padding : 35px;">
    <div class="createPost-container">
      <el-form ref="UserForm" class="form-container" :model="UserForm" :rules="UserRules">

        <div class="createPost-main-container" style="margin-top: 20px;">
          <el-row>

            <div class="postInfo-container">
              <el-card class="box-card">
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('ReceiptNo')" class="postInfo-container-item">
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item>
                        <el-input v-model="UserForm.id" readonly type="text" class="article-textarea" autosize placeholder="Please enter Amount" required />
                      </el-form-item>
                    </el-col>

                  </el-row>

                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('PaymentDate')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item prop="date">
                        <el-date-picker
                          v-model="UserForm.date"
                          type="date"
                          format="dd-MM-yyyy"
                          value-format="yyyy-MM-dd"
                          placeholder="Pick a day"
                        />
                      </el-form-item>
                    </el-col>

                  </el-row>

                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('student_name')" class="postInfo-container-item">
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item>
                        <el-input v-model="student" readonly type="text" class="article-textarea" autosize placeholder="Please enter Amount" required />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('amount')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item prop="amount">
                        <el-input v-model.number="UserForm.amount" :rows="1" type="text" class="article-textarea" autosize placeholder="Please enter Amount" required />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('note')" class="postInfo-container-item">
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
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
            </div>
          </el-row>
        </div>
      </el-form>

    </div>

  </div>

</template>

<script>
// import MDinput from '@/components/MDinput'
// import Sticky from '@/components/Sticky'
// import Warning from './Warning'
import checkPermission from '@/utils/permission'
// import Multiselect from '@/views/components-demo/drag-select'
// import TabPane from '@/views/tab/components/TabPane'
import permission from '@/directive/permission'
// import ElDragSelect from '@/components/DragSelect' // base on element-ui
import store from '@/store'
import { validEmail } from '@/utils/validate'

export default {
  name: 'UserEntry',
  components: {},
  directives: { permission },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('Please enter the correct email'))
      } else {
        callback()
      }
    }

    const validateConfirmPass = (rule, value, callback) => {
      if (value !== this.UserForm.password) {
        if (!value) {
          callback(new Error('This field value is required'))
        }
        callback(new Error('The password is not matching'))
      } else {
        callback()
      }
    }

    return {
      UserForm: {
        id: '',
        student_id: '',
        date: new Date().toJSON().replace(/T|Z/g, ' ').split(' ')[0],
        amount: '',
        note: ''
      },
      student: '',
      loading: false,
      UserRules: {
        date: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        amount1: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        first_name: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        last_name: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        amount: [
          { required: true, message: 'Amount is required' },
          { type: 'number', message: 'Amount must be  numbers' }
        ],
        gender: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        password: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        password_confirmation: [{ required: true, trigger: 'blur', validator: validateConfirmPass }]
      },
      options: [
        {
          value: 'All',
          label: 'All'
        },
        {
          value: 'American',
          label: 'American'
        },
        {
          value: 'British',
          label: 'British'
        },
        {
          value: 'Company',
          label: 'Company'
        }
      ],
      activeName: 'Settings',
      schoolOptions: [
        { key: 'American', display_name: 'American' },
        { key: 'British', display_name: 'British' }
      ],

      rolesList1: [],
      Cafeterias: []
    }
  },
  computed: {
    isValidForm() {
      return (
        this.cashin_new_number.length > 5 &&
        this.cashout_new_number.length > 5 &&
        this.pay_new_number.length > 5 &&
        this.pur_new_number.length > 5 &&
        this.journal_new_number.length > 5 &&
        this.inventory_new_number.length > 5
      )
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  mounted() {
    if (!this.checkPermission('Add_user') || !this.checkPermission('Edit_user')) {
      this.$router.push({ path: '/403' })
    }
    console.log('Component mounted.')
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    if (id) {
      this.UserForm.id = id
      this.fetchData(id)
    }
    // this.getAllRoles()
    // this.getAllCafeterias()
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    checkPermission,
    fetchData(id) {
      this.loading = true
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255,255,255,0.95)'
      })
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
      formdata.append('student_id', id)
      this.axios
        .post(store.getters.api_route + 'pages/student/details', formdata, config)
        .then(res => {
          // console.log(res.data.user)
          this.student = res.data.data.first_name + ' ' + res.data.data.middle_name + ' ' + res.data.data.last_name
          this.UserForm.student_id = res.data.data.id
          this.UserForm.id = Number(res.data.lastID) + 1
          // if (res.data.user.password !== '') {
          //   this.UserForm.password = res.data.user.password
          // }
          // this.UserForm.password=res.data.user.password
          // this.UserForm.password_confirmation=res.data.user.password
          // this.UserForm.mobile = Number(res.data.user.mobile)
          // this.UserForm.gender = res.data.user.gender
          // if (res.data.user.ask_change_pass === 0) {
          //   this.UserForm.ask_change_pass = false
          // } else {
          //   this.UserForm.ask_change_pass = true
          // }
          // if (res.data.user.cafeteria_id === 0) {
          //   this.UserForm.cafeteria = 'all'
          // } else {
          //   this.UserForm.cafeteria = res.data.user.cafeteria_id
          // }
          // this.UserForm.role = res.data.role.id
          // this.UserForm.status = res.data.user.status
          this.loading = false
          loading.close()
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
    store() {
      this.$refs.UserForm.validate(valid => {
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
          const id = this.$route.params && this.$route.params.id
          formdata.append('id', id)
          formdata.append('student_id', this.UserForm.student_id)
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
                this.$store.dispatch('tagsView/delVisitedView', this.$route)
                this.$router.push({ path: '/setting/student' })
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
          console.log('error submit!!')
          return false
        }
      })
    },
    getAllRoles() {
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
        .post(store.getters.api_route + 'pages/roles/getallroles', formdata, config)
        .then(res => {
          // console.log(res.data.data)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
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
    getroledata() {
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
      formdata.append('id', this.UserForm.role)
      this.axios
        .post(store.getters.api_route + 'accounting/role/edit', formdata, config)
        .then(res => {
          this.UserForm.school = res.data.focus
          // console.log(res.data)
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

  .drag-select {
    ::v-deep {
      .sortable-ghost {
        opacity: 0.8;
        color: #fff !important;
        background: #42b983 !important;
      }

      .el-tag {
        cursor: pointer;
      }
    }
  }

  .article-textarea ::v-deep {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }

  .tab-container {
    margin: 30px;
  }

  .block {
    padding: 12px 10px;
  }

</style>
