'use strict';

var portStat=false;
var Port;
chrome.browserAction.setBadgeText({ text: 'MyVIT' });

var isdata,Data;
var getData=function () {
    chrome.storage.local.get(function(result){
        isdata=!$.isEmptyObject(result);
        var reg=result.Reg;
        var pass=result.Pwd;
        if(isdata)rqst(0,reg,pass);
    });
};
var setData=function (r,p) {
    chrome.storage.local.set({'Reg':r,'Pwd':p});
};
var clearData=function() {
    chrome.storage.local.clear();
    Data=undefined;
    isdata=undefined;
};

$(function () {
    getData();
});

var rqst=function (ch,reg,pass) {
    var type=['login','refresh'];
    $.ajax({
        url:'https://myffcs.in:10443/campus/vellore/'+type[ch],
        type: 'POST',
        processData:false,
        data:'regNo='+reg+'&psswd='+pass,
        success:function (result) {
            if(ch==0)
            {
                if(result.status.message=="Invalid Credentials")
                {
                    isdata=false;
                    console.log(result.status.message);
                    if(portStat)Port.postMessage({isData:false,reason:result.status.message,type:'close'});
                }
                else
                {
                    if(portStat)Port.postMessage({type:'Status-update',status:'Retrieving Data ...'});
                    rqst(1,reg,pass);
                }
            }
           else
               parse(result);
        },
        error: function(){
            isdata=false;
            if(portStat)Port.postMessage({isData:false,reason:'No Internet or Server is Down',type:'warning'});
            else {
                Data.push(reg);
                Data.push(pass);
            }
        }
    });
};  // Function to fetch data from API
var parse=function (x) {
    var course=function (c,n) {
        return {
            title:n,
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
    var update=function(d,det,mode,i)
    {
        var obj;
        if(mode)
            obj=d[i].lab;
        else
            obj=d[i].theory;
        obj.total=det[0];
        obj.attended=det[1];
        obj.percentage=det[2];
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
    var courses=x.courses;
    console.log(courses);
    var data=[],temp,isp,details=[],index;
    for(var i=0;i<courses.length;i++)
    {
        details[0]=courses[i].attendance.total_classes;
        details[1]=courses[i].attendance.attended_classes;
        details[2]=courses[i].attendance.attendance_percentage;
        isp=ispresent(data,courses[i].course_code);
        if(isp==-1)
        {
            temp=new course(courses[i].course_code,courses[i].course_title);
            data.push(temp);
            index=(data.length-1);
        }
        else {
            index=isp;
        }
        update(data,details,islab(courses[i]),index);
    }
    var sort=function (d) {
      var temp;
      temp=_.sortBy(d,'code');
      return temp;
    };
    Data=sort(data);
    console.log(Data);
    if(portStat)Port.postMessage({isData:isdata,data:Data});
    //Send the data to display.
    // handleui(data);
};  // Function to filter out the required data.

chrome.runtime.onConnect.addListener(function(port) {
    if(port.name == "MyVIT")
    {
        Port=port;
        portStat=true;
        port.postMessage({isData:isdata,data:Data});
        port.onMessage.addListener(function(msg) {
            if (msg.req=="Set-Reg-Pass")
            {
                setData(msg.Reg,msg.Pwd);
                getData();
            }
            else if (msg.req == "refresh")
            {
                getData();
            }
            else if (msg.req == "logout")
            {
               clearData();
               port.postMessage({isData:false,reason:'logout'});
            }
        });
    }
});