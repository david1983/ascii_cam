
window.addEventListener("DOMContentLoaded", function() {
    w = 160;
    h = 120;
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
}, false);


setInterval(function(){
    convert_ascii();
},100)



function convert_ascii(){
    var canvas = document.getElementById("canvas"),
        tc = canvas.getContext("2d")
    tc.drawImage(video, 0, 0, w, h);
    var pixels = tc.getImageData(0, 0, w, h);
    var colordata = pixels.data;

    var ascii = document.getElementById("ascii");
    while (ascii.hasChildNodes()) {
        ascii.removeChild(ascii.lastChild);
    }
    var line="";
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
        if(i != 0 && (i/4)%w == 0) //if the pointer reaches end of pixel-line
        {
            ascii.appendChild(document.createTextNode(line));
            //newline
            ascii.appendChild(document.createElement("br"));
            //emptying line for the next row of pixels.
            line = "";
        }

        line += character;
    }
}
