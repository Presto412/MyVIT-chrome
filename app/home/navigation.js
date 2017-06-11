/**
 * Created by Vineeth on 10-06-2017.
 */
let navStat=false,navPort=chrome.runtime.connect({name: "MyVIT-Navigator"});
function addNav() {
    chrome.storage.local.get('menu',function(result){
        let isdata=!$.isEmptyObject(result);
        if(isdata)
        {
            let $side=$(` <ul id="full-nav" class="side-nav scroll1"> </ul> `);
            $('nav').before($side);
            let menu=result.menu.menu;
            console.log(menu);
            for (let item of menu)
            {
                if (item.content===null)
                {
                    let $t=$(`<li><a href="${item.link}" class="waves-effect waves-teal navigation">${item.name}</a></li>`);
                    $("#full-nav").append($t);
                }
                else
                {
                    if($('#dropDown').length===0)
                        $('#full-nav').append($(`<li><ul id="dropDown" class="collapsible collapsible-accordion"></ul></li>`));
                    let t=`<li><a style="padding-left: 32px;" class="collapsible-header  waves-effect waves-teal">${item.name}<i style="margin-right: 0;" class="fa fa-caret-down right"></i></a> <div class="collapsible-body grey lighten-5"> <ul> `;
                    for(let subMenu of item.content)
                        t+=`<li><a class="navigation" style="padding-left: 48px;" href="${subMenu.link}">${subMenu.name}</a></li>`;
                    t+=`</ul> </div> </li>`;
                    $('#dropDown').append($(t));
                }
            }
        }
        // else --implement if not logged in--
        $("#sideBtn").sideNav({
            menuWidth: ($(window).width()/100)*21,
            closeOnClick: true
        });
        $('.collapsible').collapsible();
        $('a.navigation').click(function (e) {
            e.preventDefault();
            navPort.postMessage({url:$(this).attr('href')});
        });
        chrome.runtime.sendMessage({request:'initialize'});
    });
}