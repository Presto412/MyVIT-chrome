'use strict';
let myChart;
let manipulate;
let port = chrome.runtime.connect({name: "MyVIT"});
port.onMessage.addListener(function(msg) {
    console.log(msg);
    let processFormStatus=function(d,type){
        return $('<p style="line-height: 15px;font-size: 15px;" class="center-align"><i style="line-height: 15px;font-size:18px;" class="material-icons">'+type+'</i>'+d+'</p>');
    };
    if (msg.isData)
    {
        $('.login_wrapper').addClass('hide');
        $('.loading_wrapper').addClass('hide');
        $('#heading').text("My VIT");
        $('#graph').removeClass('hide');
        $('#status').text("Logging In");
        console.log(msg.data);
        initAttend(msg.data);
    }
    else if (msg.isData==false)
    {
        // console.log(msg.reason,msg.data);
        $('#graph').addClass('hide');
        $('.loading_wrapper').addClass('hide');
        if(msg.reason!='logout'&&msg.reason!=undefined)
            Materialize.toast(processFormStatus(msg.reason,msg.type), 2000,'center-align');
        else if(msg.reason==undefined&&msg.data!=undefined){
            document.getElementById('regno').value=msg.data[0];
            document.getElementById('pass').value=msg.data[1];
        }
        $('.login_wrapper').removeClass('hide');
        $('#heading').text("My VIT - Login");
        $('#status').text("Logging In");
    }
    else if (msg.type=='Status-update'){
        $('#status').text(msg.status);
    }

});
let initAttend=function (x) {
    let ctx = document.getElementById("myChart").getContext('2d');
    let courses=[],manipI,manipDI,titles=[];
    let ethbg=[],elabg=[];
    let eth=[],eth_orig;
    let ela=[],ela_orig;
    for(let i=0;i<x.length;i++)
    {
        titles[i]=x[i].title;
        courses[i]=x[i].code;
        eth[i]=x[i].theory.percentage;
        ela[i]=x[i].lab.percentage;
    }
    let clickHandle= function(evt){
        $('.chartWrap')
            .mouseenter(function () {
                $('#myChart').addClass('disabledDiv');
                $('.LegendWrap').addClass('disabledDiv');
                $('#manipDoneWrapper').addClass('animated bounce infinite');
            })
            .mouseleave(function () {
                // console.log('mouseleave');
                $('#myChart').removeClass('disabledDiv');
                $('.LegendWrap').removeClass('disabledDiv');
                $('#manipDoneWrapper').removeClass('animated bounce infinite');
            });
        let ctype=["Theory","Lab"];
        let activePoints = myChart.getElementAtEvent(evt);
        let per;
        // console.log(activePoints[0]);
        manipI=activePoints[0]._index;
        manipDI=activePoints[0]._datasetIndex;
        $('#myChart').addClass('disabledGraph');
        $('#manipAlt').addClass('hide');
        $(".manipHead").text(titles[manipI]+' - '+ctype[manipDI]);
        $("#manip").removeClass('disabledDiv');
        $("#manipDoneWrapper").removeClass('scale-out');
        if(manipDI)
        {
            elabg[manipI]='#ab47bc';
            per=ela[manipI];
            ela_orig=ela[manipI];
        }
        else
        {
            ethbg[manipI]='#ab47bc';
            per=eth[manipI];
            eth_orig=eth[manipI];
        }
        $('#percentage').text(per+'%');
        myChart.update();
        populateHistory();
    };
        manipulate=function(){
        let total,attended;
        let spiners=[],manipVal;
        spiners.push(document.getElementById('miss').value);
        spiners.push(document.getElementById('attend').value);
        if(manipDI)
        {
            attended=x[manipI].lab.attended;
            total=x[manipI].lab.total;
            manipVal=(((+attended+ (+spiners[1])*2)/(+total+ (+spiners[0])*2+ (+spiners[1])*2))*100);
            manipVal=Math.ceil(manipVal);
            ela[manipI]=manipVal;
        }
        else
        {
            attended=x[manipI].theory.attended;
            total=x[manipI].theory.total;
            manipVal=(((+attended+ +spiners[1])/(+total+ +spiners[0]+ +spiners[1]))*100);
            manipVal=Math.ceil(manipVal);
            eth[manipI]=manipVal;
        }
        $('#percentage').text(manipVal+'%');
        myChart.update();
    };
    let populateHistory=function () {
        let hiString="",hist;
        if(manipDI)
        {
            hist=x[manipI].lab.history;
        }
        else
        {
            hist=x[manipI].theory.history;
        }
        for (let i=hist.length-1;i>=0;i--)
        {
            let t="";
            t=`<div class="row hist"><div class="col s4">${moment(hist[i].date).format('MMM Do')}</div><div class="col s4 center-align">${moment(hist[i].date).format('dddd')}</div><div class="col s4 right-align ${hist[i].status}">${hist[i].status}</div></div>`;
            hiString+=t;
        }
        document.getElementById('history').innerHTML=hiString;
    };
    let manipdone=function () {
        if(manipDI)
        {
            ela[manipI]=ela_orig;
            if(ela_orig<75)
                elabg[manipI]='#ef5350';
            else
                elabg[manipI]='#ffb74d';
        }
        else
        {
            eth[manipI]=eth_orig;
            if(eth_orig<75)
                ethbg[manipI]='#ef5350';
            else
                ethbg[manipI]='#4db6ac';
        }
        $('#manipAlt').removeClass('hide');
        $(".manipHead").text('');
        document.getElementById('miss').value=0;
        document.getElementById('attend').value=0;
        $("#manip").addClass('disabledDiv');
        $("#manipDoneWrapper").addClass('scale-out');
        $('#myChart').removeClass('disabledGraph');
        myChart.update();
    };
    $('#miss').on('input', function() {
        if( +($(this).val())<0)
            $(this).val(0);
        manipulate();
    });
    $('#attend').on('input', function() {
        if( +($(this).val())<0)
            $(this).val(0);
        manipulate();
    });
    $('#manipDone').click(function () {
        $('.chartWrap').off();
        manipdone();
    });
    for(let k=0;k<eth.length;k++)
    {
        if(eth[k]<75&&eth[k]!=null)
            ethbg.push('#ef5350');
        else
            ethbg.push('#4db6ac');
        if(ela[k]<75&&eth[k]!=null)
            elabg.push('#ef5350');
        else
            elabg.push('#ffb74d');
    }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: courses,
            datasets: [{
                label: 'Theory',
                data:eth ,
                backgroundColor: ethbg
            }, {
                label: 'Lab',
                data: ela,
                backgroundColor: elabg
            }]
        },
        options: {
            legend:{
                display:false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        beginAtZero: true
                    }
                }]
            },
            onClick:clickHandle,
            hover: {
                onHover: function(e) {
                    $("#myChart").css("cursor", e[0] ? "pointer" : "default");
                }
            }
        }
    });
};
$("#manipDone").flip({
    trigger: 'hover'
});
$('#lbutton').click(function () {
    let reg=document.getElementById('regno').value;
    let pass=document.getElementById('pass').value;
    port.postMessage({req:'Set-Reg-Pass',Reg:reg,Pwd:pass});
    $('#heading').text("");
    $('.login_wrapper').addClass('hide');
    $('.loading_wrapper').removeClass('hide');
});
$('#refresh').click(function () {
    $('#graph').addClass('hide');
    $('#heading').text("");
    $('#status').text('Refreshing..');
    $('.loading_wrapper').removeClass('hide');
    myChart.destroy();
    port.postMessage({req:'refresh'});
});
$('#logout').click(function () {
    $('#graph').addClass('hide');
    $('#heading').text("");
    $('#status').text('Logging out..');
    $('.loading_wrapper').removeClass('hide');
    port.postMessage({req:'logout'});
    myChart.destroy();
});
$('#addAttend').click(function () {
   let t;
   t=document.getElementById('attend').value;
   t=+t;
   t++;
   document.getElementById('attend').value=t;
    if( +($('#attend').val())<0)
        $('#attend').val(0);
    manipulate();
});
$('#addMiss').click(function () {
    let t;
    t=document.getElementById('miss').value;
    t=+t;
    t++;
    document.getElementById('miss').value=t;
    if( +($('#miss').val())<0)
        $('#miss').val(0);
    manipulate();
});
$('#subMiss').click(function () {
    let t;
    t=document.getElementById('miss').value;
    t=+t;
    if(t>0)
    {
        t--;
        document.getElementById('miss').value=t;
        manipulate();
    }
});
$('#subAttend').click(function () {
    let t;
    t=document.getElementById('attend').value;
    t=+t;
    if(t>0)
    {
        t--;
        document.getElementById('attend').value=t;
        manipulate();
    }
});
// (function ($) {
    // $(function () {

        //initialize all modals
        // $('.modal').modal();

        //now you can open modal from code
        // $('#modal1').modal('open');

        //or by click on trigger
        // $('.trigger-modal').modal();

    // }); // end of document ready
// })(jQuery); // end of jQuery name space
$(function () {
    $('.modal').modal();
    $('.login_wrapper').on('keyup',function (e) {
        if(e.key==='Enter')
            $('#lbutton').click();
    })
});