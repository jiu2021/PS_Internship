<template>
  <div id="app">
    <WaterfallFlow :imgListProp="imgList" :columnCountProp="4" :columnGapProp="10">
      <div slot="userDefined" class="slot">
        <span class="copyright">图片来源www.baidu.com</span>
      </div>
    </WaterfallFlow>
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
    height: auto;
  }

  .copyright {
    font-size: 0.5rem;
    color: rgb(0,0,0,0.4);
  }

  .slot {
    text-align: center;
  }
</style>
