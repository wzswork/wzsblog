# vue 构造函数

## vue目录

最近准备研究学习一下vue的源码，感觉再不学3.0就出来了，就来不及了,2333。

首先先理清楚vue的基本脉络，我准备从构造函数开始。从git上clone下来的vue源码，首先找到src目录，然后打开core，这一部分就应该是vue的核心代码。

core目录下的几个文件夹，顾名思义大致可猜到分别是什么功能模块，不过我们还是先打开index.js看看代码。

    import Vue from './instance/index'

可以看到第一行就引入了Vue。看文件夹名字instance，估计我们要找的vue构造函数就在这里了。打开一看，果然如此。

## vue构造函数

    function Vue (options) {
        if (process.env.NODE_ENV !== 'production' &&
            !(this instanceof Vue)
        ) {
            warn('Vue is a constructor and should be called with the `new` keyword')
        }
        this._init(options)
    }

    initMixin(Vue)
    stateMixin(Vue)
    eventsMixin(Vue)
    lifecycleMixin(Vue)
    renderMixin(Vue)

打开index.js,代码很简单，就是返回一个vue的构造函数，以及各个组装过程的调用。Vue函数里面也只有一个在非生产环境时，没有把Vue作为构造函数调用时的报错，毫无疑问，主要工作，都放在_this.init()之中。

按照代码的运行逻辑，先看initMixin(),在顶部的import里面可以看到，代码就在src\core\instance\init.js之中。

### initMixin

init文件中，第一个函数就是initMixin，它的作用也很明显，就是给Vue对象装配了prototype._init方法，也就是我们之前在构造函数中所调用this._init。然后让我们看看_init具体是什么。

    const vm: Component = this
    // a uid
    vm._uid = uid++

前两行，先将vue对象赋值给vm，然后设置了一个私有变量_uid。uid我们可以在文件开头看到。是一个从0开始的量，所以这应该是一个用来标识每一个初始化的vue对象的自增ID。

然后接着是一段在非生产环境做性能测试用的代码。

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

mark工具函数可以在工具util/perf中找到，是调用window.performance API记录时间戳。

     // a flag to avoid this being observed
    vm._isVue = true

然后是一个_isVue标志，防止被observe。具体，可以打开observer/index，可以看到在给一个值创建observer时，做了条件判断，如果_isVue为true，就不创建。

在接着，是合并options参数的代码，同时如果是组件，就走组件参数初始化。
    
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }

组件的参数合并比较复杂，我们稍后单开一章详细分析其整个流程。

    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
istanbul是个测试代码覆盖率的工具，这行注释表示else语句不计入代码覆盖率的计算。
条件判断表明当不是生产环境时，进行代理初始化。接下来还有一连串的init等函数调用，我们先把整个vue.prototype._init方法做的事情看完，再细致研究每个初始化函数做了什么。

紧接着，将_self赋值后，就是一连串的初始化操作，

    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

这里我们也先留着之后再分析，除了初始化操作以外，还插入了调用生命周期函数的callHook。
接着的一段代码，又是一段在非生产环境中打时间戳测试性能的代码。不贴出来了。

在_init的最后，调用了一下vm.$mount，可以在API说明中看到是用来挂载实例的，这里也看不出这个方法是在哪里声明的，只能等我们看完各式init函数之后才能知道了。

到现在，整个vue.prototype._init所做的事情基本就结束了，衍生开来，如前文所言，构造函数所做的主要工作，就是调用了一下这个_init方法,所以也可以说构造函数运行到此就结束了。
接下来，就要进入各个具体的initXXX中细看了。