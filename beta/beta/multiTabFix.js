/**
 * Created by Vineeth on 27-08-2017.
 */
(function () {
    console.log('executed !',window.location);
    if ($('.fa.fa-warning.text-red').text()==="Multiple Tabs Access prevented !!!(Either Logout Your Previous Session or Close Your Web Browser and Try Again.)")
    {
        window.location="https://vtopbeta.vit.ac.in";
    }
    else if(window.location.href==="https://vtopbeta.vit.ac.in/vtop/processLogout"){
        window.location="https://vtopbeta.vit.ac.in";
    }
})();