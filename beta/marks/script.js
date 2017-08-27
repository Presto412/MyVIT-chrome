$(function () {
    $('table table table').wrap('<div class="container" style="width: 85%;"></div>');
    $('table table').wrap('<div class="row"><div class="col s10 push-s1 card-panel" style="padding:0"></div></div>');
    $('tr[bgcolor="#B0BFCC"]').addClass('wbg');
    $('tr[bgcolor="#CCCCCC"]').addClass('wbg hoverBg');
    $('tr[bgcolor="#EDEADE"],tr[bgcolor="#5A768D"],tr[bgcolor="#999966"]').addClass('listHead');
    $('.listHead').eq(0).css('margin-bottom','30px');
});