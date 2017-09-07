/**
 * Created by Vineeth on 07-09-2017.
 */

$(function () {
    console.log('sessionExpiredFix executed !');
   if ($('.content-header').find('h1').text()==="Session Expired"){
       Materialize.toast($(`<h6>Resolving session expired error ... <i class="fa fa-refresh fa-spin fa-fw"></i></h6>`),"red darken-1");
       chrome.browsingData.removeCache({}, function(){
           Materialize.toast($(`<h6>Error resolved redirecting ...<i class="fa fa-refresh fa-spin fa-fw"></i></h6>`),5000);
           window.location="https://vtopbeta.vit.ac.in";
       });
   }
});