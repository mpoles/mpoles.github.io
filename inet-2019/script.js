var main = function () {
    $('.nav a').on('click', function(e) {
        e.preventDefault();
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 99
                }, 1500);
            }
        }
    });
    $(window).scroll(function() {
         if ($(this).scrollTop() < 99) {
             $('.rat').removeClass('hid');
             $('.active').removeClass('active');
         } else {
             $('.rat').addClass('hid');
             if ($(this).scrollTop() < $('#lab2').offset().top-291) {
                 if (!$('.nav a:nth-child(1)').hasClass('active')) {
                     $('.active').removeClass('active');
                     $('.nav a:nth-child(1)').addClass('active');
                 }
             } else if ($(this).scrollTop() < $('#lab3').offset().top - 219) {
                     if (!$('.nav a:nth-child(3)').hasClass('active')) {
                         $('.active').removeClass('active');
                         $('.nav a:nth-child(3)').addClass('active');
                     }
                 } else if ($(this).scrollTop() < $('#lab4').offset().top - 291) {
                         if (!$('.nav a:nth-child(5)').hasClass('active')) {
                             $('.active').removeClass('active');
                             $('.nav a:nth-child(5)').addClass('active');
                         }
                     } else if ($(this).scrollTop() + window.innerHeight < $(document).height()) {
                         if (!$('.nav a:nth-child(7)').hasClass('active')) {
                             $('.active').removeClass('active');
                             $('.nav a:nth-child(7)').addClass('active');
                         }
                     } else if (!$('.nav a:nth-child(9)').hasClass('active')) {
                                 $('.active').removeClass('active');
                                 $('.nav a:nth-child(9)').addClass('active');
                             }
         }
    });
};

$(document).ready(main);