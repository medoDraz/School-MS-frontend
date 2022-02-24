<template>
  <div>
    <el-row :gutter="30" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('/user_management/users')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{ $t('users') }}
            </div>
            <count-to :start-val="0" :end-val="userscount" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('/user_management/roles')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="documentation" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              {{ $t('roles') }}
            </div>
            <count-to :start-val="0" :end-val="rolescount" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <!--      <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">-->
      <!--        <div class="card-panel" @click="handleSetLineChartData('/setting/cafeterias')">-->
      <!--          <div class="card-panel-icon-wrapper icon-shopping">-->
      <!--            <svg-icon icon-class="shopping" class-name="card-panel-icon" />-->
      <!--          </div>-->
      <!--          <div class="card-panel-description">-->
      <!--            <div class="card-panel-text">-->
      <!--              Cafeterias-->
      <!--            </div>-->
      <!--            <count-to :start-val="0" :end-val="stores" :duration="3600" class="card-panel-num" />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </el-col>-->
      <!--      <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">-->
      <!--        <div class="card-panel" @click="handleSetLineChartData('/groups/index')">-->
      <!--          <div class="card-panel-icon-wrapper icon-message">-->
      <!--            <svg-icon icon-class="chart" class-name="card-panel-icon" />-->
      <!--          </div>-->
      <!--          <div class="card-panel-description">-->
      <!--            <div class="card-panel-text">-->
      <!--              Groups-->
      <!--            </div>-->
      <!--            <count-to :start-val="0" :end-val="groups" :duration="3600" class="card-panel-num" />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </el-col>-->
      <!--      <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">-->
      <!--        <div class="card-panel" @click="handleSetLineChartData('/Items/index')">-->
      <!--          <div class="card-panel-icon-wrapper icon-money">-->
      <!--            <svg-icon icon-class="money" class-name="card-panel-icon" />-->
      <!--          </div>-->
      <!--          <div class="card-panel-description">-->
      <!--            <div class="card-panel-text">-->
      <!--              Items-->
      <!--            </div>-->
      <!--            <count-to :start-val="0" :end-val="items" :duration="3600" class="card-panel-num" />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </el-col>-->
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import store from '@/store'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      langs: ['ar', 'en'],
      userscount: 0,
      rolescount: 0,
      stores: 0,
      items: 0,
      groups: 0
    }
  },
  created() {
    // this.getData()
  },
  methods: {
    handleSetLineChartData(type) {
      // console.log( type)
      this.$router.push({ path: type })
    },
    getData() {
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
      this.axios.post(store.getters.api_route + 'cafeteria/dashboard1', formdata, config)
        .then(res => {
          // console.log(res.data.data)
          this.userscount = res.data.data.userscount
          this.rolescount = res.data.data.rolescount
          this.stores = res.data.data.stores
          this.items = res.data.data.items
          this.groups = res.data.data.groups
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
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

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
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
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

@media (max-width:550px) {
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
