<template>

  <div style="padding : 10px;">
    <div class="createPost-container">
      <div class="createPost-main-container" style="margin-top: 50px;">
        <div id="printMe">
          <!--          <hr>-->
          <el-card class="header" body-style="padding: 10px;" style="margin-bottom: 25px;">
            <el-row>
              <el-col :span="12" style="padding-left: 10px;">
                <el-row style="margin-top: 10px;">
                  {{ $t('student_name') }}: <span v-if="orderDetails.student"> {{ orderDetails.student.name }} </span>
                </el-row>
                <el-row style="margin-top: 8px;">
                  {{ $t('student_id') }}: <span v-if="orderDetails.student"> {{ orderDetails.student.id }}</span>
                </el-row>
                <el-row style="margin-top: 8px;">
                  {{ $t('school') }} : <span v-if="orderDetails.student && orderDetails.student.school">{{ orderDetails.student.school.name }}</span>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row style="margin-top: 10px;">
                  {{ $t('grade') }} : <span v-if="orderDetails.student && orderDetails.student.grade">{{ orderDetails.student.grade.grade }}</span>
                </el-row>
                <el-row style="margin-top: 8px;">
                  {{ $t('class') }}: <span v-if="orderDetails.student && orderDetails.student.classgroup">{{ orderDetails.student.classgroup[0].code }}</span>
                </el-row>
                <el-row style="margin-top: 8px;">
                  {{ $t('total') }}: {{ orderDetails.total }}
                </el-row>
              </el-col>
            </el-row>
          </el-card>
          <!--          <hr>-->
          <el-table style="margin-top: 10px; width: 100%;font-size: .7em" :data="orderItems">
            <el-table-column :label="$t('image')">
              <template slot-scope="{row}">
                <img
                  :alt="row.name"
                  class="rounded-circle img-custome image"
                  style="height: 60px;"
                  :src="imgUrl + row.image"
                >
              </template>
            </el-table-column>
            <el-table-column :label="$t('name')" prop="name" />
            <el-table-column prop="price" :label="$t('price')" />
            <el-table-column prop="quantity" :label="$t('quantity')" />
            <el-table-column :label="$t('total')">
              <template slot-scope="{row}">
                {{ Number(row.price) * Number(row.quantity) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div style="margin-top: 10px;">
        <el-button v-print="printObj" style=" width: 200px; " type="success">
          {{ $t('print') }}
        </el-button>
      </div>
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
// import ElDragSelect from '@/components/DragSelect' // base on element-ui
import store from '@/store'

export default {
  name: 'ShowJournal',
  components: {
    // MDinput,
    // Sticky,
    // Warning,
    // Multiselect,
    // TabPane,
    // ElDragSelect
  },
  data() {
    return {
      printObj: {
        id: 'printMe',
        popTitle: 'Alson Schools -Journal Voucher',
        style: '@media print{@page{size:landscape}}'
        // extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>'
      },
      theme: false,
      readonly: false,
      journal_id: '',
      imgUrl: store.getters.app_route + 'storage/',
      currencyOptions: [
        { key: 'USD', display_name: 'Dollar' },
        { key: 'EUR', display_name: 'European Euro' },
        { key: 'EGP', display_name: 'Egyptian pound' }
      ],
      typeOptions: ['AP', 'AR', 'General Journal', 'Salaries', 'Cash management', 'Filter'],
      ProfitOptions: ['Company', 'American', 'British'],
      Debit_Credit: ['Debit', 'Credit'],
      debit_credit: '',
      profit: '',
      jv_type: '',
      description: '',
      period: '',
      date: '',
      orderDetails: '',
      time: '',
      user_name: '',
      reference: '',
      create_type: '',
      account_code: '',
      dimension: '',
      amount: 0,
      currency: '',
      next: false,
      id: '',
      jornal_id: '',
      debit_amount: 0,
      credit_amount: 0,
      total_amount: 0,

      analytics_code: '',
      analytics_code1: [],
      dimensionlist: [],
      JVS: [],
      orderItems: [],
      jvs_credit: '',
      jvs_debit: ''
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
  watch: {},
  mounted() {
    // if (!this.checkPermission('Edit_JV')) {
    //   this.$router.push({ path: '/403' })
    // }
    console.log('Component mounted.')
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    // console.log(id)
    // this.jornal_id = id
    this.OrderData(id)
  },
  methods: {
    checkPermission,
    OrderData(id) {
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
        .post(store.getters.api_route + 'cafeteria/Order/details', formdata, config)
        .then(res => {
          this.orderDetails = res.data.data
          var items = []
          this.orderDetails.details.forEach(function(e) {
            e.item['quantity'] = e.quantity
            items.push(e.item)
          })
          this.orderItems = items
          // this.debit_amount = Number(this.debit_amount).toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0'
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
  margin-left: 0px;
  margin-bottom: 8px;
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

</style>
