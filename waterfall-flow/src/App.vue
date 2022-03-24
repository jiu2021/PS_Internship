<template>
  <div id="app">
    <WaterfallFlow :imgList="imgList" columnSet="3"/>
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
  async created() {
    const res = await reqGetImgList();
    if(res.code==200) {
      this.imgList = res.data;
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
