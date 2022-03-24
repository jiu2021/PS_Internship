import Vue from 'vue'
// @ts-ignore
import App from './App.vue'

//引入MockServe
import '../src/mock/index'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')