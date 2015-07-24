
window.addEventListener("DOMContentLoaded", function() {

    init(80,60)
})

setInterval(function(){
    convert_ascii();
},100)

window.h = 80;
window.w = 40;
window.fontsize = 4;
window.backgroundCanvas = '#FFF'
window.foregroundCanvas= '#000'

document.getElementById('setSize').addEventListener('click', function(){
    var w = document.getElementById('wValue').value
    var h = document.getElementById('hValue').value
    var fontsize = document.getElementById('resolution').value;
    fontsize = (fontsize>0) ? fontsize : 8;
    w = (w>0) ? w : 80;
    h = (h>0)  ? h : 60;
    window.h = h;
    window.w = w;
    window.fontsize = fontsize;
    var ascii = document.getElementById("ascii");
    ascii.style.fontSize = fontsize + 'px';
    var canvas = document.getElementById("canvas")
    canvas.width = w;
    canvas.height = h;
})

document.getElementById('closeBtn').addEventListener('click',function(){
    var settings = document.getElementById('settings');
    settings.style.right = -300 + 'px';
})

document.getElementById('configureBtn').addEventListener('click',function(){
    var settings = document.getElementById('settings');
    settings.style.right = 20 + 'px';
})

document.getElementById('settingBtn').addEventListener('click',function(){
    var settings = document.getElementById('settings');
    settings.style.right = 40 + '%';
})

document.getElementById('snapBtn').addEventListener('click',function(){
    var canvas = document.getElementById('snap');
    window.open(
        canvas.toDataURL("image/jpeg"),
        '_blank' // <- This is what makes it open in a new window.
    );
})

$("#background").spectrum({
    color:'#000',
    move: function(color) {
        window.backgroundCanvas = color.toHexString(); // #ff0000
    }
})

$("#textcolor").spectrum({
    color:'#FFF',
    move: function(color) {
        window.foregroundCanvas= color.toHexString(); // #ff0000
    }
})



function init(w,h){

    window.w = w
    window.h = h
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        video = document.getElementById("video"),
        videoObj = { "video": true },
        errBack = function(error) {
            console.log("Video capture error: ", error.code);
        };

    canvas.width= w;
    canvas.height=h;
    if(navigator.getUserMedia) {
        navigator.getUserMedia(videoObj, function(stream) {
            video.src = stream;
            video.play();
        }, errBack);
    } else if(navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia(videoObj, function(stream){
            video.src = window.webkitURL.createObjectURL(stream);
            video.play();
        }, errBack);
    }
    else if(navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia(videoObj, function(stream){
            video.src = window.URL.createObjectURL(stream);
            video.play();
        }, errBack);
    }
}

function convert_ascii(){
    var canvas = document.getElementById("canvas"),
        tc = canvas.getContext("2d")
    tc.drawImage(video, 0, 0, window.w, window.h);
    var pixels = tc.getImageData(0, 0, window.w, window.h);
    var colordata = pixels.data;

    var ascii = document.getElementById("ascii");
    while (ascii.hasChildNodes()) {
        ascii.removeChild(ascii.lastChild);
    }
    var line="";

    var snapcanvas=document.getElementById('snap');
    snapcanvas.width=(window.fontsize) ? window.w*window.fontsize : window.h;
    snapcanvas.height=window.row || window.h*15;
    var context = snapcanvas.getContext('2d');
    context.clearRect(0, 0, snapcanvas.width, snapcanvas.height);
    context.fillStyle=window.backgroundCanvas;
    context.fillRect(0,0,snapcanvas.width,snapcanvas.height);
    context.fillStyle = window.foregroundCanvas;
    console.log(window.row)
    var fontsize = 2;
    context.font = "bold " + fontsize + "px monospace";
    row=1
    for(var i = 0; i < colordata.length; i = i+4)
    {
        r = colordata[i];
        g = colordata[i+1];
        b = colordata[i+2];

        gray = r*0.2126 + g*0.7152 + b*0.0722;

        if(gray > 250) character = " ";

        else if(gray > 230) character = "`";
        else if(gray > 200) character = "°";
        else if(gray > 175) character = ".";
        else if(gray > 160) character = ":";
        else if(gray > 140) character = ">";
        else if(gray > 120) character = "§";
        else if(gray > 100) character = "#";
        else if(gray > 80) character = "&";
        else if(gray > 60) character = "$";
        else if(gray > 40) character = "%";
        else if(gray > 20) character = "W";
        else character = "@"; //almost black

        //newlines and injection into dom
        if(i != 0 && (i/4)%window.w == 0) //if the pointer reaches end of pixel-line
        {
            //ascii.appendChild(document.createTextNode(line));
            var metrics = context.measureText(line);
            var testWidth = metrics.width;
            while(testWidth<snapcanvas.width){

                fontsize++;
                context.font = "bold " + fontsize + "px monospace";
                var metrics = context.measureText(line);
                var testWidth = metrics.width;
            }

            context.fillText(line, 0, row);
            row += fontsize;

            //newline
            //ascii.appendChild(document.createElement("br"));
            //emptying line for the next row of pixels.
            line = "";
        }

        line += character;
    }
    window.row=row;
}
