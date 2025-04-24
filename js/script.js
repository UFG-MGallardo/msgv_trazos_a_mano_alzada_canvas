var limpiar = document.getElementById("limpiar");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var cw = canvas.width = 300, cx = cw / 2;
var ch = canvas.height = 300, cy = ch / 2;

var dibujar = false;
var factorDeAlismiento = 5;
var Trazados = [];
var puntos = [];

ctx.lineJoin = "round";

limpiar.addEventListener('click', function(){
    dibujar = false;
    ctx.clearRect(0,0,cw,ch);
    Trazados.length = 0;
    puntos.length = 0;
}, false);

canvas.addEventListener('mousedown', function(){
    dibujar = true;
    puntos.length = 0;
    ctx.beginPath();
}, false);

canvas.addEventListener('mouseup', redibujarTrazados, false);

canvas.addEventListener('mouseout', redibujarTrazados, false)

canvas.addEventListener('mousemove', function(evt){
    if (dibujar){
        var m = oMousePos(canvas, evt);
        puntos.push(m);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
    }
}, false);

function reducirArray(n, elArray){
    let nuevoArray = elArray.filter((_,i)=>i%n==0);
    nuevoArray.push(elArray[elArray.length-1]);
    Trazados.push(nuevoArray);
}

function calcularPuntoDeControl(ry,a,b){
    return{
        x: (ry[a].x + ry[b].x)/2,
        y: (ry[a].y + ry[b].y)/2
    }
}

function alisarTrazado(ry){
    if(ry.length>1){
        var ultimoPunto = ry.length - 1;
        ctx.beginPath();
        ctx.moveTo(ry[0].x,ry[0].y);
    

    for(let i = 1; i < ry.length - 2; i++){
        let pc = calcularPuntoDeControl(ry,i,i+1);
        ctx.quadraticCurveTo(ry[i].x, ry[i].y, pc.x, pc.y);
    };

    ctx.quadraticCurveTo(ry[ultimoPunto-1].x, ry[ultimoPunto-1].y, ry[ultimoPunto].x, ry[ultimoPunto].y);
    ctx.stroke();

    }
}

function redibujarTrazados(){
    dibujar = false;
    ctx.clearRect(0,0,cw,ch);
    reducirArray(factorDeAlismiento, puntos);
    Trazados.forEach(trazado => alisarTrazado(trazado));
}

function oMousePos(canvas, evt){
    let rect = canvas.getBoundingClientRect();
    return{
        x : Math.round(evt.clientX- rect.left),
        y : Math.round(evt.clientY - rect.top)
    }
}