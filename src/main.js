// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//模块化加载
import Vue from 'vue'
console.log(Vue);


import App from './App'
//global. 定义全局
global.CROSS_URL = 'https://bird.ioliu.cn/v1?url=';

//axios
import axios from 'axios';
import Qs from 'qs';
Vue.prototype.axios = axios;
Vue.prototype.qs = Qs;
// console.log(vm.$el);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  data:{
    msg:'data信息',
    img: null,
    arr: [1,2,3]
  },
  methods:{
    getList(){
      console.log('方法');
      return '方法返回值';
    },
    getAxios() {
      this.axios.post(CROSS_URL+'http://m.maoyan.com/movie/list.json?type=hot&offset=0&limit=10',{
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(function(res){
          console.log(res.data);
          this.img = res.data.data.img;
                //控制台打印请求成功时返回的数据
             //bind(this)可以不用
        }.bind(this))
        .catch(function(err){
          if(err.response) {
            console.log(err.response)
              //控制台打印错误返回的内容
          }
              //bind(this)可以不用
        }.bind(this))

    },
    init(){
      //do something
    }
  },
  beforeCreate(){
    // 组件实例刚被创建,此时无法访问到 el 属性和 data 属性等..
    // console.log('beforeCreate',this.msg,this.getList());
    //undefined not a funtion
    
    //应用情景：
  },
  created(){
    //常用

    //可以调用数据和实例方法
    // console.log('created',this.msg,this.getList());
    //data信息 方法返回值

    this.getAxios();
    //应用情景：提前渲染接口的数据 axios等  异步数据的请求适宜在create钩子函数里调用
    this.init();
    //或者初始化
  },
  beforeMount(){

  },
  mounted(){
    //常用

  },
  beforeUpdate(){

  },
  Updated(){

  },
  beforeDestroy(){

  },
  destroyed(){

  },

})
