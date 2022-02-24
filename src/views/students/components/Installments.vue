<template>
  <div class="app-container">
    <div style="margin:0 0 20px 0px">
      <h3>Installments Details</h3>
    </div>

    <el-table :key="key" :data="artists" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="name" label="Installment" />
      <el-table-column prop="name" label="Due Dates" />
      <el-table-column prop="name" label="Basic Fees" />
      <el-table-column prop="name" label="Discount" />
      <el-table-column prop="name" label="Final Fees" />
      <el-table-column prop="name" class="text-center" label="Action">
        <template class="text-center">
          <input id="62df479d1976" type="checkbox" class="form-check-input">
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
const defaultFormThead = ['apple', 'banana']

export default {
  name: 'Test',

  data() {
    return {

      tableData: [
        {
          name: 'fruit-1',
          apple: 'apple-10',
          banana: 'banana-10',
          orange: 'orange-10'
        },
        {
          name: 'fruit-2',
          apple: 'apple-20',
          banana: 'banana-20',
          orange: 'orange-20'
        }, {
          name: 'fruit-2',
          apple: 'apple-ss',
          banana: 'banana-20',
          orange: 'orange-20'
        }
      ],

      key: 1,
      formTheadOptions: ['apple', 'banana', 'orange'],
      checkboxVal: defaultFormThead,
      formThead: defaultFormThead
    }
  },
  watch: {
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
      this.key = this.key + 1
    }
  },
  created() {
    alert(this.artists)
  }

}
</script>

