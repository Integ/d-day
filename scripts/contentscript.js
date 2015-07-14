'use strict';

var array = [];
$('.joined-user li').each(function(i, e) {
    var item = []
    item.push($(this).find('a').attr('title'));
    item.push('');
    item.push($(this).find('a img').attr('src').replace('_medium40', '_huge256'));
    item.push(parseInt(i / 14));    //列
    item.push(i % 14);    //行
    array.push(item);
});

chrome.runtime.sendMessage({data: array}, function(response) {
      console.log('Option 页状态:' + response.status);
});

$('.joined-user.list-inline.ml0')
    .wrap('<div id="joinedWrap"></div>');

$('#joinedWrap').css({
    position: 'fixed',
    width: '100vw',
    top: 0,
    left: 0,
    'height': '100vh',
    'overflow': 'auto',
    'background-color': '#FFF',
    'text-align': 'center'
});

$('.joined-user li').addClass('mix');

$('.joined-user .avatar-24')
    .removeClass('avatar-24')
    .addClass('avatar-64 bg-gray');

$('.joined-user .avatar-64').each(function() {
    var ns = $(this).attr('src').replace('medium40', 'huge128');
    $(this).attr('src', ns);
});

$('#joinedWrap').prepend('<h1 class="h2 text-primary">May the force be with you !<button class="btn btn-danger ml20" id="stop" >STOP</button></h1>');

var running = true;
$('#stop').click(function(){
    if(running === true) {
        running = false;
        $('#stop').text('START')
            .removeClass('btn-danger').addClass('btn-success');
    } else {
        running = true;
        $('#stop').text('STOP')
            .removeClass('btn-success').addClass('btn-danger');
        $('.mix:first-child').width('auto')
        $('.mix:first-child h1').remove();
        $('.mix:first-child img').animate({
            height: "60px",
            width: "60px"
        }, 2000, function(){
            $('#trig').trigger('click');
        });
    }
});

$('.joined-user').after('<div class="text-center row"><button data-sort="random" id="trig" class="hide btn btn-success sort">Lets Rock !</button></div>');

// Instantiate MixItUp:
$('.joined-user').mixItUp({
    animation: {
        duration: 1500
    },
    callbacks: {
        onMixEnd: function(state) {
            if(running === true) {
                $('#trig').trigger('click');
            } else {
                $('.mix:first-child').width('100%').append('<h1 class="hide text-danger"><span class="text-warning">Congratulations:</span><br/><br/>' + $('.mix a').attr('title') + '</h1>');
                $('.mix:first-child img').animate({
                    height: "300px",
                    width: "300px"
                }, 2000, function(){
                    $('.mix:first-child h1').removeClass('hide');
                });
            }
        }
    }
});
