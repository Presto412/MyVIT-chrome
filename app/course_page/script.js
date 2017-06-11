/*

chrome.tabs.query({currentWindow: true, active: true }, function (tabArray){
        let port=chrome.tabs.connect(tabArray[0].id,{name: "MyVIT_coursePage"});
        port.onMessage.addListener(function(msg){
            let payLoad=msg.Course_page;
            console.log('Payload recieved !');
            console.log(payLoad);
            populate(payLoad);
            handleui();
        });
});
*/

let populate=function (payLoad) {
    let cpString='';
    let pageExists=function (i,m) {
        if(m=='t'){
            if(payLoad[i].theory.data==null)
            {
                return[false,'disabled'];
            }
            else{
                return[true,'']
            }
        }
        else {
            if(payLoad[i].lab.data==null)
            {
                return[false,'disabled'];
            }
            else{
                return[true,'']
            }
        }
    };
    let isActive=function (i,m) {
        if (m=='t'){
            if(pageExists(i,'t')[0]){
                return 'active';
            }
            else
                return ''
        }
        else{
            if(pageExists(i,'l')[0]){
                if(!pageExists(i,'t')[0]){
                    return 'active';
                }
                else {
                    return '';
                }
            }
            else
                return ''
        }
    };
    for(let i=0;i<payLoad.length;i++)
    {
        let t='<li>',tT='',tL='',tR='';
        t+=`<div class="collapsible-header"><h5>${payLoad[i].code}</h5></div>
            <div class="row collapsible-body" style="padding: 0;">
                <div class="col s12">
                        <ul class="tabs">
                            <li class="tab col s3 ${pageExists(i,'t')[1]}"><a class="${isActive(i,'t')}" href="#${payLoad[i].code}_T">Theory</a></li>
                            <li class="tab col s3 ${pageExists(i,'l')[1]}"><a class="${isActive(i,'l')}" href="#${payLoad[i].code}_L">Lab</a></li>
                        </ul>
                 </div>`;
        if(pageExists(i,'t')[0])
        {
            tT=`<div id="${payLoad[i].code}_T" class="col s12">`;
            for (let j=0;j<payLoad[i].theory.data.uploads.lecture.length;j++){
                tR+=`<div class="row page">
                            <div class="col s1"><p class="cele">${j+1}</p></div>
                            <div class="col s2"><p class="cele">${payLoad[i].theory.data.uploads.lecture[j].date}</p></div>
                            <div class="col s1"><p class="cele">${payLoad[i].theory.data.uploads.lecture[j].day}</p></div>
                            <div class="col s5"><p class="cele">${payLoad[i].theory.data.uploads.lecture[j].topic}</p></div>
                            <div class="col s3"><p class="cele"><a href="${payLoad[i].theory.data.uploads.lecture[j].material.link}">${payLoad[i].theory.data.uploads.lecture[j].material.name}</a></p></div>
                        </div>`;
            }
            tT+=tR+'</div>';
            t+=tT;
        }
        if(pageExists(i,'l')[0])
        {
            tR='';
            tL=`<div id="${payLoad[i].code}_L" class="col s12">`;
            for (let j=0;j<payLoad[i].lab.data.uploads.lecture.length;j++){
                tR+=`<div class="row page">
                            <div class="col s1"><p class="cele">${j+1}</p></div>
                            <div class="col s2"><p class="cele">${payLoad[i].lab.data.uploads.lecture[j].date}</p></div>
                            <div class="col s1"><p class="cele">${payLoad[i].lab.data.uploads.lecture[j].day}</p></div>
                            <div class="col s5"><p class="cele">${payLoad[i].lab.data.uploads.lecture[j].topic}</p></div>
                            <div class="col s3"><p class="cele"><a href="${payLoad[i].lab.data.uploads.lecture[j].material.link}">${payLoad[i].lab.data.uploads.lecture[j].material.name}</a></p></div>
                        </div>`;
            }
            tL+=tR+'</div>';
            t+=tL;
        }
        t+='</div></li>';
        cpString+=t;
    }
    document.getElementById('payloadDisplay').innerHTML=cpString;
};

let handleui=function () {
    $('ul.tabs').tabs();
    $('#preload').addClass('hide');
    $('#cpWrapper').removeClass('hide');
};
//
// <div class="row hist">
//     <div class="col s4">EXTERNAL_FRAGMENT</div>
//     <div class="col s4 center-align">EXTERNAL_FRAGMENT</div>
//     <div class="col s4 right-align EXTERNAL_FRAGMENT">EXTERNAL_FRAGMENT</div>
//     </div>


// <div id="${payLoad[i].code}" class="col s12"> </div>