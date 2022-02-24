<template>

  <div style="padding : 35px;">
    <div class="createPost-container">
      <el-form ref="RoleForm" class="form-container" :model="RoleForm" :rules="rules">
        <div class="createPost-main-container">
          <el-row>
            <div class="postInfo-container" style="margin-top: 45px;">
              <el-row>
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item :label="$t('department _focus')" class="postInfo-container-item">
                      <span style="float: left; color:red; font-weight: bold;">*</span>
                      <span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-form-item prop="focus">
                      <el-drag-select
                        ref="focus"
                        v-model="RoleForm.focus"
                        style="width:500px;"
                        multiple
                        placeholder="select the focus"
                      >
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                      </el-drag-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-row>
              <el-row>
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item :label="$t('name')" class="postInfo-container-item">
                      <span style="float: left; color:red; font-weight: bold;">*</span>
                      <span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-form-item prop="name">
                      <el-input
                        ref="name"
                        v-model="RoleForm.name"
                        :rows="1"
                        type="textarea"
                        class="article-textarea"
                        autosize
                        placeholder="Please enter the content"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-row>
              <el-row>
                <el-row>
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item :label="$t('description')" class="postInfo-container-item">
                      <span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-input
                      v-model="RoleForm.description"
                      :rows="1"
                      type="textarea"
                      class="article-textarea"
                      autosize
                      placeholder="Please enter the content"
                    />
                  </el-col>
                </el-row>
              </el-row>
              <el-row>
                <el-row style="text-align: center;">
                  <h4>Permissions</h4>
                </el-row>
                <el-row>
                  <el-tabs v-model="activeName" style="margin-top:0px;" vertical>
                    <el-tab-pane key="Accounting" label="Accounting" name="Accounting">
                      <keep-alive>
                        <div class="perm" style="display: grid; padding-left: 35px; ">
                          <el-checkbox
                            v-model="checkAll_accounting"
                            :indeterminate="isIndeterminate_accounting"
                            @change="handleCheckAllChange(accounting, 'accounting')"
                          >Check all
                          </el-checkbox>
                          <el-checkbox-group
                            v-model="RoleForm.permissions"
                            style="display: grid; padding-left: 20px; margin-top: 10px"
                            @change="handleCheckedAccountingChange"
                          >
                            <el-checkbox
                              v-for="permission in accounting"
                              :key="permission"
                              :label="permission"
                            >{{ permission }}
                            </el-checkbox>
                          </el-checkbox-group>

                        </div>
                      </keep-alive>
                    </el-tab-pane>
                    <el-tab-pane key="LedgerGeneral" label="Ledger General" name="LedgerGeneral">
                      <keep-alive>
                        <div class="perm" style="display: grid; padding-left: 35px; ">
                          <el-checkbox
                            v-model="checkAll_lg"
                            :indeterminate="isIndeterminate_lg"
                            @change="handleCheckAllChange(lg,'lg')"
                          >Check all
                          </el-checkbox>
                          <el-checkbox-group
                            v-model="RoleForm.permissions"
                            style="display: grid; padding-left: 20px; margin-top: 10px"
                            @change="handleCheckedLgChange"
                          >
                            <el-checkbox
                              v-for="permission in lg"
                              :key="permission"
                              :label="permission"
                            >{{ permission }}
                            </el-checkbox>
                          </el-checkbox-group>

                        </div>
                      </keep-alive>
                    </el-tab-pane>
                    <el-tab-pane key="Budget" label="Budget" name="Budget">
                      <keep-alive>
                        <div class="perm" style="display: grid; padding-left: 35px; ">
                          <el-checkbox
                            v-model="checkAll_budget"
                            :indeterminate="isIndeterminate_budget"
                            @change="handleCheckAllChange(lg,'budget')"
                          >Check all
                          </el-checkbox>
                          <el-checkbox-group
                            v-model="RoleForm.permissions"
                            style="display: grid; padding-left: 20px; margin-top: 10px"
                            @change="handleCheckedBudgetChange"
                          >
                            <el-checkbox
                              v-for="permission in budget"
                              :key="permission"
                              :label="permission"
                            >{{ permission }}
                            </el-checkbox>
                          </el-checkbox-group>

                        </div>
                      </keep-alive>
                    </el-tab-pane>
                    <el-tab-pane key="StockHouse" label="Stock House" name="StockHouse">
                      <keep-alive>
                        <div class="perm" style="display: grid; padding-left: 35px; ">
                          <el-checkbox
                            v-model="checkAll_stock"
                            :indeterminate="isIndeterminate_stock"
                            @change="handleCheckAllChange(lg,'stock')"
                          >Check all
                          </el-checkbox>
                          <el-checkbox-group
                            v-model="RoleForm.permissions"
                            style="display: grid; padding-left: 20px; margin-top: 10px"
                            @change="handleCheckedStockChange"
                          >
                            <el-checkbox
                              v-for="permission in stock"
                              :key="permission"
                              :label="permission"
                            >{{ permission }}
                            </el-checkbox>
                          </el-checkbox-group>

                        </div>
                      </keep-alive>
                    </el-tab-pane>
                    <el-tab-pane key="AccountsPayable" label="Accounts Payable" name="AccountsPayable">
                      <keep-alive>
                        <div class="perm" style="display: grid; padding-left: 35px; ">
                          <el-checkbox
                            v-model="checkAll_payable"
                            :indeterminate="isIndeterminate_payable"
                            @change="handleCheckAllChange(lg,'payable')"
                          >Check all
                          </el-checkbox>
                          <el-checkbox-group
                            v-model="RoleForm.permissions"
                            style="display: grid; padding-left: 20px; margin-top: 10px"
                            @change="handleCheckedPayableChange"
                          >
                            <el-checkbox
                              v-for="permission in payable"
                              :key="permission"
                              :label="permission"
                            >{{ permission }}
                            </el-checkbox>
                          </el-checkbox-group>

                        </div>
                      </keep-alive>
                    </el-tab-pane>
                    <el-tab-pane key="Fees" label="Fees" name="Fees">
                      <keep-alive>
                        <div class="perm" style="display: grid; padding-left: 35px; ">
                          <el-checkbox
                            v-model="checkAll_fees"
                            :indeterminate="isIndeterminate_fees"
                            @change="handleCheckAllChange(lg,'fees')"
                          >Check all
                          </el-checkbox>
                          <el-checkbox-group
                            v-model="RoleForm.permissions"
                            style="display: grid; padding-left: 20px; margin-top: 10px"
                            @change="handleCheckedFessChange"
                          >
                            <el-checkbox
                              v-for="permission in fees"
                              :key="permission"
                              :label="permission"
                            >{{ permission }}
                            </el-checkbox>
                          </el-checkbox-group>

                        </div>
                      </keep-alive>
                    </el-tab-pane>
                    <el-tab-pane key="AccountsReceivable" label="Accounts Receivable" name="AccountsReceivable">
                      <keep-alive>
                        <div class="perm" style="display: grid; padding-left: 35px; ">
                          <el-checkbox
                            v-model="checkAll_receivable"
                            :indeterminate="isIndeterminate_receivable"
                            @change="handleCheckAllChange(lg,'receivable')"
                          >Check all
                          </el-checkbox>
                          <el-checkbox-group
                            v-model="RoleForm.permissions"
                            style="display: grid; padding-left: 20px; margin-top: 10px"
                            @change="handleCheckedReceivableChange"
                          >
                            <el-checkbox
                              v-for="permission in receivable"
                              :key="permission"
                              :label="permission"
                            >{{ permission }}
                            </el-checkbox>
                          </el-checkbox-group>

                        </div>
                      </keep-alive>
                    </el-tab-pane>
                    <el-tab-pane key="Banks" label="Banks" name="Banks">
                      <keep-alive>
                        <div class="perm" style="display: grid; padding-left: 35px; ">
                          <el-checkbox
                            v-model="checkAll_bank"
                            :indeterminate="isIndeterminate_bank"
                            @change="handleCheckAllChange(lg,'bank')"
                          >Check all
                          </el-checkbox>
                          <el-checkbox-group
                            v-model="RoleForm.permissions"
                            style="display: grid; padding-left: 20px; margin-top: 10px"
                            @change="handleCheckedBankChange"
                          >
                            <el-checkbox
                              v-for="permission in bank"
                              :key="permission"
                              :label="permission"
                            >{{ permission }}
                            </el-checkbox>
                          </el-checkbox-group>

                        </div>
                      </keep-alive>
                    </el-tab-pane>
                    <el-tab-pane key="Cashier" label="Treasury (Cashier)" name="Cashier">
                      <keep-alive>
                        <div class="perm" style="display: grid; padding-left: 35px; ">
                          <el-checkbox
                            v-model="checkAll_cashier"
                            :indeterminate="isIndeterminate_cashier"
                            @change="handleCheckAllChange(lg,'cashier')"
                          >Check all
                          </el-checkbox>
                          <el-checkbox-group
                            v-model="RoleForm.permissions"
                            style="display: grid; padding-left: 20px; margin-top: 10px"
                            @change="handleCheckedCashierChange"
                          >
                            <el-checkbox
                              v-for="permission in cashier"
                              :key="permission"
                              :label="permission"
                            >{{ permission }}
                            </el-checkbox>
                          </el-checkbox-group>

                        </div>
                      </keep-alive>
                    </el-tab-pane>
                    <el-tab-pane key="Setting" label="Setting" name="Setting">
                      <keep-alive>
                        <div class="perm" style="display: grid; padding-left: 35px; ">
                          <el-checkbox
                            v-model="checkAll_setting"
                            :indeterminate="isIndeterminate_setting"
                            @change="handleCheckAllChange(lg,'setting')"
                          >Check all
                          </el-checkbox>
                          <el-checkbox-group
                            v-model="RoleForm.permissions"
                            style="display: grid; padding-left: 20px; margin-top: 10px"
                            @change="handleCheckedSettingChange"
                          >
                            <el-checkbox
                              v-for="permission in setting"
                              :key="permission"
                              :label="permission"
                            >{{ permission }}
                            </el-checkbox>
                          </el-checkbox-group>

                        </div>
                      </keep-alive>
                    </el-tab-pane>
                  </el-tabs>
                </el-row>
              </el-row>
            </div>
          </el-row>
        </div>
        <el-button style="margin-left: 40%; width: 200px; margin-top: 10px;" type="success" @click="store">
          {{ $t('submit') }}
        </el-button>
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
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import store from '@/store'
// import { validAlphabets, isArray } from '@/utils/validate'

// const cityOptions = [
//   'Accounts_Payables'
// ]

export default {
  name: 'EditRole',
  components: {
    // MDinput,
    // Sticky,
    // Warning,
    // Multiselect,
    // TabPane,
    ElDragSelect
  },
  data() {
    return {
      activeName: 'Accounting',
      RoleForm: {
        focus: [],
        name: '',
        description: '',
        permissions: []
      },
      rules: {
        focus: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        name: [{ required: true, message: 'This field value is required', trigger: 'change' }]
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
      checkAll_accounting: false,
      checkAll_lg: false,
      checkAll_budget: false,
      checkAll_stock: false,
      checkAll_payable: false,
      checkAll_fees: false,
      checkAll_receivable: false,
      checkAll_bank: false,
      checkAll_cashier: false,
      checkAll_setting: false,

      accounting: [
        'Access_Accounting',
        'Access_JV',
        'Add_JV',
        'Show_JV',
        'Print_JV',
        'Edit_JV',
        'Delete_JV',
        'Access_Accounts',
        'Add_Accounts',
        'Edit_Accounts',
        'Delete_Accounts',
        'Access_Analytics',
        'Add_Analytics',
        'Edit_Analytics',
        'Delete_Analytics',
        'Access_Dimension',
        'Add_Dimension',
        'Edit_Dimension'
      ],
      lg: [
        'Access_LG',
        'Access_Trial_Balance',
        'Access_Account_Allocated'

      ],
      budget: [
        'Access_Budget',
        'Add_Budget',
        'Edit_Budget',
        'Access_Budget_Report'
      ],
      stock: [
        'Access_Stock',
        'Stock_Management',
        'Access_Store',
        'Add_Store',
        'Edit_Store',
        'Access_Category',
        'Add_Category',
        'Edit_Category',
        'Delete_Category',
        'Access_Item',
        'Add_Item',
        'Edit_Item',
        'purchase_order'
      ],
      payable: [
        'Access_Payable',
        'Access_Cash_Request',
        'Add_Cash_Request',
        'Edit_Cash_Request',
        'Access_Payment_Success',
        'Payment_Voucher',
        'Supplier_Payment',
        'Access_Supplier',
        'Add_Supplier',
        'Edit_Supplier'
      ],
      fees: [
        'Access_Fees',
        'Add_Fees',
        'Edit_Fees'
      ],
      receivable: [
        'Access_Receivable',
        'Access_Cash_Receipt',
        'Add_Cash_Receipt',
        'Edit_Cash_Receipt',
        'Access_Fees_Collection',
        'Add_Fees_Collection',
        'Edit_Fees_Collection',
        'Access_Invoices',
        'Add_Invoices',
        'Edit_Invoices'
      ],
      bank: [
        'Access_Banks',
        'Add_Banks',
        'Edit_Banks'
      ],
      cashier: [
        'Access_Cashier',
        'Add_Cashier',
        'Edit_Cashier'
      ],
      setting: [
        'Access_Setting',
        'User_Management',
        'Add_role',
        'Edit_role',
        'Delete_role',
        'Add_user',
        'Edit_user',
        'Delete_user',
        'Access_GlobalSerial',
        'Access_GlobalConfig',
        'Access_AccountantPeriod'
      ],
      isIndeterminate_accounting: false,
      isIndeterminate_lg: false,
      isIndeterminate_budget: false,
      isIndeterminate_stock: false,
      isIndeterminate_payable: false,
      isIndeterminate_fees: false,
      isIndeterminate_receivable: false,
      isIndeterminate_bank: false,
      isIndeterminate_cashier: false,
      isIndeterminate_setting: false
    }
  },
  computed: {},
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  mounted() {
    if (!this.checkPermission('Edit_role')) {
      this.$router.push({ path: '/403' })
    }
    console.log('Component mounted.')
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.fetchData(id)
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    checkPermission,
    fetchData(id) {
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }
      const formdata = new FormData()
      formdata.append('token', store.getters.token)
      formdata.append('id', id)
      this.axios
        .post(store.getters.api_route + 'accounting/role/edit', formdata, config)
        .then(res => {
          // console.log(res.data);
          this.RoleForm.focus = res.data.focus
          this.RoleForm.name = res.data.name
          this.RoleForm.description = res.data.description
          this.RoleForm.permissions = res.data.permissions
          let accounting_len = 0
          let lg_len = 0
          let budget_len = 0
          let stock_len = 0
          let payable_len = 0
          let fees_len = 0
          let receivable_len = 0
          let bank_len = 0
          let cashier_len = 0
          let setting_len = 0
          this.accounting.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              accounting_len = accounting_len + 1
            }
          })
          if (accounting_len === this.accounting.length) {
            this.checkAll_accounting = true
          } else if (accounting_len === 0) {
            this.checkAll_accounting = false
            this.isIndeterminate_accounting = false
          } else {
            this.isIndeterminate_accounting = true
          }

          this.lg.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              lg_len = lg_len + 1
            }
          })
          if (lg_len === this.lg.length) {
            this.checkAll_lg = true
          } else if (lg_len === 0) {
            this.checkAll_lg = false
            this.isIndeterminate_lg = false
          } else {
            this.isIndeterminate_lg = true
          }

          this.budget.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              budget_len = budget_len + 1
            }
          })
          if (budget_len === this.budget.length) {
            this.checkAll_budget = true
          } else if (budget_len === 0) {
            this.checkAll_budget = false
            this.isIndeterminate_budget = false
          } else {
            this.isIndeterminate_budget = true
          }

          this.stock.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              stock_len = stock_len + 1
            }
          })
          if (stock_len === this.stock.length) {
            this.checkAll_stock = true
          } else if (stock_len === 0) {
            this.checkAll_stock = false
            this.isIndeterminate_stock = false
          } else {
            this.isIndeterminate_stock = true
          }

          this.payable.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              payable_len = payable_len + 1
            }
          })
          if (payable_len === this.payable.length) {
            this.checkAll_payable = true
          } else if (payable_len === 0) {
            this.checkAll_payable = false
            this.isIndeterminate_payable = false
          } else {
            this.isIndeterminate_payable = true
          }

          this.fees.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              fees_len = fees_len + 1
            }
          })
          if (fees_len === this.fees.length) {
            this.checkAll_fees = true
          } else if (fees_len === 0) {
            this.checkAll_fees = false
            this.isIndeterminate_fees = false
          } else {
            this.isIndeterminate_fees = true
          }

          this.receivable.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              receivable_len = receivable_len + 1
            }
          })
          if (receivable_len === this.receivable.length) {
            this.checkAll_receivable = true
          } else if (receivable_len === 0) {
            this.checkAll_receivable = false
            this.isIndeterminate_receivable = false
          } else {
            this.isIndeterminate_receivable = true
          }

          this.bank.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              bank_len = bank_len + 1
            }
          })
          if (bank_len === this.bank.length) {
            this.checkAll_bank = true
          } else if (bank_len === 0) {
            this.checkAll_bank = false
            this.isIndeterminate_bank = false
          } else {
            this.isIndeterminate_bank = true
          }

          this.cashier.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              cashier_len = cashier_len + 1
            }
          })
          if (cashier_len === this.cashier.length) {
            this.checkAll_cashier = true
          } else if (cashier_len === 0) {
            this.checkAll_cashier = false
            this.isIndeterminate_cashier = false
          } else {
            this.isIndeterminate_cashier = true
          }

          this.setting.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              setting_len = setting_len + 1
            }
          })
          if (setting_len === this.setting.length) {
            this.checkAll_setting = true
          } else if (setting_len === 0) {
            this.checkAll_setting = false
            this.isIndeterminate_setting = false
          } else {
            this.isIndeterminate_setting = true
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
    },
    store() {
      this.$refs.RoleForm.validate(valid => {
        if (valid) {
          const id = this.$route.params && this.$route.params.id
          const config = {
            headers: { 'content-type': 'multipart/form-data' }
          }
          const formdata = new FormData()
          formdata.append('id', id)
          formdata.append('focus', this.RoleForm.focus)
          formdata.append('name', this.RoleForm.name)
          formdata.append('description', this.RoleForm.description)
          formdata.append('permissions', this.RoleForm.permissions)
          formdata.append('token', store.getters.token)

          this.axios
            .post(store.getters.api_route + 'accounting/role/update', formdata, config)
            .then(res => {
              // console.log(res);
              if (res.data.error === true) {
                this.$notify({
                  title: res.data.message + ' are Required',
                  message: res.data.message + ' are Required',
                  type: 'error',
                  duration: 2000
                })
              } else {
                this.$store.dispatch('tagsView/delVisitedView', this.$route)
                this.$router.push({ path: '/user_management/roles' })
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
    handleCheckAllChange(model, type) {
      if (type === 'accounting') {
        if (this.checkAll_accounting === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.accounting))
        } else {
          this.accounting.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              const index1 = this.RoleForm.permissions.indexOf(column)
              if (index1 > -1) {
                // console.log(this.accounting[index])
                this.RoleForm.permissions.splice(index1, 1)
              }
            }
          })
        }
        // this.RoleForm.permissions = this.checkAll_accounting ? model : ''
        this.isIndeterminate_accounting = false
      } else if (type === 'lg') {
        if (this.checkAll_lg === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.lg))
        } else {
          this.lg.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              const index1 = this.RoleForm.permissions.indexOf(column)
              if (index1 > -1) {
                // console.log(this.accounting[index])
                this.RoleForm.permissions.splice(index1, 1)
              }
            }
          })
        }
        // this.RoleForm.permissions = this.checkAll_lg ? model : ''
        this.isIndeterminate_lg = false
      } else if (type === 'budget') {
        if (this.checkAll_budget === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.budget))
        } else {
          this.budget.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              const index1 = this.RoleForm.permissions.indexOf(column)
              if (index1 > -1) {
                // console.log(this.accounting[index])
                this.RoleForm.permissions.splice(index1, 1)
              }
            }
          })
        }
        // this.RoleForm.permissions = this.checkAll_budget ? model : ''
        this.isIndeterminate_budget = false
      } else if (type === 'stock') {
        if (this.checkAll_stock === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.stock))
        } else {
          this.stock.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              const index1 = this.RoleForm.permissions.indexOf(column)
              if (index1 > -1) {
                // console.log(this.accounting[index])
                this.RoleForm.permissions.splice(index1, 1)
              }
            }
          })
        }
        // this.RoleForm.permissions = this.checkAll_stock ? model : ''
        this.isIndeterminate_stock = false
      } else if (type === 'payable') {
        if (this.checkAll_payable === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.payable))
        } else {
          this.payable.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              const index1 = this.RoleForm.permissions.indexOf(column)
              if (index1 > -1) {
                // console.log(this.accounting[index])
                this.RoleForm.permissions.splice(index1, 1)
              }
            }
          })
        }
        // this.RoleForm.permissions = this.checkAll_payable ? model : ''
        this.isIndeterminate_payable = false
      } else if (type === 'fees') {
        if (this.checkAll_fees === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.fees))
        } else {
          this.fees.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              const index1 = this.RoleForm.permissions.indexOf(column)
              if (index1 > -1) {
                // console.log(this.accounting[index])
                this.RoleForm.permissions.splice(index1, 1)
              }
            }
          })
        }
        // this.RoleForm.permissions = this.checkAll_fees ? model : ''
        this.isIndeterminate_fees = false
      } else if (type === 'receivable') {
        if (this.checkAll_receivable === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.receivable))
        } else {
          this.receivable.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              const index1 = this.RoleForm.permissions.indexOf(column)
              if (index1 > -1) {
                // console.log(this.accounting[index])
                this.RoleForm.permissions.splice(index1, 1)
              }
            }
          })
        }
        // this.RoleForm.permissions = this.checkAll_receivable ? model : ''
        this.isIndeterminate_receivable = false
      } else if (type === 'bank') {
        if (this.checkAll_bank === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.bank))
        } else {
          this.bank.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              const index1 = this.RoleForm.permissions.indexOf(column)
              if (index1 > -1) {
                // console.log(this.accounting[index])
                this.RoleForm.permissions.splice(index1, 1)
              }
            }
          })
        }
        // this.RoleForm.permissions = this.checkAll_bank ? model : ''
        this.isIndeterminate_bank = false
      } else if (type === 'cashier') {
        if (this.checkAll_cashier === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.cashier))
        } else {
          this.cashier.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              const index1 = this.RoleForm.permissions.indexOf(column)
              if (index1 > -1) {
                // console.log(this.accounting[index])
                this.RoleForm.permissions.splice(index1, 1)
              }
            }
          })
        }
        // this.RoleForm.permissions = this.checkAll_cashier ? model : ''
        this.isIndeterminate_cashier = false
      } else if (type === 'setting') {
        if (this.checkAll_setting === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.setting))
        } else {
          this.setting.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              const index1 = this.RoleForm.permissions.indexOf(column)
              if (index1 > -1) {
                // console.log(this.accounting[index])
                this.RoleForm.permissions.splice(index1, 1)
              }
            }
          })
        }
        // this.RoleForm.permissions = this.checkAll_setting ? model : ''
        this.isIndeterminate_setting = false
      }
    },

    removeDuplicates(inArray) {
      const arr = inArray.concat() // create a clone from inArray so not to change input array
      // create the first cycle of the loop starting from element 0 or n
      for (let i = 0; i < arr.length; ++i) {
        // create the second cycle of the loop from element n+1
        for (let j = i + 1; j < arr.length; ++j) {
          // if the two elements are equal , then they are duplicate
          if (arr[i] === arr[j]) {
            arr.splice(j, 1) // remove the duplicated element
          }
        }
      }
      return arr
    },

    handleCheckedAccountingChange(value) {
      console.log(value)
      this.isIndeterminate_accounting = true
      const checkedCount = value.length
      this.checkAll_accounting = checkedCount === this.accounting.length
      this.isIndeterminate_accounting = checkedCount > 0 && checkedCount < this.accounting.length
    },
    handleCheckedLgChange(value) {
      // console.log(value)
      const checkedCount = value.length
      this.checkAll_lg = checkedCount === this.lg.length
      this.isIndeterminate_lg = checkedCount > 0 && checkedCount < this.lg.length
    },
    handleCheckedBudgetChange(value) {
      // console.log(value)
      const checkedCount = value.length
      this.checkAll_budget = checkedCount === this.budget.length
      this.isIndeterminate_budget = checkedCount > 0 && checkedCount < this.budget.length
    },
    handleCheckedStockChange(value) {
      // console.log(value)
      const checkedCount = value.length
      this.checkAll_stock = checkedCount === this.stock.length
      this.isIndeterminate_stock = checkedCount > 0 && checkedCount < this.stock.length
    },
    handleCheckedPayableChange(value) {
      // console.log(value)
      const checkedCount = value.length
      this.checkAll_payable = checkedCount === this.payable.length
      this.isIndeterminate_payable = checkedCount > 0 && checkedCount < this.payable.length
    },
    handleCheckedFessChange(value) {
      // console.log(value)
      const checkedCount = value.length
      this.checkAll_fees = checkedCount === this.fees.length
      this.isIndeterminate_fees = checkedCount > 0 && checkedCount < this.fees.length
    },
    handleCheckedReceivableChange(value) {
      // console.log(value)
      const checkedCount = value.length
      this.checkAll_receivable = checkedCount === this.receivable.length
      this.isIndeterminate_receivable = checkedCount > 0 && checkedCount < this.receivable.length
    },
    handleCheckedBankChange(value) {
      // console.log(value)
      const checkedCount = value.length
      this.checkAll_bank = checkedCount === this.bank.length
      this.isIndeterminate_bank = checkedCount > 0 && checkedCount < this.bank.length
    },
    handleCheckedCashierChange(value) {
      // console.log(value)
      const checkedCount = value.length
      this.checkAll_cashier = checkedCount === this.cashier.length
      this.isIndeterminate_cashier = checkedCount > 0 && checkedCount < this.cashier.length
    },
    handleCheckedSettingChange(value) {
      // console.log(value)
      const checkedCount = value.length
      this.checkAll_setting = checkedCount === this.setting.length
      this.isIndeterminate_setting = checkedCount > 0 && checkedCount < this.setting.length
    }

  }
}

</script>

<style lang="scss" scoped>

.el-form-item {
  margin-left: 0px;
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
