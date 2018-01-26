# JS的数据类型

## JS基础数据类型
js的基本数据类型有哪些是个经常被问到的问题，在过去，我们一般会回答有这么几种：number string boolean undefined 和 null。但是ES6给了我们新的一个基础数据类型symbol类型。

### number类型
如果了解过其他非弱类型语言，可以明白，JS的number类型包含整型和双精度浮点型两种数字，在进行运算时JS引擎会自动在两者之间进行转换。由于浮点数所占空间是整数的两倍，所以js会时刻准备着将浮点数转换为整数。
整数数据除了默认的十进制数据以外，还存在用字面量直接表示二进制、八进制和十六进制的方式。
* 二进制 0b1111
* 八进制 0o1234 (还有01234这种直接以0开头表示八进制数的方式，但是已在ES6中被废止)
* 十六进制 0x1abc
虽然字面量存在不同进制的表现，但是运算过程仍旧是统一为十进制运算

浮点型数据是双精度，最高精度为17位小数。之前也说过，由于所占空间较大，如果你的number数据是类似1.0这种，会被直接转化为整数存储。浮点数据也可以用科学计数法来表示数字，如3.45e5 就表示345000。
同样，浮点数据也有几乎所有语言都存在的计算精度问题，对于一些数值是无法测试的，最有名的例子就是0.1+0.2是不等于0.3，而等于0.30000000000000004。所以最好不要写出类似
    
    if(0.1+0.2 == 0.3){ //false
        //do something
    }
这种代码来。

number类型还存在几个特殊的值，+infinity、-infinity和NaN（not a number）。
number类型所能存储的数值也是有限的，会有一个最大数和一个最小数，根据浏览器的实现不同可能会有差异，但是用Number.MAX_VALUE、Number.MIN_VALUE可以分别取到。当你的计算值大于或小于极限值时，就会出现infinity（例如1/0，-1/0）。当你的数值运算出现了非法值的时候就会出现NaN（例如 0/0），或者当对一个无法转换为数值的值进行强制转换时，也会出现NaN（例如 parseInt("abc")）。

### String 类型
以V8引擎为例，js的底层是基于C++的，虽然JS的String量并不再规定是使用 '' 或 "", 但String类型的本质仍然是一个经过封装的const char* 类型的数据，所以String类型的数据一旦创建后，是无法改变的。我们的用法只能将原有字符串销毁并创建一个新的字符串。
同时String类型也是一个在JS中使用十分广泛的类型，除了null和undefined以外的其他值都拥有toString方法将其转变为字符串类型。
String也拥有丰富的操作方法，进行拼接，截取等操作。
同时JS现在也支持utf-16编码来表示字符，"\uabcd"、"\u1234\u1234"等等。

### boolean类型
boolean类型只有两个值 true和false。在js中只有小写的才是boolean值，大写不是。
此类型只需要注意一下各种值在被强制转换为boolean值时的情况即可。
数据类型||false||true
number||0和NaN||非0数值，包括infinity
object||null||除了null以外的所有对象
String||空字符串""||非空字符串
undefined||undefined||-

### undefined和null
undefined和null，有些类似，在相等检测时 undefined == null （true）
但是二者用途是不一样的，null是一个空对象指针，当我们想将某个量置空，或者手动解除其引用以便垃圾回收时，可以将其设置为null。
同时也因为null是一个空对象指针，我们在用typeof 判断其数据类型时，得到的并不是"null"，而是"object"。
而undefined则是当一个变量被声明了，却没有初始化时的值。虽然我们使用typeof去判断一个声明了却未初始化的变量和判断一个不存在的未声明过的变量时得到的都是undefined，但是二者还是有区别的，你在直接使用一个未声明过的变量时，代码会报错。

### symbol
Symbol数据类型是ES6新标准给出的一个新的基本数据类型，在我的理解来看，它没有一个能很直观看到的值，只有一个描述和一个引用。 描述和引用都可能重复，但是每一个Symbol值都是独一无二的。
我当初看阮一峰老师的es6基础的时候，我感觉委员会为了能随心所遇的添加新方法也是拼了，搞出了这么一个东西。例如迭代器iterator，这个名字实在是太普遍了，委员会这次推出了官方标准的iterator，为了不影响到历史代码的正常运行，便使用了[Symbol.iterator]来作为迭代器的方法名。
不过这个东西也不单单就是为了迭代器推出的，其设定一个独一无二的值作为方法名的手段，在我们写模块，写组件，写工具的时候也十分实用，妈妈再也不用但是我在全局注册的变量，注册的组建名，模块名被人覆盖，被人污染了！
Symbol的简单使用如下：

    let s = Symbol("a new symbol"); //其中s是Symbol的引用， 括号中的参数是symbol的描述。描述可有可无。
    s.toString(); // Symbol(a new symbol)  调用toString()得到的也不是symbol的值，而是创建时候的字面量。
    let s1 = Symbol('a'), s2 = Symbol('a');  // 即使是同样的描述，或者同样不带描述，所创建的两个symbol量也是不相等的。
需要注意的是，在使用symbol量作为属性名时，不可以使用obj.someSymbol的形式，只能使用obj[someSymbol]。同时symbol名的方法属性是不可被遍历。(for in, for of, stringfy, Object.keys, getOwnPropertyNames等等都无法获取到symbol属性名)，但是又一个专门的Object.getOwnPropertySymbols方法可以用来获取所有symbol方法名，其返回值是一个数组。

有时候可能会需要对同一个symbol在不同的地方多次引用，有Symbol.for()和Symbol.keyFor()两个方法。

    let s1 = Symbol.for('s1');
    let s2 = Symbol.for('s1');
    let s3 = Symbol.keyFor(s1);
    <!-- s1 === s2 === s3，同一个symbol -->
    let s4 = Symbol('s4');
    let s5 = Symbol.keyFor(s4); //undefined
    <!-- s4 != s5 只有用for登记过的symbol才可以用keyFor获取 -->
需要注意的是，Symbol.for为 Symbol 值登记的名字，是全局环境的，可以在不同的 iframe 或 service worker 中取到同一个值。


## JS引用数据类型，object
 除了

