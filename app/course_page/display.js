/**
 * Created by Vineeth on 29-05-2017.
 */
$(function () {
    $('body').prepend('<div id="root" class="container" style="width:85%"></div><a id="download" style="position: fixed;bottom: 5px;right: 5px;" class="btn-floating btn-large waves-effect waves-light teal scale-transition scale-out tooltipped" data-position="left" data-delay="50" data-tooltip="Download Selected"><i class="fa fa-download"></i></a>');
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
   $t2.find('a').addClass('btn btn-flat').css('height','100%');
   $t2.find('tr').eq(0).remove();
   $t2.find('tr').eq(-1).remove();
   $t2.find('input[name="sybcmd"]').addClass('btn btn-flat');
   $t2.find('tr').each(function () {
       if($(this).children('td').eq(-1).text()=='')$(this).remove();
       else{
           let $txt=$(this).children('td').eq(-1).find('font');
           $txt.text($txt.text().replace(/_/g,"-"));
       }
   });
   let $t3=$root.find('table').eq(2);
   $t3.find('tr').eq(0).addClass('listHead').children('td:nth-child(5)').attr('width','230').append('<p class="right tooltipped" data-position="left" data-delay="50" data-tooltip="Select All" style="margin:0;"> <input type="checkbox" class="filled-in" id="selectAll"/> <label for="selectAll"></label> </p>').end().children('td:nth-child(2)').attr('width','130');
   $t3.find('tr[bgcolor="#EDEADE"]').addClass('list').css('cursor','default').each(function () {
       $(this).children('td').eq(-1).addClass('rm').find('a').wrap('<div class="link" style="margin: 15px 0;"></div>').end().find('br').remove().end();
   });
   let i=0;
   $('.link').each(function () {
       $(this).append(`<p class="right" style="margin:0;"><input type="checkbox" id="item${i}" /><label for="item${i++}"></label></p>`);
   });
   $('.rm').each(function () {
       let $l=$(this).find('.link').detach();
       $(this).empty().append($l);
   });
   $('.tooltipped').tooltip({delay: 50});
   function handleButton(){
       if ($('.link input:checked').length) {
           if ($('#download').hasClass('scale-out')){
               $('#download').removeClass('scale-out').addClass('pulse');
               setTimeout(function () {
                   $('#download').removeClass('pulse');
               },2000);
           }
       }
       else {
           $('#download').addClass('scale-out');
       }
   }
   $('.link input:checkbox').change(handleButton);
   $('#selectAll').change(function () {
       if($(this).is(':checked'))
           $('.link input:checkbox').prop('checked',true);
       else
           $('.link input:checkbox').prop('checked',false);
       handleButton();
   });
    $('#download').click(function () {
        let links=[];
        $('.link input:checked').each(function () {
            console.log($(this));
            let $a=$(this).parent().siblings('a');
            links.push($a.attr('href'));
        });
        $('.link input:checkbox').prop('checked',false);
        handleButton();
        console.log(links);
    })
});