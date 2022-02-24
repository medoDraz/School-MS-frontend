<template>
  <div style="padding : 35px;">
    <div class="createPost-container">
      <el-form ref="UserForm" class="form-container" :model="UserForm" :rules="loginRules">
        <div class="createPost-main-container" style="margin-top: 50px;">
          <el-row>
            <div class="postInfo-container">
              <el-row>
                <el-row style="margin-top:15px;">
                  <pan-thumb :image="imageUrl+UserForm.image" />

                  <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">
                    Change Image
                  </el-button>

                  <image-cropper
                    v-show="imagecropperShow"
                    :key="imagecropperKey"
                    :url="uploadUrl"
                    lang-type="en"
                    @close="close"
                    @crop-upload-success="cropSuccess"
                  />
                </el-row>
              </el-row>
              <el-row>
                <el-row style="margin-top: 15px;">
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="Group" class="postInfo-container-item">
                      <span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">

                    <el-select v-model="UserForm.group" placeholder="Choose the group" clearable class="filter-item" style="width: 250px">
                      <el-option v-for="item in rolesList1" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>

                  </el-col>

                </el-row>
              </el-row>
              <el-row>
                <el-row style="margin-top: 15px;">
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label=" Name" class="postInfo-container-item">
                      <span style="float: left; color:red; font-weight: bold;">*</span>
                      <span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-input v-model="UserForm.name" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter item Name" required />
                  </el-col>
                </el-row>
              </el-row>

              <el-row>
                <el-row style="margin-top: 15px;">
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="Price" class="postInfo-container-item">
                      <span style="float: left; color:red; font-weight: bold;">*</span>
                      <span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">

                    <el-input v-model="UserForm.price" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter price" required />
                  </el-col>
                </el-row>

              </el-row>
              <el-row>
                <el-row style="margin-top: 15px;">
                  <el-col :span="5" style="margin-right: 10px;">
                    <el-form-item label="Status" class="postInfo-container-item">
                      <span style="float: right; font-weight: bold;">:</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-row>
                      <div class="block">
                        <el-radio-group v-model="UserForm.status">
                          <el-radio label="1">
                            Active
                          </el-radio>
                          <el-radio label="0">
                            In active
                          </el-radio>
                        </el-radio-group>
                      </div>
                    </el-row>
                  </el-col>

                </el-row>

              </el-row>

            </div>

          </el-row>
        </div>

        <el-button style="margin-left: 40%; width: 200px; margin-top: 10px;" type="success" @click.native.prevent="store">
          Submit
        </el-button>
      </el-form>
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
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'AddItem',
  components: {
    // MDinput,
    // Sticky,
    // Warning,
    // Multiselect,
    // TabPane,
    // ElDragSelect,
    ImageCropper,
    PanThumb
  },
  data() {
    return {
      UserForm: {
        name: '',
        group: '',
        price: '',
        status: '',

        image: 'uploads/f2dd25735c265d934f4c98ccaea503bd.png'
      },
      avatar: '',
      imageUrl: store.getters.app_route + 'storage/',
      imagecropperShow: false,
      imagecropperKey: 0,
      uploadUrl: store.getters.api_route + 'pages/uploadImage',
      loginRules: {

        name: [{ required: true, trigger: 'blur' }]
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
    this.getAllGroups()
    this.getAllStore()
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    cropSuccess(resData) {
      console.log(resData)
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.UserForm.image = resData
    },
    close() {
      this.imagecropperShow = false
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
          const formdata = new FormData()
          formdata.append('name', this.UserForm.name)
          formdata.append('group', this.UserForm.group)
          formdata.append('price', this.UserForm.price)
          formdata.append('image', this.UserForm.image)
          formdata.append('status', this.UserForm.status)
          formdata.append('token', store.getters.token)
          this.axios.post(store.getters.api_route + 'pages/addItem', formdata, config)
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
                this.$router.push({ path: '/Cafetria/Items' })
                this.$notify({
                  title: 'success',
                  message: res.data.message,
                  type: 'success',
                  duration: 2000
                })
              }
            })
            .catch(error => {
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
      const formdata = new FormData()
      // formdata.append('token', store.getters.token)
      this.axios.post(store.getters.api_route + 'pages/groups', formdata, config)
        .then(res => {
          console.log(res.data.data)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.rolesList1 = res.data.data.groups
          console.log(this.rolesList1)
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
          console.log(res.data.data)
          const { data } = res
          if (!data) {
            console.log('sdfsf')
          }
          this.cafetriaList = res.data.data
          console.log(this.cafetriaList)
        })
        .catch(err => {
          console.log(err)
        })
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
