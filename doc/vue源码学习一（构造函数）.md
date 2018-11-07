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

按照代码的运行逻辑，先看initMixin(),在顶部的import里面可以看到，代码就在init.js之中。

### initMixin


