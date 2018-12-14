// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//ps:Vue是异步执行 DOM 更新 所以无法立刻对dom数据操作（虚拟dom还没创建完且无法直接对dom操作）（异步更新队列）
//解决方法：Vue.nextTick(callback) 。这样回调函数在 DOM 更新完成后就会调用。
//具体在写一个demo 感受一下

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
let vm =new Vue({
  el: '#app',
  components: { App },
  // template: '<App/>',
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
      this.axios.post(CROSS_URL+'https://api.douban.com/v2/movie/in_theaters',{
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(function(res){
          console.log('res',res.data.subjects[0]);
          this.img = res.data.data.img;
        }.bind(this))
        .catch(function(err){
          if(err.response) {
            console.log(err.response)
          }
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
    
    //应用情景：暂无
  },
  created(){
    //常用
    //组件实例创建完成,属性已绑定,   但**DOM***还未生成,$el属性还不存在!
    //可以调用数据和实例方法
    // console.log('created',this.msg,this.getList());  //data信息 方法返回值
    // console.log('created',document.querySelectorAll('li').length);  //1 

    //应用情景：提前渲染接口的数据 axios等  异步数据的请求适宜在create钩子函数里调用
    this.getAxios();   
    //或者初始化     
    this.init();
    // console.log('this.$el',this.$el); //undefined
  //模拟异步获取数据
    setTimeout(()=>{
      // console.log('mounted-this',this); //vue      
      this.arr = [4,5,6,7] //进行数据修改  长度应该是4，但是因为异步返回的数据无法立刻进行操作还是操作之前的（目前是这么理解的不确定对错orz）
      console.log('created-异步数据操作1',document.querySelectorAll('li').length); //异步队列导致的输出是3
      this.$nextTick(() => {
        //进行单次局部操作 同时dom操作
        console.log('单次局部操作1',document.querySelectorAll('li').length); //4
      })
    },0)
    //为什么异步处理数据不建议于update里的情况
    //update 几次数据会进行几次操作 无法进行局部数据操作 或者最后一次数据操作
    setTimeout(()=>{
      this.arr = [14,15,16,17,11]
      console.log('created-异步数据操作2',document.querySelectorAll('li').length); //异步队列导致的输出是4
      this.$nextTick(()=>{
        //进行单次局部操作 同时dom操作
        console.log('单次局部操作2',document.querySelectorAll('li').length);
      })
    },1000)    
  },
  beforeMount(){
    //此时的el还未对数据进行渲染.(虚拟dom的内容)
    // console.log('beforeMount',document.querySelectorAll('li').length);  //1 
  },
  mounted(){
    //常用
    //初始相应的数据已经在dom渲染完毕了,可以获取到dom
    //已将数据渲染到真实dom
    //应用情景：挂载元素内dom节点的获取
    // console.log('mounted',document.querySelectorAll('li').length);  //3
    // console.log('this.$el',this.$el); //<div id="app">balabala</div>
  },
  beforeUpdate(){
    console.log('beforeUpdate',document.querySelectorAll('li').length); //3
  },
  updated(){
    //不建议异步获取的数据的dom在此处操作 无法进行局部数据操作 或者最后一次数据操作
    //应用：*每一次数据*更新完毕可以在此处操作 对数据更新做统一处理 但是不同数据做不同处理不可在此
    //ps:Vue是异步执行 DOM 更新 所以无法立刻对dom数据操作（虚拟dom还没创建完且无法直接对dom操作）（异步更新队列）
    //解决方法（如何分别处理）：Vue.nextTick(callback) 。这样回调函数在 DOM 更新完成后就会调用。
    //在组件内使用 vm.$nextTick() 实例方法特别方便，因为它不需要全局 Vue ，并且回调函数中的 this 将自动绑定到当前的 Vue 实例上
    console.log('updated',document.querySelectorAll('li').length); //如果是多次异步数据请求时候 第一次的数据4 和第二次的数据5 运行两次。 
  },
  beforeDestroy(){
    //注意要全局调用
    console.log('beforeDestroy');
  },
  destroyed(){
    //注意要全局调用
    console.log('destroyed');
  },
  watch:{//监听某一属性 当属性变化时候进行操作。
        //对具体某个数据变化进行统一处理 ps:$nextTick()为某个数据的某次变化
    'arr':function () {
      
    }
  }
})

// vm.$destroy();