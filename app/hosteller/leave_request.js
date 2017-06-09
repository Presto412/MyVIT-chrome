/**
 * Created by Vineeth on 08-06-2017.
 */
$('select').addClass('browser-default');
let $f=$('td').children('form').css('margin','0').attr('id','form').detach();
let $his=$('td').children('table').attr('id','history').detach();
let $cal=$(`<style>#calBorder{box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px, rgba(0, 0, 0, 0.2) 0px 3px 1px -2px;transition: box-shadow 0.25s; padding: 24px; margin: 0.5rem 0 1rem; border-radius: 2px;}</style>`);
let data=$f.find('select,textarea,input').detach();
data.eq(0).remove();
$f.empty().append(data);
data.wrap('<div class="row"><div class="col s12 input-field"></div></div>');
$f.find('textarea').addClass('materialize-textarea').val('').attr({'id':'address','data-length':100}).removeAttr('rows').removeAttr('cols').removeAttr('style').after('<label for="address">Address</label>');
$f.find('input').eq(0).parent().parent().remove().end().end().end().eq(-1).parent().parent().remove();
$f.find('input[name="reason"]').eq(0).attr('id','reason').after('<label for="reason">Reason</label>');
$f.find('input[type="submit"]').eq(0).attr('id','apply').addClass('btn').after('<a class="btn disabled" style="margin-left: 40px;" href="#">Remember Details</a>');
$('body').empty().append('<h4 class="center-align">Leave Request</h4>').append($f).append($his).append($cal);
$f.wrap('<div class="row" id="root"><div class="col s7" style="padding: 0;"><div class="row"><div class="col s10 push-s1 card-panel"></div></div></div></div>');
$his.wrap('<div class="row" id="history"><div class="col s10 push-s1 card-panel" style="padding: 0;"></div></div>').find('tr').eq(0).addClass('listHead').end().eq(1).addClass('wbg').end().end().find('input[type="submit"]').addClass('btn btn-flat');
$('#root').append('<div class="col s5" id="autofill"><div class="row"><div class="col s10 push-s1 card-panel"></div></div></div>');
$('textarea').characterCounter();
$('select[name="lvtype"]').removeAttr('onchange').off('change').change(function (e) {
    $('#dateTime').addClass('hide').empty();
    addDetails();
}).parent().parent().after('<div id="dateTime" class="card-panel grey lighten-4 hide"></div>');
function addDetails()
{
    let lvtyp=$('select[name="lvtype"]').val();
    if (lvtyp=="")
        return;
    $.ajax({
        url:`leave_apply_dt.asp?x=${(new Date()).toUTCString()}&lvtyp=${lvtyp}`,
        type: 'GET',
        success:function (data) {
            addUI(data);
        },
        error:function () {
            console.log('error fetching the details !!');
        }
    });
    function addUI(d){
        let $d=$(d),type=['Exit',"Re-Entry"];
        console.log($d);
        // let append='';
        if(($d.find('input[type="text"]')).length)
        {
            let $append=$d.find('input,a,select');
            let $dt=$('#dateTime');
            $dt.append($append).find('input[type="radio"]').each(function (i,ele) {
                console.log('entered !');
                $(this).attr('id',`radio${i}`).wrap('<p style="width: 20%;display:inline;"></p>').after(`<label for="radio${i}">${$(this).get(0).value}</label>`)
            }).parent().css({'margin':'0 13px'});
            let $a=$dt.find('a');
            $dt.find('select').addClass('browser-default').css({'width':'20%','display':'inline'});
            $dt.find('input[type="text"]').css({'width':'50%'}).each(function (i) {
                let $t=$a.eq(i).detach();
                $(this).before(`<p style="display: block;margin:20px 13px 13px;">${type[i]} Date and Time</p>`).wrap('<div class="row"><div class="col s12 input-field"></div></div>').after($t).after(`<label for="${$(this).attr('id')}">${type[i]} Date</label>`);
            });
            $dt.find('select[name*="hh"]').css({'margin':'0 13px'}).each(function (i) {
                $(this).before(`<small style="display: block;margin:20px 13px 13px;">${type[i]} Time</small>`);
            });
            console.log($dt.find('a'));
            $('a').click(function () {
                $(this).siblings('label').addClass('active');
            });
            $dt.removeClass('hide');
        }
        else {
            let $append=$d.find('input,select');
            let $dt=$('#dateTime');
            $dt.append($append).find('input[type="radio"]').each(function (i,ele) {
                console.log('entered !');
                $(this).attr('id',`radio${i}`).wrap('<p style="width: 20%;display:inline;"></p>').after(`<label for="radio${i}">${$(this).get(0).value}</label>`)
            }).parent().css({'margin':'0 13px'});
            $dt.find('select').addClass('browser-default').css({'width':'20%','display':'inline'}).eq(0).css('width','60%').before(`<small style="display: block;margin:20px 13px 13px;">Exit Date</small>`);
            $dt.find('select[name*="hh"]').css({'margin':'0 13px'}).each(function (i) {
                $(this).before(`<small style="display: block;margin:20px 13px 13px;">${type[i]} Time</small>`);
            });
            $('a').click(function () {
                $(this).siblings('label').addClass('active');
            });
            $dt.removeClass('hide');
        }
    }
}