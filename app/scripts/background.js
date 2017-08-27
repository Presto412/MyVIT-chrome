'use strict';

let portStat=false;
let Port;
chrome.browserAction.setBadgeText({ text: 'MyVIT' });
/*let navPort;
chrome.tabs.query({currentWindow: true, active: true }, function (tabArray){
    navPort=chrome.tabs.connect(tabArray[0].id,{name: "Navigator"});
});*/
let isdata,Data,requests=[],allFetched=false;
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
    isdata=false;
    homeStat=false;
    homePort=undefined;
    dashStat=false;
    dashPort=undefined;
    requests=[];
    allFetched=false;
};
$(function () {
    getData();
});
let rqst=function (ch,reg,pass) {
    let type=['login','attendance'];
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
                    // console.log(result.status.message);
                    if(portStat)Port.postMessage({isData:false,reason:result.status.message,type:'close'});
                }
                else
                {
                    if(portStat)Port.postMessage({type:'Status-update',status:'Retrieving Data ...'});
                    rqst(1,reg,pass);
                }
            }
           else if (ch==1)
            {
                console.log(result);
                parse(result);
                /*for (let i=2;i<type.length;i++)
                {
                    requests.push(rqst(i,reg,pass));
                }
                $.when.apply(this,requests).then(function (x) {
                    allFetched=true;
                    console.log('all requests done');
                });*/
            }
            else
            {
                console.log('reached for',type[ch]);
                newNotif(result,type[ch],function () {
                    if(dashStat)
                    {
                        dashPort.postMessage({request:`init${type[ch]}`,data:Data});
                        homePort.postMessage({request:`init${type[ch]}`,data:Data});
                        console.log('reached for',type[ch]);
                    }
                    chrome.storage.local.set({[(type[ch])]:result});
                });
                console.log(type[ch],' fetched !');
            }
        },
        error: function(){
            isdata=false;
            if(portStat)Port.postMessage({isData:false,reason:'No Internet or Server is Down',type:'warning'});
            else {
                Data=[reg,pass];
            }
        }
    });
    return $t;
};  // Function to fetch data from API
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
    let repFac=function (cp) {
        let fac=[];
        // console.log('executed');
        let truncFac=function () {
            for(let i=0;i<cp.length;i++)
            {
                let t=cp[i].theory.faculty;
                if(t!=null)
                {
                    t=t.slice(0,t.lastIndexOf(' - '));
                    cp[i].theory.faculty=t;
                    // console.log(t+'<-');
                }
                t=cp[i].lab.faculty;
                if(t!=null)
                {
                    t=t.slice(0,t.lastIndexOf(' - '));
                    cp[i].lab.faculty=t;
                    // console.log(t+'<-');
                }
            }
            // console.log(cp);
        };
        let replace=function () {
            for(let i=0;i<cp.length;i++)
            {
                let ft=false,fl=false;
                for(let j=0;j<fac.length;j++)
                {
                    if(cp[i].theory.faculty==fac[j].Name)
                    {
                        // console.log(fac[j].Name);
                        cp[i].theory.faculty=fac[j].FacID;
                        ft=true;
                    }
                    if(cp[i].lab.faculty==fac[j].Name)
                    {
                        cp[i].lab.faculty=fac[j].FacID;
                        fl=true;
                    }
                    if (ft&&fl)
                        break;
                }
            }
        };
        $.ajax({
            url:chrome.extension.getURL('/assets/fac.min.json'),
            type: 'GET',
            success:function (result) {
                // console.log('executed ajax');
                fac=JSON.parse(result);
                console.log(fac.length+' faculties');
                truncFac();
                replace();
                chrome.storage.local.set({'cpMeta':cp});
            },
            error: function(){
                console.log('Faculty info not found !');
            }
        });
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
    console.log(x);
    let cPages=[],data=[],temp,isp,details=[],index,tempcp,cpDetails=[];
    for(let i in courses)
    {
        console.log(courses[i]);
        if(courses[i].faculty!="")
        {
            details[0]=courses[i].totalClasses;
            details[1]=courses[i].attended;
            details[2]=courses[i].attendPer;
            // details[3]=courses[i].attendance.details;

            cpDetails[0]=courses[i].slot;
            cpDetails[1]=courses[i].faculty;

            isp=ispresent(data,courses[i].course_code);
            if(isp==-1)
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
    console.log(Data);
    chrome.storage.local.set({'Graph':Data});
    repFac(sort(cPages));
    if(homeStat)homePort.postMessage({status:isdata}); //Send the data to display.
    if(dashStat)dashPort.postMessage({request:'initAttend'}); //Send the data to display.
    if(portStat)Port.postMessage({isData:isdata,data:Data}); //Send the data to display.
};  // Function to filter out the required data.
let homeStat=false,homePort=undefined,dashStat=false,dashPort=undefined;
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
        port.onDisconnect.addListener(function() {
            Port=undefined;
            portStat=false;
        });
    }
    else if(port.name == "MyVIT-Navigator")
    {
        port.onMessage.addListener(function(msg) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {url:msg.url});
            });
        });
    }
    else if(port.name == "MyVIT-Home")
    {
        homeStat=true;
        homePort=port;
        homePort.postMessage({status:isdata});
        if(allFetched)
            homePort.postMessage({request:'initAll'});
    }
    else if(port.name == "MyVIT-Dashboard")
    {
        dashStat=true;
        dashPort=port;
        if(allFetched)
            dashPort.postMessage({request:'initAll'});
        else if(isdata)
            dashPort.postMessage({request:'initAttend'});
    }
    else console.log(port.name,' is connected ');
});
let initialized=false,isloaded=0,stack=[];
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if((details.type=='sub_frame'||details.type=='main_frame'))
        {
            if(details.url=="https://vtop.vit.ac.in/student/content.asp") isloaded=0;
            let l1=stack.length;
            stack.push(details.frameId);
            stack=_(stack).uniq();
            let l2=stack.length;
            if(l1!=l2)isloaded++;
            console.log('stack - ',isloaded,' intercepted - ',details);
        }
        if(details.type=='sub_frame'&&initialized)
            chrome.tabs.executeScript(null, {file: "preloader/preload.js"});
        else if(details.type=='main_frame')
        {
            if (details.url=="https://vtop.vit.ac.in/student/home.asp")
                initialized=false;
            else
                stack.pop();
                isloaded--;
        }
        if(5<1) //Replace
        return {redirectUrl: chrome.extension.getURL("home/index.html")};
        else if(details.url=='https://vtop.vit.ac.in/student/style2.css')
        {
            return {redirectUrl: chrome.extension.getURL("styles/commons.css")};
        }
        else if(details.url.search("https://vtop.vit.ac.in/fonts/")!=-1)
        {
            return {redirectUrl: chrome.extension.getURL(details.url.replace("https://vtop.vit.ac.in/",""))};
        }
    },
    {urls: ["*://vtop.vit.ac.in/*"]},
    ["blocking"]);
let unblock=true;
chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        // console.log('Response Headers',details);
        let headers=details.responseHeaders;
        for(let i=0;i<headers.length;i++)
            if(headers[i].name==="Content-Type")
                if (headers[i].value.search("application")!==-1)
                {

                    if(headers[i].value!=="application/x-javascript")
                    {
                        console.log('File intercepted');
                        console.log('Response Headers',details);
                        chrome.tabs.executeScript(null, {file: "preloader/unload.js"});
                    }
                }
    },
    {urls: ["*://vtop.vit.ac.in/*"]},
    ["responseHeaders"]);
chrome.runtime.onMessage.addListener(
    function(message,sender, sendResponse) {
        console.log(message.request + ' requested.');
        console.log(sender);
        // console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if (message.request== "preload")
        {
            chrome.tabs.executeScript(null, {file: "preloader/preload.js"});
        }
        else if (message.request== "unload")
        {
            if(isloaded>0)
            {
                isloaded--;
            }
            console.log('stack - ',isloaded,' unblock - ',unblock,' initialize - ',initialized);
            if(isloaded==0&&unblock&&initialized)
            {
                stack=[];
                chrome.tabs.executeScript(null, {file: "preloader/unload.js"});
            }
            else if(isloaded==0&&unblock){
                $( '.preload-contain,#preLoader,#preBody' ).fadeOut( 500, function() {
                    console.log('executed !');
                    $('#preLoader').parent().remove();
                });
            }
        }
        else if (message.request== "initialize")
            initialized=true;
        else if (message.request== "block-unload")
            initialized=true;
        else if (message.request== "allow-unload")
            unblock=true;
    });
//----Experimental--------------------------------------------------
chrome.alarms.onAlarm.addListener(function (x){


    chrome.notifications.create(
        'name-for-notification2',{
            type: 'basic',
            iconUrl: '../assets/images/icon-38.png',
            title: "Assignment reminder",
            message: "CSE2003\nData Sturctures and Algorithms\nDA-2"
        });
    chrome.notifications.create(
        'name-for-notification3',{
            type: 'basic',
            iconUrl: '../assets/images/icon-38.png',
            title: "Assignment reminder",
            message: "CSE2003\nData Sturctures and Algorithms\nDA-3"
        });

    console.log('alarm rang !!',x);
});
function generateNotif(x) {
    let ctr=0;
    function audioNotification(){
        let notifSound = new Audio(chrome.extension.getURL('/assets/notification.mp3'));
        notifSound.play();
    }
    function optionGetter(obj,opt) {
        if(obj[opt]===undefined)
            return false;
        else
            return obj[opt];
    }
    function createNotif(notification,index) {
        chrome.notifications.create(
            `${notification.type}${index}`,{
                type: 'basic',
                isClickable:optionGetter(notification,'clickable'),
                requireInteraction:optionGetter(notification,'preventDismiss'),
                iconUrl: '../assets/images/icon-128.png',
                title: notification.title,
                message: notification.message
            });
    }
    for(let i of x)
        createNotif(i,ctr++);
    audioNotification();
}
function notifTemplate(x,type) {
    if (type==='message')
    {
        let notifs=[];
        for (let i of x)
        {
            let t={
                type:"message",
                title:`${i.from} - ${moment(i.posted,'DD-MM-YYYY HH:mm:ss').fromNow()}:`,
                message:`${i.course}\n${i.message}`
            };
            notifs.push(t);
        }
        return notifs;
    }
    // else (type==='')
}
function newNotif(x,type,done) {
    if (type==='messages')
        chrome.storage.local.get(function(o){
            if(o.messages===undefined)
                done();
            else {
                let oMsg=o.messages.faculty_messages;
                let nMsg=x.faculty_messages;
                if(!(_.isEqual(oMsg[0],nMsg[0])))
                {
                    let msgs=[];
                    for(let i=0;(!(_.isEqual(oMsg[0],nMsg[i])));i++)
                    {
                        console.log('original',oMsg[0],'new ',nMsg[i]);
                        msgs.push(nMsg[i]);
                    }
                    console.log(msgs);
                    generateNotif(notifTemplate(msgs,'message'));
                }
                else
                {
                    console.log('No new messages recieved !');
                }
                done();
            }
        });
    else
        done();
}
OneSignal.init({appId: "f4b31659-6356-4a2c-bc94-178c6dfcd0a2",
    googleProjectNumber: "392495554304"});