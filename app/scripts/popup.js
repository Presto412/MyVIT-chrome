'use strict';
var x;
var initAttend=function (x) {
  var ctx = document.getElementById("myChart").getContext('2d');
  var courses=[];
  var eth=[];
  var ela=[];
  for(var i=0;i<x.length;i++)
  {
    courses[i]=x[i].code;
    eth[i]=x[i].theory.percentage;
    ela[i]=x[i].lab.percentage;
  }
  var gdata= function(evt){
    var activePoints = myChart.getElementAtEvent(evt);
    console.log(activePoints);
    // use _datasetIndex and _index from each element of the activePoints array
  };
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: courses,
      datasets: [{
        label: 'Theory',
        data:eth ,
        backgroundColor: "#4db6ac"
      }, {
        label: 'Lab',
        data: ela,
        backgroundColor: "#ffb74d"
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
      onClick:gdata,
      hover: {
        onHover: function(e) {
          //console.log(e);
          $("#myChart").css("cursor", e[0] ? "pointer" : "default");
        }
      }
    }
  });
};
var course=function (c) {
  return {
    code:c,
    theory:{
      total:null,
      attended:null,
      percentage:null
    },
    lab:{
      total:null,
      attended:null,
      percentage:null
    }
  }
};
var ispresent=function(data,ele){
  var f=-1;
  for(var i=0;i<data.length;i++)
  {
    if(data[i].code==ele)
    {
      f=0;
      return i;
    }
    else f=-1;
  }
  if(f==-1)
  {
    return f;
  }
};
var islab=function (course) {
  if(course.subject_type=='Embedded Lab'||course.subject_type=='Lab Only')
    return 1;
  else return 0;
};
var update=function(data,details,mode,i)
{
  var obj;
  if(mode)
    obj=data[i].lab;
  else
    obj=data[i].theory;
  obj.total=details[0];
  obj.attended=details[1];
  obj.percentage=details[2];
};
var parse=function (x) {
  var courses=x.courses;
  var data=[],temp,isp,details=[],index;
  console.log(courses);
  for(var i=0;i<courses.length;i++)
  {
    details[0]=courses[i].attendance.total_classes;
    details[1]=courses[i].attendance.attended_classes;
    details[2]=courses[i].attendance.attendance_percentage;
    isp=ispresent(data,courses[i].course_code);
    if(isp==-1)
    {
      temp=new course(courses[i].course_code);
      data.push(temp);
      index=(data.length-1);
    }
    else {
      index=isp;
    }
    update(data,details,islab(courses[i]),index);
  }
  console.log(data);
  handleui(data);
};
var rqst=function (ch) {
  var type=['login','refresh'];
  var reg=document.getElementById('regno').value;
  var pass=document.getElementById('pass').value;
  $.ajax({
    url:'https://myffcs.in:10443/campus/vellore/'+type[ch],
    type: 'POST',
    processData:false,
    data:'regNo='+reg+'&psswd='+pass,
    success:function (result) {
      console.log(result);
      if(ch==0)
      {
        $('#status').text('Retrieving Data ...');
        rqst(1);
      }
      else
        parse(result);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown){
      console.log("err--"+type[ch]+ XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText);
    }
  });
};
var handleui =function(data)
{
  $('.loading_wrapper').addClass('hide');
  $('#header').removeClass('hide');
  $('#graph').removeClass('hide');
  $('h1').text("My VIT");
  initAttend(data);
};
var handle=function () {
  $('.login_wrapper').addClass('hide');
  $('#header').addClass('hide');
  $('.loading_wrapper').removeClass('hide');
  rqst(0);
};
$('#lbutton').click(function () {
  handle();
});
// console.log('\'Allo \'Allo! Popup');
