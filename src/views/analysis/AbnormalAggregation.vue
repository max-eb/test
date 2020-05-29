<template>
  <div class="root-container">
    <div class="toolbar-container">
      <div class="toolbar-item">
        <label>异常阈值:</label>
        <input id="top-value" v-model="aggregateNumber">
      </div>
      <div class="toolbar-item">
        <label>区域半径:</label>
        <input id="circle-length" v-model="area">
      </div>

      <el-button type="text" class="check-button" @click="updateAbnormalData">查看</el-button>
      <!--      <button class="check-button" v-on:click.native="updateAbnormalData">查看</button>-->
    </div>
    <div class="body-container">
      <baidu-map class="heat-map-container" :center="{lng: 123.473215, lat: 41.680601}" :zoom="11">
        <bml-heatmap :data="heatData" :max="100" :radius="20" />
      </baidu-map>

      <div class="aggregation-table-container">
        <el-table :key="key" :data="rawData" fit highlight-current-row style="width: 100%">
          <el-table-column prop="time" label="时间" width="60" />
          <el-table-column prop="lng" label="经度" width="180" />
          <el-table-column prop="lat" label="纬度" width="180" />
          <el-table-column prop="count" label="人数" width="60" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { createResource } from '@/utils/axios-util'
import { BmlHeatmap } from 'vue-baidu-map'
export default {
  name: 'AbnormalAggregation',
  components: {
    BmlHeatmap
  },
  data() {
    return {
      heatData: [],
      aggregateNumber: '10',
      area: '1500',
      rawData: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData: function(a, c) {
      const aggregateNumber = a || `10`
      const area = c || '1500'
      createResource('http://666b0ef6.ngrok.io/v1/system/Abnormal_aggregation',
        { 'Aggregate_number': aggregateNumber, area: area }
      ).then((response) => {
        const { data } = response
        const heatData = data.map((dataItem) => {
          return {
            lng: parseFloat(dataItem.lon),
            lat: parseFloat(dataItem.lat),
            count: parseInt(dataItem.counts) * 50
          }
        })
        console.log('heatData:', heatData)
        this.heatData = heatData

        const rawData = data.map((dataItem) => {
          const time = parseInt(dataItem.time)
          const h = parseInt(time / 60)
          const m = parseInt(time % 60)

          return {
            time: `0${h}`.slice(-2) + ':' + `0${m}`.slice(-2),
            lng: dataItem.lon,
            lat: dataItem.lat,
            count: parseInt(dataItem.counts)
          }
        })
        this.rawData = rawData
      })
    },
    updateAbnormalData: function() {
      console.log('clicked')
      this.getData(this.aggregateNumber, this.area)
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

  .toolbar-container {
    padding-bottom: 20px;
    display: flex;
    align-items: center;
  }

  .heat-map-container {
    width: 600px;
    height: 600px
  }

  .aggregation-table-container {
    width: 100%;
    height: 300px;

    max-width: 500px;
    margin: 0 50px;
  }

  .body-container {
    width: 100%;
    min-height: 600px;
    display: flex;
  }

  .toolbar-item {
    line-height: 50px;
    margin-right: 20px;
  }

  .check-button {
    height: 40px;
    width: 100px;
    background-color: #1a90ff;
    color: white;
    outline: none;
    border: 0;
    border-radius: 4px;
    cursor: pointer;
  }

  input, input:focus {
    height: 40px;
    border-radius: 4px;
    border: 1px solid #2333;
  }
</style>
