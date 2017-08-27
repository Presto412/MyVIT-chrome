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
$f.find('textarea').addClass('materialize-textarea').val('').attr({'id':'address','data-length':100,'tabindex':3}).removeAttr('rows').removeAttr('cols').removeAttr('style').after('<label for="address">Address</label>');
$f.find('input').eq(0).parent().parent().remove().end().end().end().eq(-1).parent().parent().remove();
$f.find('input[name="reason"]').eq(0).attr({'id':'reason','tabindex':4}).after('<label for="reason">Reason</label>');
$f.find('input[type="submit"]').eq(0).attr('id','apply').addClass('btn').after('<a id="remember" class="btn" style="margin-left: 40px;" href="#">Remember Details</a>');
$('body').empty().append('<h4 class="center-align">Leave Request</h4>').append($f).append($his).append($cal);
$f.wrap('<div class="row" id="root"><div class="col s7" style="padding: 0;"><div class="row"><div class="col s10 push-s1 card-panel"></div></div></div></div>');
$his.wrap('<div class="row" id="history"><div class="col s10 push-s1 card-panel" style="padding: 0;"></div></div>').find('tr').eq(0).addClass('listHead').end().eq(1).addClass('wbg').end().end().find('input[type="submit"]').addClass('btn btn-flat');
$('#root').append('<div class="col s5" id="autofill"></div>');
$('#address').after('<input class="hide" name="remLen1">');
$('textarea').characterCounter();
$('select[name="lvtype"]').removeAttr('onchange').off('change').change(function (e) {
    $('#dateTime').addClass('hide').empty();
    addDetails();
}).parent().parent().after('<div id="dateTime" class="card-panel grey lighten-4 hide"></div>');
function addDetails(m,x)
{
    let lvtyp=$('select[name="lvtype"]').val();
    if (lvtyp=="")
        return;
    $.ajax({
        url:`leave_apply_dt.asp?x=${(new Date()).toUTCString()}&lvtyp=${lvtyp}`,
        type: 'GET',
        success:function (data) {
            addUI(data);
            if(m===1)
            {
                $('select[name="sttime_hh"]').val(x.time1.h);
                $('select[name="sttime_mm"]').val(x.time1.m);
                $('select[name="endtime_hh"]').val(x.time2.h);
                $('select[name="endtime_mm"]').val(x.time2.m);
                let mer1=(x.time1.meridian==='AM')?'radio0':'radio1';
                let mer2=(x.time2.meridian==='AM')?'radio2':'radio3';
                $(`#${mer1},#${mer2}`).prop('checked',true);
            }
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
function extractDetails() {
    let $lvtype=$('select[name="lvtype"]');
    let $apply=$('select[name="apply"]');
    return{
        auth:$apply.val(),
        type:$lvtype.val(),
        authName:$apply.find('option:selected').text(),
        typeName:$lvtype.find('option:selected').text(),
        time1:{
            h:$('select[name="sttime_hh"]').val(),
            m:$('select[name="sttime_mm"]').val(),
            meridian:$('input:radio[name="frm_timetype"]:checked').val()
        },
        time2:{
            h:$('select[name="endtime_hh"]').val(),
            m:$('select[name="endtime_mm"]').val(),
            meridian:$('input:radio[name="to_timetype"]:checked').val()
        },
        address:$('textarea[name="place"]').val(),
        reason:$('input[name="reason"]').val()
    };
}
$('#remember').click(function () {
    let d=extractDetails();
    chrome.storage.local.get(function (result) {
        let t=[];
        if(result.leave!==undefined)
            t=result.leave;
        t.push(d);
        chrome.storage.local.set({'leave':t});

        displayDetails();
    });
});
function displayDetails() {
    chrome.storage.local.get(function (result) {
        if(result.leave!==undefined)
        {
            $('#autofill').empty();
            let j=0;
            for(let  i of result.leave)
            {
                let t=`<div class="row">
    <div style="cursor: pointer;" class="col s10 push-s1 card-panel hoverBg hoverable">
        <h5>${i.time1.h}:${i.time1.m} ${i.time1.meridian} - ${i.time2.h}:${i.time2.m} ${i.time2.meridian}</h5>
        <p style="font-size: small;font-weight: bold;">${i.authName}<br>${i.typeName}</p>
        <p style="font-size: large;" class="address">${i.address}</p>
    </div>
</div>`;
                j++;
                let $t=$(t);
                $t.children('.hoverBg.hoverable').data(i);
                $('#autofill').append($t);
            }
            $('.address').shave('45px');
            $('.hoverable.hoverBg').click(function () {
                console.log($(this).data());
                populateDetails($(this).data());
            })
        }
    });
}
function populateDetails(x) {
    $('select[name="lvtype"]').val(x.type);
    $('select[name="apply"]').val(x.auth);
    $('textarea[name="place"]').val(x.address).siblings('label').addClass('active');
    $('input[name="reason"]').val(x.reason).siblings('label').addClass('active');
    $('#dateTime').addClass('hide').empty();
    addDetails(1,x);
}
$(function () {
    displayDetails();
});