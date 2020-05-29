<template>
  <div class="root-container">
    <div class="toolbar-container" />
    <baidu-map class="trajectory-map-container" :center="{lng: 123.473215, lat: 41.680601}" :zoom="12">
      <bm-polyline v-for="(polyItem, key) in polylinePath" :key="key" :path="polyItem" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="1" :editing="false" />
      <!--      <bm-info-window v-for="infoItem in infoList" :position="infoItem.position" :show="true" v-bind:width="0" v-bind:height="0" @open="infoOpen">-->
      <!--        <div>-->
      <!--          <div>-->
      <!--            <span>驻留点</span>-->
      <!--            <span v-text="infoItem.residence"></span>-->
      <!--          </div>-->
      <!--          <div>-->
      <!--            <span>驻留时长: </span>-->
      <!--            <span v-html="`${infoItem.duration}` + '分钟'">2</span>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </bm-info-window>-->

      <div v-for="(item,key) in infoList" :key="key">
        <bm-marker :position="item.position" :dragging="true" @click="lookDetail(item.position, item.residence, item.duration)" />
      </div>
      <bm-info-window :position="position" :show="show" @close="infoWindowClose" @open="infoWindowOpen">
        <div>
          <div>
            <span>驻留点</span>
            <span v-text="`${residence}`" />
          </div>
          <div>
            <span>驻留时长: </span>
            <span v-html="`${duration}` + '分钟'">2</span>
          </div>
        </div>
      </bm-info-window>
    </baidu-map>
    <!--    <baidu-map class="map" :center="{lng: 116.404, lat: 39.915}" :zoom="15" :scroll-wheel-zoom="true">-->
    <!--&lt;!&ndash;      <bm-polyline :path="polylinePath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2"></bm-polyline>&ndash;&gt;-->
    <!--      <new-polyline :path="polylinePath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2"></new-polyline>-->
    <!--      <bm-info-window :position="{lng: 116.404, lat: 39.915}" :show="true" v-bind:width="0" v-bind:height="0" @open="infoOpen">-->
    <!--        <div>-->
    <!--          <div>-->
    <!--            <span>驻留点</span>-->
    <!--            <span>1</span>-->
    <!--          </div>-->
    <!--          <div>-->
    <!--            <span>驻留时长: </span>-->
    <!--            <span>2分钟</span>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </bm-info-window>-->
    <!--    </baidu-map>-->
  </div>
</template>

<script>
import { getResource } from '@/utils/axios-util'
export default {
  name: 'Residence',
  data() {
    return {
      polylinePath: [],
      infoList: [],
      show: false,
      residence: '',
      duration: ''
    }
  },
  mounted() {
    this.retrieveData()
  },
  methods: {
    lookDetail(item, res, dur) {
      this.position = item
      this.show = true
      this.residence = res
      this.duration = dur
    },
    infoWindowClose() {
      this.show = false
    },
    infoWindowOpen() {
      this.show = true
      this.infoOpen()
    },
    infoOpen: function() {
      const nodes = document.getElementsByClassName('BMap_pop')
      Array.from(nodes).forEach((nodeItem) => {
        console.log('nodeItem:', nodeItem, nodeItem.style)
        nodeItem.style.opacity = 0.6
      })
      console.log('nodes:', nodes, nodes[0])
    },
    retrieveData: function() {
      getResource('http://6eac1419e491.ngrok.io/v1/system/Residence')
        .then((response) => {
          const { data } = response
          const innerLineList = []
          data.forEach((cData) => {
            cData.line.forEach((lineItem) => {
              const lineListItem = []
              lineListItem.push({
                lng: parseFloat(lineItem[0].lon),
                lat: parseFloat(lineItem[0].lat)
              })

              lineListItem.push({
                lng: parseFloat(lineItem[1].lon),
                lat: parseFloat(lineItem[1].lat)
              })
              innerLineList.push(lineListItem)
            })
          })
          console.log('innerLineList:', innerLineList)
          this.polylinePath = innerLineList

          const infoData = []
          data.forEach((cData) => {
            const lineList = cData.line
            lineList.forEach((lineItem) => {
              infoData.push({
                residence: lineItem[0].residence,
                duration: lineItem[0].duration,
                position: {
                  lng: parseFloat(lineItem[0].lon),
                  lat: parseFloat(lineItem[0].lat)
                }
              })
              infoData.push({
                residence: lineItem[1].residence,
                duration: lineItem[1].duration,
                position: {
                  lng: parseFloat(lineItem[1].lon),
                  lat: parseFloat(lineItem[1].lat)
                }
              })
            })
          })
          console.log('infoData:', infoData)
          this.infoList = infoData
        })
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

  .trajectory-map-container, .map {
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

  .BMap_pop {
    opacity: 0.6 !important;
  }
</style>
