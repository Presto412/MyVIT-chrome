let port = chrome.runtime.connect({name: "MyVIT-Dashboard"});
port.onMessage.addListener(function (message) {
    console.log(message.request,' - requested !');
    if(message.request==='initAll'||message.request==='initAttend')
    {
        fetchAttend();
    }
    if(message.request==='initAll'||message.request==='initcalCourses')
    {
        fetchUpcoming();
    }
    if(message.request==='initAll'||message.request==='initcalCourses')
    {
        fetchSchedule();
    }
});
function fetchAttend() {
    chrome.storage.local.get(function(result){
        console.log(result);
        initAttend(result.Graph);
    });
}
function fetchUpcoming() {
    chrome.storage.local.get(function(result){
        console.log(result);
        populateUpcoming(result.calCourses.course);
    });
}
function fetchSchedule(){
    chrome.storage.local.get(function (result) {
        let sch=result.timetable2.timetable;
        console.log('schedule',sch);
        function parseClass(a,x,type) {
            let name='';
            let data=(a).split(' - ');
            let time=x.split('to');
            for(let i of result.Graph)
                if(i.code===data[0])
                    name=i.title;
            let start=moment(time[0],'HH:mm');
            let end=moment(time[1],'HH:mm');
            return{
                key:start.valueOf(),
                data:{
                    start:start.format('LT'),
                    end:end.format('LT'),
                    code:data[0],
                    type:type,
                    name:name,
                    venue:data[2],
                    slot:data[3]
                }
            }
        }
        function mergeClass(x) {
            for (let i=0;i<x.length-1;i++)
            {
                if(x[i]!==undefined)
                if(x[i].data.code===x[i+1].data.code&&x[i].data.type===x[i+1].data.type&&x[i].data.venue===x[i+1].data.venue) //x[i].data.end===x[i+1].data.start&&
                {
                    x[i].data.slot+='+'+x[i+1].data.slot;
                    x[i].data.end=x[i+1].data.end;
                    x[i+1]=undefined;
                }
            }
            x=_.compact(x);
            return x;
        }
        for (let i of sch)
        {
            let today=[];
            let $t=$(`<div class="row" style="display: flex;justify-content: center;" href="#one!"> <div class="vtime"> <ul class="classes"> </ul> </div> </div>`);
            for (let x in i.lab)
                if(i.lab[x]!=="")
                    today.push(parseClass(i.lab[x],x,'lab'));
            for(let x in i.theory)
                if(i.theory[x]!=="")
                    today.push(parseClass(i.theory[x],x,'theory'));
            today=_.sortBy(today,'key');
            today=mergeClass(today);
            for(let j of today)
            {
                let temp=`<li class="${j.data.type}"><span></span> <div> <div class="title">${j.data.name}</div> <div class="info">${j.data.code} - <span style="text-transform: capitalize;">${j.data.type}</span><br>${j.data.slot}</div> <div class="type">${j.data.venue}</div> </div> <span class="number"><span>${j.data.start}</span> <span>${j.data.end}</span></span> </li>`;
                $t.find('.classes').append($(temp));
            }
            $('.scheduleSlider').append($t);
        }
        initSchedule();
    });
}
function initSchedule() {
    let days=['MON','TUE','WED','THU','FRI','SAT','SUN'];
    let day=(moment().day()===0)?6:(moment.day()-1);
    $('.scheduleSlider').slick({
        dots: true,
        arrows:false,
        infinite: false,
        draggable:false,
        swipe:false,
        touchMove:false,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: true,
        initialSlide:day,
        customPaging: function(slick,index) {
            return `<a id="day${index}" class="btn btn-floating dayBtn hoverable" style="margin: 0 10px;">${days[index]}</a>`;
        },
        appendDots:$(".scheduleDays")
    });
    $('.scheduleSlider').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        $('.dayBtn').removeClass('active');
        $(`#day${nextSlide}`).addClass('active');
    });
    $(`#day${day}`).addClass('active');
}
function populateUpcoming(x) {
    // console.log('entered',x);
    $('#loaderAssign').remove();
    let toSort=[];
    function isLab(str) {
        if (str==='ELA'||str==='LO')return true;
    }
    for(let i of x)
    {

        if ((!isLab(i.crstp))&&((i.assignment.length))!==0)
        {
            for (let assignment of i.assignment)
            {
                //------Condition to check if assignment is already uploaded------------------TODO:wrap all the content inside the if statement.
                // if (assignment.answer!=='Blocked'||assignment.assignStatus!=='Uploaded') {}
                //----------------------------------------------------------------------------
                let t=`<div class="row card-panel" style="min-height: 150px;"> <div class="col s9"> <h6>${i.crscd} - DA-${assignment.Num}</h6> <p>${i.crstitle}</p> <p style="font-size: larger;"><b>Due Date : ${assignment.duedate}</b></p> </div> <div class="col s3"> <div class="btn btn-flat tooltipped" data-tooltip="Upload" data-position="right" data-delay="50"> <i class="material-icons">file_upload</i> </div> </div> </div>`;
                let date=moment(assignment.duedate,'DD-MMM-YYYY'),key;
                key=date.valueOf();
                let objT={
                    date:key,
                    data:t
                };
                toSort.push(objT);
            }

        }
    }
    // console.log(toSort);
    let sorted=_.sortBy(toSort,'date');
    // console.log(sorted);
    for (let tSort of sorted)
        $('#upcoming').append($(tSort.data));
    $('.tooltipped').tooltip({delay: 50});
}
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
            }
        }
    });
};
