<template>
  <div class="flow-wrapper">
    <ul class="flow-container">
      <li v-for="img in imgList" :key="img.id" class="flow-item" ref="imgWrapper" :style="{'width':newImgWidth+'px'}">
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
      imgList:[],
      newImgWidth:''
    }
  },
  updated() {
    const windowWidth =  document.documentElement.clientWidth;
    this.initLayoutArr(windowWidth,this.columnCount,this.columnGap);
  },
  methods:{
    initLayoutArr(windowWidth,columnCount,columnGap) {
    //先置空视图抽象数组
    this.layoutArr = [];
    let imgList = this.imgList;
    let imgWrapper = this.$refs.imgWrapper;
    let layoutArr = this.layoutArr;
    this.newImgWidth = Math.round(windowWidth/columnCount);
    let newImgWidth = this.newImgWidth;

    imgList.forEach(async(item,index)=>{
      let img = new Image();
      img.src = item.imgUrl;
      //同步阻塞加载，防止异步回调造成乱序排列
      await new Promise(resolve=>{
        img.onload = (e) => {
          if (e.type == 'load'){
            //计算图片新宽高度，并加入数组
            item.imgWidth = newImgWidth;
            item.imgHeight = Math.round(img.height * item.imgWidth / img.width);
          }
          else{ 
            //图片加载失败，给一个默认高度50
            item.imgHeight = 50;
            console.log("index： ", index, "， 加载报错：", e);
          }
          if(index < columnCount) {
            //首行，先放图再更新视图抽象数组
            imgWrapper[index].style.left = index * (newImgWidth + columnGap) + 'px';
            layoutArr[index] = [item.imgHeight];
          }else {
            //后续行
            let columnLength = layoutArr[0].reduce((pre,cur)=>pre+cur,0);
            let shortestIndex = 0;
            layoutArr.forEach((Item,Index)=>{
              if(Item.reduce((pre,cur)=> pre+cur,0) < columnLength){
                shortestIndex = Index;
                columnLength = Item.reduce((pre,cur)=> pre+cur,0);
              }
            });
            imgWrapper[index].style.left = shortestIndex * (newImgWidth + columnGap) + 'px';
            imgWrapper[index].style.top = columnGap * layoutArr[shortestIndex].length + columnLength + 'px';
            layoutArr[shortestIndex].push(item.imgHeight);
          }
          resolve();
        };
      })
    })

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
    }
  }
}
</script>

<style scoped>
  .flow-wrapper {
    width: 100%;
    height: 100%;
  }

  .flow-container {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 3px;
  }

  .flow-item {
    position: absolute;
    top:0;
    left: 0;
    height: auto;
    box-sizing: border-box;
  }

  .item-img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
</style>