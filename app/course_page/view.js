/**
 * Created by Vineeth on 29-05-2017.
 */

$(function () {
    chrome.runtime.sendMessage({request:'block-unload'});
    console.log('view.js ready !');
    let $root=$('#content');
    let $form=$root.find('form[name="coursepage_plan_view"]');
    $root.wrap('<div class="container"></div>');
    $form.find('select').each(function () {
       $(this).css('cursor','pointer').addClass('browser-default hoverable').wrap('<div class="col s8 push-s2" style="padding: 5px;"></div>');
       $(this).parent().prepend(`<label style="text-transform: uppercase;">${$(this).attr('name')}</label>`);
       let $t=$(this).parent().detach();
       $form[0].append($t[0]);
    });
    $form.detach();
    $root.parent().prepend($form[0]);
    $form.wrap('<div class="card-panel"><div class="col s8 push-s2"></div></div>');
    $root.parent().prepend('<h3 class="center-align">VTOP course page</h3>');
    $form.children('table').remove();
    let $list=$root.find('table');
    let t=true;
    if($list.length){
        let $display;
        $list.find('tr').each(function(){
            $(this).children('td').eq(-1).addClass('hide');
            $(this).children('td').eq(-2).addClass('hide');
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
        $list.wrap('<div class="row"><div class="col s10 push-s1"></div></div>');
        let $l=$list.parents('.row').detach();
        $root.parent().after($l[0]);
    }
    $root.remove();
    chrome.runtime.sendMessage({request:'allow-unload'});
    chrome.runtime.sendMessage({request:'unload'});
});
