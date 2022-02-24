<template>
  <div class="container">
    <div class="left-container" style="bacground: #000000; padding-top:35px">
      <el-card style="margin-bottom: 10px;">
        <el-row>
          <el-col :span="2" style="padding-top: 10px;">Date : </el-col>
          <el-col :span="4">
            <el-date-picker
              v-model="date"
              type="date"
              format="yyyy-MM-dd"
              :clearable="false"
              value-format="yyyy-MM-dd"
              placeholder="Pick a day"
              style="width: 100%;"
              @change="getAllItems()"
            />
          </el-col>
          <!--          <el-col :span="2" style="padding-top: 10px;">Break : </el-col>-->
          <!--          <el-col :span="4">-->
          <!--            <el-select-->
          <!--              v-model="breaks"-->
          <!--              filterable-->
          <!--              remote-->
          <!--              reserve-keyword-->
          <!--              :placeholder="$t('break')"-->
          <!--              style="width:100%"-->
          <!--              @change="getAllItems()"-->
          <!--            >-->
          <!--              <el-option label="Break 1" value="1" />-->
          <!--              <el-option label="break 2" value="2" />-->
          <!--            </el-select>-->
          <!--          </el-col>-->
          <el-col :span="2" style="padding-top: 10px;">Cafeteria : </el-col>
          <el-col :span="4">
            <el-select
              v-model="cafeteria_id"
              filterable
              remote
              reserve-keyword
              :placeholder="$t('cafeterias')"
              style="width:100%"
              @change="getAllItems()"
            >
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
              <!--              <el-option v-for="item in Cafeterias" :key="item.id" :label="item.name" :value="item.id" />-->
            </el-select>
          </el-col>
        </el-row>
      </el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-container>
              <el-header
                class="demo-color-box"
                style="background: rgb(144, 147, 153);"
              > {{ $t('NewOrders') }}</el-header>
              <div style="height: 680px;overflow: auto;">
                <div
                  v-for="transition of new_items"
                  :key="transition.id"
                  class="el-card card-item"
                  style="margin:5px 0; background: background: rgb(192, 196, 204);"
                  @click="getDetails(transition)"
                >
                  <el-button type="text" style="width: 100%;">
                    <div class="text item" style="padding:5px 20px;">
                      <el-row :gutter="20" style="padding-bottom: 5px;padding-top: 5px;">
                        <span v-if="transition.via === 'POS'">In School Order</span>
                        <span v-else>Online Order</span>
                      </el-row>
                      <el-divider />
                      <el-row :gutter="30">
                        <el-col :span="8">
                          <div class="grid-content bg-purple-left">
                            # {{ transition.id }}
                          </div>
                        </el-col>
                        <el-col :span="8">
                          <div class="grid-content bg-purple-left" style="width: 100%;">
                            <span style="font-weight: bold;">{{ transition.user_type }}</span>
                          </div>
                        </el-col>
                        <el-col :span="7">
                          <div
                            class="grid-content bg-purple-right "
                            style="text-align: right;"
                          >
                            {{ transition.total }} EGP
                          </div>
                        </el-col>
                      </el-row>
                      <el-divider />
                      <el-row :gutter="20" style="padding-bottom: 5px;padding-top: 5px;">
                        <span v-if="transition.student">{{ transition.student.name }}</span>
                        <span v-if="transition.staff">{{ transition.staff.name }}</span>
                      </el-row>
                      <span v-if="transition.student && transition.student.medical.length > 0" style="margin-top: 2px;color:red;">
                        * Medical: <span v-for="item in transition.student.medical" :key="item.id">{{ item.food_allergies }}</span>
                      </span>
                      <el-divider />
                      <el-row :gutter="20">
                        <el-col :span="10">
                          <div class="grid-content bg-purple-left">
                            <i class="el-icon-time" />
                            {{ format_date(transition.created_at) }}
                          </div>
                        </el-col>

                        <el-col :span="6" :offset="6">
                          {{ transition.countitems }} {{ $t('items') }}
                        </el-col>
                      </el-row>
                    </div>
                  </el-button>
                </div>
              </div>
            </el-container>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-container>
              <el-header
                class="demo-color-box"
                style="background: rgb(230, 162, 60);"
              >{{ $t('ReadyOrders') }}</el-header>

              <div style="height: 680px;overflow: auto;">
                <div
                  v-for="transition of ready_items"
                  :key="transition.id"
                  class="el-card card-item"
                  style="margin:5px 0px; background: rgb(250, 236, 216)"
                  @click="getDetails(transition)"
                >
                  <el-button type="text" style="width: 100%;">
                    <div class="text item" style="padding:5px 20px;">
                      <el-row :gutter="20" style="padding-bottom: 5px;padding-top: 5px;">
                        <span v-if="transition.via === 'POS'">In School Order</span>
                        <span v-else>Online Order</span>
                      </el-row>
                      <el-divider />
                      <el-row :gutter="30">
                        <el-col :span="8">
                          <div class="grid-content bg-purple-left">
                            # {{ transition.id }}
                          </div>
                        </el-col>
                        <el-col :span="8">
                          <div class="grid-content bg-purple-left" style="width: 100%;">
                            <span style="font-weight: bold;">{{ transition.user_type }}</span>
                          </div>
                        </el-col>
                        <el-col :span="7">
                          <div
                            class="grid-content bg-purple-right "
                            style="text-align: right;"
                          >
                            {{ transition.total }} EGP
                          </div>
                        </el-col>
                      </el-row>
                      <el-divider />
                      <el-row :gutter="20" style="padding-bottom: 5px;padding-top: 5px;">
                        <span v-if="transition.student">{{ transition.student.name }}</span>
                        <span v-if="transition.staff">{{ transition.staff.name }}</span>
                      </el-row>
                      <span v-if="transition.student && transition.student.medical.length > 0" style="margin-top: 2px;color:red;">
                        * Medical: <span v-for="item in transition.student.medical" :key="item.id">{{ item.food_allergies }}</span>
                      </span>
                      <el-divider />
                      <el-row :gutter="20">
                        <el-col :span="10">
                          <div class="grid-content bg-purple-left">
                            <i class="el-icon-time" />
                            {{ format_date(transition.updated_at) }}
                          </div>
                        </el-col>

                        <el-col :span="6" :offset="6">
                          {{ transition.countitems }} {{ $t('items') }}
                        </el-col>
                      </el-row>
                    </div>
                  </el-button>
                </div>
              </div>
            </el-container>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-drawer
      :title="$t('ItemsOrder')"
      :visible.sync="drawer"
      :direction="direction"
      size="30%"
    >
      <el-row style="padding:0 20px">
        <el-col :span="20">
          <el-row style="overflow-y: scroll;height: 150px;">
            <el-col v-for="item of details" :key="item.item.id" :span="3">
              <el-card v-if="item.item.off_kitchen === 0 && transaction.delivery_status === -1" :body-style="{ padding: '0px' }" style=" height:150px">
                <img
                  v-if="item.item.image !== ''"
                  :alt="item.item.name"
                  class="rounded-circle img-custome image"
                  :src="imgUrl + item.item.image"
                >
                <div style="padding: 10px;">
                  <span>{{ item.item.name }}</span>
                  <div class="bottom clearfix">
                    <time class="time">{{ item.quantity }} pcs</time>
                  </div>
                </div>
              </el-card>
              <el-card v-if="transaction.delivery_status !== -1" :body-style="{ padding: '0px' }" style=" height:150px">
                <img
                  v-if="item.item.image !== ''"
                  :alt="item.item.name"
                  class="rounded-circle img-custome image"
                  :src="imgUrl + item.item.image"
                >
                <div style="padding: 10px;">
                  <span>{{ item.item.name }}</span>
                  <div class="bottom clearfix">
                    <time class="time">{{ item.quantity }} pcs</time>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4">
          <el-row>
            <el-col :span="14">

              <div class="text item" />
              <div class="text item" />
            </el-col>
            <el-col :span="10">
              <el-button
                v-if="transaction.delivery_status === -1"
                type="warning"
                style="width: 100%; margin-top:10px;"
                @click="changeDelivery(details[0].transaction_id, 0)"
              >{{ $t('Ready') }}</el-button>
              <el-button
                v-if="transaction.delivery_status === 0"
                type="success"
                style="width: 100%; margin-top:10px;"
                @click="changeDelivery(details[0].transaction_id, 1)"
              >
                {{ $t('Delivered') }}
              </el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import Vue from 'vue'
import splitPane from 'vue-splitpane'
// import CountTo from 'vue-count-to'
import store from '@/store'
// eslint-disable-next-line no-unused-vars
import { reactive } from 'vue'
// eslint-disable-next-line no-unused-vars
import { format } from 'echarts/lib/export'
import VueSweetalert2 from 'vue-sweetalert2'
// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css'
import checkPermission from '@/utils/permission'
import moment from 'moment'
import Echo from 'laravel-echo'
window.io = require('socket.io-client')

Vue.use(VueSweetalert2)

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    splitPane
  },

  data() {
    return {
      drawer: false,
      direction: 'btt',
      transaction: [],
      details: [],
      langs: ['ar', 'en'],
      currentDate: new Date(),
      query: '',
      breaks: '1',
      date: new Date().toJSON().replace(/T|Z/g, ' ').split(' ')[0],
      value: [],
      search_data: [],
      studentId: 0,
      studentWallet: 0,
      disable: false,
      imgUrl: store.getters.app_route + 'storage/',
      items: [],
      delivered_items: [],
      new_items: [],
      ready_items: [],
      groups: [],
      results: '',
      activeName: '',
      columns: ['Item Name', 'Quantity', 'Price', 'Total'],
      cartItems: [],
      total: 0,
      current: '',
      links: [],
      Cafeterias: [],
      state: '',
      students: [],
      user_cafeteria_id: store.getters.cafeteria_id,
      cafeteria_id: store.getters.cafeteria_id,
      timeout: null
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getAllItems()
    this.getAllCafeterias()
  },
  mounted() {
    window.Echo = new Echo({
      broadcaster: 'socket.io',
      host: store.getters.app_socket_route + ':6001',
      logToConsole: true,
      transports: ['websocket']
    })

    window.Echo.channel('createOrder').listen(
      '.create-order',
      (data) => {
        this.getAllItems()
      }
    )
    window.Echo.channel('updateOrder').listen(
      '.update-order',
      (data) => {
        this.getAllItems()
      }
    )
    window.Echo.channel('deleteOrder').listen(
      '.delete-order',
      (data) => {
        this.getAllItems()
      }
    )
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

      this.axios
        .post(store.getters.api_route + 'cafeteria/listCafetria', formdata, config)
        .then(res => {
          // console.log(res.data.data)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.Cafeterias = res.data.data
          this.Cafeterias.unshift({
            id: 0,
            name: 'All'
          })
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
    format_date(value) {
      if (value) {
        return moment(String(value)).format('hh:mm')
      }
    },
    changeDelivery(id, status) {
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
      formdata.append('id', id)
      formdata.append('status', status)
      this.axios
        .post(
          store.getters.api_route + 'cafeteria/changeDelivery',
          formdata,
          config
        )
        .then(res => {
          // console.log(res.data.data.new)
          // eslint-disable-next-line no-unused-vars
          const { data } = res

          this.$swal.fire({
            icon: 'success',
            title: res.data.message,
            // text: res.data.message,
            position: 'top-end',
            toast: true,
            showConfirmButton: false,
            timer: 3000
          })
          this.listLoading = false
          this.drawer = false
          var vm = this
          vm.$forceUpdate()
          this.getAllItems()
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

    handleClose(done) {
      this.$confirm('Are you sure you want to close this?')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    openDrawer(id) {
      // alert(id);
      this.drawer = true
    },
    getDetails(transaction) {
      this.transaction = transaction
      this.details = transaction.details
      this.drawer = true
    },
    getAllItems() {
      this.listLoading = true
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255,255,255,0.95)'
      })
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
      formdata.append('date', this.date)
      formdata.append('break', this.breaks)
      formdata.append('type', 'kitchen')
      formdata.append('cafeteria_id', this.cafeteria_id)
      this.axios
        .post(
          store.getters.api_route + 'cafeteria/ListOrders',
          formdata,
          config
        )
        .then(res => {
          // console.log(res.data.data.new)
          // eslint-disable-next-line no-unused-vars
          const { data } = res

          // this.total = res.data.data.items.total;
          // this.per_page = res.data.data.items.per_page;
          // this.items = res.data.data.items.data;
          this.delivered_items = res.data.data.delivered
          this.new_items = res.data.data.new
          this.ready_items = res.data.data.ready
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
      loading.close()
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
    }
  }
}
</script>
<style scoped>
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: #e4e4e4;
  }
  ::-webkit-scrollbar-thumb {
    background: #797979;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #c1c1c1;
  }
  .tap-pane {
    height: 75vh;
    overflow: auto;
  }

  .vertical {
    padding-top: 35px !important;
  }

  .horizontal {
    padding-top: 35px;
  }

  .block {
    position: absolute;
    bottom: 10px;
  }

  .components-container {
    position: relative;
    height: 100vh;
  }

  .left-container {
    background-color: #e4e4e4;
    height: 100%;
    text-align: center;
  }

  .right-container {
    background-color: #fce38a;
    height: 200px;
  }

  .top-container {
    background-color: #fce38a;
    width: 100%;
    height: 100%;
  }

  .bottom-container {
    /*   width: 100%;*/
    /*background-color: #95E1D3;*/
    /* height: 100%;*/
  }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 0px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
  .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 5px 0;
  }
  .total-list .el-divider--horizontal {
    margin: 10px 0;
  }

  .cartItems {
    padding: 10px;
    overflow-y: scroll;
    min-height: 100%;
    max-height: 100%;
  }
</style>
<style lang="scss" scoped>
  .col-md-4 {
    width: 30%;
    float: left;
    border: 1px solid #fff;
    border-radius: 5px;
    margin: 5px;
  }

  .img-custome {
    width: 100%;
    height: 60px;
    margin: 0px;
  }

  h4 {
    margin: 3px;
  }

  .panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shopping {
          background: #34bfa3;
        }
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  .studentInfo {
    /*width: 30%;
    padding-top: 20px;*/
    border-radius: 5px;
    //margin: 12% 30%;
    //background-color: #f4516c;
    float: left;
  }

  .calculator {
    /*width:60%;
    padding: 20px;*/
    border-radius: 5px;
    //margin: 12% 30%;
    //background-color: hsl(0, 0%, 20%);
    float: right;
  }

  .input {
    width: 85%;
    height: 50px;
    border-radius: 0px;
    border: 1px solid hsl(0, 0%, 0%);
    background-color: #333333;
    color: #d9d9d9;
    padding: 0 5px 0 5px;
    margin: 0 0px 10px 0px;
    font-size: 30px;
  }

  .studentInfo .input {
    /*width: 175px;
     background-color: #1890ff;*/
  }

  .button {
    margin: 3px;
    width: 50px;
    border: 1px solid hsl(0, 0%, 5%);
    height: 25px;
    border-radius: 4px;
    color: hsl(0, 0%, 0%);
    background-color: hsl(0, 0%, 61%);
    cursor: pointer;
    outline: none;
  }

  .basic-mode {
    width: 415px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }
    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;
      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
<style>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }
  .el-tabs--border-card > .el-tabs__content {
    padding: 0px;
  }
  .el-header,
  .el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-drawer__header {
    margin: 0;
  }
  .demo-color-box {
    position: relative;
    border-radius: 4px;

    height: 114px;
    box-sizing: border-box;
    color: #fff;
    font-size: 14px;
  }
  .el-card.card-item:hover{
    cursor: pointer;
  }
</style>
