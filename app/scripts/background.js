'use strict';

let portStat=false;
let Port;
chrome.browserAction.setBadgeText({ text: 'MyVIT' });

let isdata,Data,History;
let getData=function () {
    chrome.storage.local.get(function(result){
        isdata=!$.isEmptyObject(result);
        let reg=result.Reg;
        let pass=result.Pwd;
        if(isdata)rqst(0,reg,pass);
    });
};
let setData=function (r,p) {
    chrome.storage.local.set({'Reg':r,'Pwd':p});
};
let clearData=function() {
    chrome.storage.local.clear();
    Data=undefined;
    isdata=undefined;
};

$(function () {
    getData();
});

let rqst=function (ch,reg,pass) {
    let type=['login','refresh'];
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
                    // console.log(result.status.message);
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
                Data=[reg,pass];
            }
        }
    });
};  // Function to fetch data from API
let parse=function (x) {
    let course=function (c,n) {
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
    let update=function(d,det,mode,i)
    {
        let obj;
        if(mode)
            obj=d[i].lab;
        else
            obj=d[i].theory;
        obj.total=det[0];
        obj.attended=det[1];
        obj.percentage=det[2];
        obj.history=det[3];
    };
    let ispresent=function(data,ele){
        let f=-1;
        for(let i=0;i<data.length;i++)
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
    let islab=function (course) {
        if(course.subject_type=='Embedded Lab'||course.subject_type=='Lab Only')
            return 1;
        else return 0;
    };
    let courses=x.courses;
    console.log(courses);
    let data=[],temp,isp,details=[],index;
    for(let i=0;i<courses.length;i++)
    {
        details[0]=courses[i].attendance.total_classes;
        details[1]=courses[i].attendance.attended_classes;
        details[2]=courses[i].attendance.attendance_percentage;
        details[3]=courses[i].attendance.details;
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
    let sort=function (d) {
      let temp;
      temp=_.sortBy(d,'code');
      return temp;
    };
    Data=sort(data);
    // console.log(Data);
    if(portStat)Port.postMessage({isData:isdata,data:Data}); //Send the data to display.
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