var visualBg = window.location.pathname.slice(1);
if (visualBg === "boats"){

    $(function(){
        var div = document.getElementById('second-frame');
        var canvas = document.createElement('canvas');
        var w = canvas.width = document.getElementById('second-frame').clientWidth;
        var h = canvas.height = document.getElementById('second-frame').clientHeight;
        var ctx = canvas.getContext('2d');
        var img = new Image();

        // initialization
        function Init() {
            $('#second-frame').append("<div id='boat-frame'></div>")
            $('#boat-frame').append(canvas);
            Update();
        }
       
        // main loop
        function Update() {
            var backGrd = ctx.createLinearGradient(0, canvas.height, 0, 0);

            // light blue
            backGrd.addColorStop(0, '#f2c5bd');   
            backGrd.addColorStop(1, '#945986');
            ctx.fillStyle = backGrd;
            ctx.fillRect(0, 0, w, h);

            var timeCur = new Date().getTime();
            var maxLayers = Math.floor(h / 150) + 1;
            var waveLayer = -1;
            var offset = 200;
            var offsetInc = 30;

            while (waveLayer < maxLayers) {
                var timeDivider = (8 - (5 * waveLayer / maxLayers));
                var timeMod = timeCur / timeDivider;
                var ampMod = 32 + 12 * waveLayer;
                var ampMult = 8 + waveLayer * 4;

                var grd = ctx.createLinearGradient(0, offset, 0, offset + offsetInc * 2);
                grd.addColorStop(0, '#80e0d0'); //'rgba(255,255,208,0.2)');
                grd.addColorStop(0.5, '#40d8d4'); //'rgba(255,208,208,0)');
                grd.addColorStop(1, '#40d4d0');


                ctx.beginPath();
                for (var i = 0; i < w; i += 0.5) {
                  var timeUse = (timeMod + i) / ampMod;
                  var amp = ampMult * Math.sin(timeUse);
                  var height = 4 * Math.cos((timeMod) / 48);
                  var yPoint = amp - height + offset;
                  var xPoint = i;
                  ctx.lineTo(xPoint, yPoint);
                }

                ctx.lineTo(w, h + offset );
                ctx.lineTo(0, h + offset);
                ctx.lineTo(0, offset);

                ctx.closePath();
                ctx.fillStyle = grd;

                ctx.fill();

                waveLayer++;
                offsetInc = 30 + 10 * Math.pow(waveLayer, 2);
                offset += offsetInc;
            }

          requestAnimationFrame(Update);
        }
        Init();
    });
}