<template>
  <div class="app-container" style="padding-top: 45px;">
    <div class="board-column">
      <div class="board-column-header">
        {{ $t('groups_sorting') }}
      </div>
      <draggable
        :list="rolesList1"
        class="board-column-content"
      >
        <div v-for="element in rolesList1" :key="element.id" class="board-item">
          {{ element.name }} ( {{ element.cafetria_stores.name }} )
        </div>
      </draggable>
    </div>
    <div class="header">
      <el-button
        style="margin-left: 40%; width: 200px; margin-top: 10px;"
        type="success"
        @click="test"
      >
        {{ $t("save") }}
      </el-button>
    </div>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import Kanban from '@/components/Kanban'
import draggable from 'vuedraggable'
import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission' // Permission directive
import checkPermission from '@/utils/permission' // Permission checking
// import DropdownMenu from '@/components/Share/DropdownMenu'
import store from '@/store'
// import { validNumber } from '@/utils/validate'

export default {
  name: 'BanksList',
  components: { draggable },
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
        cafeteria: '',
        name: '',
        status: 1
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
        this.getAllRoles()
      }
    }
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
    this.getAllRoles()
    // this.getAllCafeterias()
  },
  methods: {
    checkPermission,
    getAllRoles() {
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
      formdata.append('limit', this.query.limit)
      formdata.append('search', this.name)
      formdata.append('store_id', this.store_id)
      this.axios.post(store.getters.api_route + 'pages/ActiveGroups', formdata, config)
        .then(res => {
          // console.log(res.data.data)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.rolesList1 = res.data.data
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
    test() {
      this.rolesList1.forEach(function(e, index) {
        e.ordering = index + 1
        // console.log(e)
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

      formdata.append('groups', JSON.stringify(this.rolesList1))
      this.axios.post(store.getters.api_route + 'pages/GroupsSorting', formdata, config)
        .then(res => {
          // console.log(res.data.data)
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
          this.getAllRoles()
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
<style>
  .board-column-header {
    background: #5d6c7e !important;
  }

</style>
<style lang="scss" scoped>
  .header {
    position: fixed;
    bottom: 0;
    width: 85.1%;
    background: #5d6c7e;
    padding-bottom: 10px;
  }
  .board-column {
    min-width: 300px;
    min-height: 100px;
    height: auto;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 3px;
    margin-bottom: 34px;

    .board-column-header {
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      padding: 0 20px;
      text-align: center;
      background: #333;
      color: #fff;
      border-radius: 3px 3px 0 0;
    }

    .board-column-content {
      height: auto;
      overflow: hidden;
      border: 10px solid transparent;
      min-height: 60px;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;

      .board-item {
        cursor: pointer;
        width: 100%;
        height: 40px;
        margin: 5px 0;
        background-color: #fff;
        text-align: left;
        line-height: 30px;
        padding: 5px 10px;
        box-sizing: border-box;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
      }
    }
  }
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
