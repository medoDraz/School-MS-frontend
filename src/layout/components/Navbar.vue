<template>
  <div>
    <div class="navbar">
      <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

      <div class="right-menu">
        <template v-if="device!=='mobile'">
          <error-log class="errLog-container right-menu-item hover-effect" />

          <screenfull id="screenfull" class="right-menu-item hover-effect" />

          <!--          <el-tooltip content="Global Size" effect="dark" placement="bottom">-->
          <!--            <size-select id="size-select" class="right-menu-item hover-effect" />-->
          <!--          </el-tooltip>-->

          <lang-select class="right-menu-item hover-effect" />

        </template>

        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="avatar" class="user-avatar">
            <!-- <i class="el-icon-caret-bottom" /> -->
          </div>
          <el-dropdown-menu slot="dropdown">

            <el-dropdown-item disabled>
              <span style="display:block;">Welcome {{ name }}</span>
            </el-dropdown-item>

            <router-link to="/">
              <el-dropdown-item divided>{{ $t('dashboard') }}</el-dropdown-item>
            </router-link>

            <el-dropdown-item divided @click.native="handleEditPermissions">
              <span style="display:block;">{{ $t('change_password') }}</span>
            </el-dropdown-item>

            <el-dropdown-item divided @click.native="logout">
              <span style="display:block;">{{ $t('logout') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-dialog :visible.sync="dialogChangePassVisible" :title=" $t('change_password')+' - '+name ">
      <div v-loading="dialogPermissionLoading" class="form-container">
        <div class="permissions-container">
          <div class="block">
            <el-form label-width="80px" label-position="top">
              <el-form-item :label="$t('new_password')">
                <el-input
                  ref="password"
                  v-model="password"
                  type="password"
                  placeholder="Password"
                  name="password"
                />
              </el-form-item>
            </el-form>
            <el-form label-width="80px" label-position="top">
              <el-form-item :label="$t('password_confirmation')">
                <el-input
                  ref="password"
                  v-model="password_confirmation"
                  type="password"
                  placeholder="Password"
                  name="password"
                />

              </el-form-item>
            </el-form>

          </div>

        </div>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogChangePassVisible=false">
            {{ $t('cancel') }}
          </el-button>
          <el-button type="primary" @click.native="handleModifypermissions">
            {{ $t('confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
// import Search from '@/components/HeaderSearch'
import store from '@/store'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    // SizeSelect
    LangSelect
    // Search
  },
  data() {
    return {
      dialogChangePassVisible: false,
      dialogPermissionLoading: false,
      password: '',
      password_confirmation: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'ask_change_pass',
      'device'
    ])
  },
  created() {
    // console.log(this.ask_change_pass)
    if (this.ask_change_pass === 1) {
      this.dialogChangePassVisible = true
    } else {
      // this.dialogChangePassVisible=true
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async handleEditPermissions() {
      this.dialogPermissionLoading = true
      this.dialogChangePassVisible = true
      this.dialogPermissionLoading = false
    },
    handleModifypermissions() {
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
      // formdata.append('id', this.user_id);
      formdata.append('password', this.password)
      formdata.append('password_confirmation', this.password_confirmation)
      formdata.append('token', store.getters.token)
      this.axios.post(store.getters.api_route + 'pages/user/changepassword', formdata, config)
        .then(res => {
          // console.log(res.data)
          this.dialogChangePassVisible = false
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
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
  }
</style>
