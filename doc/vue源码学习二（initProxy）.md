# initProxy

initProxy可以在顶部的引用看到，是在src\core\instance\proxy.js中。我们打开文件，可以发现整个文件也就只有配置好代理这一个功能，代码比较简单。

我们先看被暴露出去initProxy函数，

    initProxy = function initProxy (vm) {
        if (hasProxy) {
            // determine which proxy handler to use
            const options = vm.$options
            const handlers = options.render && options.render._withStripped
                ? getHandler
                : hasHandler
            vm._renderProxy = new Proxy(vm, handlers)
        } else {
            vm._renderProxy = vm
        }
    }

hasProxy在上面可以找到，就是判断Proxy是否存在并且是不是原生的代理构造函数。

然后开始判断是否配置了render渲染函数，根据结果不同，分别创建拦截has或者拦截get并做处理的代理对象。

同样，在上面我们可以找到hasHandler和getHandler的代码。

hasHandler主要任务是做一个hasProperty的拦截筛选，在属性为'_'开头的私有属性或者属于allowedGlobals中规定的全局变量时，返回false；同时，当属性不存在，并且不是 _ 开头的私有属性或者属于allowedGlobals中规定的全局变量时，warnNonPresent控制台作出不存在的警告。

getHandler主要任务是在进行get操作不存在的属性时，warnNonPresent控制台作出不存在的警告。

allowedGlobals和warnNonPresent，都是在代码上方定义的函数。
    
    const allowedGlobals = makeMap(
        'Infinity,undefined,NaN,isFinite,isNaN,' +
        'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
        'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
        'require' // for Webpack/Browserify
    )

    const warnNonPresent = (target, key) => {
        warn(
        `Property or method "${key}" is not defined on the instance but ` +
        'referenced during render. Make sure that this property is reactive, ' +
        'either in the data option, or for class-based components, by ' +
        'initializing the property. ' +
        'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
        target
        )
    }

makeMap的定义位置想按图索骥找起来，还挺麻烦的，因为工具函数在暴露的时候，好多用了import*，这里需要多搜索下代码，可以找到在src/shared/util.js中。主要功能注释已经写得很清楚了，就是根据输入的字符串，创建一个map，并返回一个可以验证输入值是否属于该map的函数。还可以设定是否无视大小写。

warn的定义位置在src\core\util\debug.js中，主要功能也很简单，在有自定义的warnHandler时，就调用，在没有自定义的warnHandler时，就在控制的告警报错。warn的代码里面也调用了一个工具函数generateComponentTrace。其定义就在文件底部，作用就是返回warn传入的vm的调用堆栈，用于在报错时展示出来。

至此，initProxy的全部功能就结束了，但是在proxy.js这个文件里，还顺便做了点其他的事情。

    if (hasProxy) {
        const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact')
        config.keyCodes = new Proxy(config.keyCodes, {
        set (target, key, value) {
            if (isBuiltInModifier(key)) {
                warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`)
                return false
            } else {
                target[key] = value
                return true
            }
        }
        })
    }

就顺便检测了一下config.keyCodes,禁止将其设置'stop,prevent,self,ctrl,shift,alt,meta,exact'等。