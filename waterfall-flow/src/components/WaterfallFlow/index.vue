<template>
  <div class="flow-wrapper">
    <ul class="flow-container" ref="flowContainer">
      <li v-for="(img,index) in imgList" :key="img.id" 
          class="flow-item" ref="imgWrapper" 
          :style="{'width':newImgWidth+'px','visibility':!isLoading ? 'visible':'hidden'}"
          v-show="nextImgIndex > index"
      >
        <div class="item-imgContainer">
          <img src="#" class="item-img" ref="img">
        </div>
        <div class="item-details">
          <h3 class="title" v-show="img.details.header">{{img.details.header}}</h3>
          <div class="about" v-show="img.details.about">{{img.details.about}}</div>
          <slot name="userDefined" class="slot"></slot>
        </div>
      </li>
    </ul>
    <ul class="skeleton-container">
      <li v-for="n in 20" :key="n" class="skeleton-item" :style="{'width':newImgWidth+'px'}" v-show="isLoading">
        <div class="item-imgContainer">
          <div class="item-img"></div>
        </div>
        <div class="item-details">
          <h3 class="title"></h3>
          <div class="about"></div>
        </div>
      </li>
    </ul>
    <div class="footer"><span v-show="isShowBottom">已经到加载到底部啦！</span></div>
  </div>
</template>

<script>
import _ from 'lodash';
import defaultImg from './images/default.png'
export default {
  name:'WaterfallFlow',
  props:['imgListProp','columnCountProp','columnGapProp','defaultImgUrlProp'],
  data() {
    return {
      layoutArr:[],
      imgList:[],
      newImgWidth:0,
      windowWidth:document.documentElement.clientWidth,
      isLoading:true,
      nextImgIndex:999,
      columnCount:0,
      columnGap:0,
      defaultImgUrl:defaultImg,
      isShowBottom:false
    }
  },

  created() {
    this.initColCount();
    this.newImgWidth = (this.windowWidth-this.columnGap*(this.columnCount+1))/this.columnCount;
  },

  mounted() {
    //监听滚动条
    window.onscroll = _.debounce(() => {
      if(this.isBottom()) this.lazyLoad();
    },200);
    //监听视口大小
    window.onresize = _.debounce(() => {
    this.windowWidth = document.documentElement.clientWidth;
    this.initColCount();
    this.newImgWidth = Math.round((this.windowWidth-this.columnGap*(this.columnCount+1))/this.columnCount);
    setTimeout(() => {
      this.resortImg();
      this.setContainerHeight();
    }, 250);
    }, 200)
  },

  methods:{
  async initLayoutArr() {
    console.log('1')
    let imgWrapper = this.$refs.imgWrapper;
    const columnCount = this.columnCount;
    const windowHeight = document.documentElement.clientHeight;
    console.log(windowHeight)
    let imgList = this.imgList;
    for(let index = 0;index < imgList.length;index++) {
      await this.loadOneImg(imgList[index].imgUrl,index);
      //可视区外停止加载
      if(index-columnCount >= 0 && parseInt(imgWrapper[index-columnCount].style.top) > windowHeight){
        this.nextImgIndex = ++index;
        break;
      }
    }
    this.isLoading = false;
  },
  
  async loadOneImg(url,index) {
    console.log(2)
    let realImgList = this.$refs.img;
    let imgList = this.imgList;
    let img = new Image();
    img.src = url;
    //同步阻塞加载，防止异步回调造成乱序排列
    await new Promise(resolve=>{
      img.onload = img.onerror = (e) => {
        if (e.type == 'load'){
          realImgList[index].src = url;
          console.log(realImgList[index],realImgList[index].clientHeight,'asfvasb')
          this.sortOneImg(index);
        }
        else{
          //图片加载失败，给一个默认图片
          imgList[index].imgUrl = this.defaultImgUrl;
          console.log("index： ", index, "， 加载报错：", e);
          //重新加载
          this.loadOneImg(imgList[index].imgUrl,index);
        }
        resolve();
      };
    });
  },

  sortOneImg(index) {
    console.log('3')
    let imgWrapper = this.$refs.imgWrapper;
    let layoutArr = this.layoutArr;
    const newImgWidth = this.newImgWidth;
    const columnCount = this.columnCount;
    const columnGap = this.columnGap;
    if(index < columnCount) {
      //首行，先放图再更新视图抽象数组
      imgWrapper[index].style.left = newImgWidth * index + index * columnGap*1.25 + 'px';
      imgWrapper[index].style.top = 0;
      console.log(imgWrapper[index],imgWrapper[index].clientHeight,'111')
      layoutArr[index] = [imgWrapper[index].clientHeight];
    }else {
    //后续行
    const {shortestIndex,columnLength} = this.getShortestCol();
    imgWrapper[index].style.left = newImgWidth * shortestIndex + shortestIndex * columnGap*1.25 + 'px';
    imgWrapper[index].style.top = columnGap * layoutArr[shortestIndex].length + columnLength + 'px';
    console.log(imgWrapper[index],imgWrapper[index].clientHeight,'22')
    layoutArr[shortestIndex].push(imgWrapper[index].clientHeight);
    }
  },

  resortImg() {
    //先置空视图抽象数组
    this.layoutArr = [];
    let imgList = this.imgList;
    for(let index = 0 ; index < imgList.length || index < this.nextImgIndex ; index++) {
      this.sortOneImg(index);
    }
  },

  async lazyLoad() {
    const columnCount = this.columnCount;
    let nextImgIndex = this.nextImgIndex;
    const imgList = this.imgList;
    //每次加载一排
    for(let i = 0; i < columnCount;i++) {
      if(nextImgIndex < this.imgList.length) {
        this.nextImgIndex++;
        await this.loadOneImg(imgList[nextImgIndex].imgUrl,nextImgIndex);
        this.nextImgIndex = ++nextImgIndex;
      }
    }
  },

  setContainerHeight() {
    let flowContainer = this.$refs.flowContainer;
    let layoutArr = this.layoutArr;
    const columnGap = this.columnGap;
    const {longestIndex,columnLength} = this.getLongestCol();
    flowContainer.style.height = layoutArr[longestIndex].length * columnGap * 1.2 + columnLength + 'px';
  },

  getShortestCol() {
    let layoutArr = this.layoutArr;
    let columnLength = layoutArr[0].reduce((pre,cur)=> pre+cur,0);
    let shortestIndex = 0;
    layoutArr.forEach((item,index)=>{
    if(item.reduce((pre,cur)=> pre+cur,0) < columnLength){
      shortestIndex = index;
      columnLength = item.reduce((pre,cur)=> pre+cur,0);
    }
    });
    
    return {shortestIndex,columnLength};
  },

  getLongestCol() {
    let layoutArr = this.layoutArr;
    let columnLength = 0;
    let longestIndex = 0;
    layoutArr.forEach((item,index)=>{
    if(item.reduce((pre,cur)=> pre+cur,0) > columnLength){
      longestIndex = index;
      columnLength = item.reduce((pre,cur)=> pre+cur,0);
    }
    });
    
    return {longestIndex,columnLength};
  },

  isBottom() {
    //滚动条滚动时，距离顶部的距离
    var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
    //可视区的高度
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    //滚动条的总高度
    var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
    //滚动条到底部的条件
    if(scrollTop+windowHeight + 5 >= scrollHeight){
      return true;
    }else {
      return false;
    }
  },

  initColCount() {
    this.columnGap = this.columnGapProp;
    if(this.defaultImgUrlProp) {
      this.defaultImgUrl = this.defaultImgUrlProp;
    }
    if(this.windowWidth < 420) {
      this.columnCount = 2;
    }else {
      this.columnCount = this.columnCountProp;
    }
  }
  },

  watch:{
    imgListProp(value) {
      //深拷贝
      this.imgListProp.forEach(item=>{
        this.imgList.push(JSON.parse(JSON.stringify(item)))
      });
      this.$nextTick(()=>this.initLayoutArr());
    },
    nextImgIndex() {
      this.setContainerHeight();
      this.isShowBottom = this.nextImgIndex >= this.imgList.length;
    }
  }
}
</script>

<style scoped>
  .flow-wrapper {
    width: 100%;
    height: auto;
  }

  .flow-container {
    position: relative;
    width: 100%;
    margin-left:2px ;
    height: auto;
  }

  .flow-item {
    position: absolute;
    top:0;
    left: 0;
    height: auto;
    box-sizing: border-box;
    margin: .4rem;
    border-radius: .1rem;
    box-shadow:1px 1px 6px 1px var(--shadow);
    transition: all .3s;
    visibility: hidden;
  }

  .flow-item:hover {
    box-shadow:2px 2px 12px 2px var(--shadow-hover);
  }

  .item-imgContainer {
    padding: .2rem;
  }

  .item-img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .item-details {
    padding: .3rem .2rem;
  }

  .title {
    padding-bottom: .2rem;
  }

  .skeleton-container {
    display: flex;
    flex-flow: row wrap;
  }

  .skeleton-item {
    box-sizing: border-box;
    margin: .3rem;
    border-radius: .1rem;
    box-shadow:0 1px 5px 0 var(--shadow);
  }

  .about {
    font-size:.8rem;
  }

  .skeleton-item .item-img,
  .skeleton-item .title,
  .skeleton-item .about {
    background-color: var(--loading-grey);
    background-image: linear-gradient(
      100deg,
      rgba(255,255,255,0) 40%,
      rgba(255,255,255,.5) 50%,
      rgba(255,255,255,0) 60%
    );
    background-position-x: 150%;
    background-size:200% 100%;
    animation: loading 1.5s ease-in-out infinite;
  }

  .skeleton-item .title {
    height: 1.6rem;
    margin: .2rem 0;
    border-radius: 0.3rem;
    animation-delay: .05s;
  }

  .skeleton-item .about {
    height: 4rem;
    border-radius: 0.3rem;
    animation-delay: .06s;
  }
  .skeleton-item .item-img {
    height: 10rem;
    border-radius: 0.3rem;
    animation-delay: .01s;
  }

  .footer {
    width: 100%;
    height: 2rem;
    margin: 2rem 0;
    text-align: center;
    line-height: 2rem;
    font-size: 1rem ;
  }

  @keyframes loading {
    to {
      background-position-x: -20%;
    }
  }
</style>