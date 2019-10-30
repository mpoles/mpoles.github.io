var main = function () {
    $(".ok").on('click', function(event) {
        event.preventDefault();
        var h = +$('.h').val();
        var p = +$('.p').val();
        var hbirth = +$('.hbirth').val()/100;
        var pbirth = +$('.pbirth').val()/100;
        var hdeath = +$('.hdeath').val()/100;
        var pdeath = +$('.pdeath').val()/100;
        var scale = +$('.scale').val();
        var herb = 0;
        var hgraph = [];
        var pgraph = [];
        for (var i=0; i<=scale; i++){
            herb = h + (h * hbirth - hdeath * h * p);
            p += pbirth * h * p - p * pdeath;
            h = herb;
            hgraph.push([i,h]);
            pgraph.push([i,p]);
        }
        $.plot($(".graph"), [hgraph,pgraph]);
    });
};

$(document).ready(main);