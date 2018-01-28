
function A(){
    this.c = 3;
    return {
        a:1,
        b:2
    };
}

var a = new A();
console.log(a);