<template>
  <div class="app-container" style="padding-top: 45px;">
    <div class="filter-container">
      <el-input v-model="name" placeholder="keyword" clearable style="width: 300px; margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select
        v-model="cat_id"
        placeholder="Group"
        clearable
        style="width: 200px;margin-left: 10px;"
        class="filter-item"
        @change="handleFilter"
      >
        <div v-for="item in Groups" :key="item.id">
          <el-option
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </div>
      </el-select>
      <el-select
        v-model="store_id"
        placeholder="Cafeteria"
        clearable
        style="width: 200px;margin-left: 10px;"
        class="filter-item"
        @change="handleFilter"
      >
        <div v-for="item in Cafeterias" :key="item.id">
          <el-option
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </div>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="handleFilter">
        {{ $t('search') }}
      </el-button>
      <router-link :to="'/setting/item/entry'">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus">
          {{ $t('add') }}
        </el-button>
      </router-link>
      <el-button v-waves :loading="downloading" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('export') }}
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="accountsList1" stripe style="width: 100%;font-size: .8em">
      <el-table-column prop="id" :label="$t('id')" sortable width="60" />
      <el-table-column prop="name" :label="$t('ItemName')" sortable width="140" />
      <el-table-column prop="items_cats.name" :label="$t('Group')" sortable width="140">
        <template slot-scope="{row}">
          <div v-if="row.items_cats !== 'null'" style="display: grid;">
            <span>{{ row.items_cats.name }}</span>
            <span v-if="row.items_cats.status === 0" style="color: #ff0000">{{ $t('suspended') }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" :label="$t('price')" sortable width="230" />
      <el-table-column prop="cafetria_stores.name" :label="$t('Cafeteria')" sortable width="140">
        <template slot-scope="{row}">
          <div v-if="row.cafetria_stores !== 'null'" style="display: grid;">
            <span>{{ row.cafetria_stores.name }}</span>
            <span v-if="row.cafetria_stores.status === 0" style="color: #ff0000">{{ $t('suspended') }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('status')" prop="status" sortable width="110">
        <template slot-scope="{row}">
          <el-tag v-if="row.status === 1" type="success">
            {{ $t('active') }}
          </el-tag>
          <el-tag v-else type="danger">
            {{ $t('InActive') }}
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
              <router-link :to="'/setting/item/entry/'+row.id">
                <el-dropdown-item>{{ $t('edit') }}</el-dropdown-item>
              </router-link>
              <el-dropdown-item v-if="row.status !== 1" divided @click.native="handleModifyStatus(row,1)">
                {{ $t('active') }}
              </el-dropdown-item>
              <el-dropdown-item v-if="row.status !== 0" divided @click.native="handleModifyStatus(row,0)">
                {{ $t('suspend') }}
              </el-dropdown-item>
              <!--              <el-dropdown-item v-if="row.status!=='Open'" divided @click.native="handleModifyStatus(row,row.status)">-->
              <!--                {{ $t('ChangeStatus') }}-->
              <!--              </el-dropdown-item>-->
              <!--              <el-dropdown-item v-if="row.status!=='Closed'" divided @click.native="handleModifyStatus(row,'Closed')">-->
              <!--                Closed-->
              <!--              </el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" :pagination="getAllItems" />
    <!--    <el-pagination-->
    <!--      v-show="total>per_page"-->
    <!--      style="margin-top: 20px;"-->
    <!--      :current-page.sync="query.page"-->
    <!--      layout="total, prev, pager, next, jumper"-->
    <!--      :total="total"-->
    <!--      @current-change="handleCurrentChange"-->
    <!--    />-->
  </div>
</template>
<script>

import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission' // Permission directive
import Pagination from '@/components/Pagination'
import store from '@/store'
import checkPermission from '@/utils/permission'
import { parseTime } from '@/utils'

export default {
  name: 'ItemsList',
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
    var validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.newUser.password) {
        callback(new Error('Password is mismatched!'))
      } else {
        callback()
      }
    }
    return {
      name: '',
      store_id: '',
      cat_id: '',
      statusOptions: ['Active', 'Suspend', 'Draft'],
      textMap: { update: 'Edit', create: 'Create' },
      dialogStatus: '',
      accountsList1: [],
      tableData: [],
      list: null,
      total: 0,
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
        role: [{ required: true, message: 'Role is required', trigger: 'change' }],
        name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
        email: [
          { required: true, message: 'Email is required', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
        ],
        password: [{ required: true, message: 'Password is required', trigger: 'blur' }],
        confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
      },
      permissionProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled'
      },
      permissions: [],
      menuPermissions: [],
      Cafeterias: [],
      Groups: [],
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
      if (v) {
        this.name = v
        this.handleFilter()
      } else {
        this.getAllItems(0)
      }
    }
  },
  mounted() {
    if (!this.checkPermission('Access_Section')) {
      this.$router.push({ path: '/403' })
    }
    console.log('Component mounted.')
  },
  created() {
    this.getAllItems(0)
    this.getAllCafeterias()
    this.getAllGroups()
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
      formdata.append('token', store.getters.token)
      formdata.append('limit', 'NaN')
      this.axios
        .post(store.getters.api_route + 'pages/Cafetrias/list', formdata, config)
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
    getAllGroups() {
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
      this.axios.post(store.getters.api_route + 'pages/groups/index', formdata, config)
        .then(res => {
          // console.log(res.data.data)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.Groups = res.data.data.data
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
    getAllItems(page) {
      this.listLoading = true
      // let config = {
      //    headers: { 'content-type': 'multipart/form-data' }
      //  };
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
      this.axios.post(store.getters.api_route + 'cafeteria/Items/list?page=' + page, formdata, config)
        .then(res => {
          // console.log(res.data.data.data)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.total = res.data.data.total
          this.per_page = res.data.data.per_page
          this.accountsList1 = res.data.data.data
          this.listLoading = false
          // console.log(this.accountsList1)
        })
        .catch(err => {
          console.log(err)
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
      formdata.append('store_id', this.store_id)
      formdata.append('cat_id', this.cat_id)
      this.axios.post(store.getters.api_route + 'cafeteria/Items/list', formdata, config)
        .then(res => {
          // console.log(res)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.total = res.data.data.total
          this.per_page = res.data.data.per_page
          this.accountsList1 = res.data.data.data
          this.listLoading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleModifyStatus(row, status) {
      // console.log(status)
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
      // var sts = 0
      // if (status === 1) {
      //   sts = 0
      // } else {
      //   sts = 1
      // }
      formdata.append('status', status)
      // formdata.append('token', store.getters.token)
      this.axios.post(store.getters.api_route + 'cafeteria/changeItemSts', formdata, config)
        .then(res => {
          console.log(res.data)
          this.$message({
            message: res.data.message,
            type: 'success'
          })
          row.status = Number(status)
          // row.Status = stsTxt
          this.getAllItems()
        })
        .catch(err => {
          console.log(err)
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
        const tHeader = ['id', 'Item Name', 'Group', 'Price', 'Cafeteria', 'status']
        const filterVal = ['id', 'name', 'items_cats', 'price', 'cafetria_stores', 'status']
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
      const { data, meta } = this.userslist
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
      return this.accountsList1.map(v => filterVal.map(j => {
        if (typeof v[j] === 'object') {
          if (j === 'cafetria_stores') {
            return v[j].name
          } else if (j === 'items_cats') {
            return v[j].name
          }
        } else if (j === 'status') {
          if (v[j] === 0) {
            return 'Suspended'
          } else {
            return 'Active'
          }
        } else if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleSizeChange(val) {
      // console.log(`dgdg ${val} 条`);
    },
    handleCurrentChange(val) {
      this.getAllItems(val)
      // console.log(`当前页: ${val}`);
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
}
</style>
