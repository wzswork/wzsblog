

var b = 1;

function c(){
    return function(){
        console.log(b)
    }
}

let a = c();

a();
b = 2;
a();

// b();