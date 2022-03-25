<template>
  <div class="flow-wrapper">
    <ul class="flow-container">
      <li v-for="img in imgList" :key="img.id" class="flow-item" ref="imgWrapper">
        {{img.id}}
        <img :src="img.imgUrl" class="item-img" ref="img">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name:'WaterfallFlow',
  props:['imgListProp','columnCountProp','columnGapProp'],
  data() {
    return {
      layoutArr:[],
      imgList:[]
    }
  },
  created() {
  },
  beforeMount() {
  },
  mounted() {
  },
  methods:{
    initLayoutArr(windowWidth,columnCount,columnGap) {
      var imgList = this.imgList;
      imgList.forEach((item,index) => {
        var img = new Image();
        img.src = item.imgUrl;
        img.onload = img.onerror = (e)=>{
        if (e.type == 'load'){
          //计算图片新宽高度，并加入数组
          item.imgWidth = Math.round(windowWidth/columnCount-columnGap*(columnCount-1));
          item.imgHeight = Math.round(img.height * item.imgWidth / img.width);
        }
        else{ 
          //图片加载失败，给一个默认高度50
          item.imgHeight = 50;
          console.log("index： ", index, "， 加载报错：", e);
        }

        if(index < columnCount) {
          this.layoutArr[index] = [item.imgHeight];
        }else {
          let columnLength = this.layoutArr[0].reduce((pre,cur)=>pre+cur,0);
          let shortestIndex = 0;
          this.layoutArr.forEach((Item,Index)=>{
            if(Item.reduce((pre,cur)=> pre+cur,0) < columnLength){
              shortestIndex = Index;
              columnLength = Item.reduce((pre,cur)=> pre+cur,0);
            }
          });
          this.layoutArr[shortestIndex].push(item.imgHeight);
        }
      }
    });
    },
  },
  computed:{
    columnCount(){
      return this.columnCountProp;
    },
    columnGap(){
      return this.columnGapProp;
    },
  },
  watch:{
    imgListProp(value) {
      this.imgListProp = value;
      //深拷贝
      this.imgListProp.forEach(item=>{
        this.imgList.push(JSON.parse(JSON.stringify(item)))
      });
      const windowWidth =  document.documentElement.clientWidth;
      this.initLayoutArr(windowWidth,this.columnCount,this.columnGap);
    }
  }
}
</script>

<style scoped>
  .flow-wrapper {
    width: 100%;
    height: 100vh;
  }

  .flow-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .flow-item {
    position: absolute;
    width: calc(33% - 8px);
    height: auto;
    margin: 5px;
    box-sizing: border-box;
    background-color: aqua;
  }

  .item-img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
</style>