<template>
  <div class="trip-mode-container">
    <el-table :key="key" :data="tableData" fit highlight-current-row style="width: 100%">
      <el-table-column prop="id" label="人员编号" width="180" />
      <el-table-column prop="stime" label="出发时间" width="180" />
      <el-table-column prop="etime" label="结束时间" width="180" />
      <el-table-column prop="label" label="出行方式" width="180" />
      <el-table-column prop="from" label="出发地" width="180" />
      <el-table-column prop="to" label="目标地" width="180" />
    </el-table>
  </div>
</template>

<script>
import { getResource } from '@/utils/axios-util'

export default {
  name: 'TripMode',
  data() {
    return {
      tableData: []
    }
  },
  mounted() {
    getResource('http://666b0ef6.ngrok.io/v1/system/Travel_label').then((response) => {
      const { data } = response
      const tableData = data.map((dataItem) => {
        const sth = parseInt(dataItem.sttime / 60)
        const stm = parseInt(dataItem.sttime % 60)
        const enh = parseInt(dataItem.entime / 60)
        const enm = parseInt(dataItem.entime % 60)

        let labelText
        switch (dataItem.labels) {
          case 2: labelText = '骑行'; break
          case 3: labelText = '公交'; break
          case 4: labelText = '驾车'; break
          case 5: labelText = '步行'; break
          default: labelText = '地铁'
        }

        return {
          id: dataItem.id,
          stime: `0${sth}`.slice(-2) + ':' + `0${stm}`.slice(-2),
          etime: `0${enh}`.slice(-2) + ':' + `0${enm}`.slice(-2),
          label: labelText,
          from: `${dataItem.stlon},${dataItem.stlat}`,
          to: `${dataItem.enlon},${dataItem.enlat}`
        }
      })
      this.tableData = tableData
    })
  }
}
</script>

<style scoped>
  .trip-mode-container {
    width: 100%;
    height: 600px;
    padding: 20px;
  }
</style>
