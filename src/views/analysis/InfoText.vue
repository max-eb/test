<template>
  <baidu-map class="map" :center="{lng: 116.404, lat: 39.915}" :zoom="15">
    <bm-info-window :position="{lng: 116.404, lat: 39.815}" title="Info Window Title" :close-on-click="false" :show="infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen">
      <p v-text="infoWindow.contents" />
      <button @click="clear">Clear</button>
    </bm-info-window>
    <!--    <bm-info-window :position="{lng: 116.404, lat: 39.815}" title="Info Window Title" :show="infoWindow.show" @close="infoWindowClose" @open="infoWindowOpen">-->
    <!--      <p v-text="infoWindow.contents"></p>-->
    <!--      <button @click="clear">Clear</button>-->
    <!--    </bm-info-window>-->
  </baidu-map>
</template>

<script>
export default {
  data() {
    return {
      infoWindow: {
        show: true,
        contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    }
  },
  methods: {
    infoWindowClose(e) {
      this.infoWindow.show = false
    },
    infoWindowOpen(e) {
      this.infoWindow.show = true
    },
    clear() {
      this.infoWindow.contents = ''
    }
  }
}
</script>

<style>
  .map {
    height: 600px;
  }

</style>
