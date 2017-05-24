/*
ui();
function ui() {
    document.getElementsByTagName('html')[0].style.display='none';
    // $('html').css([{'visibility':'hidden'}]);
    console.log('done');
}
window.onload=function () {
    console.log($('table'));
    x=$('table');
    x[0].remove();
    x[1].remove();
    x[3].remove();
    // console.log($('table'));
    $('body').css("background-image", "none");
    $('body table')[0].replaceWith('<div>' + $(this).html() +'</div>');
    document.getElementsByTagName('html')[0].style.display='block';

};
*/
$(function(){
    $(".button-collapse").sideNav();
});