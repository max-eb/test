<template>
  <div class="root-container">
    <div class="toolbar-container">
      <vue-timepicker v-model="timeData" format="HH:mm" input-width="100px" hide-clear-button @change="changeHandler" />
      <span class="toolbar-tip">&lt;= Click to change time</span>
    </div>
    <baidu-map class="trajectory-map-container" :center="{lng: 123.473215, lat: 41.680601}" :zoom="12">
      <bm-polyline v-for="(polyItem, key) in polylinePath" :key="key" :path="polyItem" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="10" :editing="false" />
    </baidu-map>
  </div>
</template>

<script>
import { createResource } from '@/utils/axios-util'
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue'

export default {
  name: 'Trajectory',
  components: {
    VueTimepicker
  },
  data() {
    return {
      polylinePath: [],
      innerTime: 0,
      intervalTask: null,
      timeData: {
        HH: '00',
        mm: '00'
      }
    }
  },
  mounted() {
    this.intervalTask = setInterval(() => {
      this.retrieveData()
    }, 1000 * 60)

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
    }, 1000 * 60)
  },
  methods: {
    retrieveData: function() {
      // const time = this.innerTime + 5

      const h = parseInt(this.timeData.HH)
      const m = parseInt(this.timeData.mm)
      const time = h * 60 + m

      if (time > 1400) {
        clearInterval(this.intervalTask)
      }

      createResource('http://141756eb.ngrok.io/v1/system/travel_track', { time: `${time}` })
        .then((response) => {
          const { data } = response
          const newData = data.map((cData) => {
            const gpsList = cData.track
            const newGpsList = gpsList.map((gpsPoint) => {
              return {
                lng: parseFloat(gpsPoint.lon),
                lat: parseFloat(gpsPoint.lat)
              }
            })
            return newGpsList
          })
          console.log('newData:', newData)
          this.polylinePath = newData
        })
      this.innerTime = time
    },
    changeHandler: function() {
      this.retrieveData()
    }
  }
}
</script>

<style scoped>
  .root-container {
    height: 600px;
    width: 100%;
    padding: 20px;
  }

  .trajectory-map-container {
    height: 600px;
  }

  .toolbar-container {
    padding-bottom: 20px;
  }

  .toolbar-tip {
    color: grey;
    font-size: 14px;
    margin-left: 10px;
  }
</style>
