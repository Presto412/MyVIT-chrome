preload();
function preload() {
    let colors=['#6a1b9a','#ad1457','#ff5252','#283593','#00695c','#d84315','#558b2f'];
    let html=document.getElementsByTagName('html')[0];
    let body=document.createElement('body');
    let head=document.createElement('head');
    head.innerHTML=`<title>My VIT</title><link href="${chrome.extension.getURL("styles/commons.css")}" rel="stylesheet">`;
    head.id='head';
    body.id='preBody';
    body.style.margin=0;
    body.style.height='100vh';
    body.style.background='none';
    body.style.backgroundColor='white';
    html.style.overflow='hidden';
    body.innerHTML=`<style type="text/css">.preload-contain{position:absolute;width:100%;top:50%;z-index: 905;background-color:white;transform:translateY(-50%)}.sk-folding-cube{margin:40px auto;width:90px;height:90px;position:relative;-webkit-transform:rotateZ(45deg);transform:rotateZ(45deg);}.sk-folding-cube .sk-cube{float:left;width:50%;height:50%;position:relative;-webkit-transform:scale(1.1);-ms-transform:scale(1.1);transform:scale(1.1);}.sk-folding-cube .sk-cube:before{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-color:${colors[Math.floor(Math.random()*(colors.length))]};-webkit-animation:sk-foldCubeAngle 2.4s infinite linear both;animation:sk-foldCubeAngle 2.4s infinite linear both;-webkit-transform-origin:100% 100%;-ms-transform-origin:100% 100%;transform-origin:100% 100%;}.sk-folding-cube .sk-cube2{-webkit-transform:scale(1.1) rotateZ(90deg);transform:scale(1.1) rotateZ(90deg);}.sk-folding-cube .sk-cube3{-webkit-transform:scale(1.1) rotateZ(180deg);transform:scale(1.1) rotateZ(180deg);}.sk-folding-cube .sk-cube4{-webkit-transform:scale(1.1) rotateZ(270deg);transform:scale(1.1) rotateZ(270deg);}.sk-folding-cube .sk-cube2:before{-webkit-animation-delay:0.3s;animation-delay:0.3s;}.sk-folding-cube .sk-cube3:before{-webkit-animation-delay:0.6s;animation-delay:0.6s;}.sk-folding-cube .sk-cube4:before{-webkit-animation-delay:0.9s;animation-delay:0.9s;}@-webkit-keyframes sk-foldCubeAngle{0%, 10%{-webkit-transform:perspective(140px) rotateX(-180deg);transform:perspective(140px) rotateX(-180deg);opacity:0;}25%, 75%{-webkit-transform:perspective(140px) rotateX(0deg);transform:perspective(140px) rotateX(0deg);opacity:1;}90%, 100%{-webkit-transform:perspective(140px) rotateY(180deg);transform:perspective(140px) rotateY(180deg);opacity:0;}}@keyframes sk-foldCubeAngle{0%, 10%{-webkit-transform:perspective(140px) rotateX(-180deg);transform:perspective(140px) rotateX(-180deg);opacity:0;}25%, 75%{-webkit-transform:perspective(140px) rotateX(0deg);transform:perspective(140px) rotateX(0deg);opacity:1;}90%, 100%{-webkit-transform:perspective(140px) rotateY(180deg);transform:perspective(140px) rotateY(180deg);opacity:0;}}</style><div class="preload-contain"><div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div></div> `;
    html.appendChild(head);
    html.appendChild(body);
    console.log('Preloaded !');
}
window.onload=function () {
    // console.log($('table'));
    x=$('table');
    x[0].remove();
    x[1].remove();
    x[3].remove();
    $('#head').siblings('head').remove();
    document.getElementsByTagName('table')[0].style.height='100%';
    let nav=`
  <ul id="hosteller" class="dropdown-content">
  <li><a href="#!"><i style="margin-right: 10px;" class="fa fa-plane" aria-hidden="true"></i>Leave/Outing Request</a></li>
  <li><a href="#!"><i style="margin-right: 10px;" class="fa fa-moon-o" aria-hidden="true"></i>Late Hours Permission</a></li>
  <li class="divider"></li>
  <li><a href="#!"><i style="margin-right: 10px;" class="fa fa-user-o" aria-hidden="true"></i>My Proctor</a></li>
  </ul> 
  <ul id="other" class="dropdown-content">
  <li><a href="#!"><i style="margin-right: 10px;" class="fa fa-calendar-o" aria-hidden="true"></i>Time Table</a></li>
  <li class="divider"></li>
  <li><a href="#!"><i style="margin-right: 10px;" class="fa fa-clock-o" aria-hidden="true"></i>Exam Schedule</a></li>
  <li><a href="#!"><i style="margin-right: 10px;" class="fa fa-sticky-note-o" aria-hidden="true"></i>Marks</a></li>
  </ul>  
  <nav style="margin-bottom: 5px;">
    <div class="nav-wrapper">
      <span class="brand-logo" style="padding-left: 30px;"><a href="#">My VIT</a><span style="margin: 0 10px;">|</span><span style="font-size: 16px;">Fall Semester 2017~18</span></span>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><a href="sass.html"><i style="margin-right: 10px;" class="fa fa-file-text" aria-hidden="true"></i>Course Page</a></li>
        <li><a href="badges.html"><i style="margin-right: 10px;" class="fa fa-cloud-upload" aria-hidden="true"></i>Upload Assignments</a></li>
        <li><a class="dropdown-button" href="#!" data-activates="other">Other<i style="margin-left: 10px;" class="fa fa-caret-down"></i></a></li>
        <li><a href="badges.html"><i class="fa fa-search" style="margin-right: 10px;" aria-hidden="true"></i>Search Faculty</a></li>
        <li><a class="dropdown-button" href="#!" data-activates="hosteller">Hosteller<i style="margin-left: 10px;" class="fa fa-caret-down"></i></a></li>
        <li><a class="tooltipped" href="stud_logout.asp" target="_self" data-position="left" data-delay="50" data-tooltip="Logout"><i class="material-icons">input</i></li>
      </ul>
    </div>
  </nav>`;
    // console.log($('body'));
    let $body=$('body');
    let $iframe=$('iframe');
    $body.eq(-1).prepend($(nav));
    $(".dropdown-button").dropdown({ constrainWidth: false});
    $('.tooltipped').tooltip({delay: 50});
    $(window).on('blur',function(){$('.dropdown-button').dropdown('close');});

    // $('nav').after($iframe);
    for(let k=0;k<4;k++)
    {
        $iframe.siblings().remove().end().unwrap();
    }
    $iframe.removeAttr('height').css({'border': 'none','flex-grow':'1'}).parent().css({'display': 'flex','flex-direction': 'column','background-image':'none'});
    // $('table').remove();
    chrome.runtime.sendMessage({request:'initialize'});
};