<template>

  <div style="padding : 35px;">
    <div class="createPost-container">
      <el-form ref="RoleForm" class="form-container" :model="RoleForm" :rules="rules">
        <div class="createPost-main-container" style="margin-top: 20px;">
          <el-row>
            <div class="postInfo-container">
              <el-card class="box-card">
                <el-row>
                  <el-row>
                    <el-col :span="5" style="margin-right: 10px;margin-bottom: 10px;">
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
                  <!--                  <el-row style="height: 25px;text-align: center;">-->
                  <!--                    <h4 style="margin-bottom: 0 !important;">{{ $t('permissions') }}</h4>-->
                  <!--                  </el-row>-->
                  <el-row>
                    <el-tabs v-model="activeName" style="margin-top:0;" vertical>
                      <el-tab-pane key="grades" :label="$t('grades')" name="grades">
                        <keep-alive>
                          <div class="perm" style="display: grid; padding-left: 35px; ">
                            <el-checkbox
                              v-model="checkAll_grades"
                              :indeterminate="isIndeterminate_grades"
                              @change="handleCheckAllChange(grades, 'grades')"
                            >{{ $t('check_all') }}
                            </el-checkbox>
                            <el-checkbox-group
                              v-model="RoleForm.permissions"
                              style="display: grid; padding-left: 20px; margin-top: 10px"
                              @change="handleCheckedGradeChange"
                            >
                              <el-checkbox
                                v-for="permission in grades"
                                :key="permission"
                                :label="permission"
                              >{{ permission }}
                              </el-checkbox>
                            </el-checkbox-group>
                          </div>
                        </keep-alive>
                      </el-tab-pane>
                      <el-tab-pane key="classes" :label="$t('classes')" name="classes">
                        <keep-alive>
                          <div class="perm" style="display: grid; padding-left: 35px; ">
                            <el-checkbox
                              v-model="checkAll_classes"
                              :indeterminate="isIndeterminate_classes"
                              @change="handleCheckAllChange(classes, 'classes')"
                            >{{ $t('check_all') }}
                            </el-checkbox>
                            <el-checkbox-group
                              v-model="RoleForm.permissions"
                              style="display: grid; padding-left: 20px; margin-top: 10px"
                              @change="handleCheckedClassesChange"
                            >
                              <el-checkbox
                                v-for="permission in classes"
                                :key="permission"
                                :label="permission"
                              >{{ permission }}
                              </el-checkbox>
                            </el-checkbox-group>
                          </div>
                        </keep-alive>
                      </el-tab-pane>
                      <el-tab-pane key="sections" :label="$t('sections')" name="sections">
                        <keep-alive>
                          <div class="perm" style="display: grid; padding-left: 35px; ">
                            <el-checkbox
                              v-model="checkAll_sections"
                              :indeterminate="isIndeterminate_sections"
                              @change="handleCheckAllChange(sections, 'sections')"
                            >{{ $t('check_all') }}
                            </el-checkbox>
                            <el-checkbox-group
                              v-model="RoleForm.permissions"
                              style="display: grid; padding-left: 20px; margin-top: 10px"
                              @change="handleCheckedSectionsChange"
                            >
                              <el-checkbox
                                v-for="permission in sections"
                                :key="permission"
                                :label="permission"
                              >{{ permission }}
                              </el-checkbox>
                            </el-checkbox-group>
                          </div>
                        </keep-alive>
                      </el-tab-pane>
                      <el-tab-pane key="subjects" :label="$t('subjects')" name="subjects">
                        <keep-alive>
                          <div class="perm" style="display: grid; padding-left: 35px; ">
                            <el-checkbox
                              v-model="checkAll_subjects"
                              :indeterminate="isIndeterminate_subjects"
                              @change="handleCheckAllChange(subjects, 'subjects')"
                            >{{ $t('check_all') }}
                            </el-checkbox>
                            <el-checkbox-group
                              v-model="RoleForm.permissions"
                              style="display: grid; padding-left: 20px; margin-top: 10px"
                              @change="handleCheckedSubjectsChange"
                            >
                              <el-checkbox
                                v-for="permission in subjects"
                                :key="permission"
                                :label="permission"
                              >{{ permission }}
                              </el-checkbox>
                            </el-checkbox-group>
                          </div>
                        </keep-alive>
                      </el-tab-pane>
                      <el-tab-pane key="students" :label="$t('students')" name="students">
                        <keep-alive>
                          <div class="perm" style="display: grid; padding-left: 35px; ">
                            <el-checkbox
                              v-model="checkAll_students"
                              :indeterminate="isIndeterminate_students"
                              @change="handleCheckAllChange(students, 'students')"
                            >{{ $t('check_all') }}
                            </el-checkbox>
                            <el-checkbox-group
                              v-model="RoleForm.permissions"
                              style="display: grid; padding-left: 20px; margin-top: 10px"
                              @change="handleCheckedStudentsChange"
                            >
                              <el-checkbox
                                v-for="permission in students"
                                :key="permission"
                                :label="permission"
                              >{{ permission }}
                              </el-checkbox>
                            </el-checkbox-group>
                          </div>
                        </keep-alive>
                      </el-tab-pane>
                      <el-tab-pane key="teachers" :label="$t('teachers')" name="teachers">
                        <keep-alive>
                          <div class="perm" style="display: grid; padding-left: 35px; ">
                            <el-checkbox
                              v-model="checkAll_teachers"
                              :indeterminate="isIndeterminate_teachers"
                              @change="handleCheckAllChange(teachers, 'teachers')"
                            >{{ $t('check_all') }}
                            </el-checkbox>
                            <el-checkbox-group
                              v-model="RoleForm.permissions"
                              style="display: grid; padding-left: 20px; margin-top: 10px"
                              @change="handleCheckedTeachersChange"
                            >
                              <el-checkbox
                                v-for="permission in teachers"
                                :key="permission"
                                :label="permission"
                              >{{ permission }}
                              </el-checkbox>
                            </el-checkbox-group>
                          </div>
                        </keep-alive>
                      </el-tab-pane>
                      <el-tab-pane key="parents" :label="$t('parents')" name="parents">
                        <keep-alive>
                          <div class="perm" style="display: grid; padding-left: 35px; ">
                            <el-checkbox
                              v-model="checkAll_parents"
                              :indeterminate="isIndeterminate_parents"
                              @change="handleCheckAllChange(parents, 'parents')"
                            >{{ $t('check_all') }}
                            </el-checkbox>
                            <el-checkbox-group
                              v-model="RoleForm.permissions"
                              style="display: grid; padding-left: 20px; margin-top: 10px"
                              @change="handleCheckedParentsChange"
                            >
                              <el-checkbox
                                v-for="permission in parents"
                                :key="permission"
                                :label="permission"
                              >{{ permission }}
                              </el-checkbox>
                            </el-checkbox-group>
                          </div>
                        </keep-alive>
                      </el-tab-pane>
                      <el-tab-pane key="settings" :label="$t('settings')" name="settings">
                        <keep-alive>
                          <div class="perm" style="display: grid; padding-left: 35px; ">
                            <el-checkbox
                              v-model="checkAll_settings"
                              :indeterminate="isIndeterminate_settings"
                              @change="handleCheckAllChange(settings, 'settings')"
                            >{{ $t('check_all') }}
                            </el-checkbox>
                            <el-checkbox-group
                              v-model="RoleForm.permissions"
                              style="display: grid; padding-left: 20px; margin-top: 10px"
                              @change="handleCheckedSettingsChange"
                            >
                              <el-checkbox
                                v-for="permission in settings"
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
                <el-button style="margin-left: 40%; width: 200px; margin-top: 10px;" type="success" @click="store">
                  {{ $t('submit') }}
                </el-button>
              </el-card>

            </div>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>

</template>
<script>

// import Multiselect from '@/views/components-demo/drag-select'
// import TabPane from '@/views/tab/components/TabPane'
import checkPermission from '@/utils/permission'
// import ElDragSelect from '@/components/DragSelect' // base on element-ui
import store from '@/store'
import { generateTitle } from '@/utils/i18n'
// import { validAlphabets, isArray } from '@/utils/validate'

// const cityOptions = [
//   'Accounts_Payables'
// ]

export default {
  name: 'RoleEntry',
  components: {
    // Multiselect,
    // TabPane,
    // ElDragSelect
  },
  data() {
    return {
      activeName: 'grades',
      RoleForm: {
        name: '',
        description: '',
        permissions: []
      },

      rules: {
        // focus: [{ required: true, message: 'This field value is required', trigger: 'change' }],
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
          value: 'Biritsh',
          label: 'Biritsh'
        },
        {
          value: 'Company',
          label: 'Company'
        }
      ],
      checkAll_grades: false,
      checkAll_classes: false,
      checkAll_sections: false,
      checkAll_subjects: false,
      checkAll_students: false,
      checkAll_teachers: false,
      checkAll_parents: false,
      checkAll_settings: false,

      checkAll_cashier: false,
      checkAll_permissions: false,

      grades: [
        'Access_Grade',
        'Add_Grade',
        'Edit_Grade',
        'Delete_Grade'
      ],
      classes: [
        'Access_Class',
        'Add_Class',
        'Edit_Class',
        'Delete_Class'
      ],
      sections: [
        'Access_Section',
        'Add_Section',
        'Edit_Section',
        'Delete_Section'
      ],
      subjects: [
        'Access_Subject',
        'Add_Subject',
        'Edit_Subject',
        'Delete_Subject'
      ],
      students: [
        'Access_Student',
        'Add_Student',
        'Edit_Student',
        'Delete_Student'
      ],
      teachers: [
        'Access_Teacher',
        'Add_Teacher',
        'Edit_Teacher',
        'Delete_Teacher'
      ],
      parents: [
        'Access_Parent',
        'Add_Parent',
        'Edit_Parent',
        'Delete_Parent'
      ],
      settings: [
        'Access_Setting',
        'User_Management',
        'Access_Roles',
        'Add_role',
        'Edit_role',
        'Delete_role',
        'Access_Users',
        'Add_user',
        'Edit_user',
        'Delete_user'
      ],

      isIndeterminate_grades: false,
      isIndeterminate_classes: false,
      isIndeterminate_sections: false,
      isIndeterminate_subjects: false,
      isIndeterminate_students: false,
      isIndeterminate_teachers: false,
      isIndeterminate_parents: false,
      isIndeterminate_settings: false,

      isIndeterminate_cashier: false,
      isIndeterminate_permissions: false

    }
  },
  computed: {
  },
  watch: {
    // activeName(val) {
    //   this.$router.push(`${this.$route.path}?tab=${val}`)
    // }
  },
  mounted() {
    if (this.RoleForm.name === '') {
      this.$refs.name.focus()
    }

    if (!this.checkPermission('Add_role') || !this.checkPermission('Edit_role')) {
      this.$router.push({ path: '/403' })
    }
    // console.log('Component mounted.');
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    if (id) {
      this.fetchData(id)
    }
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    generateTitle,
    checkPermission,
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
      formdata.append('token', store.getters.token)
      formdata.append('id', id)
      this.axios
        .post(store.getters.api_route + 'role/edit', formdata, config)
        .then(res => {
          // console.log(res.data);
          this.RoleForm.name = res.data.role.name
          this.RoleForm.description = res.data.role.description
          this.RoleForm.permissions = res.data.permissions
          let grades_len = 0
          let classes_len = 0
          let sections_len = 0
          let subjects_len = 0
          let students_len = 0
          let teachers_len = 0
          let parents_len = 0
          let settings_len = 0
          this.grades.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              grades_len = grades_len + 1
            }
          })
          if (grades_len === this.grades.length) {
            this.checkAll_grades = true
          } else if (grades_len === 0) {
            this.checkAll_grades = false
            this.isIndeterminate_grades = false
          } else {
            this.isIndeterminate_grades = true
          }
          this.classes.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              classes_len = classes_len + 1
            }
          })
          if (classes_len === this.classes.length) {
            this.checkAll_classes = true
          } else if (classes_len === 0) {
            this.checkAll_classes = false
            this.isIndeterminate_classes = false
          } else {
            this.isIndeterminate_classes = true
          }
          this.sections.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              sections_len = sections_len + 1
            }
          })
          if (sections_len === this.grades.length) {
            this.checkAll_sections = true
          } else if (sections_len === 0) {
            this.checkAll_sections = false
            this.isIndeterminate_sections = false
          } else {
            this.isIndeterminate_sections = true
          }
          this.subjects.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              subjects_len = subjects_len + 1
            }
          })
          if (subjects_len === this.grades.length) {
            this.checkAll_subjects = true
          } else if (subjects_len === 0) {
            this.checkAll_subjects = false
            this.isIndeterminate_subjects = false
          } else {
            this.isIndeterminate_subjects = true
          }
          this.students.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              students_len = students_len + 1
            }
          })
          if (students_len === this.grades.length) {
            this.checkAll_students = true
          } else if (students_len === 0) {
            this.checkAll_students = false
            this.isIndeterminate_students = false
          } else {
            this.isIndeterminate_students = true
          }
          this.teachers.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              teachers_len = teachers_len + 1
            }
          })
          if (teachers_len === this.grades.length) {
            this.checkAll_teachers = true
          } else if (teachers_len === 0) {
            this.checkAll_teachers = false
            this.isIndeterminate_teachers = false
          } else {
            this.isIndeterminate_teachers = true
          }
          this.parents.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              parents_len = parents_len + 1
            }
          })
          if (parents_len === this.grades.length) {
            this.checkAll_parents = true
          } else if (parents_len === 0) {
            this.checkAll_parents = false
            this.isIndeterminate_parents = false
          } else {
            this.isIndeterminate_parents = true
          }
          this.settings.forEach((column, index) => {
            if (this.RoleForm.permissions.includes(column)) {
              settings_len = settings_len + 1
            }
          })
          if (settings_len === this.grades.length) {
            this.checkAll_settings = true
          } else if (settings_len === 0) {
            this.checkAll_settings = false
            this.isIndeterminate_settings = false
          } else {
            this.isIndeterminate_settings = true
          }

          loading.close()
        })
        .catch(err => {
          console.log(err)
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
          const id = this.$route.params && this.$route.params.id
          formdata.append('id', id)
          formdata.append('name', this.RoleForm.name)
          formdata.append('description', this.RoleForm.description)
          formdata.append('permissions', this.RoleForm.permissions)
          formdata.append('token', store.getters.token)
          let url
          id ? url = store.getters.api_route + 'role/update' : url = store.getters.api_route + 'role/store'

          this.axios
            .post(url, formdata, config)
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
                  message: this.$t(res.data.message),
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
      if (type === 'grades') {
        if (this.checkAll_grades === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.grades))
        } else {
          this.grades.forEach((column, index) => {
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
        this.isIndeterminate_grades = false
      } else if (type === 'classes') {
        if (this.checkAll_classes === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.classes))
        } else {
          this.classes.forEach((column, index) => {
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
        this.isIndeterminate_classes = false
      } else if (type === 'sections') {
        if (this.checkAll_sections === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.sections))
        } else {
          this.sections.forEach((column, index) => {
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
        this.isIndeterminate_sections = false
      } else if (type === 'subjects') {
        if (this.checkAll_subjects === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.subjects))
        } else {
          this.subjects.forEach((column, index) => {
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
        this.isIndeterminate_subjects = false
      } else if (type === 'students') {
        if (this.checkAll_students === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.students))
        } else {
          this.students.forEach((column, index) => {
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
        this.isIndeterminate_students = false
      } else if (type === 'teachers') {
        if (this.checkAll_teachers === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.teachers))
        } else {
          this.teachers.forEach((column, index) => {
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
        this.isIndeterminate_teachers = false
      } else if (type === 'parents') {
        if (this.checkAll_parents === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.parents))
        } else {
          this.parents.forEach((column, index) => {
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
        this.isIndeterminate_parents = false
      } else if (type === 'settings') {
        if (this.checkAll_settings === true) {
          this.RoleForm.permissions = this.removeDuplicates(this.RoleForm.permissions.concat(this.settings))
        } else {
          this.settings.forEach((column, index) => {
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
        this.isIndeterminate_settings = false
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

    handleCheckedGradeChange(value) {
      // console.log(value)
      const checkedCount = value.length
      checkedCount === this.grades.length ? this.checkAll_grades = true : this.checkAll_grades = false
      checkedCount > 0 && checkedCount < this.grades.length ? this.isIndeterminate_grades = true : this.isIndeterminate_grades = false

      // this.checkAll_grades = checkedCount === this.grades.length
      // this.isIndeterminate_grades = checkedCount > 0 && checkedCount < this.grades.length
    },
    handleCheckedClassesChange(value) {
      // console.log(value)
      const checkedCount = value.length
      // checkedCount === this.classes.length ? this.checkAll_classes = true : this.checkAll_classes = false
      // checkedCount > 0 && checkedCount < this.classes.length ? this.isIndeterminate_classes = true : this.isIndeterminate_classes = false

      this.checkAll_classes = checkedCount === this.classes.length
      this.isIndeterminate_classes = checkedCount > 0 && checkedCount < this.classes.length
    },
    handleCheckedSectionsChange(value) {
      // console.log(value)
      const checkedCount = value.length
      // checkedCount === this.sections.length ? this.checkAll_sections = true : this.checkAll_sections = false
      // checkedCount > 0 && checkedCount < this.sections.length ? this.isIndeterminate_sections = true : this.isIndeterminate_sections = false

      this.checkAll_sections = checkedCount === this.sections.length
      this.isIndeterminate_sections = checkedCount > 0 && checkedCount < this.sections.length
    },
    handleCheckedSubjectsChange(value) {
      // console.log(value)
      const checkedCount = value.length
      // checkedCount === this.subjects.length ? this.checkAll_subjects = true : this.checkAll_subjects = false
      // checkedCount > 0 && checkedCount < this.subjects.length ? this.isIndeterminate_subjects = true : this.isIndeterminate_subjects = false

      this.checkAll_subjects = checkedCount === this.subjects.length
      this.isIndeterminate_subjects = checkedCount > 0 && checkedCount < this.subjects.length
    },
    handleCheckedStudentsChange(value) {
      // console.log(value)
      const checkedCount = value.length
      // checkedCount === this.students.length ? this.checkAll_students = true : this.checkAll_students = false
      // checkedCount > 0 && checkedCount < this.students.length ? this.isIndeterminate_students = true : this.isIndeterminate_students = false

      this.checkAll_students = checkedCount === this.students.length
      this.isIndeterminate_students = checkedCount > 0 && checkedCount < this.students.length
    },
    handleCheckedTeachersChange(value) {
      // console.log(value)
      const checkedCount = value.length
      // checkedCount === this.teachers.length ? this.checkAll_teachers = true : this.checkAll_teachers = false
      // checkedCount > 0 && checkedCount < this.teachers.length ? this.isIndeterminate_teachers = true : this.isIndeterminate_teachers = false

      this.checkAll_teachers = checkedCount === this.teachers.length
      this.isIndeterminate_teachers = checkedCount > 0 && checkedCount < this.teachers.length
    },
    handleCheckedParentsChange(value) {
      // console.log(value)
      const checkedCount = value.length
      // checkedCount === this.parents.length ? this.checkAll_parents = true : this.checkAll_parents = false
      // checkedCount > 0 && checkedCount < this.parents.length ? this.isIndeterminate_parents = true : this.isIndeterminate_parents = false

      this.checkAll_parents = checkedCount === this.parents.length
      this.isIndeterminate_parents = checkedCount > 0 && checkedCount < this.parents.length
    },
    handleCheckedSettingsChange(value) {
      // console.log(value)
      const checkedCount = value.length
      // checkedCount === this.settings.length ? this.checkAll_settings = true : this.checkAll_settings = false
      // checkedCount > 0 && checkedCount < this.settings.length ? this.isIndeterminate_settings = true : this.isIndeterminate_settings = false

      this.checkAll_settings = checkedCount === this.settings.length
      this.isIndeterminate_settings = checkedCount > 0 && checkedCount < this.settings.length
    }

  }
}
</script>
<style lang="scss" scoped>

  .el-form-item {
    margin-left: 0;
    margin-bottom: 5px;
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
      border-radius: 0;
      border-bottom: 1px solid #bfcbd9;
    }
  }

  .tab-container {
    margin: 30px;
  }

</style>
