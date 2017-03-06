'use strict';
var myChart;
var port = chrome.runtime.connect({name: "MyVIT"});
port.onMessage.addListener(function(msg) {
    var processFormStatus=function(d,type){
        return $('<p style="line-height: 15px;font-size: 15px;" class="center-align"><i style="line-height: 15px;font-size:18px;" class="material-icons">'+type+'</i>'+d+'</p>');
    };
    if (msg.isData)
    {
        $('.login_wrapper').addClass('hide');
        $('.loading_wrapper').addClass('hide');
        // $('#header').addClass('hide');
        $('#heading').text("My VIT");
        $('#graph').removeClass('hide');
        $('#status').text("Logging In");
        initAttend(msg.data);
    }
    else if (msg.isData==false)
    {
        console.log(msg.reason);
        $('#graph').addClass('hide');
        $('.loading_wrapper').addClass('hide');
        if(msg.reason!='logout'&&msg.reason!=undefined)
            Materialize.toast(processFormStatus(msg.reason,msg.type), 2000,'center-align');
        $('.login_wrapper').removeClass('hide');
        $('#heading').text("My VIT - Login");
        $('#status').text("Logging In");
    }
    else if (msg.type=='Status-update'){
        $('#status').text(msg.status);
    }

});
var initAttend=function (x) {
    var ctx = document.getElementById("myChart").getContext('2d');
    var courses=[],manipI,manipDI;
    var ethbg=[],elabg=[];
    var eth=[],eth_orig=[];
    var ela=[],ela_orig=[];
    for(var i=0;i<x.length;i++)
    {
        courses[i]=x[i].code;
        eth[i]=x[i].theory.percentage;
        ela[i]=x[i].lab.percentage;
    }
    courses[courses.length]='debarred';
    eth[eth.length]=80;
    ela[ela.length]=60;
    var clickHandle= function(evt){
        var activePoints = myChart.getElementAtEvent(evt);
        var orig;
        console.log(activePoints[0]);
        manipI=activePoints[0]._index;
        manipDI=activePoints[0]._datasetIndex;
        $("#manipHead").text(courses[manipI]);
        $("#manip").removeClass('disabledDiv');
        if(manipDI)
        {
            elabg[manipI]='#ab47bc';
        }
        else
        {
            ethbg[manipI]='#ab47bc';
        }
        myChart.update();
    };
    var manipulate=function(){
        var total,attended;
        eth_orig=eth;
        ela_orig=ela;
        var spiners=[],manipVal;
        spiners.push(document.getElementById('miss').value);
        spiners.push(document.getElementById('attend').value);
        if(manipDI)
        {
            attended=x[manipI].lab.attended;
            total=x[manipI].lab.total;
            manipVal=(((attended+spiners[1])/(total+spiners[0]+spiners[1]))*100);
            console.log(manipVal,total,attended);
            manipVal=Math.floor(manipVal);
            // console.log(manipVal);
            ela[manipI]=manipVal;
        }
        else
        {
            attended=x[manipI].theory.attended;
            total=x[manipI].theory.total;
            console.log('attended :',attended);
            console.log('total :',total);
            console.log('miss spinner:',spiners[0]);
            console.log('attended spinner:',spiners[1]);
            manipVal=(((+attended+ +spiners[1])/(+total+ +spiners[0]+ +spiners[1]))*100);
            console.log(+manipVal,+attended+ +spiners[1],+total+ +spiners[0]+ +spiners[1]);
            manipVal=Math.floor(manipVal);
            // console.log(manipVal);
            eth[manipI]=manipVal;
        }
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
    for(var k=0;k<eth.length;k++)
    {
        if(eth[k]<75)
            ethbg.push('#ef5350');
        else
            ethbg.push('#4db6ac');
        if(ela[k]<75)
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
            tooltip:{
                callback:{

                }
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

$('#lbutton').click(function () {
    var reg=document.getElementById('regno').value;
    var pass=document.getElementById('pass').value;
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