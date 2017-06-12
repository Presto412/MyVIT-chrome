$(function () {
    chrome.storage.local.get(function(result){
        console.log(result);
        initAttend(result.Graph);
        populateUpcoming(result.calCourses.course);
    });
});
function populateUpcoming(x) {
    // console.log('entered',x);
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