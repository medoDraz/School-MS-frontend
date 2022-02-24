<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import store from '@/store'

const animationDuration = 5000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      data: []
    }
  },
  mounted() {
    // console.log(this.chartData())
    // this.$emit('chart-data', this.data)
    // console.log(this.orders)
    this.getData()
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
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
          var data = []
          this.orders = res.data.data.orders
          for (var i = 1; i <= 12; i++) {
            var t = 0
            res.data.data.orders.forEach(function(e) {
              if (i === Number(e.month)) {
                t = e.total_orders
              }
            })
            data.push(t)
          }
          this.data = data
          // console.log(data)
          return data
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
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '1%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Des'
          ],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: 'Sales',
          type: 'bar',
          stack: 'vistors',
          barWidth: '30%',
          data: this.data,
          animationDuration
        }]
      })
    }
  }
}
</script>
