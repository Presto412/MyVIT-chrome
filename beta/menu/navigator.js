/**
 * Created by Vineeth on 11-06-2017.
 */
chrome.runtime.onMessage.addListener(function(message) {
    $(window.parent.frames[1].document.location).attr("href",message.url);
});
(function () {
    $('html').css('display','none');
})();