/**
 * Created by Vineeth on 05-06-2017.
 */
$(function () {
   let $search=` <style> .autocomplete-content{ position: absolute; } .sk-spinner-pulse { width: 90px; height: 90px; margin: 40px auto; background-color: #333; border-radius: 100%; -webkit-animation: sk-pulseScaleOut 0.5s infinite ease-in-out; animation: sk-pulseScaleOut 0.5s infinite ease-in-out; } @-webkit-keyframes sk-pulseScaleOut { 0% { -webkit-transform: scale(0); transform: scale(0); } 100% { -webkit-transform: scale(1); transform: scale(1); opacity: 0; } } @keyframes sk-pulseScaleOut { 0% { -webkit-transform: scale(0); transform: scale(0); } 100% { -webkit-transform: scale(1); transform: scale(1); opacity: 0; } } </style> <div class="container"> <div class="row " style="margin-bottom: 150px;"> <div class="col s10 push-s1"> <div class="row card-panel"> <h4 class="center-align">Faculty Information</h4> <div style="position: relative;" class="input-field col s12"> <i class="material-icons prefix">person</i> <input type="text" id="search" class="autocomplete"> <label for="search">Search Faculty</label> </div> </div> </div> </div> </div> `;
   $('body').html($($search));
   AutoComplete();
});
function AutoComplete() {
    let data={};
    $.ajax({
        url:chrome.extension.getURL('/assets/fac.min.json'),
        type: 'GET',
        success:function (result) {
            populate(JSON.parse(result));
        },
        error: function(){
            console.log('Faculty info not found !');
        }
    });
    function populate(result) {
        for(let x of result)
            data[x.Name]=null;
        $('input.autocomplete').autocomplete({
            data: data,
            limit: 10,
            onAutocomplete: function(val) {
                $('.container').append('<div id="pre" class="sk-spinner sk-spinner-pulse"></div>');
                $('#det,img').remove();
                fetchDetails(getID(result,val));
            },
            minLength: 1
        });
    }
}
function getID(data, ele) {
    for(let x of data)
        if(x.Name==ele)
            return x.FacID;
}
function fetchDetails(id) {
    $.ajax({
        url:`https://vtop.vit.ac.in/student/official_detail_view.asp?empid=${id}&date=${new Date().getTime()}`,
        type: 'GET',
        success:function (result) {
            detailsUI(result)
        },
        error: function(){
            console.log('Faculty Details not found !');
        }
    });
}
function detailsUI(r) {
    let $details=`<div id="det" class="row hide"> <div class="col s8 push-s2"> <div class="card-panel teal" style="padding-top: 0;"> <div class="row"> <div id="header" style="position: relative;margin-bottom: 30px;" class="col s12"> <h4 class="right-align white-text" style=" margin: 0; padding-top: 5px; width: 65%; float: right; "> <span id="name"></span><br> <small id="desig" class="white-text" style=" font-size: 16px; "></small> </h4> </div> </div> <div id="properties"></div> </div> </div> </div>`;
    $('.container').append($($details));
    inject();
    function inject() {

        let $r=$(r);
        let $img=$r.find('img').attr({ 'width': '125px', 'style': 'position: absolute;top: 0;left: 20%;transform: translate(-50%,-40%)'}).removeAttr('height').addClass('responsive-img circle').detach();
        $img.attr('src',$img.attr('src')+`?date=${new Date().getTime()}`);
        $('#header').prepend($img);
        let rows=$r.find('table[width="761"] tr');
        $('#name').text(rows.eq(1).find('td[width="660"]').text());
        $('#desig').text(rows.eq(3).find('td[width="660"]').text());
        for (let i=2;i<rows.length-1;i++)
        {
            if(i===3)
                continue;
            else if(i===9)
            {
                let $t=$(`<div class="row"> <div class="col s4 white-text">${rows.eq(i).find('td[width="225"]').text()}</div> <div id="timing" class="col s8 white-text"></div> </div>`);
                $('#properties').append($t);
                let $time=$r.find('table[width="250"] tr[bgcolor="#CCCCCC"]');
                for(let j=0;j<$time.length;j++)
                {
                    let $d=$time.eq(j).find('td');
                    let $j=`<div style="margin: 0;text-justify: distribute;">${$d.eq(0).text()}<span> : </span>${$d.eq(1).text()}<span> to </span>${$d.eq(2).text()}</div>`;
                    $('#timing').append($j);
                }
            }
            else {
                let x=rows.eq(i).find('td[width="225"]').text(),y=rows.eq(i).find('td[width="660"]').text();
                let $t=`<div class="row"> <div class="col s4 white-text">${x}</div> <div class="col s8 white-text">${y}</div> </div>`;
                if(x!="")
                $('#properties').append($($t));
            }
        }
    }
    $('#pre').fadeOut(500,function () {
        $(this).remove();
        $('#det').removeClass('hide').addClass('animated fadeInLeft');
    });
}