<template>
  <div id="app">
    <WaterfallFlow :imgListProp="imgList" :columnCountProp="3" :columnGapProp="10"/>
  </div>
</template>

<script>
import WaterfallFlow from './components/WaterfallFlow/index.vue';
import {reqGetImgList} from './api/index'

export default {
  name: 'App',
  data() {
    return {
      imgList:[]
    }
  },
  components: {
    WaterfallFlow
  },
  created() {
    this.getImgList();
  },
  methods:{
    async getImgList() {
      const res = await reqGetImgList();
      if(res.code==200) {
        this.imgList = res.data;
      }
    }
  }
}
</script>

<style scoped>
  #app {
    width: 100%;
    height: 100%;
  }
</style>
