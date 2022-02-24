<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <el-card style="margin-bottom:20px;">
            <div slot="header" class="clearfix">
              <span>{{ $t('student') }}</span>
            </div>

            <div class="user-profile">
              <div class="box-center">
                <pan-thumb
                  :image="url + avatar"
                  :height="'100px'"
                  :width="'100px'"
                  :hoverable="false"
                />
              </div>
              <div class="box-center">
                <div class="user-name text-center" />
                <div class="user-name text-center">
                  {{ list.name }} | ID {{ list.id }}
                </div>
                <div class="user-role text-center text-muted">
                  {{ list.school.name }} | {{ list.grade.grade }}
                </div>
                <div class="user-role text-center text-muted">
                  <router-link :span="12" :to="'/accounting/kashir/' + list.id">
                    <el-button
                      style="width: 100%"
                      type="primary"
                    >{{ $t('set_payment') }}</el-button>
                  </router-link>
                </div>
                <div class="user-role text-center text-muted">
                  <router-link :span="12" :to="'/accounting/paymentLog/' + list.id">
                    <el-button
                      style="width: 100%"
                      type="info"
                    >{{ $t('student_payment_log') }}</el-button>
                  </router-link>
                </div>
              </div>
            </div>

            <div class="user-bio">
              <div class="user-education user-bio-section">
                <div class="user-bio-section-header" />
                <div class="user-bio-section-body">
                  <el-list>
                    <li class="user-name text-left" style="padding:5px">
                      <b>{{ $t('gender') }}:</b> {{ list.gender }}
                    </li>
                    <li class="user-name text-left" style="padding:5px">
                      <b>{{ $t('Birthdate') }}:</b> {{ list.birthdate }}
                    </li>
                    <li class="user-name text-left" style="padding:5px">
                      <b>{{ $t('phone') }}:</b> {{ list.mobile }}
                    </li>
                  </el-list>
                </div>
              </div>
            </div>
          </el-card>
          <el-card style="margin-bottom:20px;">
            <div slot="header" class="clearfix">
              <span>{{ $t('father_info') }}</span>
            </div>

            <div class="user-bio">
              <div class="user-education user-bio-section">
                <div class="user-bio-section-body">
                  <el-list>
                    <li class="user-name text-left" style="padding:5px">
                      <b>{{ $t('name') }}: {{ list.student_family.father.first_name }}
                        {{ list.student_family.father.middle_name }}
                        {{ list.student_family.father.last_name }}</b>
                    </li>
                    <li class="user-name text-left" style="padding:5px">
                      <b>{{ $t('email') }}:</b> {{ list.student_family.father.email }}
                    </li>
                    <li class="user-name text-left " style="padding:5px">
                      <b>{{ $t('phone') }}:</b> {{ list.student_family.father.mobile }}
                    </li>
                  </el-list>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane :label="$t('Finance')" name="account">
                <div style="margin:0 0 20px 0px">
                  <h3 style="float:left;">{{ $t('fees_details') }}</h3>
                </div>

                <el-table
                  :data="fees_details"
                  border
                  fit
                  show-summary
                  highlight-current-row
                  style="width: 100%"
                >
                  <el-table-column prop="name" :label="$t('name')" />

                  <el-table-column :label="$t('account_code')">
                    <template slot-scope="scope">
                      {{ scope.row.account_code }}
                    </template>
                  </el-table-column>

                  <el-table-column prop="amount" :label="$t('amount')" />
                </el-table>

                <div style="margin:0 0 20px 0px">
                  <h3 style="float:left;">{{ $t('installments_details') }}</h3>
                  <h3 style="float:right;">
                    <el-dropdown
                      class="avatar-container left-menu-item hover-effect right"
                      trigger="click"
                    >
                      <div class="avatar-wrapper el-link el-link--primary">
                        {{ $t('actions') }}
                        <i class="el-icon-caret-bottom" />
                      </div>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          <span
                            @click="dialogFormVisible = true"
                          >{{ $t('set_discount') }}</span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </h3>
                </div>

                <el-table
                  :data="installments"
                  border
                  fit
                  show-summary
                  highlight-current-row
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column
                    type="selection"
                    :reserve-selection="true"
                    align="center"
                    width="90"
                  />
                  <el-table-column :label="$t('installment')">
                    <template slot-scope="scope">
                      <span
                        v-if="scope.row.ordering === 1"
                        style="font-weight: bold;"
                      >
                        {{ scope.row.ordering }}st
                      </span>
                      <span
                        v-else-if="scope.row.ordering === 2"
                        style="font-weight: bold;"
                      >
                        {{ scope.row.ordering }}nd
                      </span>
                      <span
                        v-if="scope.row.ordering === 3"
                        style="font-weight: bold;"
                      >
                        {{ scope.row.ordering }}rd
                      </span>
                      <span
                        v-if="scope.row.ordering === 4"
                        style="font-weight: bold;"
                      >
                        {{ scope.row.ordering }}th
                      </span>
                      <span />
                    </template>
                  </el-table-column>

                  <el-table-column prop="type" :label="$t('fees_name')" />

                  <el-table-column prop="title" :label="$t('month')" />
                  <el-table-column prop="amount" :label="$t('basic_fees')" />
                  <el-table-column
                    prop="discount"
                    :label="$t('discount')"
                    width="100px"
                  />
                  <el-table-column prop="paid" :label="$t('final_fees')" />
                  <el-table-column prop="topay" :label="$t('due_to_pay')" />
                </el-table>

                <div style="margin:0 0 20px 0px">
                  <h3>{{ $t('payment_details') }}</h3>
                </div>

                <el-table
                  class="text-center"
                  :data="list.payments"
                  border
                  show-summary
                  fit
                  highlight-current-row
                  style="width: 100%"
                >
                  <el-table-column
                    prop="id"
                    label="ID"
                    width="90"
                    align="center"
                  />
                  <el-table-column :label="$t('installment')">
                    <template slot-scope="scope">
                      <span
                        v-if="
                          scope.row.payment_installments.installment.ordering ===
                            1
                        "
                        style="font-weight: bold;"
                      >
                        {{
                          scope.row.payment_installments.installment.ordering
                        }}st
                      </span>
                      <span
                        v-else-if="
                          scope.row.payment_installments.installment.ordering ===
                            2
                        "
                        style="font-weight: bold;"
                      >
                        {{
                          scope.row.payment_installments.installment.ordering
                        }}nd
                      </span>
                      <span
                        v-if="
                          scope.row.payment_installments.installment.ordering ===
                            3
                        "
                        style="font-weight: bold;"
                      >
                        {{
                          scope.row.payment_installments.installment.ordering
                        }}rd
                      </span>
                      <span
                        v-if="
                          scope.row.payment_installments.installment.ordering ===
                            4
                        "
                        style="font-weight: bold;"
                      >
                        {{
                          scope.row.payment_installments.installment.ordering
                        }}th
                      </span>
                      <span />
                    </template>
                  </el-table-column>

                  <el-table-column :label="$t('fees_name')">
                    <template scope="scope">
                      {{ scope.row.payment_installments.installment.type }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="payment_installments.installment.title"
                    :label="$t('month')"
                    width="100"
                  />
                  <el-table-column prop="amount" :label="$t('amount')" width="80" />
                  <el-table-column prop="method" :label="$t('method')" width="80" />
                  <el-table-column prop="created_at" :label="$t('date')" />
                  <el-table-column prop="note" :label="$t('note')" />
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog :title="$t('set_discount')" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          :label="$t('discount_reason')"
          style="text-align:left"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.reason" placeholder="Please select a reason">
            <el-option :label="$t('staff_student')" value="Staff Student" />
            <el-option :label="$t('sibling')" value="Sibling" />
            <el-option :label="$t('Alumni')" value="Alumni" />
            <el-option :label="$t('4th_child')" value="4th Child" />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('amount')"
          style="text-align:left"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.amount" autocomplete="off" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="setDiscount">{{ $t('save') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import store from '@/store'

export default {
  name: 'StudentProfile',
  components: { PanThumb },

  data() {
    return {
      checked: [],
      selected: [],

      url: store.getters.app_route,
      user: {},
      list: null,
      installments: null,
      fees_details: null,
      avatar: null,
      activeTab: 'account',
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        reason: '',
        amount: ''
      },
      formLabelWidth: '150px'
    }
  },
  computed: {
    // ...mapGetters(['name', 'avatar', 'roles'])
  },
  created() {
    this.student_id = this.$route.params && this.$route.params.id
    this.getStudent()
  },
  methods: {
    handleSelectionChange(rows) {
      this.multipleSelection = rows
      this.select_order_number = this.multipleSelection.length

      this.selected = []
      if (rows) {
        rows.forEach(row => {
          if (row) {
            this.selected.push(row.id)
          }
        })
      }
    },

    getStudent(page) {
      this.dialogPermissionLoading = true
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      const formdata = new FormData()
      formdata.append('id', this.student_id)
      formdata.append('token', store.getters.token)
      this.axios
        .post(store.getters.api_route + 'student', formdata, config)
        .then(res => {
          this.list = res.data.data
          if (!res.data.data.fees) {
            var items = []
            this.installments = []
            this.fees_details = []
          } else {
            items = res.data.data.fees.fees_installments
            this.installments = res.data.data.fees.fees_installments
            this.fees_details = res.data.data.fees_details
          }
          // alert(JSON.stringify(this.fees_details));
          var sum = 0
          var total = 0
          var discount = 0

          items.forEach(function(item) {
            // console.log(item);
            sum += item.amount

            item.total = item.amount
            item.installment_id = item.id
            if (item.exception) {
              item.total = item.amount - item.exception.discount
              total += item.amount - item.exception.discount
              discount += item.exception.discount
            }
          })
          // alert(discount);
          // console.log(res.data.data.picture)
          this.list.total = sum
          this.list.topay = total
          this.list.totaldiscount = discount
          this.avatar = res.data.data.picture
          this.dialogPermissionLoading = false
        })
        .catch(err => {
          // console.log(err);
          this.$message({
            message: err,
            type: 'error'
          })
        })
    },
    setDiscount: function(msg) {
      // alert(this.selected);
      this.dialogFormVisible = false

      // return false;
      this.dialogPermissionLoading = true
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      const formdata = new FormData()
      formdata.append('items', this.selected)
      formdata.append('student_id', this.student_id)
      formdata.append('reason', this.form.reason)
      formdata.append('amount', this.form.amount)
      formdata.append('discountType', 2)
      formdata.append('token', store.getters.token)

      this.axios
        .post(store.getters.api_route + 'fees/addDiscount', formdata, config)
        .then(res => {
          console.log(res.data)
          if (res.data.error) {
            this.$message({
              message: res.data.message,
              type: 'error'
            })
          } else {
            this.$message({
              message: res.data.message,
              type: 'success'
            })
            location.reload()
          }
        })
        .catch(err => {
          // console.log(err);
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
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
label {
  text-align: left !important;
}
</style>
