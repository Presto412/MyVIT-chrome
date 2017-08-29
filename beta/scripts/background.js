'use strict';

let portStat=false;
let Port;
chrome.browserAction.setBadgeText({ text: 'MyVIT' });
/*let navPort;
chrome.tabs.query({currentWindow: true, active: true }, function (tabArray){
    navPort=chrome.tabs.connect(tabArray[0].id,{name: "Navigator"});
});*/
let isdata,Data,requests=[],allFetched=false,reg,pass,dataStatus='NoData';
let getData=function () {
    chrome.storage.local.get(function(result){
        isdata=!$.isEmptyObject(result);
        reg=result.Reg;
        pass=result.Pwd;
        if(isdata)
        {
            dataStatus='Logging in ...';
            rqst(0,reg,pass);
            console.log('requested the api !');
        }
    });
};
let setData=function (r,p) {
    chrome.storage.local.set({'Reg':r,'Pwd':p});
};
let clearData=function() {
    chrome.storage.local.clear();
    Data=undefined;
    reg=undefined;
    pass=undefined;
    dataStatus='NoData';
    isdata=false;
    dashStat=false;
    dashPort=undefined;
    requests=[];
    allFetched=false;
};
$(function () {
    getData();
});
let rqst=function (ch,reg,pass) {
    let type=['login','attendance','attendanceDet','timetable2'];
    let $t=$.ajax({
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
                    dataStatus='Invalid Credentials';
                    if(portStat)Port.postMessage({isData:false,reason:result.status.message,type:'close'});
                }
                else
                {
                    dataStatus='Retrieving Data ...';
                    if(portStat)Port.postMessage({type:'Status-update',status:'Retrieving Data ...'});
                    rqst(1,reg,pass);
                }
            }
           else if (ch==1)
            {
                console.log(result);
                parse(result);
                dataStatus='initAttend';
                for (let i=2;i<type.length;i++)
                {
                    requests.push(rqst(i,reg,pass));
                }
                $.when.apply(this,requests).then(function (x) {
                    allFetched=true;
                    dataStatus='initAll';
                    console.log('all requests done');
                });
            }
            else
            {
                console.log('reached for',type[ch]);
                newNotif(result,type[ch],function () {
                    if(type[ch]==='attendanceDet')
                    {
                        addHistory(result);
                        if(portStat)Port.postMessage({isData:isdata,data:Data,request:'initHistory'});
                    }
                    if(dashStat)
                    {
                        dashPort.postMessage({request:`init${type[ch]}`,data:Data});
                        console.log('reached for',type[ch]);
                    }
                    chrome.storage.local.set({[(type[ch])]:result});
                });
                console.log(type[ch],' fetched !');
            }
        },
        error: function(){
            isdata=false;
            dataStatus='No-Internet';
            if(portStat)Port.postMessage({isData:false,reason:'No Internet or Server is Down',type:'warning'});
            else {
                Data=[reg,pass];
            }
        }
    });
    return $t;
};  // Function to fetch data from API
let addHistory=function(hist) {
    function isLab(type) {
        return type === 'LO' || type === 'ELA';
    }
    function modifyData(code, type, details) {
        console.log(code,type,details);
        for(let i=0;i<Data.length;i++) {
            if(Data[i].code===code)
            {
                Data[i][type]['history']=details;
            }
        }
    }
    let attendHist=hist.attendance;
    for(let i in attendHist)
    {
        let code=i.substring(0,i.lastIndexOf('_'));
        let type=i.substring(i.lastIndexOf('_')+1);
        type=(isLab(type))?'lab':'theory';
        modifyData(code,type,attendHist[i]);
    }
    chrome.storage.local.set({'Graph':Data});
};
let parse=function (x) {
    console.log(x);
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
    let cPage=function (c) {
        return {
            code:c,
            theory:{
                slot:null,
                faculty:null
            },
            lab:{
                slot:null,
                faculty:null
            }
        }
    };
    let update=function(d,det,mode,i,cp) {
        let obj;
        if(mode)
            obj=d[i].lab;
        else
            obj=d[i].theory;
        if(cp)
        {
            obj.slot=det[0];
            obj.faculty=det[1];
        }
        else
        {
            obj.total=det[0];
            obj.attended=det[1];
            obj.percentage=det[2];
            obj.history=det[3];
        }
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
        if(course.subject_type=='ELA'||course.subject_type=='LO')
            return 1;
        else return 0;
    };
    let courses=x.attendance;
    let cPages=[],data=[],temp,isp,details=[],index,tempcp,cpDetails=[];
    for(let i in courses)
    {
        if(courses[i].faculty!="")
        {
            details[0]=courses[i].totalClasses;
            details[1]=courses[i].attended;
            details[2]=courses[i].attendPer;
            // details[3]=courses[i].attendance.details;

            // cpDetails[0]=courses[i].slot;
            // cpDetails[1]=courses[i].faculty;

            isp=ispresent(data,courses[i].course_code);
            if(isp===-1)
            {
                temp=new course(courses[i].course_code,courses[i].course_title);
                data.push(temp);
                tempcp=new cPage(courses[i].course_code);
                cPages.push(tempcp);
                index=(data.length-1);
            }
            else {
                index=isp;
            }
            update(data,details,islab(courses[i]),index,0);
            // update(cPages,cpDetails,islab(courses[i]),index,1);
        }
    }
    let sort=function (d) {
      let temp;
      temp=_.sortBy(d,'code');
      return temp;
    };
    Data=sort(data);
    chrome.storage.local.set({'Graph':Data});
    // repFac(sort(cPages));
    if(dashStat)dashPort.postMessage({request:'initAttend'}); //Send the data to display.
    if(portStat)Port.postMessage({isData:isdata,data:Data}); //Send the data to display.
};  // Function to filter out the required data.
let dashStat=false,dashPort=undefined;
let courseStat=false,coursePort=undefined;
// let homeStat=false,homePort=undefined,dashStat=false,dashPort=undefined;
chrome.runtime.onConnect.addListener(function(port) {
    if(port.name == "MyVIT")
    {
        Port=port;
        portStat=true;
        port.postMessage({isData:isdata,data:Data,status:dataStatus});
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
        port.onDisconnect.addListener(function() {
            Port=undefined;
            portStat=false;
        });
    }
    else if(port.name == "MyVIT-Dashboard")
    {
        console.log('Dashboard Connected !');
        dashStat=true;
        dashPort=port;
        if(allFetched)
            dashPort.postMessage({request:'initAll'});
        else if(Data!==undefined)
            dashPort.postMessage({request:'initAttend'});
        port.onDisconnect.addListener(function() {
            dashPort=undefined;
            dashStat=false;
        });
    }
    else if(port.name == "MyVIT-Home")
    {
        port.postMessage({status:authStat});
        port.onMessage.addListener(function(msg) {
            if (msg.request==="switch")
            {
                clearData();
                setData(sessionData.uname[0],sessionData.passwd[0]);
                port.postMessage({status:1});
                getData();
            }
        });
    }
    else if(port.name == "MyVIT-coursePage")
    {
        courseStat=true;
        coursePort=port;
        console.log('course page port connected !');
    }
    else console.log(port.name,' is connected ');
});

// ----------- Authentication module ---------
let authStat=0,sessionData;
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if(details.type==="main_frame") {
            console.log(sessionData);
            authStat=0;
            sessionData=details.requestBody.formData;
            if (reg===undefined)
            {
                authStat=0;
                console.log('Not logged in !');
            }
            else if (sessionData.uname[0]===reg)
            {
                authStat=1;
                console.log('authenticated !');
            }
            else{
                authStat=2;
                console.log('Logged in to different account !');
                console.log(sessionData.uname[0],reg);
            }
        }
    },
    {urls: ["*://vtopbeta.vit.ac.in/vtop/processLogin"]},
    ["requestBody"]);

// -------------------- Fonts ---------------------------
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if(details.url.search("https://vtopbeta.vit.ac.in/fonts/")!==-1)
        {
            return {redirectUrl: chrome.extension.getURL(details.url.replace("https://vtopbeta.vit.ac.in/",""))};
        }
    },
    {urls: ["*://vtopbeta.vit.ac.in/*"]},
    ["blocking"]);

// ----------- Course Page module --------------
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        console.log(details);
        console.log('courseStat - ',courseStat);
        if(details.url==="https://vtopbeta.vit.ac.in/vtop/processViewStudentCourseDetail") {
            if(courseStat)coursePort.postMessage({request:"observe"});
        }
    },
    {urls: ["*://vtopbeta.vit.ac.in/vtop/processViewStudentCourseDetail"]},
    ["requestBody"]);
