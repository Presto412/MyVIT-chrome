/**
 * Created by Vineeth on 27-08-2017.
 */
//-------------------------- Notifications ----------------------------------
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