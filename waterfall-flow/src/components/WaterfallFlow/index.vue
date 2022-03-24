<template>
  <div class="flow-wrapper">
    <ul class="flow-container">
      <li v-for="img in imgList" :key="img.id" class="flow-item" ref="img">
        {{img.id}}
        <img :src="img.imgUrl" class="item-img">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name:'WaterfallFlow',
  props:['imgList','columnSet'],
  data() {
    return {
      columnCount: 0,

    }
  },
  created() {
    this.columnCount = this.columnSet;
    const windowWidth =  document.documentElement.clientWidth;
		const windowHeight = document.documentElement.clientHeight;
  },
  mounted() {
    /*console.log(this.$refs.img);
    const imgList = Array.from(this.$refs.img);*/
  }
}
</script>

<style scoped>
  .flow-wrapper {
    width: 100%;
    height: 100vh;
  }

  .flow-container {
    display: flex;
    flex-flow: column wrap;
    column-count: 3;
    width: 100%;
    height: 400%;
  }

  .flow-item {
    display: inline-block;
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