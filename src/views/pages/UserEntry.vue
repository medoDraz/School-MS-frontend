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
                      <el-form-item :label="$t('role')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item prop="role">
                        <el-select
                          v-model="UserForm.role"
                          placeholder="Choose the Role"
                          clearable
                          class="filter-item"
                          style="width: 250px"
                        >
                          <el-option v-for="item in rolesList1" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                      </el-form-item>
                    </el-col>

                  </el-row>

                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('first_name')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item prop="first_name">
                        <el-input
                          ref="first_name"
                          v-model="UserForm.first_name"
                          :rows="1"
                          type="textarea"
                          class="article-textarea"
                          autosize
                          placeholder="Please enter the First Name"
                          required
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('last_name')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item prop="last_name">
                        <el-input
                          ref="last_name"
                          v-model="UserForm.last_name"
                          :rows="1"
                          type="textarea"
                          class="article-textarea"
                          autosize
                          placeholder="Please enter the Last Name"
                          required
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>

                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('user_credential')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-row>
                        <el-col :span="3" style="margin-right: 10px;">
                          <el-form-item :label="$t('mobile')" class="postInfo-container-item">
                            <span style="float: left; color:red; font-weight: bold;">*</span>
                            <span style="float: right; font-weight: bold;">:</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="19">
                          <el-form-item prop="mobile">
                            <el-input
                              ref="mobile"
                              v-model="UserForm.mobile"
                              autocomplete="off"
                              class="article-textarea"
                              placeholder="Please enter the Mobile"
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row style="margin-top: 12px;">
                        <el-col :span="3" style="margin-right: 10px;">
                          <el-form-item :label="$t('email')" class="postInfo-container-item">
                            <span style="float: left; color:red; font-weight: bold;">*</span>
                            <span style="float: right; font-weight: bold;">:</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="20">
                          <el-form-item prop="email">
                            <el-input
                              ref="email"
                              v-model="UserForm.email"
                              type="text"
                              :autocomplete="UserForm.email"
                              placeholder="Please enter the Email"
                              required
                            />
                          </el-form-item>
                        </el-col>
                      </el-row>

                    </el-col>

                  </el-row>

                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('password')" class="postInfo-container-item">
                        <span v-if="!UserForm.id" style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item v-if="UserForm.id">
                        <el-input
                          v-model="UserForm.password"
                          show-password
                          placeholder="Password"
                          autocomplete="new-password"
                          name="password"
                        />
                      </el-form-item>
                      <el-form-item v-else prop="password">
                        <el-input
                          ref="password"
                          v-model="UserForm.password"
                          show-password
                          placeholder="Password"
                          autocomplete="new-password"
                          name="password"
                        />
                      </el-form-item>

                    </el-col>

                  </el-row>

                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('password_confirmation')" class="postInfo-container-item">
                        <span v-if="!UserForm.id" style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item v-if="UserForm.id">
                        <el-input
                          v-model="UserForm.password_confirmation"
                          show-password
                          placeholder="Password"
                          name="password"
                        />
                      </el-form-item>
                      <el-form-item v-else prop="password_confirmation">
                        <el-input
                          ref="password_confirmation"
                          v-model="UserForm.password_confirmation"
                          show-password
                          placeholder="Password"
                          name="password"
                        />
                      </el-form-item>

                    </el-col>

                  </el-row>

                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('ask_change_pass')" class="postInfo-container-item">
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18" style="margin-top: 10px;">
                      <el-checkbox v-model="UserForm.ask_change_pass">{{ $t('ask_change_pass') }}</el-checkbox>

                    </el-col>

                  </el-row>

                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('gender')" class="postInfo-container-item">
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-row>
                        <div class="block">
                          <el-form-item prop="gender">
                            <el-radio-group ref="gender" v-model="UserForm.gender">
                              <el-radio label="female">
                                {{ $t('female') }}
                              </el-radio>
                              <el-radio label="male">
                                {{ $t('male') }}
                              </el-radio>
                            </el-radio-group>
                          </el-form-item>
                        </div>
                      </el-row>
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
import axios from 'axios'
import { removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

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
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        gender: '',
        // cafeteria: '',
        password: '',
        status: 1,
        password_confirmation: '',
        role: '',
        ask_change_pass: true
      },
      loading: false,
      UserRules: {
        // cafeteria: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        role: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        first_name: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        last_name: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        mobile: [
          { required: true, pattern: /^[0-9]+$/, message: 'Mobile is required' }
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
    // console.log(store.getters.user_id)
    this.getAllRoles()
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
      formdata.append('id', id)
      this.axios
        .post(store.getters.api_route + 'user/edit', formdata, config)
        .then(res => {
          console.log(res.data.user)
          this.UserForm.first_name = res.data.user.first_name
          this.UserForm.last_name = res.data.user.last_name
          this.UserForm.email = res.data.user.email
          // if (res.data.user.password !== '') {
          //   this.UserForm.password = res.data.user.password
          // }
          // this.UserForm.password=res.data.user.password
          // this.UserForm.password_confirmation=res.data.user.password
          this.UserForm.mobile = res.data.user.mobile
          this.UserForm.gender = res.data.user.gender
          if (res.data.user.ask_change_pass === 0) {
            this.UserForm.ask_change_pass = false
          } else {
            this.UserForm.ask_change_pass = true
          }
          if (res.data.user.cafeteria_id === 0) {
            this.UserForm.cafeteria = 'all'
          } else {
            this.UserForm.cafeteria = res.data.user.cafeteria_id
          }
          this.UserForm.role = res.data.role.id
          this.UserForm.status = res.data.user.status
          this.loading = false
          loading.close()
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
          formdata.append('first_name', this.UserForm.first_name)
          formdata.append('last_name', this.UserForm.last_name)
          formdata.append('email', this.UserForm.email)
          formdata.append('mobile', this.UserForm.mobile)
          formdata.append('gender', this.UserForm.gender)
          formdata.append('password', this.UserForm.password)
          formdata.append('password_confirmation', this.UserForm.password_confirmation)
          if (this.UserForm.ask_change_pass === false) {
            formdata.append('ask_change_pass', 0)
          } else {
            formdata.append('ask_change_pass', 1)
          }

          formdata.append('role', this.UserForm.role)
          formdata.append('status', this.UserForm.status)
          // formdata.append('role', this.UserForm.password);
          // formdata.append('token', store.getters.token)
          let url
          id ? url = store.getters.api_route + 'user/update' : url = store.getters.api_route + 'user/store'
          this.axios
            .post(url, formdata, config)
            .then(res => {
              if (res.data.error === true) {
                this.$notify({
                  title: res.data.message + ' are Required',
                  message: res.data.data['email'][0],
                  type: 'error',
                  duration: 2000
                })
              } else {
                this.UserForm.first_name = ''
                this.UserForm.last_name = ''
                this.UserForm.email = ''
                this.UserForm.mobile = ''
                this.UserForm.gender = ''
                this.UserForm.password = ''
                this.UserForm.password_confirmation = ''
                this.ask_change_pass = false
                this.UserForm.school = ''
                this.UserForm.role = ''
                this.$refs.UserForm.resetFields()
                this.$store.dispatch('tagsView/delVisitedView', this.$route)
                this.$router.push({ path: '/user_management/users' })
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
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getInfo() {
      return new Promise((resolve, reject) => {
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
        axios.post(store.getters.api_route + 'cafeteria/user/detail', formdata, config)
          .then(res => {
            const { data } = res
            if (!data) {
              reject('Verification failed, please Login again.')
            }
            const { ask_change_pass, id, permissions, api_token, school, roles, name, avatar, introduction, cafeteria, user, cafeteria_id } = data
            if (roles.length === 0) {
              reject('The user haven\'t any roles .')
            }
            const roles1 = []
            roles.forEach(function(entry) {
              roles1.push(entry.name)
            })
            this.$store.commit('SET_ROLES', roles1.toString())
            this.$store.commit('SET_USER_ID', id)
            this.$store.commit('SET_SCHOOL', school)
            this.$store.commit('SET_ASK_CHANGE_PASS', ask_change_pass)
            this.$store.commit('SET_Permissions', permissions)
            this.$store.commit('SET_Api_token', api_token)
            this.$store.commit('SET_NAME', name)
            this.$store.commit('SET_CAFETERIA', cafeteria)
            this.$store.commit('SET_CAFETERIA_ID', cafeteria_id)
            this.$store.commit('SET_USER', user)
            this.$store.commit('SET_AVATAR', store.getters.app_route + avatar)
            this.$store.commit('SET_INTRODUCTION', introduction)
            resolve(data)
          })
          .catch(err => {
            console.log(err)
            this.$store.dispatch('tagsView/delAllViews', null, { root: true })
            this.$store.commit('SET_TOKEN', '')
            this.$store.commit('SET_ROLES', [])
            removeToken()
            resetRouter()
            reject(err)
          })
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
        .post(store.getters.api_route + 'roles/getallroles', formdata, config)
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
