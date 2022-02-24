<template>
  <div>
    <div class="createPost-container" style="margin-top: 35px; ">
      <el-row>
        <el-col :span="17">
          <el-tabs v-model="activeName" style="margin-top:0px;" vertical>
            <el-tab-pane
              v-for="item in groups"
              :key="item.id+'-'+item.store_id"
              :label="item.name"
              :name="item.name"
              @click="getData(item.id)"
            >
              <keep-alive>
                <div class="el-row  tap-pane">
                  <div
                    v-for="item1 of items"
                    :key="item1.id"
                    class="el-card el-col el-col-4"
                    @click="addToCart(item1, items, $event)"
                  >
                    <el-card :body-style="{ padding: '0px' }" style=" height:230px">
                      <img
                        v-if="item1.image !== ''"
                        :alt="item1.name"
                        class="rounded-circle img-custome image"
                        :src="imgUrl + item1.image"
                      >
                      <div style="padding: 14px;">
                        <span>{{ item1.name }}</span>
                        <div class="bottom clearfix">
                          <time class="time">{{ item1.price }} L.E</time>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </div>
              </keep-alive>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="7">
          <div class="cartItems">
            <el-row :gutter="20">
              <el-col :span="8"><div class="grid-content bg-purple">Item</div></el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  Qty
                </div>
              </el-col>
              <el-col
                :span="4"
              ><div class="grid-content bg-purple">Price</div></el-col>
              <el-col
                :span="4"
              ><div
                class="grid-content bg-purple"
                style="text-align: right;"
              >
                Total
              </div></el-col>
            </el-row>
            <el-divider />
            <div
              v-for="(item, index) in cartItems"
              :key="index"
              style="padding:10px"
            >
              <el-row :gutter="20">
                <el-col
                  :span="8"
                ><div class="grid-content bg-purple-left">
                  {{ item.name }}
                </div></el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-right align-right">
                    <button
                      @click.capture="increament(item, cartItems, $event)"
                    >
                      +
                    </button>
                    <input
                      v-model="item.qty"
                      type="text"
                      style="width:50px"
                    >
                    <button @click="decreament(item, cartItems)">-</button>
                  </div>
                </el-col>
                <el-col
                  :span="4"
                ><div class="grid-content bg-purple-right ">
                  {{ item.price }}
                </div></el-col>
                <el-col
                  :span="4"
                ><div
                  class="grid-content bg-purple-right "
                  style="text-align: right;"
                >
                  {{ item.qty * item.price }}
                </div></el-col>
              </el-row>
              <el-divider />
            </div>
          </div>

          <el-select
            v-model="selected"
            filterable
            remote
            reserve-keyword
            placeholder="Search Student ID / Name"
            :remote-method="remoteMethod"
            style="width:100%"
          >
            <el-option
              v-for="student in students"
              :key="student.id"
              :label="student.FullName"
              :value="student.id"
            />
          </el-select>
          <div style="padding:10px;" class="total-list">
            <el-row :gutter="20">
              <el-col
                :span="12"
              ><div class="grid-content bg-purple-left">
                Sub Total
              </div></el-col>
              <el-col
                :span="12"
              ><div
                class="grid-content bg-purple-right align-right"
                style="text-align: right;"
              >
                {{ total }}
              </div></el-col>
            </el-row>
            <el-divider />
            <el-row :gutter="20">
              <el-col
                :span="12"
              ><div class="grid-content bg-purple-left">
                Student Ballence
              </div></el-col>
              <el-col
                :span="12"
              ><div
                class="grid-content bg-purple-right align-right"
                style="text-align: right;"
              >
                {{ studentWallet }}
              </div></el-col>
            </el-row>
            <el-divider />
            <el-row :gutter="20">
              <el-col
                :span="12"
              ><div class="grid-content bg-purple-left">Tax</div></el-col>
              <el-col
                :span="12"
              ><div
                class="grid-content bg-purple-right align-right"
                style="text-align: right;"
              >
                0.00
              </div></el-col>
            </el-row>
            <el-divider />
            <el-row :gutter="20">
              <el-col
                :span="12"
              ><div class="grid-content bg-purple-left">Total</div></el-col>
              <el-col
                :span="12"
              ><div
                class="grid-content bg-purple-right align-right"
                style="text-align: right;"
              >
                {{ total }}
              </div></el-col>
            </el-row>
          </div>

          <div class=" el-row">
            <el-button
              class="el-col el-col-11"
              type="danger"
              @click="clearCart"
            >
              Cancel
            </el-button>

            <el-button
              class="el-col el-col-12"
              :disabled="disable"
              type="success"
              @click="addOrder()"
            >
              PAY
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
<!--  <div class="components-container">-->
<!--  </div>-->
</template>

<script>
import Vue from 'vue'

// import splitPane from 'vue-splitpane'

// import CountTo from 'vue-count-to'
import store from '@/store'
// eslint-disable-next-line no-unused-vars
import { reactive } from 'vue'
// eslint-disable-next-line no-unused-vars
import { format } from 'echarts/lib/export'

import VueSweetalert2 from 'vue-sweetalert2'
// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css'

Vue.use(VueSweetalert2)

export default {
  components: {
    // splitPane
  },

  data() {
    return {
      langs: ['ar', 'en'],
      currentDate: new Date(),
      query: '',
      value: [],
      search_data: [],
      studentId: 0,
      studentWallet: 0,
      disable: false,
      imgUrl: store.getters.app_route,
      items: [],
      groups: [],
      results: '',
      activeName: '',
      columns: ['Item Name', 'Quantity', 'Price', 'Total'],
      cartItems: [],
      total: 0,
      current: '',
      links: [],
      state: '',
      students: [],
      timeout: null
    }
  },
  computed: {
    selected: {
      get() {
        return null
      },
      set(optionValue) {
        // console.log(optionValue.wallet)
        // this.options = this.options.filter(o => o !== optionValue);

        this.query = optionValue.FullName
        this.studentId = optionValue.id
        this.studentWallet = optionValue.wallet
        // if(parseInt(amount)>0) this.disable=false; else this.disable=true;
        this.search_data = []
      }
    }
  },

  watch: {
    activeName(val) {
      // console.log(val)
      if (this.groups.length > 0) {
        const index = this.groups.findIndex(item => item.name === val)
        // debugger;
        this.getData(this.groups[index].id)
      }
      // this.$router.push(`${this.$route.path}?tab=${val}`)
    },
    items: {
      immediate: true,
      // This will let Vue know to look inside the array
      deep: true,
      handler: function(data) {
        //  console.log(data)
      }
    },

    cartItems: {
      immediate: true,
      // This will let Vue know to look inside the array
      deep: true,

      // We have to move our method to a handler field
      handler: function(data) {
        // console.log('Changed')
        // console.log(data)
        // console.log(this.cartItems);
        var t = 0
        this.cartItems.forEach(function(i, e) {
          t += e.qty * e.price
        })
        this.total = t
      }
    }
  },
  created() {
    this.getData(-1)
  },
  mounted() {
    // console.log(store.getters.cafeteria_id)
  },
  methods: {
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
        var url = store.getters.api_route + 'pages/student/search'
        const formdata = new FormData()
        formdata.append('token', store.getters.token)
        formdata.append('q', query)
        this.axios.post(url, formdata, config).then(response => {
          this.students = response.data.data.students
        })
      } else {
        this.students = []
      }
    },

    /**
     * Calculator Functions
     */
    press: function(event) {
      // we make a reference to the inner text
      // of each button to dispatch our functions
      const key = event.target.innerText
      // console.log('Key =>' + key)
      if (
        key !== '=' &&
        key !== 'C' &&
        key !== '*' &&
        key !== '/' &&
        key !== '√' &&
        key !== '+'
      ) {
        this.current += key
      } else if (key === '=') {
        this.equals()
      } else if (key === 'C') {
        this.clear()
      } else if (key === '*') {
        this.multiply()
      } else if (key === '/') {
        this.divide()
      } else if (key === '√') {
        this.squareRoot()
      } else if (key === '+') {
        this.adding()
      }
    },
    equals() {
      if (this.current.indexOf('^') > -1) {
        var base = this.current.slice(0, this.current.indexOf('^'))
        var exponent = this.current.slice(this.current.indexOf('^') + 1)
        // eslint-disable-next-line no-eval
        this.current = eval('Math.pow(' + base + ',' + exponent + ')')
      } else {
        // eslint-disable-next-line no-eval
        this.current = eval(this.current)
      }
    },

    // our ' C ' button
    clear() {
      this.current = ''
    },

    // our ' <= ' button
    backspace() {
      // eslint-disable-next-line no-undef
      this.current = app.current.substring(0, app.current.length - 1)
    },
    // Oyr '+' button
    adding() {
      this.current += '+'
    },
    // our ' * ' button
    multiply() {
      this.current += '*'
    },

    // our ' / ' button
    divide() {
      this.current += '/'
    },

    // our ' + ' button
    plus() {
      this.current += '+'
    },

    // our ' - ' button
    minus() {
      this.current += '-'
    },

    // our ' sin ' button
    sin() {
      // eslint-disable-next-line no-undef
      this.current = Math.sin(app.current)
    },

    // our ' cos ' button
    cos() {
      // eslint-disable-next-line no-undef
      this.current = Math.cos(app.current)
    },

    // our ' tan ' button
    tan() {
      // eslint-disable-next-line no-undef
      this.current = Math.tan(app.current)
    },

    // our ' log ' button
    log() {
      // eslint-disable-next-line no-undef
      this.current = Math.log10(app.current)
    },
    /**
     * End of Calculator function
     */
    increament(info, items, event) {
      info.qty++
      if (event) {
        event.preventDefault()
      }
      const index = this.cartItems.findIndex(item => item.id === info.id)

      var qty = this.cartItems[index].qty++
      this.cartItems[index].qty = qty
      // var val= this.cartItems[index];

      this.$set(this.cartItems[index], 'qty', qty) // reactive

      // instead of `Object.assign(this.someObject, { a: 1, b: 2 })`
      // items = Object.assign({}, items, info)
      this.$nextTick(function() {
        // this.$set(info,'qty',qty);

        this.cartItems.push()
      })
    },
    decreament(info, items) {
      const index = items.findIndex(item => item.id === info.id)

      if (info.qty > 1) {
        items[index].qty = parseInt(info.qty) - 1
        var qty = info.qty--
        // Vue.set(this.cartItems[index],'qty',qty);
        this.$set(this.cartItems[index], 'qty', qty)
      } else items.splice(index, 1)
      //   console.log(items);
      this.$nextTick(function() {
        // console.log(this.$el.textContent) // => 'updated'
        this.cartItems.push()
      })
    },
    resize() {
      // console.log('resize')
    },
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
      // console.log("Created Items =>" + this.createdTimes)
    },

    clearCart(event) {
      // this.$swal('Hello Vue world!!!');
      this.$swal
        .fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        })
        .then(result => {
          if (result.isConfirmed) {
            this.cartItems = []
            this.$swal.fire('Deleted!', 'Your cart is empty.', 'success')
          }
        })
    },
    addToCart(itemToAdd, items, event) {
      // eslint-disable-next-line no-unused-vars
      const found = false
      var itemInCart = []
      // Add the item or increase qty
      // eslint-disable-next-line no-redeclare
      var itemInCart = this.cartItems.filter(item => item.id === itemToAdd.id)
      const isItemInCart = itemInCart.length > 0
      if (isItemInCart === false) {
        itemToAdd.qty = 1
        this.cartItems.push(itemToAdd)
      } else {
        this.increament(itemInCart[0], this.cartItems, event)
      }
    },
    removeItem(index, item) {
      this.cartItems.splice(index, 1)
    },
    addItem(item) {
      this.cartItems.push(item)
    },
    addOrder(event) {
      // console.log('Student => ' + this.studentId)
      // console.log('Card => ' + this.cartItems.length)

      if (this.cartItems.length === 0) {
        // alert('You have to choose at least one item on cart')
        this.$swal.fire({
          icon: 'error',
          text: 'You have to choose at least one item on cart',
          position: 'top-end',
          toast: true,
          showConfirmButton: false,
          timer: 2000
        })
      } else if (this.studentId < 1) {
        // alert('You have to choose student')
        this.$swal.fire({
          icon: 'error',
          text: 'You have to choose student',
          position: 'top-end',
          toast: true,
          showConfirmButton: false,
          timer: 2000
        })
        // eslint-disable-next-line brace-style
      }
      // else if (this.studentWallet == 0) {
      //   // alert('You have to choose student')
      //   this.$swal.fire({
      //     icon: "error",
      //     text: "this student has empty credit",
      //     position: "top-end",
      //     toast: true,
      //     showConfirmButton: false,
      //     timer: 2000
      //   });
      // }
      else {
        //

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
        formdata.append('student', this.studentId)
        formdata.append('total', this.total)
        // formdata.append('item', this.cartItems.join('&'));
        // console.log(this.cartItems)

        for (let i = 0; i < this.cartItems.length; i++) {
          formdata.append('item[]', JSON.stringify(this.cartItems[i]))
        }

        var url = store.getters.api_route + 'pages/addOrder'
        this.axios
          .post(url, formdata, config)
          .then(res => {
            // console.log(res)
            this.cartItems = []
            this.studentId = 0
            this.query = ''
            //   alert(res.data.message)
            this.$swal.fire({
              icon: 'success',
              title: res.data.message,
              // text: res.data.message,
              position: 'top-end',
              toast: true,
              showConfirmButton: false,
              timer: 3000
            })
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    getData(cat) {
      /*  let config = {
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
      var cafe_id = store.getters.cafeteria_id
      // console.log('CAT => ' + cat)
      const formdata = new FormData()
      formdata.append('token', store.getters.token)
      if (cat > 0) {
        //   let index =  this.items.findIndex(item => item.name == cat);
        var url = store.getters.api_route + 'pages/filter/' + cat
        this.items = []
      } else {
        // eslint-disable-next-line no-redeclare
        var url = store.getters.api_route + 'pages/dashboard/' + cafe_id
      }
      this.axios
        .post(url, formdata, config)
        .then(res => {
          if (cat < 0) {
            this.groups = res.data.data.groups
            this.groups.unshift({
              id: -1,
              name: 'all'
            })

            this.activeName = this.groups[0].name
          }
          this.items = res.data.data.items
          this.userscount = res.data.data.userscount
          this.rolescount = res.data.data.rolescount
          this.acountscount = res.data.data.acountscount
          this.analticscount = res.data.data.analticscount
          this.journalscount = res.data.data.journalscount
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style scoped>
.tap-pane {
  background: #e4e4e4;
  height: 84vh;
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
  margin-bottom: 18px;
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
  height: 600px !important;
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
  height: 120px;
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
</style>
