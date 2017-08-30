/**
 * Created by Vineeth on 27-08-2017.
 */
let port = chrome.runtime.connect({name: "MyVIT-Home"});
port.onMessage.addListener(function (message) {
    console.log(message.request,' - requested !');
    if(message.status===0)
    {
        $('#page-wrapper').find('.content').append(`<div class="row">
    <div class="col-xs-9 col-xs-offset-1">
        <div class="box">
            <!-- /.box-header -->
            <div class="box-body">
                <h3 class="text-center">Login to MyVIT</h3>
                <p class="text-center">This is a one time setup to unlock all awesome features of this app.</p>
                <img style="max-width: 85%;" class="img-responsive center-block" src="${chrome.extension.getURL('assets/images/Prompt.PNG')}" alt="">
                <h2 class="text-center">(or)</h2>
                <!-- /.box-body -->
                <div class="box-footer">
            <div class="pull-right">
                <button type="button" id="switch" class="btn">Auto-login to this account</button>
                <button type="button" class="btn" data-widget="remove">Ignore</button></div>
            </div>
            </div>
        </div>
    </div>
</div>`);
        $('#switch').click(function () {
            port.postMessage({request:'switch'});
        });
    }
    else if(message.status===1)
    {
        $('#page-wrapper').css({'display':'flex','flex-basis':'column'}).html(`<iframe style="border: none;width: 100%;flex-grow: 1;" src=${chrome.extension.getURL('dashboard/index.html')}></iframe>`);
    }
    else if(message.status===2)
    {
        // fetchAttend();
        $('#page-wrapper').find('.content').append(`<div class="row">
    <div class="col-xs-7 col-xs-offset-2">
        <div class="box box-danger">
        <div class="box-tools pull-right">
                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
                <button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>
              </div>
            <!-- /.box-header -->
            <div class="box-body">
                <h3 class="text-center">Logged into different account !</h3>
                <p class="text-center">This is a one time setup to unlock all awesome features of this app.</p>
                <!-- /.box-body -->
            </div>
            <div class="box-footer">
            <div class="pull-right">
                <button type="button" id="switch" class="btn">Switch to this account</button>
                <button type="button" class="btn" data-widget="remove">Ignore</button></div>
            </div>
        </div>
    </div>
</div>`);
        $('#switch').click(function () {
            port.postMessage({request:'switch'});
        });
    }
});
(function () {
    $('#dbMenu').children('ul').prepend('<li><a id="home" href="#"><i class="fa fa-home" aria-hidden="true"></i>Home</a></li>')
    $('#home').click(function (e) {
        e.preventDefault();
        $('#page-wrapper').css({'display':'flex','flex-basis':'column'}).html(`<iframe style="border: none;width: 100%;flex-grow: 1;" src=${chrome.extension.getURL('dashboard/index.html')}></iframe>`);
    })
})();