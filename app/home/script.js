preload();
function preload() {
    let colors=['6a1b9a','ad1457','ff5252','283593','00695c','212121','d84315','558b2f'];
    let html=document.getElementsByTagName('html')[0];
    let body=document.createElement('body');
    let head=document.createElement('head');
    head.innerHTML=`<title>My VIT</title>`;
    head.id='head';
    body.id='preBody';
    body.style.margin=0;
    body.style.height='100vh';
    body.style.background='none';
    body.style.backgroundColor='white';
    html.style.overflow='hidden';
    body.innerHTML=`<style type="text/css">.preload-contain{position:absolute;width:100%;top:50%;transform:translateY(-50%)}.sk-folding-cube{margin:40px auto;width:90px;height:90px;position:relative;-webkit-transform:rotateZ(45deg);transform:rotateZ(45deg);}.sk-folding-cube .sk-cube{float:left;width:50%;height:50%;position:relative;-webkit-transform:scale(1.1);-ms-transform:scale(1.1);transform:scale(1.1);}.sk-folding-cube .sk-cube:before{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-color:#${colors[Math.floor(Math.random()*(colors.length))]};-webkit-animation:sk-foldCubeAngle 2.4s infinite linear both;animation:sk-foldCubeAngle 2.4s infinite linear both;-webkit-transform-origin:100% 100%;-ms-transform-origin:100% 100%;transform-origin:100% 100%;}.sk-folding-cube .sk-cube2{-webkit-transform:scale(1.1) rotateZ(90deg);transform:scale(1.1) rotateZ(90deg);}.sk-folding-cube .sk-cube3{-webkit-transform:scale(1.1) rotateZ(180deg);transform:scale(1.1) rotateZ(180deg);}.sk-folding-cube .sk-cube4{-webkit-transform:scale(1.1) rotateZ(270deg);transform:scale(1.1) rotateZ(270deg);}.sk-folding-cube .sk-cube2:before{-webkit-animation-delay:0.3s;animation-delay:0.3s;}.sk-folding-cube .sk-cube3:before{-webkit-animation-delay:0.6s;animation-delay:0.6s;}.sk-folding-cube .sk-cube4:before{-webkit-animation-delay:0.9s;animation-delay:0.9s;}@-webkit-keyframes sk-foldCubeAngle{0%, 10%{-webkit-transform:perspective(140px) rotateX(-180deg);transform:perspective(140px) rotateX(-180deg);opacity:0;}25%, 75%{-webkit-transform:perspective(140px) rotateX(0deg);transform:perspective(140px) rotateX(0deg);opacity:1;}90%, 100%{-webkit-transform:perspective(140px) rotateY(180deg);transform:perspective(140px) rotateY(180deg);opacity:0;}}@keyframes sk-foldCubeAngle{0%, 10%{-webkit-transform:perspective(140px) rotateX(-180deg);transform:perspective(140px) rotateX(-180deg);opacity:0;}25%, 75%{-webkit-transform:perspective(140px) rotateX(0deg);transform:perspective(140px) rotateX(0deg);opacity:1;}90%, 100%{-webkit-transform:perspective(140px) rotateY(180deg);transform:perspective(140px) rotateY(180deg);opacity:0;}}</style><div class="preload-contain"><div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div></div> `;
    html.appendChild(head);
    html.appendChild(body);
    console.log('Preloaded !');
}
function loaded(){
    $('#preBody').remove();
}
window.onload=function () {
    // console.log($('table'));
    x=$('table');
    x[0].remove();
    x[1].remove();
    x[3].remove();
    $('#head').siblings('head').remove();
    document.getElementsByTagName('table')[0].style.height='100%';
    let nav=`<nav style="margin-bottom: 5px;">
    <div class="nav-wrapper">
      <a href="#" class="brand-logo">Logo</a>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><a href="sass.html">Course Page</a></li>
        <li><a href="badges.html">Upload assignments</a></li>
        <li><a href="collapsible.html">Hosteler</a></li>
      </ul>
    </div>
  </nav>`;
    $('body').prepend($(nav));
    let $iframe=$('iframe').detach();
    $('nav').after($iframe);
    $iframe.removeAttr('height').css({'border': 'none','flex-grow':'1'}).parent().css({'display': 'flex','flex-direction': 'column','background-image':'none'});
    $('table').remove();
    chrome.runtime.sendMessage({request:'initialize'});
    loaded();
};