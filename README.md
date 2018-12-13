# lifecyclehook

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
ps:$els为 DOM 元素注册一个索引，方便通过所属实例的 $els 访问这个元素
我的理解：$els类似于document.querySelector(' ')的功能,可以拿到指定的dom元素。

了解Vue生命周期的一个小demo
测试各个周期的状态：

1.触发beforeCreate(){
  此时$route对象是存在的，可以根据路由信息进行重定向之类的操作（待研究）。
  此时组件实例刚被创建,此时无法访问到 el 属性和 data 属性等；
  this.msg（data属性）-> undefined
  this.getList() -> not a function
}

2.对data进行双向绑定,初始化方法(Observer Data && init events)
当一个vue被创建后，它就会向vue的响应式系统里添加它data对象中能的所有属性：
利用es5的！Object.defineProperty！,来遍历data对象下的属性，将其转化为getter/setter，以便于拦截对象赋值于取值操作，
进而实现数据双向绑定。
将methods下的方法init，进行声明。
最后将methods下的方法和data下的属性通过遍历和利用 es5 特性 Object.defineProperty代理到实例下。
如下：
this.a = this.$data.a = this.data.a;
this.fn = this.$methods.fn = this.methods.fn; 

3.触发created(){
  //常用
  此时vue对象已创建完毕。属性可以获取。但是此时的dom对象还未生成，$el属性还不存在。
  this.msg -> 定义的data。
  this.fn -> 已是方法。
  但是页面还没有dom元素 即{{item}}还未挂载元素。
  this.$el -> undefined

  //应用情景：提前渲染接口的数据 axios等  异步数据的请求 适宜在create钩子函数里调用
}

4.将模版编译成函数
将模版template编译成AST树，render函数
返回一个vdom(虚拟dom)

5.触发beforeMount(){
  此时的el还未对数据进行渲染.(虚拟dom的内容)
  this.$el -> <div id="app">{{message}}</div>
}

6.触发mounted(){
  //常用
  模版编译，挂载后。
  此时已经将数据渲染进去了。
  this.$el -> <div id="app">内容</div>
  应用场景：依赖于DOM的代码就放在这里吧~比如监听DOM事件
}

7.此时更新一下数据。改变msg

8.触发beforeUpdate(){
  组建更新前。
}

9.重新渲染虚拟dom，并通过diff算法比较差异更新真实dom

10.触发update(){
  此时数据已成为新的。
  但是注意⚠️ 不建议异步获取的数据的dom在此处操作 无法进行局部数据操作 或者最后一次数据操作
  但是如果想进行数据统一处理，可在此处。
  （1）如果想区分不同的数据更新使用NextTick函数，针对每一次变化做不同的处理，更新数据后立即操作dom。
  （2）watch则是对具体的属性，当他更新的时候，触发。监听具体数据的变化，并做相应的处理。
}

11.在外部调用vm.$destroy();

12.触发beforeDestroyed(){
  
}
13.触发destroyed(){
  
}


异步数据的请求适合在created的钩子函数中使用，例如请求数据，初始化。

所有数据更新完毕：如果对数据更新做统一处理，在updated钩子函数中做。
如果想区分不同的数据更新使用NextTick函数，针对每一次变化做不同的处理，更新数据后立即操作dom。
watch则是对具体的属性，当他更新的时候，触发。监听具体数据的变化，并做相应的处理。

mounted：挂载元素内dom节点的获取。