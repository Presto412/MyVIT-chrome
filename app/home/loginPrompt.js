/**
 * Created by Vineeth on 16-06-2017.
 */
let promptStat=false;
$(function () {
    let port = chrome.runtime.connect({name: "MyVIT-Home"});
    port.onMessage.addListener(function (message) {
        if(message.status)
        {
            if(promptStat)
                $('#initialize').modal('close');
        }
        else {
            if(message.status===false)
            loginPrompt();
        }
        if(message.request==='initAll'||message.request==='initmessages')
        {
            facMsgInit();
        }
        if(message.request==='initAll'||message.request==='initmenu')
        {
            addNav();
        }
    })
});
function loginPrompt() {
    promptStat=true;
    let t=`<div id="initialize" class="modal">
    <div class="modal-content">
        <h4 class="center-align">Please Login to MyVIT</h4>
        <p class="center-align">This is a one time setup to unlock all awesome features of this app.</p>
        <div class="container">
        <img class="responsive-img" src="${chrome.extension.getURL('assets/images/Prompt.PNG')}" alt="">
</div>
    </div>
</div>`;
    $('body').eq(-1).append($(t));
    $('#initialize').modal({
            dismissible: false, // Modal can be dismissed by clicking outside of the modal
            opacity: .5, // Opacity of modal background
            inDuration: 100, // Transition in duration
        }
    );
    $('#initialize').modal('open');
}