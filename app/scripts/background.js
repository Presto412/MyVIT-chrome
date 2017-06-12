'use strict';

let portStat=false;
let Port;
chrome.browserAction.setBadgeText({ text: 'MyVIT' });
/*let navPort;
chrome.tabs.query({currentWindow: true, active: true }, function (tabArray){
    navPort=chrome.tabs.connect(tabArray[0].id,{name: "Navigator"});
});*/
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
    let type=['login','refresh','menu','calCourses','messages'];
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
           else if (ch==1)
            {
                parse(result);
                for (let i=2;i<type.length;i++)
                rqst(i,reg,pass);
            }
            else
            {
                console.log('reached');
                chrome.storage.local.set({[(type[ch])]:result});
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
        if(course.subject_type=='Embedded Lab'||course.subject_type=='Lab Only')
            return 1;
        else return 0;
    };
    let courses=x.courses;
    console.log(x);
    let cPages=[],data=[],temp,isp,details=[],index,tempcp,cpDetails=[];
    for(let i=0;i<courses.length;i++)
    {
        if(courses[i].faculty!="")
        {
            details[0]=courses[i].attendance.total_classes;
            details[1]=courses[i].attendance.attended_classes;
            details[2]=courses[i].attendance.attendance_percentage;
            details[3]=courses[i].attendance.details;

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
            update(cPages,cpDetails,islab(courses[i]),index,1);
        }
    }
    let sort=function (d) {
      let temp;
      temp=_.sortBy(d,'code');
      return temp;
    };
    Data=sort(data);
    repFac(sort(cPages));
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
    else if(port.name == "MyVIT-Navigator")
    {
        port.onMessage.addListener(function(msg) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {url:msg.url});
            });
        });
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
