/**
 * Created by Vineeth on 10-06-2017.
 */
let navStat=false,navPort=chrome.runtime.connect({name: "MyVIT-Navigator"});
$(function () {
    x=$('table');
    x[0].remove();
    x[1].remove();
    x[3].remove();
    $('#head').siblings('head').remove();
    document.getElementsByTagName('table')[0].style.height='100%';
    let nav=`
  <ul id="hosteller" class="dropdown-content">
  <li><a class="navigation" href="https://vtop.vit.ac.in/student/leave_request.asp"><i style="margin-right: 10px;" class="fa fa-plane" aria-hidden="true"></i>Leave/Outing Request</a></li>
  <li><a class="navigation" href="https://vtop.vit.ac.in/student/Hostel_LAB_Permission.asp"><i style="margin-right: 10px;" class="fa fa-moon-o" aria-hidden="true"></i>Late Hours Permission</a></li>
  <li class="divider"></li>
  <li><a class="navigation" href="https://vtop.vit.ac.in/student/faculty_advisor_view.asp"><i style="margin-right: 10px;" class="fa fa-user-o" aria-hidden="true"></i>My Proctor</a></li>
  </ul> 
  <ul id="other" class="dropdown-content">
  <li><a class="navigation" href="https://vtop.vit.ac.in/student/course_regular.asp?sem=WS"><i style="margin-right: 10px;" class="fa fa-calendar-o" aria-hidden="true"></i>Time Table</a></li>
  <li class="divider"></li>
  <li><a class="navigation" href="https://vtop.vit.ac.in/student/exam_schedule.asp?sem=WS"><i style="margin-right: 10px;" class="fa fa-clock-o" aria-hidden="true"></i>Exam Schedule</a></li>
  <li><a class="navigation" href="https://vtop.vit.ac.in/student/marks.asp?sem=WS"><i style="margin-right: 10px;" class="fa fa-sticky-note-o" aria-hidden="true"></i>Marks</a></li>
  </ul>  
  <nav style="margin-bottom: 5px;">
    <div class="nav-wrapper">
      <span class="brand-logo" style="margin-left: 90px;"><a class="navigation" href="https://vtop.vit.ac.in/student/stud_home.asp">My VIT</a><span style="margin: 0 10px;">|</span><span style="font-size: 16px;">Fall Semester 2017~18</span></span>
      <a id="sideBtn" href="#" data-activates="full-nav" class="left"><i class="material-icons btn btn-flat">menu</i></a>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><a class="navigation" href="https://vtop.vit.ac.in/student/coursepage_plan_view.asp?sem=WS"><i style="margin-right: 10px;" class="fa fa-file-text" aria-hidden="true"></i>Course Page</a></li>
        <li><a class="navigation" href="https://vtop.vit.ac.in/student/marks_da.asp?sem=WS"><i style="margin-right: 10px;" class="fa fa-cloud-upload" aria-hidden="true"></i>Upload Assignments</a></li>
        <li><a class="dropdown-button" href="#!" data-activates="other">Other<i style="margin-left: 10px;" class="fa fa-caret-down"></i></a></li>
        <li><a class="navigation" href="https://vtop.vit.ac.in/student/fac_profile.asp"><i class="fa fa-search" style="margin-right: 10px;" aria-hidden="true"></i>Search Faculty</a></li>
        <li><a class="dropdown-button" href="#!" data-activates="hosteller">Hosteller<i style="margin-left: 10px;" class="fa fa-caret-down"></i></a></li>
        <li><a class="tooltipped" href="stud_logout.asp" target="_self" data-position="left" data-delay="50" data-tooltip="Logout"><i class="material-icons">input</i></li>
      </ul>
    </div>
  </nav>
<!--<div id="messageBtn" style="position: fixed;bottom: 15px;right: 15px;">-->
    <!--<a class="btn-floating btn-large red tooltipped" data-tooltip="Faculty Messages" data-delay="50" data-position="left">-->
        <!--<i class="fa fa-2x fa-comment"></i>-->
    <!--</a>-->
    <!--<ul>
        <li><a class="btn-floating red"><i class="material-icons">insert_chart</i></a></li>
    </ul>-->
<!--</div>-->
`;
    // console.log($('body'));
    $('body').eq(-1).prepend($(nav));
    $(".dropdown-button").dropdown({ constrainWidth: false});
    $('.tooltipped').tooltip({delay: 50});
    $("#sideBtn").sideNav();
    $(window).on('blur',function(){$('.dropdown-button').dropdown('close');});
    let $iframe=$('iframe').detach();
    // $iframe.removeAttr('src');
    $('nav').after($iframe);
    $iframe.removeAttr('height').css({'border': 'none','flex-grow':'1'}).addClass('hide').parent().css({'display': 'flex','flex-direction': 'column','background-image':'none'});
    let $dashboard=$iframe.clone().attr('id','dash').attr('src',chrome.extension.getURL('dashboard/index.html')).removeClass('hide');
    $iframe.attr('id','general').before($dashboard);
    $('table').remove();
    addNav();
});
function addNav() {
    chrome.storage.local.get('menu',function(result){
        let isdata=!$.isEmptyObject(result);
        if(isdata)
        {
            let $side=$(` <ul id="full-nav" class="side-nav scroll1"> </ul> `);
            $('nav').before($side);
            let menu=result.menu.menu;
            // console.log(menu);
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
            if($(this).attr('href')==='https://vtop.vit.ac.in/student/stud_home.asp')
            {
                chrome.runtime.sendMessage({request:'preload'});
                setTimeout(function () {
                    $('#general').addClass('hide');
                    $('#dash').removeClass('hide');
                    chrome.runtime.sendMessage({request:'unload'});
                },300);
            }
            else
            {
                navPort.postMessage({url:$(this).attr('href')});
                setTimeout(function () {
                    $('#general').removeClass('hide');
                    $('#dash').addClass('hide');
                },300);
            }
        });
        chrome.runtime.sendMessage({request:'initialize'});
    });
}