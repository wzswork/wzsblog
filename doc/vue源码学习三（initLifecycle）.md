# initLifecycle

之前的代码已经看到，initProxy之后，就是initLifecycle。同样很方便在引用部分找到initLifecycle的定义在src\core\instance\lifecycle.js之中。

initLifecycle也是一段比较短的代码，主要任务就是给vm装配上一些属性。

我们先来看这一段代码，

    let parent = options.parent
    if (parent && !options.abstract) {
        while (parent.$options.abstract && parent.$parent) {
            parent = parent.$parent
        }
        parent.$children.push(vm)
    }



在有父组件的情况下，将vm的父组件引用存入变量$parent，并将自身的引用存入父组件的$children。但是会有一个条件，options.abstract，这是什么呢？可以在官方文档上找到，抽象组件是自身不会渲染一个 DOM 元素，也不会出现在父组件链中。就和这段代码的逻辑一样，当组件不是抽象组件时，将它放入父组件链中第一个不是抽象组件的组件的$children中，并将自身的父组件设置为该组件。


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

在这里可以统一说明下

$parent  | 指定已创建的实例之父实例，在两者之间建立父子关系。子实例可以用 this.$parent 访问父实例，子实例被推入父实例的 $children 数组中
$root    | 指定已创建实例的根组件，如果实例没有父组件，则根组件就是自身
$children| 初始化已创建实例的子组件数组
$refs    | 一个对象，持有已注册过 ref 的所有子组件或dom。PS：$refs是获取组件或者dom引用的一种方式，具体可以查阅文档
_watcher | 可以在src\core\observer\watcher.js的构造函数中找到赋值代码，就是对watcher实例对象的引用
_inactive| 用来标记组件的keep-alive状态
_directInactive| 也是表示的keep-alive组件状态的属性
_isMounted| 当前实例是否已挂载
_isDestroyed| 当前实例是否已被销毁
_isBeingDestroyed| 当前实例是否正在被销毁


至此，initLifecycle所做的事情就结束了，逻辑较为简单，可能就是初始化的属性都没带注释可能造成了一些麻烦。（笑）


