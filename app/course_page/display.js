/**
 * Created by Vineeth on 29-05-2017.
 */
$(function () {
    $('body').prepend('<div id="root" class="container" style="width:85%"></div>');
    let $root=$('#root');
   $('#content table').each(function () {
       $(this).wrap('<div class="row"></div>');
       let $t= $(this).parent().detach();
       $root.append($t);
   });
   $('#content').remove();
   $root.find('table').eq(0).find('tr').eq(0).addClass('listHead');
   $root.find('table').eq(0).find('tr').eq(1).addClass('wbg');
   $root.find('table').wrap('<div class="card-panel" style="padding: 0;"></div>');
   let $t2=$root.find('table').eq(1);
   $t2.find('td[bgcolor="#5A768D"]').addClass('listHead');
   $t2.find('td[bgcolor="#EDEADE"]').addClass('wbg');
   $t2.find('a').addClass('btn btn-flat');
   $t2.find('tr').eq(0).remove();
   $t2.find('tr').eq(-1).remove();
   $t2.find('input[name="sybcmd"]').addClass('btn btn-flat');
   $t2.find('tr').each(function () {
       if($(this).children('td').eq(-1).text()=='')$(this).remove();
   });
   let $t3=$root.find('table').eq(2);
   $t3.find('tr').eq(0).addClass('listHead');
   $t3.find('tr[bgcolor="#EDEADE"]').addClass('list').css('cursor','default');
});