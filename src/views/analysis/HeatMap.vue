<template>
  <div class="root-map-container">
    <div>
      <div class="heat-current-time">
        <span>当前时间: </span>
        <span v-html="currentTime" />
      </div>
    </div>
    <div class="body-container">
      <baidu-map class="heat-map-container" :center="{lng: 123.473215, lat: 41.680601}" :zoom="10">
        <bml-heatmap :data="heatData" :max="100" :radius="20" />
      </baidu-map>
    </div>
  </div>
</template>

<script>
import { BmlHeatmap } from 'vue-baidu-map'
import { createResource } from '@/utils/axios-util'

export default {
  components: {
    BmlHeatmap
  },
  data() {
    return {
      heatData: [],
      currentTime: '00:00',
      innerTime: 0
    }
  },
  mounted() {
    this.updateHeatDate()
    setInterval(() => {
      this.updateHeatDate()
    }, 1000 * 60)
  },
  methods: {
    updateHeatDate: function() {
      const time = this.innerTime + 1

      if (time > 1400) return

      console.log('time:', time)
      createResource('http://d1a45080d55a.ngrok.io/v1/system/crowd_heat_map',
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
        console.log('current time:', this.currentTime)
        this.innerTime = time
      })
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
</style>
