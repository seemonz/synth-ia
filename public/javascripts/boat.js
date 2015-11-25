var visualBg = window.location.pathname.slice(1);
if (visualBg === "boats"){
    $(function() {
        'use strict';
        var onloadDo;
        onloadDo = function () {
            var addPath, addPoints, animatePath, canvas, i, j, n, opacity, path, paths, ref, view;
            $('#second-frame').append("<div id='boat-frame'><canvas id='canvas'></canvas><img id='lighthouse' src='images/lighthouse.png' alt='lighthouse'/></div>");
            canvas = document.getElementById('canvas');
            paper.setup(canvas);
            view = paper.project.view;
            paths = new paper.Group();
            addPoints = function (path, quantity) {
                var i, j, ref, x, y;
                path.add(view.bounds.bottomLeft);
                for (i = j = -1, ref = quantity + 1; j <= ref; i = j += 1) {
                    if (window.CP.shouldStopExecution(1)) {
                        break;
                    }
                    x = view.viewSize.width / quantity * i;
                    y = view.viewSize.height / 1.618;
                    path.add(new paper.Point(x, y));
                }
                window.CP.exitedLoop(1);
                return path.add(view.bounds.bottomRight);
            };
            addPath = function (quantity, color, opacity) {
                var path;
                path = new paper.Path();
                path.fillColor = color;
                path.opacity = opacity;
                addPoints(path, quantity);
                path.smooth();
                return path;
            };
            animatePath = function (path, event, index) {
                var i, j, len, ref, results, segment, sin;
                ref = path.segments;
                results = [];
                for (i = j = 0, len = ref.length; j < len; i = ++j) {
                    if (window.CP.shouldStopExecution(2)) {
                        break;
                    }
                    segment = ref[i];
                    if (i > 0 && i < path.segments.length - 1) {
                        sin = Math.sin(event.time * 3 + i - index);
                          // var position = $('#lighthouse').position();
                          // if (position.left > 720 || position.left < -50){
                          //   $('#lighthouse').css("visibility", "hidden")
                          // } else{
                          //   $('#lighthouse').css("visibility", "visible");
                          // }
                          // console.log(position.left);
                        results.push(segment.point.y = sin * 15 + view.viewSize.height / 1.618 + index * 15);
                    } else {
                        results.push(void 0);
                    }
                }
                window.CP.exitedLoop(2);
                return results;
            };
            n = 8;
            opacity = 1 / (n / 2);
            for (i = j = 1, ref = n; j <= ref; i = j += 1) {
                if (window.CP.shouldStopExecution(3)) {
                    break;
                }
                path = addPath(8 - i, '#21f8f6', i * opacity);
                path.position.y += 25 * i;
                paths.addChild(path);
            }
            window.CP.exitedLoop(3);
            view.onFrame = function (event) {
                var k, len, ref1, results;
                ref1 = paths.children;
                results = [];
                for (i = k = 0, len = ref1.length; k < len; i = ++k) {
                    if (window.CP.shouldStopExecution(4)) {
                        break;
                    }
                    path = ref1[i];
                    results.push(animatePath(path, event, i));
                }
                window.CP.exitedLoop(4);
                return results;
            };
            view.draw();
            return null;
        };
        window.onload = onloadDo;
    }.call(this));
}