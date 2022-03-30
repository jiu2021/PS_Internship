<template>
  <div id="app">
    <WaterfallFlow :imgListProp="imgList" :columnCountProp="4" :columnGapProp="10" :defaultImgUrlProp="defaultImgUrl" @doSomething="doSomething">
      <div slot="userDefined" class="slot">
        <span class="copyright">图片来源www.baidu.com</span>
      </div>
    </WaterfallFlow>
  </div>
</template>

<script>
import WaterfallFlow from './components/WaterfallFlow/index.vue';
import {reqGetImgList} from './api/index';
import defaultImg from './assets/images/default.png'//引入父组件提供的默认图
export default {
  name: 'App',
  data() {
    return {
      imgList:[],
      defaultImgUrl:defaultImg
    }
  },
  components: {
    WaterfallFlow
  },
  created() {
    //请求图片数据
    this.getImgList();
  },
  methods:{
    async getImgList() {
      const res = await reqGetImgList();
      if(res.code==200) {
        this.imgList = res.data;
      }
    },
    doSomething(...value) {
      console.log(value);
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
    overflow: hidden;
  }

  .slot {
    text-align: center;
  }
</style>
