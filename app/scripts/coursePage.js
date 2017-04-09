$(function () {
   $('body').append(`<div style="margin-top:-200px;max-width: 800px;">
<iframe style="width:100%;" src="${chrome.extension.getURL ('course_page/index.html')}" frameborder="0"></iframe>
</div>`);
});
let fetchCP=function () {
    chrome.storage.local.get(function(result){
        isdata=!$.isEmptyObject(result);
        myCoursePage(result.Reg,result.Pwd,result.cpMeta);
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
    });
    // alert('wait !');
    // console.log(cPromise);
};/*
$.ajax({
    "async": true,
    "crossDomain": true,
    "url": "https://myffcs.in:10443/campus/vellore/coursepage/data",
    "method": "POST",
    "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "postman-token": "7d1f5c79-a7cd-9bb7-5431-2837335dae7d"
    },
    "data": {
        "regNo": "16BCE0584",
        "psswd": "dummypassworD1$&",
        "crs": "CSE1003",
        "slt": "B2",
        "fac": "11600"
    },
    success:function (result) {
        console.log(result)
    }
}).then(function () {
    alert('ajax complete');
});
*/