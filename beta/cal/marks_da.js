$(function () {
    let $root=$('body').children('table');
    let $list=$root.find('table');
    let t=true;
    if($list.length){
        $list.find('tr').each(function(){
            $(this).children('td').eq(-1).addClass('hide');
            if(t){ t=!t;$(this).addClass('listHead');return true;}
            $(this).addClass('list');
        });
        $list.find('tr').click(function () {
            console.log('clicked !');
            if($(this).hasClass('list'))
                $(this).find('input[type="submit"]').click();
        });
        $('input[type="submit"]').click(function (e) {
            e.stopPropagation();
        });
        $root.find('ol').wrap('<div class="row"><div class="col s10 push-s1 card-panel" style="padding:0"></div></div>');
        $root.children('tbody').children('tr').children('td').eq(0).remove().end().eq(1).children('b').remove();
        $list.wrap('<div class="row"><div class="col s10 push-s1 card-panel" style="padding:0"></div></div>');
    }
});