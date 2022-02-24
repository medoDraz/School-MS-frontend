<template>
  <div style="padding : 35px;">
    <div class="createPost-container" style="margin-top: 25px; ">
      <el-card class="box-card">
        <el-form ref="UserForm" class="form-container" :model="UserForm" :rules="loginRules">
          <div class="createPost-main-container">
            <el-row>
              <div class="postInfo-container">
                <el-row>
                  <el-row style="margin-top:15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <pan-thumb v-if="UserForm.id" :image="imageUrl+UserForm.imageUrl" />
                      <el-form-item v-else :label="$t('image')" class="postInfo-container-item">
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <input type="file" accept="image/*" style="margin-top: 6px;" @change="previewFiles">
                    </el-col>
                  <!--                    <image-cropper-->
                  <!--                      v-show="imagecropperShow"-->
                  <!--                      :key="imagecropperKey"-->
                  <!--                      :url="uploadUrl"-->
                  <!--                      lang-type="en"-->
                  <!--                      @close="close"-->
                  <!--                      @crop-upload-success="cropSuccess"-->
                  <!--                    />-->
                  </el-row>
                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('Cafeteria')" class="postInfo-container-item">
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item prop="cafetria">
                        <el-select v-model="UserForm.cafetria" placeholder="Choose the group" clearable class="filter-item" style="width: 250px" @change="getAllGroups()">
                          <el-option v-for="item in cafetriaList" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                      </el-form-item>
                    </el-col>

                  </el-row>
                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('Group')" class="postInfo-container-item">
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item prop="group">
                        <el-select v-model="UserForm.group" placeholder="Choose the group" clearable class="filter-item" style="width: 250px">
                          <el-option v-for="item in rolesList1" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                      </el-form-item>
                    </el-col>

                  </el-row>
                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('ItemName')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item prop="name">
                        <el-input v-model="UserForm.name" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter item Name" required />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('description')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item prop="description">
                        <el-input v-model="UserForm.description" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter Description" required />
                      </el-form-item>
                    </el-col>
                  </el-row>

                </el-row>

                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('price')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item prop="price">
                        <el-input v-model.number="UserForm.price" type="text" class="article-textarea" autosize placeholder="Please enter price" required />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-row>
                <el-row>
                  <el-row style="margin-top: 15px;">
                    <el-col :span="5" style="margin-right: 10px;">
                      <el-form-item :label="$t('AllDays')" class="postInfo-container-item">
                        <span style="float: left; color:red; font-weight: bold;">*</span>
                        <span style="float: right; font-weight: bold;">:</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="18">
                      <el-form-item prop="days">
                        <el-select v-model="UserForm.days" placeholder="Choose the Days" clearable class="filter-item" style="width: 250px">
                          <el-option key="-1" :label="$t('no')" value="-1" />
                          <el-option key="1" :label="$t('yes')" value="1" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-row>

              </div>
            </el-row>
          </div>

          <el-button style="margin-left: 40%; width: 200px; margin-top: 10px;" type="success" @click.native.prevent="store">
            {{ $t('submit') }}
          </el-button>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
// import MDinput from '@/components/MDinput';
// import Sticky from '@/components/Sticky';
// import Warning from './Warning';
// import Multiselect from '@/views/components-demo/drag-select'
// import TabPane from '@/views/tab/components/TabPane'
// import ElDragSelect from '@/components/DragSelect' // base on element-ui
import store from '@/store'
// import {validUsername} from '@/utils/validate'
// import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import checkPermission from '@/utils/permission'

export default {
  name: 'AddItem',
  components: {
    // MDinput,
    // Sticky,
    // Warning,
    // Multiselect,
    // TabPane,
    // ElDragSelect,
    // ImageCropper,
    PanThumb
  },
  data() {
    return {
      UserForm: {
        id: '',
        name: '',
        group: '',
        price: '',
        status: '',
        cafetria: '',
        days: '',
        description: '',

        image: 'uploads/f2dd25735c265d934f4c98ccaea503bd.png'
      },
      avatar: '',
      imageUrl: store.getters.app_route + 'storage/',
      imagecropperShow: false,
      imagecropperKey: 0,
      uploadUrl: store.getters.api_route + 'cafeteria/uploadImage',
      loginRules: {
        name: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        description: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        cafetria: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        group: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        status: [{ required: true, message: 'This field value is required', trigger: 'change' }],
        days: [{ required: true, tmessage: 'This field value is required', trigger: 'change' }],
        price: [
          { required: true, message: 'Price is required' },
          { type: 'number', message: 'Price must be  numbers' }
        ]
      },
      activeName: 'Settings',
      schoolOptions: [
        { key: 'American', display_name: 'American' },
        { key: 'British', display_name: 'British' }
      ],
      rolesList1: [],
      cafetriaList: []
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
    if (!this.checkPermission('Add_Items') || !this.checkPermission('Edit_Items')) {
      this.$router.push({ path: '/403' })
    }
    const id = this.$route.params && this.$route.params.id
    if (id) {
      this.fetchData(id)
    }
    // this.getAllGroups()
    this.getAllStore()
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    checkPermission,
    cropSuccess(resData) {
      // console.log(resData)
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.UserForm.image = resData
    },
    close() {
      this.imagecropperShow = false
    },
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
      this.axios.post(store.getters.api_route + 'cafeteria/item/' + id, formdata, config)
        .then(res => {
          // console.log(res.data.data[0].cat_id)
          this.UserForm.id = res.data.data[0].id
          this.UserForm.name = res.data.data[0].name
          this.UserForm.cafetria = res.data.data[0].store_id
          this.getAllGroups()
          this.UserForm.group = res.data.data[0].cat_id
          this.UserForm.price = Number(res.data.data[0].price)
          this.UserForm.description = res.data.data[0].description
          this.UserForm.days = String(res.data.data[0].all_days)
          this.UserForm.status = String(res.data.data[0].status)
          this.UserForm.imageUrl = res.data.data[0].image

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
      this.$refs.UserForm.validate(valid => {
        if (valid) {
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
          let id = this.$route.params && this.$route.params.id
          if (!id) {
            id = 'new'
          }
          const formdata = new FormData()
          formdata.append('id', id)
          formdata.append('name', this.UserForm.name)
          formdata.append('store_id', this.UserForm.cafetria)
          formdata.append('group_id', this.UserForm.group)
          formdata.append('price', this.UserForm.price)
          formdata.append('description', this.UserForm.description)
          formdata.append('days', this.UserForm.days)
          formdata.append('image', this.UserForm.image)
          formdata.append('status', this.UserForm.status)
          // formdata.append('token', store.getters.token)
          this.axios.post(store.getters.api_route + 'cafeteria/ItemStore', formdata, config)
            .then(res => {
              if (res.data.error === true) {
                this.$notify({
                  title: res.data.message + ' are Required',
                  message: res.data.message + ' are Required',
                  type: 'error',
                  duration: 2000
                })
              } else {
                this.$store.dispatch('tagsView/delVisitedView', this.$route)
                this.$router.push({ path: '/Items/index' })
                this.$notify({
                  title: 'success',
                  message: res.data.message,
                  type: 'success',
                  duration: 2000
                })
              }
            })
            .catch(error => {
              console.log(error)
              this.$notify({
                title: 'error',
                message: error.data.message,
                type: 'error',
                duration: 2000
              })
              // console.log(error);
              // $('.card').append('<div class="alert alert-danger"><p>' + error + '</p></div>');
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getAllGroups() {
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
      console.log(this.UserForm.cafetria)
      const formdata = new FormData()
      formdata.append('id', this.UserForm.cafetria)
      this.axios.post(store.getters.api_route + 'pages/CafeteriaGroups', formdata, config)
        .then(res => {
          // console.log(res.data.data)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.rolesList1 = res.data.data
          // console.log(this.rolesList1)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getAllStore() {
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
      this.axios.post(store.getters.api_route + 'cafeteria/listCafetria', formdata, config)
        .then(res => {
          // console.log(store.getters.cafeteria_id)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          const _this = this
          // this.cafetriaList = res.data.data
          if (store.getters.cafeteria_id === 0) {
            this.cafetriaList = res.data.data
          } else {
            res.data.data.forEach(function(item) {
              if (store.getters.cafeteria_id === item.id) {
                _this.cafetriaList.push(item)
                // console.log(item)
              }
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
    },
    previewFiles(event) {
      this.UserForm.image = event.target.files[0]
      // console.log(event.target.files)
    }
  }
}
</script>

<style lang="scss" scoped>
  .avatar {
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }

  .el-form-item {
    margin-left: 0;
    margin-bottom: 5px;
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
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }

  .tab-container {
    margin: 30px;
  }

  .block {
    padding: 12px 10px;
  }
</style>
