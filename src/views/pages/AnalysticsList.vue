<template>
  <div class="app-container" style="padding-top: 45px;">
    <div class="filter-container">
      <el-input v-model="name" placeholder="keyword" style="width: 300px; margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="handleFilter">
        search
      </el-button>
	  <router-link :to="'/accounting/analystic/add'">
		<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus">
		add
		</el-button>
        </router-link>
      <el-button v-waves :loading="downloading" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-download" @click="handleDownload">
        export
      </el-button>
    </div>
    <el-table :data='accountsList1' border >
    <el-table-column prop="id" label="ID" sortable width="60" >
    </el-table-column>
    <el-table-column prop="code_id" label="Code ID" sortable width="130">
    </el-table-column>
    <el-table-column prop="analysis_name"  label="Analysis Name" sortable width="150">

    </el-table-column>
    <el-table-column prop="description" label="Description" sortable width="230">
    </el-table-column>
    
    <el-table-column label="Created By" sortable width="120">
        <template slot-scope={row}>
			{{row.user.name}}
		</template>
    </el-table-column>
    <el-table-column prop="records_type" label="Type" sortable width="140">
    </el-table-column>
	<el-table-column label="Status" width="110">
		<template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
    </el-table-column>
    <el-table-column  label="Actions">
		<template slot-scope="{row,$index}" style="display: initial;">
		  <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
			<div class="avatar-wrapper">
			  <el-button type="outline-primary" class="user-avatar" icon="el-icon-more" size="mini">
			  </el-button>
			</div>
			<el-dropdown-menu slot="dropdown">
			  <router-link :to="'/accounting/analystic/edit/'+row.id">
				<el-dropdown-item >Edit</el-dropdown-item>
			  </router-link>

        <router-link :to="'/accounting/analystic/dimension_code/'+row.id">
        <el-dropdown-item divided>Dimensions Code</el-dropdown-item>
        </router-link>

				<el-dropdown-item v-if="row.status!='Open'" divided @click.native="handleModifyStatus(row,'Open')">
          Open
        </el-dropdown-item>

				<el-dropdown-item v-if="row.status!='Closed'" divided @click.native="handleModifyStatus(row,'Closed')">
          Closed
          </el-dropdown-item>

			</el-dropdown-menu>
		  </el-dropdown>
        </template>
    </el-table-column>
  </el-table>
  <el-pagination
      v-show="total>per_page"
      style="margin-top: 20px;"
      :current-page.sync="query.page"
      layout="total, prev, pager, next, jumper"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

import waves from '@/directive/waves' // Waves directive
import permission from '@/directive/permission' // Permission directive
import userslist from '@/api/userslist.json'
import store from '@/store'
const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]
// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'AnalysticsList',
  components: {  },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Open: 'success',
        Closed: 'danger',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
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
		calendarTypeOptions,
		name:'',
		statusOptions: ['Active', 'Suspend', 'Draft'],
		textMap: {update: 'Edit',create: 'Create'},
	    dialogStatus: '',
		accountsList1: [],
		tableData: [],
		users: userslist,
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
        limit: 15,
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
      otherPermissions: []
    }
  },
  computed: {
    headers(){
		return [
			{text: 'Name' , value: 'name'},
			{text: 'Name' , value: 'name'},
			{text: 'Name' , value: 'name'},
		]
	},

	items(){
		return [
			{text: 'Name' , value: 'name'},
			{text: 'Name' , value: 'name'},
			{text: 'Name' , value: 'name'},
		]
	},
  },
  created() {
     this.getAllUsers()
  },
  methods: {
    getAllUsers(page) {
      this.listLoading = true
      let config = {
          headers: {"content-type": 'multipart/form-data'}
        };
        let formdata = new FormData();
        formdata.append('token', store.getters.token);
      this.axios.post(store.getters.api_route+'accounting/analytics/index?page='+page,formdata,config)
			.then(res => {
				//console.log(res.data.data)
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

			});
    },
	handleFilter() {
      //this.listQuery.page = 1
	  let config = {
          headers: {"content-type": 'multipart/form-data'}
        };
        let formdata = new FormData();
        formdata.append('token', store.getters.token);
	     formdata.append('search', this.name);
      this.axios.post(store.getters.api_route+'accounting/analytics/getallanalystic', formdata, config)
		.then(res => {
			//console.log(res)
			const { data } = res
			if (!data) {
				console.log('sdfsf')
			}
			this.accountsList1 = res.data.data
		})
		.catch(err => {
			console.log(err)

		});
    },
    handleModifyStatus(row, status) {
      //console.log(row)
      let config = {
        headers: {"content-type": 'multipart/form-data'}
      };
      let formdata = new FormData();
      formdata.append('id', row.id);
      formdata.append('status', status);
      formdata.append('token', store.getters.token);
      this.axios.post(store.getters.api_route+'accounting/analytics/change_status', formdata, config)
        .then(res => {
        //console.log(res.data)
        this.$message({
        message: res.data.message,
        type: 'success'
      })
      row.status = status

			})
			.catch(err => {
				console.log(err)

			});

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
        const tHeader = ['id', 'code_id', 'analysis_name', 'description','records_type','created_by', 'status']
        const filterVal = ['id', 'code_id', 'analysis_name', 'description','records_type','created_by', 'status']
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
      const { limit, page } = this.query;
      this.loading = true;
      const { data, meta } = userslist;
      this.list = data;
      this.list.forEach((element, index) => {
        element['index'] = (page - 1) * limit + index + 1;
      });
      this.total = meta.total;
      this.loading = false;
    },
	handleDelete(row, index) {
		console.log(row);
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
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleSizeChange(val) {
      //console.log(`dgdg ${val} 条`);
    },
    handleCurrentChange(val) {
      this.getAllUsers(val)
      //console.log(`当前页: ${val}`);
    }
  },
};
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
