# initLifecycle

之前的代码已经看到，initProxy之后，就是initLifecycle。同样很方便在引用部分找到initLifecycle的定义在src\core\instance\lifecycle.js之中。

initLifecycle也是一段比较短的代码，主要任务就是给vm装配上一些属性。

    let parent = options.parent
    if (parent && !options.abstract) {
        while (parent.$options.abstract && parent.$parent) {
            parent = parent.$parent
        }
        parent.$children.push(vm)
    }



在有父组件的情况下，将vm的父组件引用存入变量$parent，并将自身的引用存入父组件的$children。
将vm的$root设置成父组件的$root，如果没有父组件，那么根组件就是它自己。

接下来就是一些属性的初始化

    vm.$parent = parent
    vm.$root = parent ? parent.$root : vm

    vm.$children = []
    vm.$refs = {}

    vm._watcher = null
    vm._inactive = null
    vm._directInactive = false
    vm._isMounted = false
    vm._isDestroyed = false
    vm._isBeingDestroyed = false

