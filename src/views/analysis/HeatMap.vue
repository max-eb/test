<template>
  <div class="root-map-container">
    <div>
      <!--      <div class="heat-current-time">-->
      <!--        <span>当前时间: </span>-->
      <!--        <span v-html="currentTime" />-->
      <!--      </div>-->

      <div class="toolbar-container">
        <vue-timepicker v-model="timeData" format="HH:mm" input-width="100px" hide-clear-button @change="changeHandler" />
        <span class="toolbar-tip">&lt;= Click to change time</span>
      </div>
    </div>
    <div class="body-container">
      <baidu-map class="heat-map-container" :center="{lng: 123.473215, lat: 41.680601}" :zoom="12">
        <bml-heatmap :data="heatData" :max="100" :radius="20" />
      </baidu-map>
    </div>
  </div>
</template>

<script>
import { BmlHeatmap } from 'vue-baidu-map'
import { createResource } from '@/utils/axios-util'
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue'

export default {
  components: {
    BmlHeatmap,
    VueTimepicker
  },
  data() {
    return {
      heatData: [],
      currentTime: '00:00',
      // innerTime: 0,
      timeData: {
        HH: '00',
        mm: '00'
      }
    }
  },
  mounted() {
    this.updateHeatDate()
    setInterval(() => {
      const h = parseInt(this.timeData.HH)
      const m = parseInt(this.timeData.mm)
      let totalMinutes = h * 60 + m
      totalMinutes += 1
      if (totalMinutes > 23 * 60 + 60) {
        totalMinutes = 23 * 60 + 60
      }
      const newH = parseInt(totalMinutes / 60)
      const newM = parseInt(totalMinutes % 60)
      console.log('newH:', newH)
      console.log('newM:', newM)
      this.timeData = {
        HH: `0${newH}`.slice(-2),
        mm: `0${newM}`.slice(-2)
      }

      this.updateHeatDate()
    }, 1000 * 60)
  },
  methods: {
    updateHeatDate: function() {
      // const time = this.innerTime + 1

      const h = parseInt(this.timeData.HH)
      const m = parseInt(this.timeData.mm)
      const time = h * 60 + m

      if (time > 1400) return

      console.log('time:', time)
      createResource('http://8d2eaad5d9f9.ngrok.io/v1/system/crowd_heat_map',
        { time: `${time}` }).then((response) => {
        const { data } = response
        console.log('data:', data, typeof data[0].count)
        const newData = data.map((cData) => {
          return {
            lng: parseFloat(cData.lon),
            lat: parseFloat(cData.lat),
            count: parseInt(cData.count) * 50
          }
        })
        console.log('newData:', newData)
        this.heatData = newData
        const h = parseInt(time / 60)
        const m = time % 60
        this.currentTime = `0${h}`.slice(-2) + ':' + `0${m}`.slice(-2)
        // console.log('current time:', this.currentTime)
        // this.innerTime = time
      })
    },
    changeHandler: function() {
      this.updateHeatDate()
    }
  }
}
</script>

<style scoped>
  .root-map-container {
    height: 100%;
    width: 100%;
    padding: 20px;
  }

  .heat-map-container {
    width: 100%;
    height: 600px
  }
  body {
    margin: 0;
  }
  .body-container {
    height: auto;
  }

  .heat-current-time {
    line-height: 40px;
  }

  .toolbar-container {
    padding-bottom: 20px;
  }
</style>
