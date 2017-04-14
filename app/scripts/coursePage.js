$(function () {
   $('body').append(`<div style="max-width:800px;">
<iframe id="cPage" style="width:100%;" src="${chrome.extension.getURL ('course_page/index.html')}" frameborder="0"></iframe>
</div>`);
    iFrameResize({log:false
    }, '#cPage');
});
//min-height:60vh;max-width:800px;
let Port=undefined;
let portStat=undefined;

let fetchCP=function () {
    chrome.storage.local.get(function(result){
        isdata=!$.isEmptyObject(result);
        $.ajax({
            url:'https://myffcs.in:10443/campus/vellore/login',
            type: 'POST',
            processData:false,
            data:'regNo='+result.Reg+'&psswd='+result.Pwd,
            success:function (x) {
                console.log('login success');
                myCoursePage(result.Reg,result.Pwd,result.cpMeta);
            },
            error: function(){
                console.log('unable to connect !')
            }
        });
    });
}();
let cPage=[],cPromise=[];
let myCoursePage=function(r,p,cpMeta) {
   cPage=cpMeta;
   console.log(cPage);
   let $t=undefined,$l=undefined;
   for(let i=0;i<cPage.length;i++)
    {
        $t=undefined;
        $l=undefined;
        cPage[i].theory.data=null;
        cPage[i].lab.data=null;
       if(cPage[i].theory.slot)
       {
           $t=$.ajax({
               async: true,
               crossDomain: true,
               url: "https://myffcs.in:10443/campus/vellore/coursepage/data",
               method: "POST",
               headers: {
                   "content-type": "application/x-www-form-urlencoded"
               },
               data: {
                   regNo: r,
                   psswd: p,
                   crs: cPage[i].code,
                   slt: cPage[i].theory.slot,
                   fac: cPage[i].theory.faculty
               },
               success:function (result) {
                   if(result=='')
                       result=null;
                   cPage[i].theory.data=result;
                   // console.log(result ,"code = ",cPage[i].code,'i =',i);
               }
           });
           cPromise.push($t);
       }
        if(cPage[i].lab.slot!=null)
        {

            $l=$.ajax({
                async: true,
                crossDomain: true,
                url: "https://myffcs.in:10443/campus/vellore/coursepage/data",
                method: "POST",
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                data: {
                    regNo: r,
                    psswd: p,
                    crs: cPage[i].code,
                    slt: cPage[i].lab.slot,
                    fac: cPage[i].lab.faculty
                },
                success:function (result) {
                    if(result=='')
                        result=null;
                    cPage[i].lab.data=result;
                    // console.log(result,"code = ",cPage[i].code,'i =',i);
                }
            });
            cPromise.push($l);
        }
    }
    $.when.apply(this,cPromise).then(function (x) {
        console.log('Course page retrieved');
        console.log(cPage);
        if(portStat)
            Port.postMessage({Course_page:cPage});
        else
            console.log("port not initialized");
    });
    // alert('wait !');
    // console.log(cPromise);
};
chrome.runtime.onConnect.addListener(function(port) {
    console.log('Port connected !');
    if(port.name == "MyVIT_coursePage")
    {
        Port=port;
        portStat=true;
    }
});