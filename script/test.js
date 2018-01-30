

var b = {
    a:2
}

function loga(){
    console.log(this.a)
}




var geta = loga.bind(b);

var a = {
    a:1,
    printa: geta
}

a.printa();