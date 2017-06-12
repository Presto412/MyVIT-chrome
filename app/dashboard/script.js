$(function () {
    chrome.storage.local.get('Graph',function(result){
        console.log(result);
        initAttend(result.Graph);
    });
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