var main = function () {
    $(".ok").on('click', function(event) {
        event.preventDefault();
        var n = +$('.n').val();
        var v = +$('.v').val();
        var t = +$('.t').val()/100;
        var h = +$('.h').val();
        var gap = +$('.gap').val();
        var k = +$('.k').val();
        graph = new Array(n);
        point = new Array(n);
        var i;
        graph[0]=[0,gap];
        var moment=0;
        for (i = 1; i < n; i++) {
            graph[i] = [i, 0];
        }
        for (var j=0; j<=k; j++) {
            for (i = 1; i < n - 1; i++) {
                moment = v * v * (graph[i + 1][1] - 2 * graph[i][1] + graph[i - 1][1]) * t / h / h;
                point[i] = moment;
            }

            graph[0] = [0, 0];
            graph[n - 1] = [n - 1, 0];
            for (i = 1; i < n - 1; i++) {
                graph[i] = [i, (point[i] * t)];
            }
        }
        $.plot($(".graph"), [graph]);
    });
};

$(document).ready(main);
