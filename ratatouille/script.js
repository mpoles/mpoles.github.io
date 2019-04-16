var main = function () {
    $('#bugs button').click(function () {
        new BugController();
        $('#bugs').html('<h4>Не дай мухам испортить обед!</h4><img src="/ratatouille//bugs/taco.png" width=99>');
    });
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
        if ($(this).scrollTop() > $('#lab7').offset().top-160) {
            if (!$('.nav a:nth-child(14)').hasClass('active')) {
                $('.active').removeClass('active');
                $('.nav a:nth-child(14)').addClass('active');
                setTimeout($('.nav span').css('top', ($('.nav a:nth-child(14)').offset().top-$('.nav a:nth-child(2)').offset().top-9)+'px'),999);
            }
        } else {
            if ($(this).scrollTop() > $('#lab6').offset().top-160) {
                if (!$('.nav a:nth-child(12)').hasClass('active')) {
                    $('.active').removeClass('active');
                    $('.nav a:nth-child(12)').addClass('active');
                    setTimeout($('.nav span').css('top', ($('.nav a:nth-child(12)').offset().top-$('.nav a:nth-child(2)').offset().top-9)+'px'),999);
                }
            } else {
                if ($(this).scrollTop() > $('#lab5').offset().top-160) {
                    if (!$('.nav a:nth-child(10)').hasClass('active')) {
                        $('.active').removeClass('active');
                        $('.nav a:nth-child(10)').addClass('active');
                        setTimeout($('.nav span').css('top', ($('.nav a:nth-child(10)').offset().top-$('.nav a:nth-child(2)').offset().top-9)+'px'),999);
                    }
                } else {
                    if ($(this).scrollTop() > $('#lab4').offset().top-160) {
                        if (!$('.nav a:nth-child(8)').hasClass('active')) {
                            $('.active').removeClass('active');
                            $('.nav a:nth-child(8)').addClass('active');
                            setTimeout($('.nav span').css('top', ($('.nav a:nth-child(8)').offset().top-$('.nav a:nth-child(2)').offset().top-9)+'px'),999);
                        }
                    } else {
                        if ($(this).scrollTop() > $('#lab3').offset().top-160) {
                            if (!$('.nav a:nth-child(6)').hasClass('active')) {
                                $('.active').removeClass('active');
                                $('.nav a:nth-child(6)').addClass('active');
                                setTimeout($('.nav span').css('top', ($('.nav a:nth-child(6)').offset().top-$('.nav a:nth-child(2)').offset().top-9)+'px'),999);
                            }
                        } else {
                            if ($(this).scrollTop() > $('#lab2').offset().top-160) {
                                if (!$('.nav a:nth-child(4)').hasClass('active')) {
                                    $('.active').removeClass('active');
                                    $('.nav a:nth-child(4)').addClass('active');
                                    setTimeout($('.nav span').css('top', ($('.nav a:nth-child(4)').offset().top-$('.nav a:nth-child(2)').offset().top)+'px'),999);
                                }
                            } else {
                                if ($(this).scrollTop() > 99) {
                                    $('.head img').addClass('hid');
                                    if (!$('.nav a:nth-child(2)').hasClass('active')) {
                                        $('.active').removeClass('active');
                                        $('.nav a:nth-child(2)').addClass('active');
                                        setTimeout($('.nav span').css('top', 0),999);
                                    }
                                } else {
                                    $('.head img').removeClass('hid');
                                    $('.active').removeClass('active');
                                }
                            }
                        }
                    }
                }
            }
        }
    });

};

$(document).ready(main);