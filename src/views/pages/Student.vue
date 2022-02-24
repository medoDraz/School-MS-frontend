<template>
  <div class="createPost-container">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      class="demo-ruleForm"
    >
      <div class="createPost-main-container" style="margin-top: 100px;">
        <div class="postInfo-container">
          <el-row :gutter="20">
            <el-col :span="12" :offset="6">
              <el-form-item name="student" prop="student">
                <el-select
                  v-model="ruleForm.student"
                  name="student"
                  filterable
                  default-first-option
                  remote
                  reserve-keyword
                  :placeholder="$t('SearchStudent')"
                  :remote-method="remoteMethod"
                  :loading="loading"
                >
                  <el-option
                    v-for="item in students"
                    :key="item.id"
                    :label="item.FullName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="6" center>
              <el-button
                type="primary"
                plain
                @click="submitForm('ruleForm')"
              >{{ $t('go') }}
              </el-button>
              <el-button @click="resetForm('ruleForm')">{{ $t('reset') }}</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
// import { searchStudent } from '@/api/student-search'
import store from '@/store'

export default {
  name: 'Student',
  data() {
    return {
      students: [],
      value: [],
      student: null,
      loading: false,
      ruleForm: {
        student: ''
      },
      rules: {
        student: [
          {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
  },
  methods: {
    remoteMethod(query) {
      this.loading = true
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
        this.loading = false
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // this.$store.dispatch('tagsView/delVisitedView', this.$route)
          this.$router.push('/setting/student-balance/' + this.ruleForm.student)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
  .el-select {
    display: block;
    padding-right: 8px;
  }

  .el-row {
    margin-bottom: 20px;

  &
  :last-child {
    margin-bottom: 0;
  }

  }
  .el-col {
    border-radius: 4px;
  }
</style>
