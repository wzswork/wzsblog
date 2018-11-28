# initEvents

接着initLifecycle的，就是initEvents的过程，事件的初始化，同样的方式，我们在src\core\instance\events.js之中找到源码。

    export function initEvents (vm: Component) {
        vm._events = Object.create(null)
        vm._hasHookEvent = false
        // init parent attached events
        const listeners = vm.$options._parentListeners
        if (listeners) {
            updateComponentListeners(vm, listeners)
        }
    }

首先，给vm._events的值赋予为一个空对象。那么_events是干什么用的呢，看字面意思好像是指事件，但其实，它内部所存储的并不是组件自身的事件，而是父组件绑定在其上的事件。假设有这么一个组件结构

    <div id="app">
        <child
        @hook:created="hookFromParent"
        @hover="hoverFromParent"
        >
        </child>
    </div>

child是app的子组件，那么在child的_events之中，只会有hook:created和hover，并不会有其自身的事件，如methods之中的事件。

接下来是vm._hasHookEvent，用来标志父元素是否用hook的方式绑定钩子函数，就类似上个例子中的@hook:created。

    listeners = vm.$options._parentListeners

从英文注释，我们看到是初始化父组件添加的事件