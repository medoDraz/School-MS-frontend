<template>
  <div style="padding : 35px;">
    <div class="createPost-container" style="margin-top: 35px; ">
      <el-card class="box-card">
        <el-form ref="CafeteriaForm" class="form-container" :model="CafeteriaForm" :rules="CafeteriaRule">
          <div class="createPost-main-container">
            <el-row>
              <div class="postInfo-container" style="margin-top: 45px;">
                <el-row>
                  <el-row>
                    <el-col :span="3" style="margin-right: 10px;">
                      <el-form-item :label="$t('FullName')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="20">
                      <el-form-item prop="name">
                        <el-input v-model="CafeteriaForm.name" :rows="1" type="text" class="article-textarea" autosize placeholder="Please enter the content" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-row>
                <el-row>
                  <el-row>
                    <el-col :span="3" style="margin-right: 10px;">
                      <el-form-item :label="$t('description')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="20">
                      <el-form-item prop="description">
                        <el-input v-model="CafeteriaForm.description" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-row>
                <el-row>
                  <el-row>
                    <el-col :span="3" style="margin-right: 10px;">
                      <el-form-item :label="$t('email')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="20">
                      <el-form-item prop="email">
                        <el-input v-model="CafeteriaForm.email" :rows="1" type="text" class="article-textarea" autosize placeholder="Please enter the content" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-row>
                <el-row>
                  <el-row>
                    <el-col :span="3" style="margin-right: 10px;">
                      <el-form-item :label="$t('mobile')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="20">
                      <el-form-item prop="mobile">
                        <el-input v-model="CafeteriaForm.mobile" :rows="1" type="text" class="article-textarea" autosize placeholder="Please enter the content" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-row>
                <el-row>
                  <el-row>
                    <el-col :span="3" style="margin-right: 10px;">
                      <el-form-item :label="$t('phone')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="20">
                      <el-form-item prop="telephone">
                        <el-input v-model="CafeteriaForm.telephone" :rows="1" type="text" class="article-textarea" autosize placeholder="Please enter the content" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-row>

                <el-row>
                  <el-row>
                    <el-col :span="3" style="margin-right: 10px;">
                      <el-form-item :label="$t('type')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="20">
                      <el-form-item prop="type">
                        <el-select v-model="CafeteriaForm.type" placeholder="Choose the type" clearable class="filter-item">
                          <!--                          <el-option v-for="item in types" :key="item.key" :label="item.display_name" :value="item.key" />-->
                          <el-option :label="$t('school')" :value="1" />
                          <el-option :label="$t('NonSchool')" :value="0" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-row>
                <el-row>
                  <el-row>
                    <el-col :span="3" style="margin-right: 10px;">
                      <el-form-item :label="$t('logo')" class="postInfo-container-item">
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="20">
                      <!--                      <el-avatar shape="square" :size="100" fit="fill" :src="CafeteriaForm.url + CafeteriaForm.imageUrl" />-->
                      <!--                      <img v-if="CafeteriaForm.id" :src="CafeteriaForm.url + CafeteriaForm.imageUrl" class="avatar">-->
                      <input type="file" style="margin-top: 6px;" @change="previewFiles">
                      <!--                      <el-input v-model="description" :rows="1" type="text" class="article-textarea" autosize placeholder="Please enter the content" />-->
                    </el-col>
                  </el-row>
                </el-row>
                <el-row>
                  <el-row>
                    <el-col :span="3" style="margin-right: 10px;">
                      <el-form-item class="postInfo-container-item" />
                    </el-col>
                    <el-col :span="20">
                      <el-image v-if="CafeteriaForm.id" :src="CafeteriaForm.url + CafeteriaForm.imageUrl" fit="fill" style="height: 120px;" />
                      <!--                      <pan-thumb v-if="CafeteriaForm.id" :image="CafeteriaForm.url + CafeteriaForm.imageUrl" />-->
                      <!--                      <el-avatar shape="square" :size="100" :src="CafeteriaForm.url + CafeteriaForm.imageUrl" />-->
                    </el-col>
                  </el-row>
                </el-row>
              </div>
            </el-row>
          </div>
          <el-button style="margin-left: 40%; width: 200px; margin-top: 10px;" type="success" @click="store">
            {{ $t('submit') }}
          </el-button>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
// import MDinput from '@/components/MDinput'
// import Sticky from '@/components/Sticky'
// import Warning from './Warning'
// import Multiselect from '@/views/components-demo/drag-select'
// import TabPane from '@/views/tab/components/TabPane'
// import PanThumb from '@/components/PanThumb'
// import ElDragSelect from '@/components/DragSelect' // base on element-ui
import store from '@/store'
export default {
  name: 'EditRole',
  components: {
    // PanThumb
    // MDinput,
    // Sticky,
    // Warning,
    // Multiselect,
    // TabPane,
    // ElDragSelect
  },
  data() {
    return {
      activeName: 'Settings',
      focus: [],
      name: '',
      CafeteriaForm: {
        id: '',
        name: '',
        description: '',
        url: store.getters.app_route + 'storage/',
        email: '',
        mobile: '',
        image_Url: '',
        imageUrl: '',
        telephone: '',
        type: ''
      },
      CafeteriaRule: {
        name: [{ required: true, trigger: 'blur' }],
        description: [{ required: true, trigger: 'blur' }],
        email: [{ required: true, trigger: 'blur' }],
        mobile: [
          { required: true, pattern: /^[0-9]+$/, message: 'Mobile Unit is required' }
          // { type: 'mobile', message: 'Mobile Unit must be numbers' }
        ],
        telephone: [
          { required: true, pattern: /^[0-9]+$/, message: 'Telephone Unit is required' }
          // { type: 'mobile', message: 'Telephone Unit must be numbers' }
        ],
        type: [{ required: true, trigger: 'blur' }]
      },
      description: '',
      permissions: [],
      types: [
        { key: 0, display_name: 'Non School' },
        { key: 1, display_name: 'School' }
      ]
    }
  },
  computed: {
    isValidForm() {
      return this.cashin_new_number.length > 5 && this.cashout_new_number.length > 5 && this.pay_new_number.length > 5 &&
        this.pur_new_number.length > 5 && this.journal_new_number.length > 5 && this.inventory_new_number.length > 5
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  mounted() {
    console.log('Component mounted.')
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    if (id) {
      this.fetchData(id)
    }
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    fetchData(id) {
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
      // formdata.append('token', store.getters.token)
      formdata.append('id', id)
      this.axios.post(store.getters.api_route + 'cafeteria/details/' + id, formdata, config)
        .then(res => {
          // console.log(res.data.data.stor)
          this.CafeteriaForm.id = res.data.data.stor.id
          this.CafeteriaForm.name = res.data.data.stor.name
          this.CafeteriaForm.email = res.data.data.stor.email
          this.CafeteriaForm.description = res.data.data.stor.description
          this.CafeteriaForm.mobile = res.data.data.stor.mobile
          this.CafeteriaForm.telephone = res.data.data.stor.telephone
          this.CafeteriaForm.type = res.data.data.stor.type
          this.CafeteriaForm.imageUrl = res.data.data.stor.logo

          // this.focus = res.data.focus
          // this.name = res.data.name
          // this.description = res.data.description
          // this.permissions = res.data.permissions
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
    store() {
      this.$refs.CafeteriaForm.validate(valid => {
        if (valid) {
          let id = this.$route.params && this.$route.params.id
          if (!id) {
            id = 'new'
          }
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
          formdata.append('id', id)
          formdata.append('name', this.CafeteriaForm.name)
          formdata.append('email', this.CafeteriaForm.email)
          formdata.append('desc', this.CafeteriaForm.description)
          formdata.append('mobile', this.CafeteriaForm.mobile)
          formdata.append('telephone', this.CafeteriaForm.telephone)
          formdata.append('type', this.CafeteriaForm.type)
          formdata.append('logo', this.CafeteriaForm.image_Url)
          // formdata.append('token', store.getters.token)

          this.axios.post(store.getters.api_route + 'pages/Cafetria/save', formdata, config)
            .then(res => {
              // console.log(res);
              if (res.data.error === true) {
                if (res.data.data.email) {
                  this.$notify({
                    title: 'Validation Error',
                    message: res.data.data.email[0],
                    type: 'error',
                    duration: 2000
                  })
                } else if (res.data.data.name) {
                  this.$notify({
                    title: 'Validation Error',
                    message: res.data.data.email[0],
                    type: 'error',
                    duration: 2000
                  })
                } else if (res.data.data.desc) {
                  this.$notify({
                    title: 'Validation Error',
                    message: res.data.data.desc[0],
                    type: 'error',
                    duration: 2000
                  })
                } else if (res.data.data.mobile) {
                  this.$notify({
                    title: 'Validation Error',
                    message: res.data.data.mobile[0],
                    type: 'error',
                    duration: 2000
                  })
                } else if (res.data.data.type) {
                  this.$notify({
                    title: 'Validation Error',
                    message: res.data.data.type[0],
                    type: 'error',
                    duration: 2000
                  })
                }
              } else {
                this.$store.dispatch('tagsView/delVisitedView', this.$route)
                this.$router.push({ path: '/setting/cafeterias' })
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
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    previewFiles(event) {
      this.CafeteriaForm.image_Url = event.target.files[0]
      // console.log(event.target.files)
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
      opacity: .8;
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
    border-radius: 0;
    border-bottom: 1px solid #bfcbd9;
  }
  }
  .tab-container {
    margin: 30px;
  }
</style>
